import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";

let scene;
let camera;
let renderer;

let collaborators = [];

export function ARInit() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  // setting alpha to true makes the phone screen have light. alpha to false is just a black screen.
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  document.body.appendChild(renderer.domElement);

  camera.position.z = 5;

  document.body.appendChild(
    ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
  );
}

export function ARAnimate() {
  requestAnimationFrame(ARAnimate);

  renderer.render(scene, camera);
}

export function AddCollaborator(key, modelIndex, name) {
  console.log("add collab");
  let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  let cube = new THREE.Mesh(geometry, material);
  cube.name = key;

  let collab = { id: key, model: cube, name: name };
  collab.model.position.set(0, 0, -10);

  scene.add(collab.model);
  collaborators.push(collab);
}

export function RemoveCollaborator(key) {
  removeObject3D(scene.getObjectByName(key));

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

