
window.onload = function() {
  let name = document.getElementById('name');
  let description = document.getElementById('description');
  let detail = document.getElementById('detail');
  let source = document.getElementById('source');

  let container, scene, camera, renderer, controls;

  let objects = [];

  let WIDTH  = window.innerWidth;
  let HEIGHT = window.innerHeight;

  let SPEED = 0.01;

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2(), INTERSECTED;

  function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    initCamera();
    initRenderer();
    initMesh();
    initLight();

    //Initialize trackball controls.
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    container.appendChild(renderer.domElement);

    //Initiate drag controls.
    let dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
	  dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
		dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

  }

  function onResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 100);
    // camera.position.set(0, 3.5, 5);
    camera.position.z = 10;
    // camera.lookAt(scene.position);
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.sortObjects = false;
  }

  function initLight() {
    let light = new THREE.PointLight(0xffffff);
    scene.add(light);
  }

  let mesh = null;

  function initMesh() {
    let loader = new THREE.JSONLoader();
    for (let i = 0; i< parts.length; i++) {
      loader.load('models/pinkbrain.json', function(geometry, materials) {
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.position.x = Math.random() * 8 - 6;
        mesh.position.y = Math.random() * 8 - 6;
        mesh.position.z = Math.random() * 8 - 6;

        mesh.rotation.x = Math.random()*2*Math.PI;
        mesh.rotation.y = Math.random()*2*Math.PI;
        mesh.rotation.z = Math.random()*2*Math.PI;

        scene.add(mesh);
        objects.push(mesh);
      })
    }
  }

  // function rotateMesh() {
  //   if (!mesh) {
  //     return;
  //   }
  //
  //   for(let i = 0; i<scene.children.length; i++) {
  //     scene.children[i].rotation.x -= SPEED*2;
  //     scene.children[i].rotation.y -= SPEED;
  //     scene.children[i].rotation.z -= SPEED*3;
  //   }
  // }

  function onMouseMove(event) {

    mouse.x = (event.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(event.clientY/window.innerHeight)*2 + 1;

    // Raycaster
    // Update the picking ray with the camera and mouse position.
    raycaster.setFromCamera(mouse, camera);
    // Calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);

    console.log(amygdala.name);

    //Placeholder name assignments.
    for (i = 0; i<parts.length; i++) {
      scene.children[i].name = parts[i].name;
    }

    if (intersects.length > 0) {

      if (intersects[0].object != INTERSECTED) {
        if (INTERSECTED)
          INTERSECTED.material.materials[0].emissive.setRGB(0,0,0);

        INTERSECTED = intersects[0].object;

        name.innerHTML = intersects[0].object.name;

        for (i = 0; i<parts.length; i++) {
          if (parts[i].name === name.innerHTML) {
            description.innerHTML = parts[i].description;
            detail.innerHTML = parts[i].detail;
            source.innerHTML = parts[i].source;
          }
        }

        INTERSECTED.material.materials[0].emissive.setRGB(0.1,0.1,0.1);
      }
    }
  }

  function render() {
    renderer.render(scene,camera);
    controls.update();

    // rotateMesh();
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  window.addEventListener('mousemove',onMouseMove,false);
  //Window resize event listener.
  window.addEventListener('resize',onResize,false);


  init();
  animate();
}
