function getCarFrontTexture(fontc_w, fontc_v) {
  const canvas = document.createElement("canvas");
  canvas.width = 384; // 64
  canvas.height = 192; // 32
  const context = canvas.getContext("2d");
  // console.log(fontc_v);
  context.fillStyle = fontc_v; // Màu viền
  context.fillRect(0, 0, 384, 192); // context.fillRect(0, 0, 64, 32);

  context.fillStyle = fontc_w; // Màu cửa sổ trước
  context.fillRect(48, 48, 288, 144); // 8, 8, 48, 24

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture(sidec_w, sidec_v) {
  const canvas = document.createElement("canvas");
  canvas.width = 768; //128
  canvas.height = 192; // 32
  const context = canvas.getContext("2d");

  context.fillStyle = sidec_v; // Viền trái phải
  context.fillRect(0, 0, 768, 192); // 0, 0, 128, 32

  context.fillStyle = sidec_w; // Cửa sổ trái phải
  context.fillRect(60, 48, 228, 144); // 10, 8, 38, 24
  context.fillRect(348, 48, 360, 144); // 58, 8, 60, 24

  return new THREE.CanvasTexture(canvas);
}
function Wheel(wheelc) {
  const wheelGeometry = new THREE.BoxBufferGeometry(72, 198, 72); // 12, 33, 12
  const wheelMaterial = new THREE.MeshLambertMaterial({ color: wheelc }); // Bánh xe

  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

  wheel.position.z = 36; // 6

  wheel.castShadow = false;

  wheel.receiveShadow = false;

  return wheel;
}

function Car(material, wheelc, bodyc, sidec_w, sidec_v, fontc_w, fontc_v, topc) {
  const car = new THREE.Group();

  if (material == 1) { }

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(360, 180, 90), // 60, 30, 15
    new THREE.MeshLambertMaterial({ color: bodyc })
  );

  main.position.z = 72; // 12
  main.castShadow = true;
  main.receiveShadow = true;
  car.add(main);

  const carFrontTexture = getCarFrontTexture(fontc_w, fontc_v);
  carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
  carFrontTexture.rotation = Math.PI / 2;

  const carBackTexture = getCarFrontTexture(fontc_w, fontc_v);
  carBackTexture.center = new THREE.Vector2(0.5, 0.5);
  carBackTexture.rotation = -Math.PI / 2;

  const carLeftSideTexture = getCarSideTexture(sidec_w, sidec_v);
  carLeftSideTexture.flipY = false;

  const carRightSideTexture = getCarSideTexture(sidec_w, sidec_v);

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(198, 144, 72), [ // 33, 24, 12
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ color: topc }), // top
    new THREE.MeshLambertMaterial({ color: topc }), // bottom
  ]);
  cabin.position.x = -36; // -6
  cabin.position.z = 153; // 25.5
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  car.add(cabin);

  const backWheel = new Wheel(wheelc);
  backWheel.position.x = -108; // -18
  car.add(backWheel);

  const frontWheel = new Wheel(wheelc);
  frontWheel.position.x = 108; // 18
  car.add(frontWheel);

  //   if (config.showHitZones) {
  //     car.userData.hitZone1 = HitZone();
  //     car.userData.hitZone2 = HitZone();
  //   }


  return car;
}
