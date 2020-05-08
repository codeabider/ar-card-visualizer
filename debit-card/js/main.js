const imageTargetPipelineModule = () => {
  let raycaster = new THREE.Raycaster(); // for handling events in three.js
  var mouse = new THREE.Vector2(); // for updating mouse position using events

  const allFrames = {};
  const videoFile = "./video/video-12.mp4"; //video to load in POC
  const fontsFile = "./fonts/open_sans_semibold_regular.typeface.json";
  const graphTitle = "Monthly Expense Graph";
  const financePromotions = "Financial Adviser";
  const canvas = document.getElementById("cameraFeed");
  let scene, video, font, graphPane, camera, barsGroup; //variables to use across
  let selectedMonth, totalExpense, currentCurrency, selectedBarGraph;
  selectedMonth = "";
  totalExpense = "";
  currentCurrency = "";
  selectedBarGraph = {};
  // static JSON Data integrate
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

  //Fonts loader to load fonts
  const fontLoader = () => {
    var loader = new THREE.FontLoader();
    loader.load(fontsFile, function(response) {
      font = response;
    });
  };

  // Frame for Graph
  const framePane = (scaledWidth, scaledHeight) => {
    const pane = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0xf7f5cb });
    material.alphaMap = new THREE.DataTexture(
      new Uint8Array([0, 100, 0]),
      1,
      1,
      THREE.RGBFormat
    );
    material.alphaMap.needsUpdate = true;
    material.transparent = true;
    graphPane = new THREE.Mesh(
      new THREE.PlaneGeometry(scaledWidth + 1, scaledHeight + 0.05, 0),
      material
    );
    graphPane.material.wireframe = false;
    graphPane.position.set(-0.2, 1, 0);
    pane.add(graphPane);
    const monthGraph = createBarGraph(
      scaledWidth,
      scaledHeight + 0.02,
      graphPane.position
    );
    const paneTitle = fontInit(graphTitle, 0.06, 0.005, 0x333);
    paneTitle.position.set(-0.5, 1.65, 0);
    pane.add(monthGraph);
    pane.add(paneTitle);
    return pane;
  };

  //Frame for Video Blog
  const framePane2 = (scaledWidth, scaledHeight) => {
    const pane2 = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0xaac9f0 });
    material.alphaMap = new THREE.DataTexture(
      new Uint8Array([0, 50, 0]),
      1,
      1,
      THREE.RGBFormat
    );
    material.alphaMap.needsUpdate = true;
    material.transparent = true;
    const planeGeo = new THREE.PlaneGeometry(
      scaledWidth * 2,
      scaledHeight + 0.02,
      0
    );
    graphPane = new THREE.Mesh(planeGeo, material);
    pane2.add(graphPane);
    const videoElement = videoBlog(
      scaledWidth * 1.5,
      scaledHeight * 0.8,
      graphPane.position
    );
    const paneTitle = fontInit(financePromotions, 0.08, 0.008, 0x333333);
    paneTitle.position.set(-0.5, 0.5, 0);
    pane2.add(paneTitle);
    pane2.add(videoElement);
    pane2.position.set(-0.2, -1, 0);
    return pane2;
  };

  // Elements to draw video on canvas
  const videoBlog = (scaledWidth, scaledHeight, position) => {
    video = document.createElement("video");
    video.src = videoFile;
    video.setAttribute("controls", "true");
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

  //Draw full bar graph with help of individual bars
  const createBarGraph = (scaledWidth, scaledHeight, position) => {
    barsGroup = new THREE.Group();

    barsGroup.backgroundColor = new THREE.Color(0xff0000);
    // Create initialScene which means what you want to place or draw when image target is achieved
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
        smallGroup.name = graphInfo[i].month;
        smallScale.userData = Object.assign(
          {},
          { selectedGraphInfo: graphInfo[i] }
        );
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
        mediumScale.userData = Object.assign(
          {},
          { selectedGraphInfo: graphInfo[i] }
        );
        mediumGroup.name = graphInfo[i].month;

        mediumScale.position.set(xDistance, 0.12, 0.5);
        currentText.position.set(xDistance, barsHeight * 2 - 0.1, 0.6);
        mediumGroup.add(currentText);
        mediumGroup.add(mediumScale);
        barsGroup.add(mediumGroup);
      }
      if (graphInfo[i].expense > 600) {
        let largeGroup = new THREE.Group();
        let largeScale = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, barsHeight * 3, 0.001),
          new THREE.MeshBasicMaterial({ color: 0xc46149 })
        );
        largeScale.userData = Object.assign(
          {},
          { selectedGraphInfo: graphInfo[i] }
        );
        largeGroup.name = graphInfo[i].month;

        largeScale.position.set(xDistance, 0.25, 0.5);
        currentText.position.set(xDistance, barsHeight * 3 - 0.1, 0.6);
        largeGroup.add(currentText);
        largeGroup.add(largeScale);
        barsGroup.add(largeGroup);
      }
      xDistance = xDistance + 0.08;
    }
    barsGroup.position.set(
      -scaledWidth + 0.003,
      scaledHeight / 1.5,
      position.z
    );
    return barsGroup;
  };

  //create common function to add fonts
  const fontInit = (currentText, size, height, color) => {
    const geometry = new THREE.TextGeometry(currentText, {
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

  // Add frames to scene
  const buildPrimitiveFrame = ({ scaledWidth, scaledHeight }) => {
    const frame = new THREE.Group();

    frame.add(framePane(scaledWidth, scaledHeight));
    frame.add(framePane2(scaledWidth, scaledHeight));
    // frame.add(axis());
    scene.add(frame);
    return frame;
  };

  //To load scene or 3d item if image target name matches the detected area.
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
    if (detail.name === "debit-card-image") {
      allFrames[detail.name].visible = false;
    }
    video.pause();
  };

  const mouseInfo = e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    console.log(barsGroup);
    if (!!Object.keys(selectedBarGraph).length) {
      barsGroup.remove(selectedMonth);
      barsGroup.remove(totalExpense);
      const currentInfo = barsGroup.children.map(data => {
        if (data.name === selectedBarGraph.selectedGraphInfo.month) {
          data.children[1].material.wireframe = false;
        }
        return data;
      });
      barsGroup.children = [];
      barsGroup.children = currentInfo;
    }
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    for (var i = 0; i < intersects.length; i++) {
      updateGraphDetails(intersects[i].object);
    }
  };

  const updateGraphDetails = ({ userData, material }) => {
    if (!!Object.keys(userData).length) {
      material.wireframe = true;
      selectedBarGraph = userData;
      const { selectedGraphInfo = {} } = userData;
      const { month = "", expense = "", current = "" } = selectedGraphInfo;
      selectedMonth = fontInit("Month: " + month, 0.05, 0.004, 0x333);
      totalExpense = fontInit("Total Expense: " + expense, 0.05, 0.004, 0x333);
      currentCurrency = fontInit("Currency: " + current, 0.05, 0.004, 0x333);
      selectedMonth.position.set(0.8, 0.6, 0);
      totalExpense.position.set(0.8, 0.45, 0);
      currentCurrency.position.set(0.8, 0.3, 0);
      barsGroup.add(selectedMonth);
      barsGroup.add(totalExpense);
      barsGroup.add(currentCurrency);
    }
  };

  document.getElementById("cameraFeed").addEventListener("click", mouseInfo);

  const onStart = ({ canvas }) => {
    camera = XR8.Threejs.xrScene().camera;

    scene = XR8.Threejs.xrScene().scene;
    camera.position.set(0, 3, 0);
    fontLoader();

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
  XR8.run({ canvas: document.getElementById("cameraFeed") });
};

// Show loading screen before the full XR library has been loaded.
const load = () => {
  XRExtras.Loading.showLoading({ onxrloaded });
};

window.onload = () => {
  window.XRExtras ? load() : window.addEventListener("xrextrasloaded", load);
};
