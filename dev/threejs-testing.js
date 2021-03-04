/**
 *   <foreignObject id="fo-three" width="100" height="100" x="200" y="100">
                  <canvas id="c" width="100%" height="100%" ></canvas>
                </foreignObject>

 */


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true });
    renderer.setClearColor( 0x000000, 0 ); // the default

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const controls = new OrbitControls( camera, renderer.domElement );

    const scene = new THREE.Scene();

    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const wireframe = new THREE.WireframeGeometry( geometry );


    const cube = new THREE.LineSegments( wireframe );
    cube.material.depthTest = false;
    cube.material.opacity = 1;
    cube.material.transparent = true;
    cube.material.color =  new THREE.Color( 'rgb(200,200,200)' );

    scene.add( cube );


/*
  //  const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue


    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
*/
    function render(time) {
      time *= 0.001;  // convert time to seconds
/*
      cube.rotation.x = time;
      cube.rotation.y = time;
*/
      controls.update();
      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

  }

window.addEventListener("load", ()=>{
//  main();
})