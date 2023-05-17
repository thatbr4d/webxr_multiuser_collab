import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Text } from 'troika-three-text';

let scene;
let camera;
let renderer;
let loader;

let collaborators = [];

export function ARInit() {
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

export function AddCollaborator(key, modelIndex, name) {
  console.log("add collab");
  const HEIGHT = .5;
  const WIDTH = .5;

  let geometry = new THREE.BoxGeometry(0.5, HEIGHT, 0.5);
  let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  let cube = new THREE.Mesh(geometry, material);
  cube.name = key;

  const myText = new Text();
  myText.name = "text" + key;
  myText.text = name;
  myText.fontSize = .5;
  myText.position.set(WIDTH / 2, HEIGHT, -9);

  let collab = { id: key, model: cube, name: name, textModel: myText };
  collab.model.position.set(0, 0, -10);

  scene.add(collab.model);
  scene.add(myText);

  collaborators.push(collab);

  myText.sync();
}

export function RemoveCollaborator(key) {
  removeObject3D(scene.getObjectByName(key));
  removeObject3D(scene.getObjectByName("text" + key));

  let collab = collaborators.filter(x => x.id == key);
  collaborators.pop(collab);
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