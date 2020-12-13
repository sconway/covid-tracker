import * as THREE from "THREE";
import * as topojson from "topojson-client";
import * as worldJSON from "../../json/world.json";
import { createAtmosphereShader, createEarth, createEarthShader } from "./createEarth";
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
import { addPoint, createPoints } from "./points";

/**
 * Used to load in the data that generates the main map/globe.
 */
export const loadMap = (scene, renderer, camera) => {
    const countries = topojson.feature(worldJSON, worldJSON.objects.countries);
    const atmosphere = createAtmosphereShader(sphere);
    const earth = createEarth(sphere);
    const earthShader = createEarthShader(sphere);
    // Setup cache for country textures
    const root = new THREE.Object3D();
    const geo = geodecoder(countries.features);
    const textureCache = memoize((cntryID, color) => {
        const country = geo.find(cntryID);
        return mapTexture(country, color);
    });
    const worldTexture = mapTexture(countries, "#transparent", "transparent");
    const worldTextureBack = mapTexture(countries, "#ffffff", "transparent");
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
    // earthShader.renderOrder = 3;
    // earth.renderOrder = 2;
    // atmosphere.renderOrder = 1;
    
    // make sure the back is added to the root/scene first
    // root.add(earthShader);
    root.add(atmosphere);
    root.add(earth);
    root.add(baseMapBack);
    root.add(baseMapFront);
    root.scale.set(0.1, 0.1, 0.1);

    scene.add(root);
    
    // createPoints(scene);
    // addPoint(42.3602558, 71.0572791, 1000, new THREE.Color(0x0000ff), earth);

    scaleUpTween(root, { x: 1, y: 1, z: 1 }, renderer, scene, camera);
    scaleUpTween(atmosphere, { x: 1.325, y: 1.325, z: 1.325 }, renderer, scene, camera);

    // Registers the event listeners for the events on the globe.
    setEvents(camera, [baseMapFront], "mousedown", null);
    setEvents(camera, [baseMapFront], "mouseup", null);
    setEvents(camera, [baseMapFront], "mousemove", 5, null, () => onCountryHoverOff(scene));
};
