
const textOverlayDiv = document.getElementById('text-overlay');
const element = document.querySelector(".down-arrow");

textOverlayDiv.addEventListener('scroll', () => {
    if (textOverlayDiv.offsetHeight + textOverlayDiv.scrollTop >= textOverlayDiv.scrollHeight) {
        element.classList.add("hide");
    } else {
        element.classList.remove('hide');
    }
});

/***Load Lenis API and configure ScrollTrigger API***/

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

    gsap.to('.rc-video', {
      yPercent: 40,
      ease: "none",
      scrollTrigger: {
        trigger: '.video-section-text-holder:nth-of-type(1)',
        scroller: '#text-overlay',
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

  const lenis = new Lenis({
    wrapper: document.querySelector('#text-overlay'),
    content: document.querySelector('#text-overlay .entry-holder', '.video-section', '.carousel-section', '.secondary-map-section', '.options-section'),
    smooth: true,
    lerp: 0.1, 
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
})

    

/*** Slider JS ***/ 


const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next-arrow");
const backBtn = document.querySelector(".back-arrow");
const root = document.querySelector(":root");

let currentSlide = 0;
const switchSlideDuration = 1000;
root.style.setProperty("--duration", `${switchSlideDuration}ms`);

const handleBack = () => {
    makeSlideChanges((currentSlide - 1 + slides.length) % slides.length);
};

const handleNext = () => {
    makeSlideChanges((currentSlide + 1) % slides.length);
};

const makeSlideChanges = (newSlide) => {
    slides[currentSlide].classList.replace("showcase", "right");
    slides[newSlide].classList.replace("left", "showcase");

    backBtn.removeEventListener("click", handleBack);
    nextBtn.removeEventListener("click", handleNext);

    setTimeout(
        (slide, backBtn, nextBtn) => {
            slide.classList.replace("right", "left");

            backBtn.addEventListener("click", handleBack);
            nextBtn.addEventListener("click", handleNext);
        },
        switchSlideDuration,
        slides[currentSlide],
        backBtn,
        nextBtn
    );

    currentSlide = newSlide;

    console.log(`${currentSlide + 1} / ${slides.length}`);
};

backBtn.addEventListener("click", handleBack);
nextBtn.addEventListener("click", handleNext);


/***ArcGIS JS API***/

require(["esri/WebScene",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/layers/SceneLayer",
    "esri/layers/VectorTileLayer",
    "esri/layers/TileLayer"], (WebScene, SceneView, FeatureLayer, SceneLayer, VectorTileLayer, TileLayer) => {

    const rcArea = new FeatureLayer({
      url:"https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/RC_Area/FeatureServer",
      renderer: rcRenderer,
      visible: false
    });

    const rcStructures = new SceneLayer({
      url: "https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/RC_Models/SceneServer",
      renderer: rcStructuresRenderer,
      elevationInfo: {
        mode: "on-the-ground"
      }
    });

    const rcTrees = new SceneLayer({                    
        url:"https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/RC_Trees_Expanded/SceneServer",
        opacity: 0.4,
        popupEnabled: false
    });

    const dcBuildings = new SceneLayer({
        url: "https://services.arcgis.com/neT9SoYxizqTHZPH/arcgis/rest/services/DC_3D_Buildings/SceneServer",
        definitionExpression: "EGID NOT IN ('DC00002813', 'DC00002812', 'DC00002810', 'DC00002811', 'DC00002814', 'DC00002809')",
        renderer: dcBuildingsRenderer,
        popupEnabled: false
    });

    const dcBuildingsBackground = new SceneLayer({
        url: "https://services.arcgis.com/neT9SoYxizqTHZPH/arcgis/rest/services/DC_3D_Buildings/SceneServer",
        definitionExpression: "EGID NOT IN ('DC00002813', 'DC00002812', 'DC00002810', 'DC00002811', 'DC00002814', 'DC00002809')",
        renderer: dcBuildingsRenderer,
        popupEnabled: false
    });

    const newDealBuildings = new SceneLayer({
      url: "https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/NewDeal_Mall_Structures/SceneServer",
      renderer: dcBuildingsRenderer,
      popupEnabled: false
    });

    const newDealBuildingsBackground = new SceneLayer({
      url: "https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/NewDeal_Mall_Structures/SceneServer",
      renderer: dcBuildingsRenderer,
      popupEnabled: false
    })

     const dcbaseVector = new VectorTileLayer ({
        url: "https://vectortileservices2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/DC_Vector_Base/VectorTileServer",
        opacity: 0
     });

     const dcbaseVectorBackground = new VectorTileLayer ({
        url: "https://vectortileservices2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/DC_Vector_Base/VectorTileServer",
     });     

    const dcBase1965 = new TileLayer ({
      url: "https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/DC_Aerial_1965/MapServer",
      opacity: 0.8,
    });

    const dcBoundary = new FeatureLayer({
      url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/DC_Boundary/FeatureServer",
      renderer: dcBoundaryRenderer
    })

     /***Background Map***/

     const map = new WebScene({
       ground: "world-elevation",
       layers: [dcBase1965, dcbaseVector, dcBoundary, rcArea, rcStructures, dcBuildings, newDealBuildings]
     });

     map.ground.opacity = 0;

     const view = new SceneView({
       container: "viewDiv",
       map: map,
       ui: {
            components: []
       },
       environment: {
          background:{
              type: "color", 
              color: [244, 245, 240, 1]
          },
          atmosphereEnabled: false,
          starsEnabled: false
       },
       camera: {
           position: {
             spatialReference: {
               latestWkid: 3857,
               wkid: 102100
             },
             x: -8574418.851599144,
             y: 4706509.945587167,
             z: 91322.59959733438
           },
           heading: 0.23259318346220675,
           tilt: 0.5041449310180743
         },
        viewingMode: "global"
     });

     /***Interactive Map***/

     const mapTwo = new WebScene({
       ground: "world-elevation",
       layers: [dcbaseVectorBackground, dcBuildingsBackground, rcStructures, rcTrees, newDealBuildingsBackground]
     }); 

      mapTwo.ground.opacity = 0;

     const viewTwo = new SceneView({
       container: "viewDivTwo",
       map: mapTwo,
       ui: {
            components: ["zoom"]
       },
       environment: {
          background:{
              type: "color", 
              color: [244, 245, 240, 1]
          },
          atmosphereEnabled: false,
          starsEnabled: false
       },
       navigation: { 
          mouseWheelZoomEnabled: false, 
          browserTouchPanEnabled: false, 
       },
       camera: {
           position: {
              spatialReference: {
                latestWkid: 3857,
                wkid: 102100
              },
              x: -8576619.686341936,
              y: 4704251.203138485,
              z: 713.3121951625052
            },
            heading: 0.490249338446696,
            tilt: 67.11055912437567 
         },
        viewingMode: "local"
     });


     /***Intersection Observer***/

     /*Timing Options*/

    const opts = {
      duration: 3000
    };

    // const videoDiv = document.querySelector('.video-div');
    // const video = document.querySelector('.rc-video');

    // function toggleVid() {
    //   if (video.classList.contains("hide")) {
    //       video.classList.remove("hide")
    //     } else {}
    // }

     /*Loop for multiple IO observations*/

    let io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          modify(entry.target);
        } 
      })
    }, {
      threshold: 0.1
    })

    function modify(el) {
      if (el.id === "title") {
        view.goTo({
            position: {
             spatialReference: {
               latestWkid: 3857,
               wkid: 102100
             },
             x: -8574418.851599144,
             y: 4706509.945587167,
             z: 91322.59959733438
           },
           heading: 0.23259318346220675,
           tilt: 0.5041449310180743 
        }, opts);
      }
      if (el.id === "first") {
        view.goTo({
            position: {
                spatialReference: {
                  latestWkid: 3857,
                  wkid: 102100
                },
                x: -8581794.018060436,
                y: 4701751.9767613495,
                z: 3871.6135169556364
              },
              heading: 58.3410334,
              tilt: 59.7847356 
        }, opts);
        dcBase1965.opacity = 0.8;
        if (dcbaseVector.opacity == 1) {
          dcbaseVector.opacity = 0;
        } 
      }
      if (el.id === "second") {
        view.goTo({
            position: {
                spatialReference: {
                  latestWkid: 3857,
                  wkid: 102100
                },
                x: -8570704.267592521,
                y: 4701701.369031901,
                z: 2102.793755807914
              },
              heading: 316.7449460926107,
              tilt: 65.0006852142101 
        }, opts);
        dcBase1965.opacity = 0;
        dcbaseVector.opacity = 1;
      }
      if (el.id === "third") {
        view.goTo({
            position: {
                spatialReference: {
                  latestWkid: 3857,
                  wkid: 102100
                },
                x: -8575671.6494669937,
                y: 4705846.891771941,
                z: 178.76294641476125
              },
              heading: 264.982385170003171,
              tilt: 72.20536355676637 
        }, opts);
      }
    }

    io.observe(document.querySelector('#title'));
    io.observe(document.querySelector('#first'));
    io.observe(document.querySelector('#second'));
    io.observe(document.querySelector('#third'));
    // io.observe(document.querySelector('#fourth'));
    // io.observe(document.querySelector('#fifth'));
    // io.observe(document.querySelector('#carousel-section'));


    //  view.watch('camera.position', function(newValue, oldValue, property, object) {
    //    console.log(property , newValue);
    //  });
     
    //  view.watch('camera.heading', function(newValue, oldValue, property, object) {
    //    console.log(property , newValue);
    //  });

    //  view.watch('camera.tilt', function(newValue, oldValue, property, object) {
    //    console.log(property , newValue);
    //  });

});




