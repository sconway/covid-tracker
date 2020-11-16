import * as THREE from "THREE";

/**
 * Creates and adds the earth to the scene.
 *
 * @param     shape    : THREE.Geometry
 */
export const createEarth = (shape) => {
    // loads the earth images and once it is done, expands it
    let loader = new THREE.TextureLoader();
    let texture = loader.load("images/earth.png");
    let bumpTexture = loader.load("images/earthbump.jpg");
    let specTexture = loader.load("images/earthspec.jpg");
    let cloudTexture = loader.load("images/clouds.png");

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
    specTexture.wrapS = specTexture.wrapT = THREE.RepeatWrapping;
    cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

    let earthMaterial = new THREE.MeshPhongMaterial({
        bumpMap: bumpTexture,
        bumpScale: 0.005,
        depthWrite: false,
        map: texture,
        opacity: 0.99,
        shininess: 5,
        specular: 0xcccccc,
        specularMap: specTexture,
        transparent: true,
    });
    let cloudMaterial = new THREE.MeshPhongMaterial({
        depthWrite: false,
        map: cloudTexture,
        opacity: 0.5,
        transparent: true,
    });
    let earth = new THREE.Mesh(shape, earthMaterial);
    let cloud = new THREE.Mesh(shape, cloudMaterial);

    earth.name = "earth";
    cloud.name = "cloud";
    cloud.scale.set(1.02, 1.02, 1.02);

    return {
        earth: earth,
        cloud: cloud,
    };
};
