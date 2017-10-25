window.onload = function() {
  var loadTime = window.performance.timing.domContentLoadedEventEnd-window.performance.timing.navigationStart;
  console.log('Page load time is '+ loadTime);

  let name = document.getElementById('name');
  let description = document.getElementById('description');
  let detail = document.getElementById('detail');
  let source = document.getElementById('source');
  let overlay = document.getElementById('overlay-wrap');

  let container, scene, camera, renderer, light, controls;
  let lightIntensity = 1.4;

  let group;
  let currentMeshName;

  let targetRotationX = 0;
  let targetRotationOnMouseDownX = 0;

  let targetRotationY = 0;
  let targetRotationOnMouseDownY = 0;

  let mouseX = 0;
  let mouseXOnMouseDown = 0;

  let mouseY = 0;
  let mouseYOnMouseDown = 0;

  let windowHalfX = window.innerWidth/2;
  let windowHalfY = window.innerHeight/2;

  let WIDTH  = window.innerWidth;
  let HEIGHT = window.innerHeight;
  let SPEED = 0.01;

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2(), INTERSECTED, CLICKINTERSECTED;
  let intersects;

  let loading = setTimeout(go, loadTime+5500);

  // Setting up GUI.
  let params = {
    lightIntensity: 1.4
  }
  let gui = new dat.GUI();
  gui.add(params, 'lightIntensity', 0, 2).step(0.01).onChange(function(value) {
    light.intensity = value;
  });
  gui.open();

  group = new THREE.Group();

  //Loading Screen

  function go() {
    overlay.style.display = "none";
    //Tween entrance animation.
    var position = {x : -40, y : -40, z : -600, rx : -0.5, ry : -2.5};
    var target = { x : -50, y: -50, z : -200, rx : 0, ry : 0};
    var tween = new TWEEN.Tween(position).to(target, 5700);
    tween.easing(TWEEN.Easing.Exponential.Out);

    tween.start();
    tween.onUpdate(function(){
      group.position.x = position.x;
      group.position.y = position.y;
      group.position.z = position.z;
      group.rotation.x = position.rx;
      group.rotation.y = position.ry;
    })
  }

  function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.add(group);

    initCamera();
    initRenderer();
    initMesh();
    initLight();

    container.appendChild(renderer.domElement);
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 500);
    camera.position.set(0, 3.5, 5);
    camera.position.z = 10;
    camera.lookAt(scene.position);
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.sortObjects = false;
  }

  function initLight() {
    light = new THREE.PointLight(0xffffff, lightIntensity);
    light.position.set(50,50,50);
    // light.castShadow = false;
    scene.add(light);
    console.log(scene.children);
  }

  let mesh = null;

  function initMesh() {
    let loader = new THREE.JSONLoader();
    for (i=0; i<64; i++) {
      let name = 'models/brain/part' + String(i) + '.json';
      let meshName = parts[i].name;
      loader.load(name, function(geometry, materials) {
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.rotation.y= -10;
        mesh.name = meshName;
        group.add(mesh);
      })
    }
  }

  function onResize() {
    windowHalfX = window.innerWidth/2;
    windowHalfY = window.innerHeight/2;
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseDown() {
    event.preventDefault();
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseout', onMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;
  }

  function onMouseUp(event) {
    document.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('mouseup', onMouseUp, false);
    document.removeEventListener('mouseout', onMouseOut, false);
  }

  function onMouseOut(event) {
    document.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('mouseup', onMouseUp, false);
    document.removeEventListener('mouseout', onMouseOut, false);
  }

  function onTouchStart(event) {
    if (event.touches.length == 1) {
      event.preventDefault();
      mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
      targetRotationOnMouseDownX = targetRotationX;
      mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
      targetRotationOnMouseDownY = targetRotationY;
    }
  }

  function onTouchMove(event) {
    if (event.touches.length == 1) {
      event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;
      mouseY = event.touches[0].pageY - windowHalfY;
      targetRotationY = targetRotationOnMouseDownY + (mouseY = mouseYOnMouseDown) * 0.05;
    }
  }

  function onMouseMove(event) {
    console.log('mouse is moving');
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown) * 0.02;
    targetRotationY = targetRotationOnMouseDownY + ( mouseY - mouseYOnMouseDown) * 0.02;
  }

  function onDocumentMouseMove(event) {
    mouse.x = (event.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(event.clientY/window.innerHeight)*2 + 1;
    // Raycaster
    // Update the picking ray with the camera and mouse position.
    raycaster.setFromCamera(mouse, camera);
    // Calculate objects intersecting the picking ray
    intersects = raycaster.intersectObjects(scene.children[0].children);

    if (intersects.length > 0) {

      if (intersects[0].object != INTERSECTED) {
        if (INTERSECTED) {
          INTERSECTED.material.materials[0].emissive.setRGB(0,0,0);
        }
      }

      INTERSECTED = intersects[0].object;
      name.innerHTML = intersects[0].object.name.toUpperCase();
      currentMeshName = intersects[0].object.name;

      intersects[0].object.material.materials[0].emissive.setRGB(0.1,0.1,0.1);

    }
  }

  function render() {
    group.rotation.y += (targetRotationX - group.rotation.y) * 0.05;
    group.rotation.x += (targetRotationY - group.rotation.x) * 0.05;
    renderer.render(scene,camera);
    TWEEN.update();
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  window.addEventListener('resize',onResize,false);

  window.addEventListener('mousedown', onMouseDown, false);

  window.addEventListener('touchmove', onTouchMove, false);

  window.addEventListener('touchstart',onTouchStart,false);

  window.addEventListener('mousemove', onDocumentMouseMove, false);

  init();
  animate();

}
