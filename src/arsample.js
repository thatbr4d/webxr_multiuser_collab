import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Text } from 'troika-three-text';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

let scene;
let camera;
let renderer;
let loader;
let controller1, controller2;
let controllerGrip1, controllerGrip2;

let raycaster;

let controls, group;

const tempMatrix = new THREE.Matrix4();
export function ARInit() {
  loader = new GLTFLoader();

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    40
  );

  // setting alpha to true makes the phone screen have light. alpha to false is just a black screen.
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  // Orbit controls allow the camera to orbit around a target. This was in the webxr-dragging example.
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.6, 0);
  controls.update();

  group = new THREE.Group();
  scene.add(group);

  // controllers

  controller1 = renderer.xr.getController(0);
  controller1.addEventListener('selectstart', onSelectStart);
  controller1.addEventListener('selectend', onSelectEnd);
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  controller2.addEventListener('selectstart', onSelectStart);
  controller2.addEventListener('selectend', onSelectEnd);
  scene.add(controller2);

  const controllerModelFactory = new XRControllerModelFactory();

  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
  scene.add(controllerGrip1);

  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
  scene.add(controllerGrip2);

  //This class is designed to assist with raycasting. Raycasting is used for mouse picking (working out what objects in the 3d space the mouse is over) amongst other things.
  raycaster = new THREE.Raycaster();

  document.body.appendChild(renderer.domElement);

  //camera.position.z = 5;
  
  document.body.appendChild(
    ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
  );
}

export function ARAnimate() {
  // requestAnimationFrame(ARAnimate);
  // renderer.render(scene, camera);
  renderer.setAnimationLoop(render);
}

export function AddCollaborator(key, modelName, name, move) {
  console.log("add collab");
  const MODEL_WIDTH = 1;
  const MODEL_HEIGHT = 1;

  loader.load('../../models/' + modelName + '/scene.gltf', function (gltf) {
    setUpModel(gltf, modelName);
    if (move)
      gltf.scene.position.set(3, 0, -10);
    else {
      //gltf.scene.position.set(0, 0, -10);
      
    }
    gltf.scene.name = key;

	  scene.add( gltf.scene );
  }, undefined, function ( error ) {
	  console.error( error );
  });

  const myText = new Text();
  myText.name = "text" + key;
  myText.text = name;
  myText.fontSize = .5;
  myText.position.set(MODEL_WIDTH / 2, MODEL_HEIGHT, -9);

  scene.add(myText);

  myText.sync();
  //group.add(cube);
}

export function RemoveCollaborator(key) {
  removeObject3D(scene.getObjectByName(key));
  removeObject3D(scene.getObjectByName("text" + key));
}

function removeObject3D(object3D) {
  if (!(object3D instanceof THREE.Object3D)) return false;

  if (object3D.geometry) object3D.geometry.dispose();

  if (object3D.material) {
    if (object3D.material instanceof Array) {
      object3D.material.forEach(material => material.dispose());
    } else {
      object3D.material.dispose();
    }
  }
  object3D.removeFromParent();

  return true;
}

// the callback from 'setAnimationLoop' can also return a timestamp
// and an XRFrame, which provides access to the information needed in
// order to render a single frame of animation for an XRSession describing
// a VR or AR sccene.
function render(timestamp, frame) {
  if (frame) {
    renderer.render(scene, camera);
  }
}

function onSelectStart(event) {
  const controller = event.target;
  const intersections = getIntersections(controller);

  if (intersections.length > 0) {
    const intersection = intersections[0];
    const object = intersection.object;
    //object.material.emissive.b = 1;
    controller.attach(object);
    controller.userData.selected = object;
  }

  controller.userData.targetRayMode = event.data.targetRayMode;
}

function onSelectEnd(event) {
  const controller = event.target;

  if (controller.userData.selected !== undefined) {

    const object = controller.userData.selected;
    //object.material.emissive.b = 0;
    group.attach(object);

    controller.userData.selected = undefined;
  }
}

function getIntersections(controller) {
  controller.updateMatrixWorld();

  tempMatrix.identity().extractRotation(controller.matrixWorld);

  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

  return raycaster.intersectObjects(group.children, false);
}

function setUpModel(gltf, modelName) {
  switch (modelName) {
    case "cute_rabbit":
      gltf.scene.scale.set(.25, .25, .25);
      break;
    case "shiba":
      gltf.scene.scale.set(1.75, 1.75, 1.75);
      break;
    case "cute_squid":
      gltf.scene.scale.set(1.75, 1.75, 1.75);
      gltf.scene.rotation.y = 9.5;
      break;
    case "sugar_teddy_bear":
      gltf.scene.position.set(0, -1.5, -10);
      gltf.scene.scale.set(5, 5, 5);
      break;
    case "cute_little_duck":
      gltf.scene.scale.set(5, 5, 5);
      gltf.scene.position.set(0, -1.5, -10);
      break;
    case "cute_fox":
      gltf.scene.position.set(0, -.75, -10);
      break;
    case "cute_cat_in_cute_banana":
      gltf.scene.scale.set(2, 2, 2);
      gltf.scene.position.set(0, -10, -10);
      break;
    case "cute_axolotl":
      gltf.scene.rotation.y = 10.75;
      break;
    default:
      gltf.scene.scale.set(1,1,1);
  }

  if (modelName !== "sugar_teddy_bear" && modelName !== "cute_little_duck" && modelName !== "cute_fox" && modelName !== "cute_cat_in_cute_banana")
    gltf.scene.position.set(0, 0, -10);

}