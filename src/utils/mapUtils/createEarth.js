import * as THREE from "THREE";
import { shaders } from "../shaders"

/**
 * Creates and adds the earth to the scene.
 *
 * @param     shape    : THREE.Geometry
 */
export const createEarth = (shape) => {
    let loader = new THREE.TextureLoader();
    let texture = loader.load("images/globe-dark.jpg");
    let bumpTexture = loader.load("images/earthbump.jpg");
    let specTexture = loader.load("images/earthspec.jpg");
    let cloudTexture = loader.load("images/clouds.png");

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
    // specTexture.wrapS = specTexture.wrapT = THREE.RepeatWrapping;
    // cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

    let earthMaterial = new THREE.MeshPhongMaterial({
        // bumpMap: bumpTexture,
        bumpScale: 0.005,
        // depthWrite: false,
        map: texture,
        // opacity: 0.99,
        shininess: 5,
        specular: 0xcccccc,
        // specularMap: specTexture,
        // transparent: true,
    });
    let earth = new THREE.Mesh(shape, earthMaterial);

    earth.name = "earth";

    return earth;
};

export const createAtmosphereShader = (shape) => {
    let shader = shaders.atmosphere;
    let atmosphereMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(shader.uniforms),
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
    let atmosphere = new THREE.Mesh(shape, atmosphereMaterial);

    atmosphere.name = "atmosphere";
    atmosphere.scale.set( 0.1, 0.1, 0.1 );

    return atmosphere;
}

export const createEarthShader = (shape) => {
    let shader = shaders.earth;
    let earthMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(shader.uniforms),
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });
    let earth = new THREE.Mesh(shape, earthMaterial);

    earth.rotation.y = Math.PI;
    earth.name = "earthShader";

    return earth;
}
