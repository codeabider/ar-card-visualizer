const imageTargetPipelineModule = () => {
  const LIGHT_PURPLE = 0xad50ff;
  const CHERRY = 0xdd0065;
  const MINT = 0x00edaf;
  const MANGO = 0xffc828;
  const GRAY = 0x8083a2;
  const DARK_GRAY = 0x464766;

  let model;
  // var graphInfo = [
  //   {
  //     id: "01",
  //     month: "Jan",
  //     expense: "100",
  //     currencies: ["dollar", "rupee", "pound"],
  //     current: "dollar"
  //   },
  //   {
  //     id: "02",
  //     month: "Feb",
  //     expense: "500",
  //     currencies: ["dollar", "rupee", "pound"],
  //     current: "dollar"
  //   },
  //   {
  //     id: "03",
  //     month: "March",
  //     expense: "1000",
  //     currencies: ["dollar", "rupee", "pound"],
  //     current: "dollar"
  //   },
  //   {
  //     id: "04",
  //     month: "April",
  //     expense: "250",
  //     currencies: ["dollar", "rupee", "pound"],
  //     current: "dollar"
  //   },
  //   {
  //     id: "05",
  //     month: "May",
  //     expense: "200",
  //     currencies: ["dollar", "rupee", "pound"],
  //     current: "dollar"
  //   },
  //   {
  //     id: "06",
  //     month: "June",
  //     expense: "800",
  //     currencies: ["dollar", "rupee", "pound"],
  //     current: "dollar"
  //   }
  // ];

  const frameBorder = (scaledWidth, scaledHeight) => {
    const border = new THREE.Group();
    border.add(
      frameEdge(
        -scaledWidth / 2,
        0,
        0.05,
        scaledHeight + 0.05,
        0.03,
        scaledHeight + 0.03
      )
    );
    border.add(
      frameEdge(
        scaledWidth / 2,
        0,
        0.05,
        scaledHeight + 0.05,
        0.03,
        scaledHeight + 0.03
      )
    );
    border.add(
      frameEdge(
        0,
        -scaledHeight / 2,
        scaledWidth + 0.05,
        0.05,
        scaledWidth + 0.03,
        0.03
      )
    );
    border.add(
      frameEdge(
        0,
        scaledHeight / 2,
        scaledWidth + 0.05,
        0.05,
        scaledWidth + 0.03,
        0.03
      )
    );
    return border;
  };

  // Adds an oriented axis.
  const axis = () => {
    const axes = new THREE.Group();
    const axisLength = 0.2;
    const cylinder = new THREE.CylinderBufferGeometry(
      0.01,
      0.01,
      axisLength,
      32
    );
    const xAxis = new THREE.Mesh(
      cylinder,
      new THREE.MeshBasicMaterial({ color: MANGO })
    );
    const yAxis = new THREE.Mesh(
      cylinder,
      new THREE.MeshBasicMaterial({ color: CHERRY })
    );
    const zAxis = new THREE.Mesh(
      cylinder,
      new THREE.MeshBasicMaterial({ color: MINT })
    );
    xAxis.rotateZ(Math.PI / 2);
    xAxis.position.set(axisLength / 2, 0, 0);
    yAxis.position.set(0, axisLength / 2, 0);
    zAxis.rotateX(Math.PI / 2);
    zAxis.position.set(0, 0, axisLength / 2);
    axes.add(xAxis);
    axes.add(yAxis);
    axes.add(zAxis);
    return axes;
  };

  // Adds a tinted-glass effect.
  const framePane = (scaledWidth, scaledHeight) => {
    const material = new THREE.MeshBasicMaterial({ color: LIGHT_PURPLE });
    material.alphaMap = new THREE.DataTexture(
      new Uint8Array([0, 127, 0]),
      1,
      1,
      THREE.RGBFormat
    );
    material.alphaMap.needsUpdate = true;
    material.transparent = true;
    return new THREE.Mesh(
      new THREE.CubeGeometry(scaledWidth, scaledHeight, 0.001),
      material
    );
  };

  // Constructs a picture frame out of threejs primitives.
  // const buildPrimitiveFrame = ({ scaledWidth, scaledHeight }) => {
  //   const frame = new THREE.Group();
  //   frame.add(frameBorder(scaledWidth, scaledHeight));
  //   frame.add(framePane(scaledWidth, scaledHeight));
  //   frame.add(axis());
  //   scene.add(frame);
  //   return frame;
  // };

  const initialScene = ({ scene, camera }) => {
    //initial position of camera
    const edge = new THREE.Group();
    const big = new THREE.Mesh(
      new THREE.CubeGeometry(0.1, 0.1, 0.008),
      new THREE.MeshBasicMaterial({ color: DARK_GRAY })
    );
    big.position.set(0, 0, 0);

    // var xDistance = -0.8;
    // let barsHeight = 0.6;
    // for (let i = 0; i < graphInfo.length; i++) {
    //   if (graphInfo[i].expense <= 300) {
    //     geometry = new THREE.PlaneGeometry(0.2, barsHeight * 2, 0.2);
    //     material = new THREE.MeshBasicMaterial({ color: 0x00d45c });
    //     mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.x = xDistance;
    //     mesh.position.x = xDistance;
    //     mesh.position.y = 0;
    //   }
    //   if (graphInfo[i].expense > 301 && graphInfo[i].expense <= 600) {
    //     geometry = new THREE.PlaneGeometry(0.2, barsHeight * 3, 0.2);
    //     material = new THREE.MeshBasicMaterial({ color: 0xffb521 });
    //     mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.x = xDistance;
    //     mesh.position.y = 0;
    //   }
    //   if (graphInfo[i].expense > 600) {
    //     geometry = new THREE.PlaneGeometry(0.2, barsHeight * 3.5, 0.2);
    //     material = new THREE.MeshBasicMaterial({ color: 0xff3633 });
    //     mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.x = xDistance;
    //     mesh.position.y = 0;
    //   }
    //   xDistance += 0.25;
    //   edge.add(mesh);
    // }
    model = edge.add(big);

    camera.position.set(0, 1, 3.1);
    console.log(model);

    model.visible = false;
  };

  //To load model or 3d item if image target name matches the detected area.
  // Places content over image target
  const showTarget = ({ detail }) => {
    const { scaledWidth, scaledHeight } = detail;
    // This string must match the name of the image target uploaded to 8th Wall.
    if (detail.name === "card1-demo") {
      const frame = new THREE.Group();
      frame.add(frameBorder(scaledWidth, scaledHeight));
      frame.add(framePane(scaledWidth, scaledHeight));
      frame.add(axis());
      scene.add(frame);
      model.visible = true;
    }
  };

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({ detail }) => {
    if (detail.name === "card1-demo") {
      model.visible = false;
    }
  };

  const onStart = ({ canvas }) => {
    const { scene, camera } = XR8.Threejs.xrScene();
    initialScene({ scene, camera });

    // Sync the xr controller's 6DoF position and camera parameters with our scene.
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
