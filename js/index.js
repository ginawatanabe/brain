
window.onload = function() {
  let scene, camera, renderer, controls;

  let WIDTH  = window.innerWidth;
  let HEIGHT = window.innerHeight;

  let SPEED = 0.01;

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2(), INTERSECTED;

  function init() {
    scene = new THREE.Scene();

    initCamera();
    initRenderer();
    initMesh();
    initLight();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed= 0.3;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    // controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);
    document.body.appendChild(renderer.domElement);

    //Initiate drag controls.
    let dragControls = new THREE.DragControls( scene.children, camera, renderer.domElement );
	  dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
		dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 1000);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(scene.position);
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(WIDTH, HEIGHT);
  }

  function initLight() {
    let light = new THREE.PointLight(0xffffff);
    scene.add(light);
  }

  let mesh = null;

  function initMesh() {
    let loader = new THREE.JSONLoader();
    for (let i = 0; i<2; i++) {
      loader.load('models/purpleblocksculpt.json', function(geometry, materials) {
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        // mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.75;
        mesh.translation = THREE.GeometryUtils.center(geometry);
        mesh.position.x = Math.random() * 8 - 6;
        mesh.position.y = Math.random() * 8 - 6;
        mesh.position.z = Math.random() * 8 - 6;

        mesh.rotation.x = Math.random()*2*Math.PI;
        mesh.rotation.y = Math.random()*2*Math.PI;
        mesh.rotation.z = Math.random()*2*Math.PI;

        scene.add(mesh);
      })
    }
  }

  function rotateMesh() {
    if (!mesh) {
      return;
    }

    for(let i = 0; i<scene.children.length; i++) {
      scene.children[i].rotation.x -= SPEED*2;
      scene.children[i].rotation.y -= SPEED;
      scene.children[i].rotation.z -= SPEED*3;
    }
  }

  function onMouseMove(event) {
    mouse.x = (event.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(event.clientY/window.innerHeight)*2 + 1;

    // Raycaster
    // Update the picking ray with the camera and mouse position.
    raycaster.setFromCamera(mouse, camera);
    // Calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);
    // let currentColor;
    // currentColor = scene.children[0].color.getRGB();

    if (intersects.length) {
        console.log("hello");
        // console.log(mouse);

        intersects[0].object.material.materials[0].emissive.setRGB(0.2,0,0.5);
    }

    // if (intersects.length == 0)
      // console.log("YO");
      // console.log(scene.children[0]);
      // scene.children[0].material.color = 1.2;
  }

  function render() {
    requestAnimationFrame(render);
    // rotateMesh();
    renderer.render(scene, camera);
  }
  window.addEventListener('mousemove',onMouseMove,false);

  init();
  render();
}
