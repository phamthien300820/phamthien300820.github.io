var scene, camera, renderer;
var meshObject, planeObject, mesh, plane, wireplane, Geometry, Material, pgeometry, pmaterial;
var control;
var envObj;
var texture;
var update;
var lights,
  pointLight,
  ambientLight;
var enviro;
var animaObject;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

bg = document.body.style;
bg.background = "#000000";
var bgcode;

function addDatGui() {
  var gui = new dat.GUI();

  // MESH_FOLDER
  var m = gui.addFolder("Vật thể");
  m.add(meshObject, "Geometry", {
    Hộp: 0,
    Cầu: 1,
    "Nhị thập diện": 2,
    "Bát diện đều": 3,
    "Tứ diện": 4,
    "Trụ tròn": 5,
    Xuyến: 6,
    Knot: 7,
    "Chữ nhật": 8,
    Tròn: 9,
    Ring: 10,
    "Ô tô": 11,
  })
    .onChange(function (v) {
      meshObject.make();
      geometriezGUI(meshObject.Geometry);
      if (matgui != undefined) {
        materialzGUI(meshObject.Material);
      }
    })
    .name("Hình dạng");
  m.add(meshObject, "Material", {
    "Mặc định": 0,
    Điểm: 1,
    Cạnh: 2,
  })
    .onChange(function (v) {
      meshObject.make();
      materialzGUI(meshObject.Material);
    })
    .name("Kết cấu");
  m.add(meshObject, "Texture").onChange(function () {
    if (meshObject.Texture == true) {
      document.getElementById("myInput").click();
    } else {
      meshObject.make();
    }
  });

  m.add(meshObject, "openGeo").name("Thông số hình");
  m.add(meshObject, "openMat").name("Màu sắc");

  m.add(meshObject, "scale", 0.1, 5)
  .name("Tỉ lệ")
  .onChange(function () {
    mesh.scale.x = mesh.scale.y = mesh.scale.z = meshObject.scale;
  });

  m.add(meshObject, "castShadow").name('Hiện bóng').onChange(function (v) {
    if (v == true) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      meshObject.update();

      if (planeObject.togglePlane == true) {
        planeObject.makePlane();
      }
      if (planeObject.toggleWireframe == true) {
        planeObject.makeWireframe();
      }
    } else {
      renderer.shadowMap.enabled = false;
      meshObject.update();
      if (planeObject.togglePlane == true) {
        planeObject.makePlane();
      }
      if (planeObject.toggleWireframe == true) {
        planeObject.makeWireframe();
      }
    }
  });

  // PLANE_FOLDER
  var p = gui.addFolder("Mặt phẳng");
  var wftog = false,
    ptog = false;
  p.add(planeObject, "toggleWireframe").name('Lưới').onChange(function (v) {
    if (v == true) {
      planeObject.makeWireframe();
    } else {
      scene.remove(wireplane);
    }

    if (planeObject.toggleWireframe == true && wftog == false) {
      p.add(planeObject, "w_scale", 1, 30).onChange(function () {
        if (planeObject.toggleWireframe == true) {
          planeObject.makeWireframe();
        }
      });
      wftog = true;
    }
  });

  p.add(planeObject, "togglePlane").name("Nền trơn").onChange(function (v) {
    if (v == true) {
      planeObject.makePlane();
    } else {
      scene.remove(plane);
    }

    if (planeObject.togglePlane == true && ptog == false) {
      p.add(planeObject, "Texture").onChange(function () {
        if (planeObject.Texture){
          document.getElementById("myInputplane").click();
        }
        if (planeObject.togglePlane == true) {
          planeObject.makePlane();
        
        }
      });
      p.add(planeObject, "scale", 1, 30)
        .name("Tỉ lệ")
        .onChange(function () {
          if (planeObject.togglePlane == true) {
            planeObject.makePlane();
          }
        });
      p.add(planeObject, "Lặp ảnh", 1, 160).onChange(function () {
        if (planeObject.togglePlane == true) {
          planeObject.makePlane();
        }
      });
      ptog = true;
    }
  });

  // ENVIRONMENT_FOLDER
  var e = gui.addFolder("Khung cảnh");
  var edeetz = false;
  if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
  } else {
    e.addColor(bg, "background").onChange(function (v) {
      bgcode = v;
    });
  }
  e.add(enviro, "fog").onChange(function (v) {
    if (v == true) {
      enviro.ffar = 9000;
      enviro.makeFog();
      if (edeetz == false) {
        e.addColor(enviro, "fclr")
          .name("color")
          .onChange(function () {
            scene.fog.color.setHex(dec2hex(enviro.fclr));
          });
        e.add(enviro, "fnear", 1, 10000)
          .name("near")
          .onChange(function () {
            enviro.makeFog();
          });
        e.add(enviro, "ffar", 1, 10000)
          .name("far")
          .onChange(function () {
            enviro.makeFog();
          });
        edeetz = true;
      }
    } else {
      enviro.ffar = enviro.reset;
      enviro.makeFog();
    }
  });

  // LIGHT_FOLDER
  var l = gui.addFolder("Ánh sáng");
  l.add(lights, "PointLight").name('Bật đèn').onChange(function (v) {
    if (v == true) {
      if (lightgui != undefined) {
        lightgui.destroy();
        lightgui = undefined;
      }
      lights.makePoint();
      lightGUI();
    } else {
      if (lightgui != undefined) {
        lightgui.destroy();
        lightgui = undefined;
      }
      scene.remove(pointLight);
    }
  });
  l.add(lights, "open").name("Mở cài đặt");

// ANIMATION_FOLDER
  var a = gui.addFolder("Chuyển động");
  a.add(animaObject, "turnOnAnima").name("Bật chuyển động").onChange(function() {
    animaObject.runAnimation()});
  a.add(animaObject, "rotationMesh").name("Bỏ em vào balo");
  a.add(animaObject, "rotationCircle").name("Di chuyển 360");
  a.add(animaObject, "rotationElip").name("Di chuyển Elip");
// })
}




// MATERIALZ_GUI
var matgui;
function materialzGUI(v) {
  if (matgui != undefined) {
    matgui.destroy();
    matgui = undefined;
  }

  matgui = new dat.GUI();

  if (mesh.Geometry == 11){
    matgui.addColor(meshObject, "wheelc").onChange(function () {
    })
  }
  else {
    matgui.addColor(meshObject, "color").onChange(function () {
      mesh.material.color.setHex(dec2hex(meshObject.color));
    });
  }
  


  matgui.add(meshObject, "closeMat").name("CLOSE");
}

// GEOMETRIEZ_GUI
var geogui;
function geometriezGUI(v) {
  if (geogui != undefined) {
    geogui.destroy();
    geogui = undefined;
  }

  geogui = new dat.GUI();

  if (v == 0) {
    geogui
      .add(meshObject, "cubeW", 1, 500)
      .name("width")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "cubeH", 1, 500)
      .name("height")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "cubeD", 1, 500)
      .name("depth")
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 1) {
    geogui
      .add(meshObject, "sphereR", 1, 200)
      .name("radius")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "sphereSW", 3, 150)
      .name("segmentsWidth")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "sphereSH", 2, 150)
      .name("segmentsHeight")
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 2 || v == 3 || v == 4) {
    geogui.add(meshObject, "radius", 1, 200).onChange(function () {
      meshObject.make();
    });
    geogui
      .add(meshObject, "detail", 0, 4)
      .step(1)
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 5) {
    geogui
      .add(meshObject, "cyliRT", 1, 200)
      .name("radiusTop")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "cyliRB", 1, 200)
      .name("radiusBottom")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "cyliH", 1, 400)
      .name("height")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "cyliRS", 2, 75)
      .step(1)
      .name("radiusSegments")
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 6) {
    geogui
      .add(meshObject, "torusR", 1, 200)
      .name("radius")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "torusT", 1, 200)
      .name("tube")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "torusRS", 1, 40)
      .name("radialSegments")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "torusTS", 2, 40)
      .step(1)
      .name("tubularSegments")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "torusA", 1, 15)
      .step(1)
      .name("arc")
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 7) {
    geogui
      .add(meshObject, "knotR", 1, 200)
      .name("radius")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "knotT", 1, 200)
      .name("tube")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "knotRS", 2, 100)
      .step(1)
      .name("radialSegments")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "knotTS", 2, 100)
      .step(1)
      .name("tubularSegments")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "knotP", 1, 15)
      .name("p")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "knotQ", 1, 15)
      .name("q")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "knotH", 1, 15)
      .name("heightScale")
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 8) {
    geogui
      .add(meshObject, "planeW", 1, 400)
      .name("width")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "planeH", 2, 400)
      .name("height")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "planeWS", 1, 400)
      .step(1)
      .name("widthSegments")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "planeHS", 2, 400)
      .step(1)
      .name("heightSegments")
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 9) {
    geogui
      .add(meshObject, "circleR", 1, 400)
      .name("radius")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "circleS", 2, 400)
      .step(1)
      .name("segments")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "circleTS", 1, 400)
      .step(1)
      .name("thetaStart")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "circleTL", 2, 400)
      .step(1)
      .name("thetaLength")
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 10) {
    geogui
      .add(meshObject, "ringIR", 1, 400)
      .name("innerRadius")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "ringOR", 2, 400)
      .name("outerRadius")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "ringTS", 1, 400)
      .step(1)
      .name("thetaSegments")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "ringPS", 2, 400)
      .step(1)
      .name("phiSegments")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "ringTSt", 2, 400)
      .step(1)
      .name("thetaStart")
      .onChange(function () {
        meshObject.make();
      });
    geogui
      .add(meshObject, "ringTL", 2, 400)
      .step(1)
      .name("thetaLength")
      .onChange(function () {
        meshObject.make();
      });
  } else if (v == 11) {
  }
  geogui.add(meshObject, "closeGeo").name("CLOSE");
}

// LIGHT_GUI
var lightgui;
function lightGUI() {
  lightgui = new dat.GUI();
  if (lights.PointLight == true) {
    var point = lightgui.addFolder("Point Light");
    point.addColor(lights, "cp").name("Màu sắc").onChange(function() {
      pointLight.color.setHex(dec2hex(lights.cp))
    });
    point.add(lights, "pi", 0.1, 10)
    .name("Cường độ")
    .onChange(function(){
      pointLight.intensity = lights.pi;
    });
    point.add(lights, "pn", 1, 1000)
    .name("Nhìn gần")
    .onChange(function(){
      pointLight.shadow.camera.near = lights.pn;
    });
    point.add(lights, "pf", 1000, 10000)
    .name("Nhìn xa")
    .onChange(function(){
      pointLight.shadow.camera.far = lights.pf;
    });
    point
      .add(lights, "px", -1000, 1000)
      .name("Tọa độ x")
      .onChange(function () {
        pointLight.position.x = lights.px;
      });
    point
      .add(lights, "py", -1000, 1000)
      .name("Tọa độ y")
      .onChange(function () {
        pointLight.position.y = lights.py;
      });
    point
      .add(lights, "pz", -1000, 1000)
      .name("Tọa độ z")
      .onChange(function () {
        pointLight.position.z = lights.pz;
      });
    point.open();
  }

  lightgui.add(lights, "close").name("CLOSE");
}

