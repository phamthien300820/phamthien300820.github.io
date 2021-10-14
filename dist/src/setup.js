function setup() {
    var W = window.innerWidth,
      H = window.innerHeight;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(W, H);

    // set color background
    // renderer.setClearColor("rgb(40, 42, 54)", 1);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, W / H, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    // scene.fog = new THREE.Fog(0xffffff, 1, 100000);

    // Use orbit for move, scale,... object.
    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    control = new THREE.TransformControls(camera, renderer.domElement);
    control.space = "local";
    meshObject.make();
    // lights.makePoint();
    planeObject.makePlane();
    lights.makeAm();
  
    window.addEventListener("resize", onWindowResize, false);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function draw() {
    // requestAnimationFrame(draw);
    var scale=0.005;
    camera.position.x -= camera.position.x *scale;
    camera.position.y = THREE.Math.clamp(
      camera.position.y + (200 - camera.position.y) * scale,
      50,
      1000
    );
    camera.lookAt(scene.position);

    scene.add(mesh);
    // console.log(meshObject);

    control.enabled = true;
    control.addEventListener("dragging-changed", function (event) {
      orbit.enabled = !event.value;
    });

    scene.add(control);
    update(renderer, scene, camera, orbit)
  }

  function update(renderer, scene, camera, orbit){

    
    renderer.render(scene, camera);

    orbit.update();
    // console.log(x);
    requestAnimationFrame(function () {update(renderer, scene, camera, orbit)});
  }