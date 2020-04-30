const imageTargetPipelineModule = () => {
  const LIGHT_PURPLE = 0xad50ff;
  const CHERRY = 0xdd0065;
  const MINT = 0x00edaf;
  const MANGO = 0xffc828;
  const allFrames = {};
  const videoFile = "./video/short-video.mp4";
  let model, video;
  const graphInfo = [
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
    },
    {
      id: "07",
      month: "July",
      expense: "400",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "08",
      month: "Aug",
      expense: "300",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "09",
      month: "Sep",
      expense: "100",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "10",
      month: "Oct",
      expense: "550",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "11",
      month: "Nov",
      expense: "800",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    },
    {
      id: "12",
      month: "Dec",
      expense: "900",
      currencies: ["dollar", "rupee", "pound"],
      current: "dollar"
    }
  ];

  const framePane = (scaledWidth, scaledHeight) => {
    const material = new THREE.MeshBasicMaterial({ color: LIGHT_PURPLE });
    material.alphaMap = new THREE.DataTexture(
      new Uint8Array([0, 50, 0]),
      2,
      2,
      THREE.RGBFormat
    );
    material.alphaMap.needsUpdate = true;
    material.transparent = true;
    return new THREE.Mesh(
      new THREE.CubeGeometry(scaledWidth, scaledHeight * 2, 0),
      material
    );
  };

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

  const videoBlog = (scaledWidth, scaledHeight) => {
    video = document.createElement("video");
    video.src = videoFile;
    video.setAttribute("preload", "auto");
    video.setAttribute("autoplay", "true");
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    const videoObj = new THREE.Mesh(
      new THREE.PlaneGeometry(scaledWidth / 2, scaledHeight / 2),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    videoObj.position.set(-0.5, 0.6, 0.003);
    return videoObj;
  };

  const createBarGraph = (scaledWidth, scaledHeight) => {
    const barsGroup = new THREE.Group();
    // Create initalScene which means what you want to place or draw when image target is achieved
    let xDistance = 0;
    let barsHeight = 0.25;
    for (let i = 0; i < graphInfo.length; i++) {
      if (graphInfo[i].expense <= 300) {
        let smallScale = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, barsHeight, 0.001),
          new THREE.MeshBasicMaterial({ color: 0x4ca66f })
        );
        smallScale.position.set(xDistance, -0.001, 0.5);
        barsGroup.add(smallScale);
      }
      if (graphInfo[i].expense > 301 && graphInfo[i].expense <= 600) {
        let mediumScale = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, barsHeight * 2, 0.001),
          new THREE.MeshBasicMaterial({ color: 0xc29523 })
        );
        mediumScale.position.set(xDistance, 0.12, 0.5);
        barsGroup.add(mediumScale);
      }
      if (graphInfo[i].expense > 600) {
        let largeScale = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, barsHeight * 3, 0.001),
          new THREE.MeshBasicMaterial({ color: 0xc46149 })
        );
        largeScale.position.set(xDistance, 0.25, 0.5);
        barsGroup.add(largeScale);
      }
      xDistance = xDistance + 0.1;
    }
    barsGroup.position.set(-0.5, 0.8, 0.05);

    return barsGroup;
  };

  const buildPrimitiveFrame = ({ scaledWidth, scaledHeight }) => {
    const frame = new THREE.Group();
    frame.add(framePane(scaledWidth, scaledHeight));
    frame.add(axis());
    frame.add(createBarGraph(scaledWidth, scaledHeight));
    frame.add(videoBlog(scaledWidth, scaledHeight));
    model.add(frame);
    return frame;
  };

  //To load model or 3d item if image target name matches the detected area.
  // Places content over image target
  const showTarget = ({ detail }) => {
    let frame = allFrames[detail.name];
    if (!frame) {
      frame = buildPrimitiveFrame(detail);
      allFrames[detail.name] = frame;
    }
    frame.position.copy(detail.position);
    frame.quaternion.copy(detail.rotation);
    frame.scale.set(detail.scale, detail.scale, detail.scale);
    video.play();
    frame.visible = true;
  };

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({ detail }) => {
    if (detail.name === "card-detection-poc") {
      video.pause();
      allFrames[detail.name].visible = false;
    }
  };

  const onStart = ({ canvas }) => {
    const { camera } = XR8.Threejs.xrScene();
    model = XR8.Threejs.xrScene().scene;
    camera.position.set(0, 3, 0);
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
