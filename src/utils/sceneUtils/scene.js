import * as THREE from "THREE";
import * as orbitControls from "three-orbit-controls";
import { Detector } from "../detector.js";

if (!window.WebGLRenderingContext || !Detector.webgl) {
    // the browser doesn't even know what WebGL is
    window.location = "http://get.webgl.org";
}

export const initScene = (scene, renderer, camera) => {
    // Configure and add the scene renderer.
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.getElementById("three-container").appendChild(renderer.domElement);

    camera.position.z = 800;

    // Add some light to the scene.
    const light = new THREE.HemisphereLight("#aaaaaa", "#ffffff", 2);
    scene.add(light);

    const light2 = new THREE.AmbientLight("#000000");
    scene.add(light2);

    // Add controls for the scene.
    const OrbitControls = orbitControls.default(THREE);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 800;
    controls.maxDistance = 800;
};

export const removeFromScene = (scene, name) => {
    var selectedObject = scene.getObjectByName(name);  
    scene.remove(selectedObject);
}

export const emptyScene = (elem) => {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
}