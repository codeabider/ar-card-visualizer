const imageTargetPipelineModule = () => {
  // const raycaster = new THREE.Raycaster();
  // const tapPosition = new THREE.Vector2();
  var model;
  var graphInfo = [
    {
      id: "01",
      month: "Jan",
      expense: "100",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "02",
      month: "Feb",
      expense: "500",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "03",
      month: "March",
      expense: "1000",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "04",
      month: "April",
      expense: "250",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "05",
      month: "May",
      expense: "200",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "06",
      month: "June",
      expense: "800",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    }
  ];
  console.log(graphInfo.length);
  const initialScene = ({ scene, camera }) => {
    // Create initalScene which means what you want to place or draw when image target is achieved
    var geometry = new THREE.BoxGeometry(0.2, 2, 0.2);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var xDistance = 0;
    let barsHeight;
    for (let i = 0; i < graphInfo.length; i++) {
      if (graphInfo[i].expense <= 300) {
        barsHeight = 0.8;
        geometry = new THREE.BoxGeometry(0.2, barsHeight, 0.2);
        material = new THREE.MeshBasicMaterial({ color: 0x9ecc6a });
      }
      if (graphInfo[i].expense > 300 && graphInfo[i].expense <= 600) {
        barsHeight = 1.6;
        geometry = new THREE.BoxGeometry(0.2, barsHeight, 0.2);
        material = new THREE.MeshBasicMaterial({ color: 0xe38944 });
      }
      if (graphInfo[i].expense > 600) {
        barsHeight = 2.4;
        geometry = new THREE.BoxGeometry(0.2, barsHeight, 0.2);
        material = new THREE.MeshBasicMaterial({ color: 0xf23c1f });
      }

      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = xDistance;
      // mesh.position.z = xDistance;
      xDistance += 0.4;
      scene.add(mesh);
    }
    model = scene.add(mesh);
    console.log(model);

    model.visible = false;
    //initial position of camera
    camera.position.set(0.5, 2, 4);
  };

  //To load model or 3d item if image target name matches the detected area.
  // Places content over image target
  const showTarget = ({ detail }) => {
    // This string must match the name of the image target uploaded to 8th Wall.
    if (detail.name === "debit-card-demo") {
      model.position.copy(detail.position);
      model.quaternion.copy(detail.rotation);
      model.scale.set(detail.scale, detail.scale, detail.scale);
      model.visible = true;
      // model.position.x = detail.position.x + 0.5;
    }
  };

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({ detail }) => {
    if (detail.name === "debit-card-demo") {
      model.visible = false;
    }
  };

  const onStart = ({ canvas }) => {
    const { scene, camera } = XR8.Threejs.xrScene();
    initialScene({ scene, camera });

    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion
    });
  };

  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be
    // unique within your app.
    name: "demo App",
    onStart,
    listeners: [
      { event: "reality.imagefound", process: showTarget },
      { event: "reality.imageupdated", process: showTarget },
      { event: "reality.imagelost", process: hideTarget }
    ]
  };
};

const onxrloaded = () => {
  XR8.xrController().configure({ disableWorldTracking: true });
  XR8.addCameraPipelineModules([
    // Add camera pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(), // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
    // Custom pipeline modules.
    imageTargetPipelineModule() // Draws a frame around detected image targets.
  ]);

  // Open the camera and start running the camera run loop.
  XR8.run({ canvas: document.getElementById("camerafeed") });
};

// Show loading screen before the full XR library has been loaded.
const load = () => {
  XRExtras.Loading.showLoading({ onxrloaded });
};

window.onload = () => {
  window.XRExtras ? load() : window.addEventListener("xrextrasloaded", load);
};
