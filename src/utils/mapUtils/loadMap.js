import * as THREE from "THREE";
import * as topojson from "topojson-client";
import * as worldJSON from "../../json/world.json";
import { createEarth } from "./createEarth";
import { geodecoder } from "../geoHelpers";
import { setEvents } from "../setEvents";
import { memoize } from "../utils";
import { sphere } from "../constants";
import { mapTexture } from "./mapTexture";
import { scaleUpTween } from "../tweens";
import {
    onCountryHoverOff,
    onGlobeMousemove,
    onGlobeMouseDown,
    onGlobeMouseUp,
} from "../../globeEventHandlers/globeMouseMove";

/**
 * Used to load in the data that generates the main map/globe.
 */
export const loadMap = (scene, renderer, camera) => {
    const countries = topojson.feature(worldJSON, worldJSON.objects.countries);
    const { cloud, earth } = createEarth(sphere);
    // Setup cache for country textures
    const root = new THREE.Object3D();
    const geo = geodecoder(countries.features);
    const textureCache = memoize((cntryID, color) => {
        const country = geo.find(cntryID);
        return mapTexture(country, color);
    });
    const worldTexture = mapTexture(countries, "#transparent", "transparent");
    const worldTextureBack = mapTexture(countries, "#111111", "transparent");
    const mapMaterialBack = new THREE.MeshPhongMaterial({
        depthWrite: false,
        color: 0x111111,
        emissive: 0x3c2711,
        shininess: 50,
        map: worldTextureBack,
        side: THREE.BackSide,
        transparent: true,
    });
    const mapMaterialFront = new THREE.MeshPhongMaterial({
        depthWrite: false,
        map: worldTexture,
        opacity: 0.6,
        transparent: true,
    });
    const baseMapBack = new THREE.Mesh(sphere, mapMaterialBack);
    const baseMapFront = new THREE.Mesh(sphere, mapMaterialFront);

    // Add the event listeners and name
    baseMapFront.addEventListener("mousedown", (event) => onGlobeMouseDown(event), false);
    baseMapFront.addEventListener("mouseup", (event) => onGlobeMouseUp(event, geo, root, camera, scene), false);
    baseMapFront.addEventListener(
        "mousemove",
        (event) => onGlobeMousemove(event, scene, geo, textureCache, root),
        false
    );
    baseMapFront.receiveShadow = true;
    baseMapFront.name = "front-map";
    baseMapBack.name = "back-map";
    root.name = "root";

    // set the earth image to be above the colored globe
    earth.renderOrder = 1;
    cloud.renderOrder = 2;

    // make sure the back is added to the root/scene first
    root.add(cloud);
    root.add(earth);
    root.add(baseMapBack);
    root.add(baseMapFront);
    root.scale.set(0.1, 0.1, 0.1);
    root.rotation.y = Math.PI;
    scene.add(root);

    scaleUpTween(root, renderer, scene, camera);

    // Registers the event listeners for the events on the globe.
    setEvents(camera, [baseMapFront], "mousedown", null);
    setEvents(camera, [baseMapFront], "mouseup", null);
    setEvents(camera, [baseMapFront], "mousemove", 5, null, () => onCountryHoverOff(scene));
};
