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
    renderer.setClearColor(0x0f151d);
    document.getElementById("three-container").appendChild(renderer.domElement);

    camera.position.z = 1000;

    // Add some light to the scene.
    const light = new THREE.HemisphereLight("#aaaaaa", "#ffffff", 2);
    scene.add(light);

    const spotLight = new THREE.SpotLight("#ffffff", 4, 1500);
    spotLight.position.set(600, 600, 200);
    scene.add(spotLight);

    const light2 = new THREE.AmbientLight("#000000");
    scene.add(light2);

    // Add controls for the scene.
    const OrbitControls = orbitControls.default(THREE);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 1000;

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
};
