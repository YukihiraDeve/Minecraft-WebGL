(function () {

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer( {canvas: document.getElementById('zone'), antialias: true, alpha: true} );
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
var mercurySphere , mercuryMaterial , mercuryMesh , mercuryPivot;

function initScene() {

//render fond
  
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.set(0, 300, 1550);
camera.rotation.x = -0.2;

//light

light = new THREE.PointLight(0xffffff, 1, 350);
light.position.set(-3500,-40, 1500);
light2 = new THREE.PointLight(0xffffff, 1, 0);
light2.position.set(0,0,0);
light3 = new THREE.PointLight(0xffffff, 1, 50);
light3.position.set(3000,-25, 1000);


//pivot

mercuryPivot.add( mercuryMesh );
sunMesh.add( mercuryPivot);

//planete /


mercurySphere = new THREE.SphereGeometry(3.83/2,80,80);
mercuryMaterial = new THREE.MeshLambertMaterial();
mercuryMaterial.color = new THREE.Color("rgb(250, 30, 100)");
mercuryMesh = new THREE.Mesh(mercurySphere, mercuryMaterial);
mercuryMesh.position.set(38.7+sunOrbitPush,0,0);


mercuryPivot = new THREE.Object3D();





cameraPivot.add( camera );
scene.add( sunMesh );
scene.add( light, light2, light3);

setupGui();
render();

}

function render() {

  var mercury = 0.241

  function orbit(planet) {
    if (planet) {
        return ((360 * Math.PI / 180) / (356 * planet))/3;
    } else {
        return ((360 * Math.PI / 180) / 356)/3;
    }
}

mercuryPivot.rotation.y += orbit(mercury);



renderer.render(scene, camera);
requestAnimationFrame(render);

}

window.onload = initScene;

return {
    scene: scene
}


})