
window.onload = function() {
  let name = document.getElementById('name');
  let description = document.getElementById('description');
  let detail = document.getElementById('detail');
  let source = document.getElementById('source');

  let container, scene, camera, renderer, controls;

  let objects = [];

  let memoryX = [];
  let memoryY = [];
  let dragMemory = [];

  let acceleration = 0.08;

  let WIDTH  = window.innerWidth;
  let HEIGHT = window.innerHeight;

  let SPEED = 0.01;

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2(), INTERSECTED;

  let isDragging = false;

  let params = {
    acceleration: 0.08
  }

  let gui = new dat.GUI();
  gui.add(params, 'acceleration', 0, 0.15).step(0.01).onChange(function(value) {
    acceleration = value;
  });
  gui.open();

  function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    initCamera();
    initRenderer();
    initMesh();
    initLight();

    //Initialize trackball controls.
    // controls = new THREE.TrackballControls(camera);
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.3;
    // controls.maxPolarAngle = Math.Pi/2;
    // //
    container.appendChild(renderer.domElement);
    // //
    // let dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
    // dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
    // dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

  }

  function onResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    let light = new THREE.PointLight(0xffffff);
    light.position.set(50,50,50);
    scene.add(light);
    console.log(scene.children);
  }

  let mesh = null;

  function initMesh() {
    let loader = new THREE.JSONLoader();
    for (i=0; i<64; i++) {
      let name = 'models/brain/part' + String(i) + '.json';
      loader.load(name, function(geometry, materials) {
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.position.x = -50;
        mesh.position.y = -50;
        // mesh.position.z = -120;
        mesh.position.z = -400;
        mesh.rotation.x = -0.5;
        mesh.rotation.y = 2.8;
        // mesh.rotation.z = Math.random()*2*Math.PI;
        scene.add(mesh);
        objects.push(mesh);
      })
    }
  }

  function rotateMesh() {
    if (!mesh) {
      return;
    }

    for(let i = 0; i<scene.children.length; i++) {
      scene.children[i].rotation.x -= SPEED*0.5;
      scene.children[i].rotation.y -= SPEED;
      scene.children[i].rotation.z -= SPEED*2;
    }
  }

  function onMouseDown() {
    isDragging = true;
  }

  function onMouseUp(event) {
    isDragging = false;
  }

  // function spinMesh() {
  //   speed = 0.4;
  //   console.log(speed);
  //
  //   if (speed < 0) {
  //     console.log('STOPPPPP');
  //     console.log(speed);
  //
  //     speed = 0;
  //   } else if (speed > 0) {
  //     console.log('hello');
  //     speed = speed - 0.01;
  //     console.log(speed);
  //
  //   }
  //   if (memory[0] > memory[1]) {
  //     for(let i = 0; i<scene.children.length; i++) {
  //       scene.children[i].rotation.y += SPEED*speed;
  //     }
  //   }
  //   if (memory[0] < memory[1]) {
  //     for(let i = 0; i<scene.children.length; i++) {
  //       scene.children[i].rotation.y -= SPEED*speed;
  //     }
  //   }
  //
  //   return speed;
  // }


  function onMouseMove(event) {

    mouse.x = (event.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(event.clientY/window.innerHeight)*2 + 1;

    //Drag controls for object.
    if (isDragging) {
      memoryX.unshift(mouse.x);
      if (memoryX.length > 1) {
        memoryX.length = 2;
      }

      memoryY.unshift(mouse.y);
      if (memoryY.length > 1) {
        memoryY.length = 2;
      }

      // console.log("this is current: " + event.clientX + "this is initial: " + initial)
      if (memoryX[0] > memoryX[1]) {
        for (i = 0; i<scene.children.length; i++) {
          scene.children[i].rotation.y += acceleration;
        }
      }

      if (memoryX[0] < memoryX[1]) {
        for (i=0; i<scene.children.length; i++) {
          scene.children[i].rotation.y -= acceleration;
        }
      }

      if (memoryY[0] > memoryY[1]) {
        for (i = 0; i<scene.children.length; i++) {
          scene.children[i].rotation.x -= acceleration;
        }
      }

      if (memoryY[0] < memoryY[1]) {
        for (i=0; i<scene.children.length; i++) {
          scene.children[i].rotation.x += acceleration;
        }
      }
    }

    // Raycaster
    // Update the picking ray with the camera and mouse position.
    raycaster.setFromCamera(mouse, camera);
    // Calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);

    // Placeholder name assignments.
    for (i = 0; i<parts.length; i++) {
      scene.children[i].name = parts[i].name;
    }
    console.log(parts.length);

    if (intersects.length > 0) {
      //Initiate drag controls.
      if (intersects[0].object != INTERSECTED) {
        if (INTERSECTED)
          INTERSECTED.material.materials[0].emissive.setRGB(0,0,0);

        INTERSECTED = intersects[0].object;
        name.innerHTML = intersects[0].object.name;
        console.log(intersects[0].object.name);

        INTERSECTED.material.materials[0].emissive.setRGB(0.1,0.1,0.1);
      }
    }
  }

  function render() {
    renderer.render(scene,camera);
    // controls.update();
    // rotateMesh();
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  window.addEventListener('mousemove',onMouseMove,false);
  //Window resize event listener.
  window.addEventListener('resize',onResize,false);

  window.addEventListener('mousedown', onMouseDown, false);

  window.addEventListener('mouseup', onMouseUp, false);


  init();
  animate();

}
