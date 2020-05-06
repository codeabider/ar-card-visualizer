const imageTargetPipelineModule = () => {
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  const allFrames = {};
  const videoFile = "./video/video-12.mp4";
  let model, video, font, graphPane, camera, barsGroup;
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
    const pane = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0xff9999 });
    material.alphaMap = new THREE.DataTexture(
      new Uint8Array([0, 70, 0]),
      1,
      1,
      THREE.RGBFormat
    );
    material.alphaMap.needsUpdate = true;
    material.transparent = true;
    graphPane = new THREE.Mesh(
      new THREE.PlaneGeometry(scaledWidth * 2, scaledHeight + 0.05, 0),
      material
    );
    graphPane.position.set(-0.2, 1, 0);
    pane.add(graphPane);
    const monthGraph = createBarGraph(
      scaledWidth,
      scaledHeight + 0.02,
      graphPane.position
    );
    const paneTitle = fontInit("Monthly Expense", 0.08, 0.008, 0x333);
    paneTitle.position.set(-0.5, 1.65, 0);
    pane.add(monthGraph);
    pane.add(paneTitle);
    return pane;
  };

  const framePane2 = (scaledWidth, scaledHeight) => {
    const pane2 = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0x757575 });
    material.alphaMap = new THREE.DataTexture(
      new Uint8Array([0, 100, 0]),
      1,
      1,
      THREE.RGBFormat
    );
    material.alphaMap.needsUpdate = true;
    material.transparent = true;
    graphPane = new THREE.Mesh(
      new THREE.PlaneGeometry(scaledWidth * 2, scaledHeight + 0.02, 0),
      material
    );
    graphPane.position.set(1.45, 1, 0);
    pane2.add(graphPane);
    const videoElement = videoBlog(
      scaledWidth * 2,
      scaledHeight + 0.02,
      graphPane.position
    );
    const paneTitle = fontInit("Promo Ads", 0.08, 0.008, 0xf0e87d);
    paneTitle.position.set(1.1, 1.65, 0);
    pane2.add(paneTitle);
    pane2.add(videoElement);
    return pane2;
  };

  // const axis = () => {
  //   const axes = new THREE.Group();
  //   const axisLength = 0.2;
  //   const cylinder = new THREE.CylinderBufferGeometry(
  //     0.01,
  //     0.01,
  //     axisLength,
  //     32
  //   );
  //   const xAxis = new THREE.Mesh(
  //     cylinder,
  //     new THREE.MeshBasicMaterial({ color: MANGO })
  //   );
  //   const yAxis = new THREE.Mesh(
  //     cylinder,
  //     new THREE.MeshBasicMaterial({ color: CHERRY })
  //   );
  //   const zAxis = new THREE.Mesh(
  //     cylinder,
  //     new THREE.MeshBasicMaterial({ color: MINT })
  //   );
  //   xAxis.rotateZ(Math.PI / 2);
  //   xAxis.position.set(axisLength / 2, 0, 0);
  //   yAxis.position.set(0, axisLength / 2, 0);
  //   zAxis.rotateX(Math.PI / 2);
  //   zAxis.position.set(0, 0, axisLength / 2);
  //   axes.add(xAxis);
  //   axes.add(yAxis);
  //   axes.add(zAxis);
  //   return axes;
  // };

  const videoBlog = (scaledWidth, scaledHeight, position) => {
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
      new THREE.PlaneGeometry(scaledWidth, scaledHeight),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    videoObj.position.copy(position);
    return videoObj;
  };

  const createBarGraph = (scaledWidth, scaledHeight, position) => {
    barsGroup = new THREE.Group();
    barsGroup.backgroundColor = new THREE.Color(0xff0000);
    // Create initalScene which means what you want to place or draw when image target is achieved
    let xDistance = position.x;
    let barsHeight = 0.25;

    for (let i = 0; i < graphInfo.length; i++) {
      let currentText = fontInit(graphInfo[i].month, 0.02, 0.018, 0x333333);

      if (graphInfo[i].expense <= 300) {
        let smallGroup = new THREE.Group();
        let smallScale = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, barsHeight, 0.001),
          new THREE.MeshBasicMaterial({ color: 0x4ca66f })
        );
        smallScale.name = graphInfo[i].month;
        smallGroup.position.set(xDistance, 0, 0.5);
        currentText.position.set(0, barsHeight - 0.1, 0.1);
        smallGroup.add(currentText);
        smallGroup.add(smallScale);
        barsGroup.add(smallGroup);
      }
      if (graphInfo[i].expense > 301 && graphInfo[i].expense <= 600) {
        let mediumGroup = new THREE.Group();
        let mediumScale = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, barsHeight * 2, 0.001),
          new THREE.MeshBasicMaterial({ color: 0xc29523 })
        );
        mediumScale.position.set(xDistance, 0.12, 0.5);
        currentText.position.set(xDistance, barsHeight * 2 - 0.1, 0.6);
        mediumGroup.add(mediumScale);
        mediumGroup.add(currentText);
        barsGroup.add(mediumGroup);
      }
      if (graphInfo[i].expense > 600) {
        let largeGroup = new THREE.Group();
        let largeScale = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, barsHeight * 3, 0.001),
          new THREE.MeshBasicMaterial({ color: 0xc46149 })
        );
        largeScale.position.set(xDistance, 0.25, 0.5);
        currentText.position.set(xDistance, barsHeight * 3 - 0.1, 0.6);
        largeGroup.add(largeScale);
        largeGroup.add(currentText);
        barsGroup.add(largeGroup);
      }
      xDistance = xDistance + 0.1;
    }
    barsGroup.position.set(
      -scaledWidth + 0.3,
      scaledHeight / 2 + 0.05,
      position.z
    );
    return barsGroup;
  };

  const fontLoader = () => {
    var loader = new THREE.FontLoader();
    loader.load("./fonts/open_sans_semibold_regular.typeface.json", function(
      response
    ) {
      font = response;
    });
  };

  const fontInit = (currentExpense, size, height, color) => {
    const geometry = new THREE.TextGeometry(currentExpense, {
      font: font,
      size: size,
      height: height
    });
    const textLayout = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: color })
    );
    return textLayout;
  };

  const buildPrimitiveFrame = ({ scaledWidth, scaledHeight }) => {
    const frame = new THREE.Group();

    frame.add(framePane(scaledWidth, scaledHeight));
    frame.add(framePane2(scaledWidth, scaledHeight));
    // frame.add(axis());
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
    frame.visible = true;
    video.play();
  };

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({ detail }) => {
    if (detail.name === "card-new") {
      allFrames[detail.name].visible = false;
    }
    video.pause();
  };

  const mouseInfo = e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(model.children, true);
    for (var i = 0; i < intersects.length; i++) {
      console.log(intersects[i]);
      selectedGraphInfo(intersects[i].object);
    }
  };

  const selectedGraphInfo = selectedObject => {
    selectedObject.material.wireframe = true;
  };

  const onStart = ({ canvas }) => {
    camera = XR8.Threejs.xrScene().camera;

    model = XR8.Threejs.xrScene().scene;
    camera.position.set(0, 10, 0);
    // Sync the xr controller's 6DoF position and camera parameters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion
    });

    fontLoader();
    document.getElementById("camerafeed").addEventListener("click", mouseInfo);
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
