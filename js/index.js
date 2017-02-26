window.onload = function() {
  let scene, camera, renderer;

  let WIDTH  = window.innerWidth;
  let HEIGHT = window.innerHeight;

  let SPEED = 0.01;

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  function init() {
      scene = new THREE.Scene();

      // initCube();
      initCamera();
      initRenderer();
      initMesh();

      document.body.appendChild(renderer.domElement);
  }

  function initCamera() {
      camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
      camera.position.set(0, 3.5, 5);
      camera.lookAt(scene.position);
  }

  function initRenderer() {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(WIDTH, HEIGHT);
  }

  // function initCube() {
  //     cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshNormalMaterial());
  //     scene.add(cube);
  // }

  let mesh = null;

  function initMesh() {
    let loader = new THREE.JSONLoader();
    for (let i = 0; i<5; i++) {
      debugger
      loader.load('../public/marmelab.json', function(geometry, materials) {
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
  //
  // function rotateCube() {
  //     cube.rotation.x -= SPEED * 0.2;
  //     cube.rotation.y -= SPEED;
  //     cube.rotation.z -= SPEED * 0.3;
  // }

  function onMouseMove(event) {
    mouse.x = (event.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(event.clientY/window.innerHeight)*2 + 1;
    // Raycaster
    // Update the picking ray with the camera and mouse position.
    raycaster.setFromCamera(mouse, camera);
    // Calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length) {
        console.log("hello");
    }
  }

  function render() {
      requestAnimationFrame(render);
      // rotateCube();
      rotateMesh();
      renderer.render(scene, camera);
  }
  window.addEventListener('mousemove',onMouseMove,false);

  init();
  render();
}
