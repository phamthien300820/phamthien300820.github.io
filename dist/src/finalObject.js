const clock = new THREE.Clock();

function newGeometry(i) {
  var geoArray = [
    new THREE.BoxGeometry(
      meshObject.cubeW,
      meshObject.cubeH,
      meshObject.cubeD,
      meshObject.cubeW / 10,
      meshObject.cubeH / 10,
      meshObject.cubeD / 10
    ),
    new THREE.SphereGeometry(
      meshObject.sphereR,
      meshObject.sphereSW,
      meshObject.sphereSH
    ),
    new THREE.IcosahedronGeometry(meshObject.radius, meshObject.detail),
    new THREE.OctahedronGeometry(meshObject.radius, meshObject.detail),
    new THREE.TetrahedronGeometry(meshObject.radius, meshObject.detail),
    new THREE.CylinderGeometry(
      meshObject.cyliRT,
      meshObject.cyliRB,
      meshObject.cyliH,
      meshObject.cyliRS,
      meshObject.cyliHS,
      meshObject.cyliOE
    ),
    new THREE.TorusGeometry(
      meshObject.torusR,
      meshObject.torusT,
      meshObject.torusRS,
      meshObject.torusTS,
      Math.PI * meshObject.torusA
    ),
    new THREE.TorusKnotGeometry(
      meshObject.knotR,
      meshObject.knotT,
      meshObject.knotRS,
      meshObject.knotTS,
      meshObject.knotP,
      meshObject.knotQ,
      meshObject.knotH
    ),
    new THREE.PlaneGeometry(
      meshObject.planeW,
      meshObject.planeH,
      meshObject.planeWS,
      meshObject.planeHS
    ),
    new THREE.CircleGeometry(
      meshObject.circleR,
      meshObject.circleS,
      meshObject.circleTS,
      Math.PI * meshObject.circleTL
    ),
    new THREE.RingGeometry(
      meshObject.ringIR,
      meshObject.ringOR,
      meshObject.ringTS,
      meshObject.ringPS,
      meshObject.ringTSt,
      Math.PI * meshObject.ringTL
    ),
  ];

  return geoArray[i];
}
function newMaterial(i, side = NaN) {
  // load a resource
  var matArray = [
    new THREE.MeshPhongMaterial({ side: side }),
    new THREE.PointsMaterial({ color: 0xffffff, size: 3 }),
    new THREE.MeshPhongMaterial({ wireframe: true }),
  ];
  return matArray[i];
}

function newMesh() {
  this.Geometry = 0;
  this.Material = 0;

  this.color = 0xff79c6;
  this.Texture = false;
  this.texture = NaN;

  this.planeTexture = false;
  this.planetexture = NaN;
  this.scale = 1;

  this.obitrotation = false;
  this.obittranslate = false;

  this.side = THREE.DoubleSide;
  this.castShadow = false;

  this.cubeW = 200;
  this.cubeH = 200;
  this.cubeD = 200;

  this.sphereR = 150;
  this.sphereSW = 100;
  this.sphereSH = 100;

  this.radius = 150;
  this.detail = 0;

  this.cyliRT = 100;
  this.cyliRB = 100;
  this.cyliH = 200;
  this.cyliRS = 50;
  this.cyliHS = 50;
  this.cyliOE = false;

  this.torusR = 100;
  this.torusT = 40;
  this.torusRS = 40;
  this.torusTS = 40;
  this.torusA = 2;

  this.knotR = 100;
  this.knotT = 40;
  this.knotRS = 64;
  this.knotTS = 8;
  this.knotP = 2;
  this.knotQ = 3;
  this.knotH = 1;

  this.planeW = 200;
  this.planeH = 200;
  this.planeWS = 4;
  this.planeHS = 4;

  this.circleR = 150;
  this.circleS = 50;
  this.circleTS = 0;
  this.circleTL = 2;

  this.ringIR = 150;
  this.ringOR = 50;
  this.ringTS = 50;
  this.ringPS = 5;
  this.ringTSt = 0;
  this.ringTL = 2;

  this.wheelc = 0xffffff;
  this.bodyc = 0xffffff;
  this.sidec_w = 0xffffff;
  this.sidec_v = 0xffffff;
  this.fontc_w = 0xffffff;
  this.fontc_v = 0xffffff;
  this.topc = 0xffffff;

  var poiArray = [
    this.cubeH / 2,
    this.sphereR,
    this.radius,
    this.radius,
    this.radius,
    this.cyliH / 2,
    this.torusR,
    this.knotR + this.knotT * 2,
    this.planeH / 2,
    this.circleR,
    this.ringIR,
    0,
  ];

  this.make = function () {
    scene.remove(mesh);

    if (this.Geometry == 11) {
      mesh = Car(
        this.Material,
        this.wheelc,
        this.bodyc,
        this.sidec_w,
        this.sidec_v,
        this.fontc_w,
        this.fontc_v,
        this.topc
      );
      // console.log(mesh);
      mesh.rotation.x -= Math.PI / 2;
    } else {
      if (this.Texture == true) {
        mesh = new THREE.Mesh(
          new newGeometry(this.Geometry),
          new THREE.MeshPhongMaterial({ map: this.texture, side: this.side })
        );
      } else {
        if (this.Material == 1) {
          mesh = new THREE.Points(
            new newGeometry(this.Geometry),
            new newMaterial(this.Material),
            100
          );
        } else {
          mesh = new THREE.Mesh(
            new newGeometry(this.Geometry),
            new newMaterial(this.Material, this.side)
          );
        }
      }
      mesh.material.color.setHex(this.color);
      mesh.receiveShadow = false;
      mesh.castShadow = true;
    }
    mesh.position.y = poiArray[this.Geometry];

    // console.log('Mesh make', mesh);
    scene.add(mesh);

    if (this.obitrotation) {
      this.obitRotation();
    }
    if (this.obittranslate) {
      this.obitTranslate();
    }
  };

  this.openMat = function () {
    if (matgui == undefined) {
      materialzGUI(meshObject.Geometry);
    }
  };
  this.closeMat = function () {
    matgui.destroy();
    matgui = undefined;
  };
  this.openGeo = function () {
    if (geogui == undefined) {
      geometriezGUI(meshObject.Geometry);
    }
  };
  this.closeGeo = function () {
    geogui.destroy();
    geogui = undefined;
  };
  this.loadTexture = function () {
    var path = document.getElementById("myInput").files[0];
    this.texture = new THREE.TextureLoader().load(URL.createObjectURL(path));
    this.update();
  };

  this.update = function () {
    scene.remove(mesh);
    var temp_mesh;

    if (this.Geometry != 11) {
      if (this.Texture == true) {
        temp_mesh = new THREE.Mesh(
          new newGeometry(this.Geometry),
          new THREE.MeshStandardMaterial({ map: this.texture, side: this.side })
        );
      } else if (this.Material == 1) {
        temp_mesh = new THREE.Points(
          new newGeometry(this.Geometry),
          new newMaterial(this.Material),
          100
        );
      } else {
        temp_mesh = new THREE.Mesh(
          new newGeometry(this.Geometry),
          new newMaterial(this.Material, this.side)
        );
      }
    } else {
      temp_mesh = Car(this.Material,
        this.wheelc,
        this.bodyc,
        this.sidec_w,
        this.sidec_v,
        this.fontc_w,
        this.fontc_v,
        this.topc
      );
    }
    temp_mesh.position.setX(mesh.position.x);
    temp_mesh.position.setY(mesh.position.y);
    temp_mesh.position.setZ(mesh.position.z);
    temp_mesh.scale.setX(mesh.scale.x);
    temp_mesh.scale.setY(mesh.scale.y);
    temp_mesh.scale.setZ(mesh.scale.z);
    temp_mesh.rotation.x = mesh.rotation._x;
    temp_mesh.rotation.y = mesh.rotation._y;
    temp_mesh.rotation.z = mesh.rotation._z;
    mesh = temp_mesh.clone();

    if (this.Geometry != 11) {
      mesh.material.color.setHex(this.color);

      mesh.receiveShadow = false;
      mesh.castShadow = true;
    }
    scene.add(mesh);

    if (this.obitrotation) {
      this.obitRotation();
    }
    if (this.obittranslate) {
      this.obitTranslate();
    }
  };
  this.obitRotation = function () {
    if (this.obitrotation == false) {
      if (this.obittranslate == true) {
        this.obittranslate = false;
        control.detach(mesh);
      }
      this.obitrotation = true;
      control.attach(mesh);
      control.setMode("rotate");
    } else {
      this.obitrotation = false;
      control.detach(mesh);
    }
  };

  this.obitTranslate = function () {
    if (this.obittranslate == false) {
      if (this.obitrotation == true) {
        this.obitrotation = false;
        control.detach(mesh);
      }

      this.obittranslate = true;
      control.attach(mesh);
      control.setMode("translate");
    } else {
      this.obittranslate = false;
      control.detach(mesh);
    }
  };
}
meshObject = new newMesh();

function newEnv() {
  this.renderShadows = false;
  this.fog = false;
  this.fclr = 0xf2f7ff;
  this.fnear = 1;
  this.ffar = 9000;
  this.reset = 100000;
  this.makeFog = function () {
    scene.fog = new THREE.Fog(this.fclr, this.fnear, this.ffar);
  };
}
enviro = new newEnv();

function newPlane() {
  this.togglePlane = true;
  this.texture = NaN;
  this.Texture = false;
  this.repeat = 80;
  this.scale = 30;
  this.toggleWireframe = false;
  this.w_line = 1;
  this.w_scale = 30;
  this.opacity = 0.3;

  this.makePlane = function () {
    pgeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
    pmaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF" });
    if (this.Texture) {
      pmaterial.map = this.texture;
      this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
      this.texture.repeat.set(this.repeat, this.repeat);
    }
    // pmaterial.side = THREE.DoubleSide;
    pmaterial.side = THREE.FrontSide;
    plane = new THREE.Mesh(pgeometry, pmaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    plane.scale.set(this.scale, this.scale, this.scale);
    scene.add(plane);
  };
  this.makeWireframe = function () {
    if (wireplane != undefined) {
      scene.remove(wireplane);
    }
    wgeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    wmaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      wireframeLinewidth: this.w_line,
    });
    wireplane = new THREE.Mesh(wgeometry, wmaterial);
    wireplane.scale.set(this.w_scale, this.w_scale, this.w_scale);
    wireplane.rotation.x = -Math.PI / 2;
    wireplane.receiveShadow = true;
    scene.add(wireplane);
  };
  this.loadTexture = function () {
    var path = document.getElementById("myInputplane").files[0];
    this.texture = new THREE.TextureLoader().load(URL.createObjectURL(path));
    if (this.togglePlane) this.makePlane();
  };
}
planeObject = new newPlane();

function newEvironment() {
  this.renderShadows = false;
  this.fog = false;
  this.fclr = 0xf2f7ff;
  this.fnear = 1;
  this.ffar = 9000;
  this.reset = 100000;
  this.makeFog = function () {
    scene.fog = new THREE.Fog(this.fclr, this.fnear, this.ffar);
  };
}
enviro = new newEvironment();

function newLight() {
  this.AmbientLight = true;
  this.aclr = 0x808080;

  this.PointLight = false;
  this.pi = 1;
  this.px = 10;
  this.py = 300;
  this.pz = -3;
  this.cp = 0xffffff;
  this.pf = 10000;
  this.pn = 1;

  this.makeAm = function () {
    if (ambientLight != undefined) {
      scene.remove(ambientLight);
    }
    ambientLight = new THREE.AmbientLight(this.aclr);
    ambientLight.position.x = 0;
    ambientLight.position.y = 300;
    ambientLight.position.z = 0;
    scene.add(ambientLight);
  };

  this.makePoint = function () {
    if (pointLight != undefined) {
      scene.remove(pointLight);
    }
    pointLight = new THREE.PointLight(this.cp, this.pi);
    pointLight.position.x = this.px;
    pointLight.position.y = this.py;
    pointLight.position.z = this.pz;

    pointLight.shadow.camera.near = this.pn;
    pointLight.shadow.camera.far = this.pf;

    pointLight.castShadow = true;

    scene.add(pointLight);
  };

  this.open = function (v) {
    if (lightgui == undefined) {
      lightGUI();
    }
  };
  this.close = function (v) {
    lightgui.destroy();
    lightgui = undefined;
  };
}
lights = new newLight();

function newAnimation() {
  this.turnOnAnima = false;

  this.rotationMesh = false;
  this.rotationCircle = false;

  this.rotationElip = false;
  this.scalemax = 1;
  this.cR = 0;
  this.maxHeight = 500;

  this.radius = 500;
  this.theta = 0;
  this.temp = 0.005;
  this.beta = 90;
  this.alpha = 1;
  this.scale = meshObject.scale;
  this.runAnimation = function () {
    if (this.turnOnAnima) {
      // animaGUI();
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
        orbit.update();
        this.meshRotation();
        this.circleRotation();
      });
    } else renderer.setAnimationLoop(null);
  };

  this.meshRotation = function () {
    if (this.rotationMesh) {
      mesh.rotation.x += 0.02;
      mesh.rotation.y += 0.01;
      mesh.scale.x = mesh.scale.y = mesh.scale.z = this.scale;
      this.scale -= this.temp;
      if (this.scale < 0) this.temp = this.temp * -1;
      if (this.scale > this.scalemax) this.temp = -1 * this.temp;
    }
  };

  this.circleRotation = function () {
    if (this.rotationCircle) {
      mesh.position.x = Math.sin(this.theta) * this.radius;
      mesh.position.z = this.alpha * Math.cos(this.theta) * this.radius;
      // mesh.position.y = 1/Math.tan(this.theta)*this.radius;
      mesh.position.y += this.cR;
      if (mesh.position.y > this.maxHeight || mesh.position.y < 0) {
        this.cR = -1 * this.cR;
      }
      this.theta += Math.PI / this.beta;
    }
  };

  this.open = function (v) {
    if (animagui == undefined) {
      animaGUI();
    }
  };
  this.close = function (v) {
    animagui.destroy();
    animagui = undefined;
  };
}
animaObject = new newAnimation();
