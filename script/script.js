/***Load ArcGIS JS API modules***/

const WebScene = await $arcgis.import("@arcgis/core/WebScene.js");
const SceneView = await $arcgis.import("@arcgis/core/views/SceneView.js");
const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
const SceneLayer = await $arcgis.import("@arcgis/core/layers/SceneLayer.js");
const VectorTileLayer = await $arcgis.import("@arcgis/core/layers/VectorTileLayer.js");
const reactiveUtils = await $arcgis.import("@arcgis/core/core/reactiveUtils.js");
const TileLayer = await $arcgis.import("@arcgis/core/layers/TileLayer.js");

/***Scroll Events***/

const textOverlayDiv = document.getElementById('text-overlay');

/***Logo click scroll to top***/

const logoBtn = document.querySelector('.logo');

logoBtn.addEventListener('click', function () {
  const duration = 750; // in ms
  const start = textOverlayDiv.scrollTop;
  const startTime = performance.now();

  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // from 0 to 1

    textOverlayDiv.scrollTop = start * (1 - progress);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
});

/***Event Listener for Atlas icon***/

const logo = document.querySelector('.logo-container');
const mapDiv = document.getElementById('viewDiv');
const titleText = document.querySelector('.title-text');

const scrollThreshold = 250;

textOverlayDiv.addEventListener('scroll', () => {
  if (textOverlayDiv.scrollTop > scrollThreshold) {
    logo.classList.add('show');
    mapDiv.classList.add('show')
  } else {
    logo.classList.remove('show');
    mapDiv.classList.remove('show');
  }
});

/***Event Listener for scroll arrow***/

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

  // const disableScrollArea = document.getElementById('viewDivTwo');

  // disableScrollArea.addEventListener('mouseenter', () => {
  //   lenis.stop();
  // });

  // disableScrollArea.addEventListener('mouseleave', () => {
  //   lenis.start();
  // });
})

/*** Slide Carousel ***/ 

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

/***Add Map Layers***/

const rcStructures = new SceneLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Resurrection_City_Structure_Models/SceneServer",
  renderer: dcBuildingsRenderer,
  elevationInfo: {
    mode: "on-the-ground"
  },
  opacity: 0
});

const rcStructuresBackground = new SceneLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Resurrection_City_Structure_Models/SceneServer",
  renderer: rcStructuresRenderer,
  elevationInfo: {
    mode: "on-the-ground"
  },
  popupEnabled: false,
  labelingInfo: [structureUseLabel]
});

const rcTrees = new SceneLayer({                    
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Resurrection_City_Trees/SceneServer",
  opacity: 0.7,
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
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/New_Deal_Mall_Buildings/SceneServer",
  renderer: dcBuildingsRenderer,
  popupEnabled: false
});

const newDealBuildingsBackground = new SceneLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/New_Deal_Mall_Buildings/SceneServer",
  renderer: dcBuildingsRenderer,
  popupEnabled: false
});

const newDealBuildingsLabelPoint = new FeatureLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/New_Deal_Structure_Label_Point/FeatureServer",
  labelingInfo: [newDealLabel],
  renderer: newDealPointRenderer
});

const dcbaseVector = new VectorTileLayer ({
  url: "https://vectortileservices3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/DC_Vector_Base_Map/VectorTileServer",
  opacity: 0
});

const dcbaseVectorBackground = new VectorTileLayer ({
  url: "https://vectortileservices3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/DC_Vector_Base_Map/VectorTileServer",
  opacity: 0.7
});     
 
const dcBase1965 = new TileLayer ({
  url: "https://tiles.arcgis.com/tiles/9nfxWATFamVUTTGb/arcgis/rest/services/DC_Aerial_1965/MapServer",
  opacity: 1,
});

const dcBoundary = new FeatureLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/DC_Boundary/FeatureServer",
  renderer: dcBoundaryRenderer
})

  /***Background Map***/

  const map = new WebScene({
    ground: "world-elevation",
    layers: [dcBase1965, dcbaseVector, dcBoundary, rcStructures, dcBuildings, newDealBuildings, rcStructures]
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
          color: [64, 46, 50, 1]
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
    layers: [dcbaseVectorBackground, dcBuildingsBackground, rcStructuresBackground, rcTrees, newDealBuildingsLabelPoint, newDealBuildingsBackground]
  }); 

  mapTwo.ground.opacity = 0;

  const viewTwo = new SceneView({
    container: "viewDivTwo",
    map: mapTwo,
    qualityProfile: "high",
    viewingMode: "global",
    navigation: {
      mouseWheelZoomEnabled: false,
      browserTouchPanEnabled: false,
    },
    ui: {
        components: []
    },
    camera: {
        position: {
          spatialReference: {
            latestWkid: 3857,
            wkid: 102100
          },
          x: -8577269.845241047,
          y: 4705647.647923097,
          z: 84.40982836019248
        },
        heading: 80.98638525774925,
        tilt: 85.16137847229764 
      },
    environment: {
      lighting: {
          directShadowsEnabled: true
      }
    },
  });

  viewTwo.environment.weather = {
  type: "cloudy",
  precipitation: 0.3,
  cloudCover: 0.7  
};


/***Custom Zoom In/Out Buttons***/

function changeZoom(delta) {
  const camera = viewTwo.camera.clone();
  const scale = delta > 0 ? 0.7 : 1.3;
  const newPos = camera.position.clone();
  newPos.x = (newPos.x - viewTwo.center.x) * scale + viewTwo.center.x;
  newPos.y = (newPos.y - viewTwo.center.y) * scale + viewTwo.center.y;
  newPos.z = (newPos.z - viewTwo.center.z) * scale + viewTwo.center.z;
  
  camera.position = newPos;
  viewTwo.goTo(camera, { duration: 500, easing: "ease-in-out" });
}

document.getElementById("zoom-in-btn").addEventListener("click", () => {
  changeZoom(1);
});

document.getElementById("zoom-out-btn").addEventListener("click", () => {
  changeZoom(-1);
});

/***Intersection Observer***/

/*Timing Options*/

const opts = {
  duration: 4500
};

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
    dcBase1965.opacity = 1;

    if (dcbaseVector.opacity == 0.7) {
      dcbaseVector.opacity = 0;
    } 
  }
  if (el.id === "third") {
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
    dcbaseVector.opacity = 0.7;
    rcStructures.opacity = 1;
  }
  if (el.id === "fourth") {
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
// io.observe(document.querySelector('#second'));
io.observe(document.querySelector('#third'));
io.observe(document.querySelector('#fourth'));
// io.observe(document.querySelector('#fifth'));

/****Close Loader Div after Layer Load****/

view.whenLayerView(dcBuildings).then((layerView) => {
  reactiveUtils.whenOnce(() => !layerView.updating).then(() => {
    document.querySelector('.loading-div').classList.toggle('hidden');
  });
});


//  viewTwo.watch('camera.position', function(newValue, oldValue, property, object) {
//    console.log(property , newValue);
//  });
  
//  viewTwo.watch('camera.heading', function(newValue, oldValue, property, object) {
//    console.log(property , newValue);
//  });

//  viewTwo.watch('camera.tilt', function(newValue, oldValue, property, object) {
//    console.log(property , newValue);
//  });






