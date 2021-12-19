import * as THREE from '../build/three.module.js';

import {
	GUI
} from './jsm/libs/dat.gui.module.js';

import {
	OrbitControls
} from './jsm/controls/OrbitControls.js';
import {
	PointerLockControls
} from './jsm/controls/PointerLockControls.js';

import {
	MTLLoader
} from './jsm/loaders/MTLLoader.js';
import {
	OBJLoader
} from './jsm/loaders/OBJLoader.js';

import {
	Octree
} from './jsm/math/Octree.js'; // Vas permettre de générer la Solidité de la map



let renderer, scene, camera, controls

let spotLight, lightHelper, shadowCameraHelper;


let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();


let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let raycaster;

const worldOctree = new Octree();



// Render Test 

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;

scene = new THREE.Scene();

// Camera add et controls

const reflectionCube = new THREE.CubeTextureLoader()
	.setPath('sky/')
	.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
scene.background = reflectionCube;

camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 0);

/* const controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.minDistance = 20;
controls.maxDistance = 500;
controls.enablePan = false;

*/
controls = new PointerLockControls(camera, document.body);


const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', function () {
	controls.lock();
});

controls.addEventListener('lock', function () {
	instructions.style.display = 'none';
	blocker.style.display = 'none';
});

controls.addEventListener('unlock', function () {
	blocker.style.display = 'block';
	instructions.style.display = '';
});

scene.add(controls.getObject());

//Controle ZQSD

const onKeyDown = function (event) {

	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			moveForward = true;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = true;
			break;

		case 'ArrowDown':
		case 'KeyS':
			moveBackward = true;
			break;

		case 'ArrowRight':
		case 'KeyD':
			moveRight = true;
			break;

		case 'Space':
			if (canJump === true) velocity.y += 350;
			canJump = false;
			break;
		case 'KeyB':
			Down = true
			break;
	}

};

const onKeyUp = function (event) {

	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			moveForward = false;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = false;
			break;

		case 'ArrowDown':
		case 'KeyS':
			moveBackward = false;
			break;

		case 'ArrowRight':
		case 'KeyD':
			moveRight = false;
			break;

		case 'KeyB':
			back = false
			break;
	}

}



document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// raycaster 
raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);




// En cas de changement de résolution de la fenetre Windows
window.addEventListener('resize', onWindowResize);


// Ajout de lumière ambiant

const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(15, 300, 35);
spotLight.angle = Math.PI / 2;
spotLight.penumbra = 0.1;
spotLight.decay = 2;
spotLight.distance = 200;

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 200;
spotLight.shadow.focus = 1;

lightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(lightHelper);

shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(shadowCameraHelper);



// Ajout d'un objet 3D
var mapMinecraft = undefined
var mtlLoader = new MTLLoader
mtlLoader.load("Test2.mtl", function (materials) {
			materials.preload();
			var objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load("Test2.obj", function (object) {

						mapMinecraft = object;
						mapMinecraft.receiveShadow = true;
						mapMinecraft.position.y = 15
						scene.add(mapMinecraft);
						worldOctree.fromGraphNode(mapMinecraft.scene);
						mapMinecraft.scene.traverse(child => {

							if (child.isMesh) {

								child.castShadow = true;
								child.receiveShadow = true;

								if (child.material.map) {

									child.material.map.anisotropy = 8;

								}
							}
                        })
                    }

)}
            )



						//Ajout de la colision sur la modele 3D
						animate();

						//la fonction render
						function render() {

							lightHelper.update();

							shadowCameraHelper.update();

							renderer.render(scene, camera);
						}

						// Function resize changement de taille de fenetre

						function onWindowResize() {

							camera.aspect = window.innerWidth / window.innerHeight;
							camera.updateProjectionMatrix();

							renderer.setSize(window.innerWidth, window.innerHeight);

						}

						function playerCollisions() {
							const result = worldOctree.capsuleIntersect(raycaster);
							playerOnFloor = false;
							if (result) {
								playerOnFloor = result.normal.y > 0;
								if (!playerOnFloor) {
									playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity));
								}
								playerCollider.translate(result.normal.multiplyScalar(result.depth));
							}
						}

						function animate() {

							requestAnimationFrame(animate);

							const time = performance.now();

							if (controls.isLocked === true) { // Vérifie si la souris est lock dans la page chrome

								raycaster.ray.origin.copy(controls.getObject().position);
								raycaster.ray.origin.y -= 10;


								const delta = (time - prevTime) / 15000;

								//Graviter de mouvement.
								velocity.x -= velocity.x * 80.0 * delta;
								velocity.z -= velocity.z * 80.0 * delta;

								velocity.y -= 200 * 100.0 * delta; // 100.0 = mass

								direction.z = Number(moveForward) - Number(moveBackward);
								direction.x = Number(moveRight) - Number(moveLeft);

								direction.normalize(); // this ensures consistent movements in all directions

								// permet le deplacement

								if (moveForward || moveBackward) velocity.z -= direction.z * 9000.0 * delta;
								if (moveLeft || moveRight) velocity.x -= direction.x * 9000.0 * delta;

								controls.moveRight(-velocity.x * delta);
								controls.moveForward(-velocity.z * delta);

								controls.getObject().position.y += (velocity.y * delta); // new behavior



								// Permet de ne pas tomber dans le vie a l'infini

								if (controls.getObject().position.y < 50) {

									velocity.y = 0;
									controls.getObject().position.y = 50;

									canJump = true;

								}

							}

							prevTime = time;

							renderer.render(scene, camera);

						}


						render();
