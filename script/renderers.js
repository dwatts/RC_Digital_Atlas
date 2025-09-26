const dcBuildingsRenderer = {
    type: "simple",
    symbol: {
    type: "mesh-3d",
    symbolLayers: [
        {
        type: "fill",
        material: {
            color: [240, 240, 240, 0.85]
        },
        edges: {
            type: "sketch",
            color: [0, 0, 0, 0.6],
            size: 0.5
        }
        }
    ]
    }
};

// const rcStructuresRenderer = {
//     type: "simple",
//     symbol: {
//     type: "mesh-3d",
//     symbolLayers: [
//         {
//         type: "fill",
//         material: {
//             color: [170, 138, 82, 0.7]
//         },
//         edges: {
//             type: "sketch",
//             color: [0, 0, 0, 0.6],
//             size: 0.5
//         }
//         }
//     ]
//     }
// };

//RC Structure Renderer

//***********General Edge Renderer**********//

const structureEdges = {
  type: "sketch",
  color: [0, 0, 0, 0.6],
  size: 0.5
}; 

//***********Category Renderer**********//
          
const admin = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#E41A1C"
      },
      edges: structureEdges    
    } 
  ]  
};
  
const gathering = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#377EB8"
      },
      edges: structureEdges    
    } 
  ]  
};

const groupRes = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#4DAF4A"
      },
      edges: structureEdges    
    } 
  ]  
}
  
const indRes = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#984EA3"
      },
      edges: structureEdges    
    } 
  ]  
}  

const notDetermined = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#FF7F00"
      },
      edges: structureEdges    
    } 
  ]  
}

const services = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#FFFF33"
      },
      edges: structureEdges    
    } 
  ]  
}

const utilities = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#A65628"
      },
      edges: structureEdges    
    } 
  ]  
}


  
const rcStructuresRenderer = {
  type: "unique-value",
  defaultSymbol: {
    type: "mesh-3d",
    symbolLayers: [
      {
        type: "fill", 
        material: {
          color: "#4f4f4f"
        },
        edges: structureEdges  
      }
    ]
  },
  field: "Category",
  uniqueValueInfos: [
    {
      value: "Administration",
      symbol: admin,
    },
    {
      value: "Gathering Spaces",
      symbol: gathering,
    },
    {
      value: "Group / Family Residential",
      symbol: groupRes,
    },
    {
      value: "Individual Residential",
      symbol: indRes,
    },
    {
      value: "Not determined",
      symbol: notDetermined,
    },
    {
      value: "Services",
      symbol: services,
    },
    {
      value: "Utilities",
      symbol: utilities,
    }    
  ],
};

//End RC Structure Category Renderer

const rcRenderer = {            
    type: "simple",
    symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
            color: [115,9,0,1],
            width: 3,
            style: "solid"    
        }
    }
}

const mallRenderer = {
        type: "simple",
        symbol: {
        type: "polygon-3d",
        symbolLayers: [{
            type: "fill",
            material: {
            color: "#e6eae6"
            }
        }]
    }
};

const dcBoundaryRenderer = {            
    type: "simple",
    symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
            color: [64, 46, 50, 0.9],
            width: 1.5,
            style: "solid"    
        }
    }
}



// const rcRenderer = {
//   type: "simple",
//   symbol: {
//     type: "line-3d",
//     symbolLayers: [
//       {
//         type: "path",
//         profile: "quad",
//         material: {
//           color: [255, 0, 16],
//         },
//         width: 5,
//         height: 30,
//         join: "miter",
//         cap: "round",
//         anchor: "bottom",
//         profileRotation: "heading", // or "heading"
//       },
//     ],
//   }
// };