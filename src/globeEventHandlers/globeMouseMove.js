import * as THREE from "THREE";
import * as d3 from "d3";
import * as countriesJSON from "../json/countries.json";
import { getEventCenter, convertToXYZ } from "../utils/geoHelpers";
import { onCountryClick, onCountryHover, removeBodyPointer, toggleGlobeVisibility } from "./countryHoverUtils";
import { sphere } from "../utils/constants";
import { isStaticClick, getTween } from "../utils/utils";
import { country, isCountryClicked, isCountryHovered } from "../stores/country";

let globeMutex = true;
let lastCountry;
let overlay;
let isMouseDown = false;
let lastPoint;
let isClicked;

export const unsubscribeCountryClick = isCountryClicked.subscribe((value) => {
    isClicked = value;
});

/**
 * Creates and overlays a map with the hovered country highlighted.
 * Called when the map/globe is hovered on.
 */
export const onGlobeMousemove = (event, scene, geo, textureCache, root) => {
    let latlng = getEventCenter.call(sphere, event);
    let country = geo.search(latlng[0], latlng[1]);

    // Make sure there is a country, is hovered on and we are not in the country view.
    if (country && !isMouseDown && !isClicked) {
        // Only run this if we have the mutex or we moved to a different country.
        if (country.code !== lastCountry || globeMutex) {
            globeMutex = false;
            lastCountry = country.code;

            // Overlay the selected country
            let map = textureCache(country.code, "rgba(0,0,0,0.9)");
            let material = new THREE.MeshPhongMaterial({
                depthWrite: false,
                map: map,
                transparent: true,
            });

            // Only add the overlay if it's not there already
            if (!overlay) {
                overlay = new THREE.Mesh(sphere, material);
                overlay.renderOrder = 3;
                overlay.name = "overlay";
                root.add(overlay);
            } else {
                overlay.material = material;
            }

            onCountryHover(scene, countriesJSON[country.code.replace(/[ '.]/g, "")]);
        }
    } else {
        if (isMouseDown)
            isMouseDown = false

        // Only call this once
        if (!globeMutex && !isClicked) {
            globeMutex = true;
            onCountryHoverOff(scene);
        }
    }
};

/**
 * Called when the mouse is pressed on the globe. Sets the values
 * used to determine if the user moved the globe.
 */
export const onGlobeMouseDown = (event) => {
    isMouseDown = true;
    lastPoint = parseInt(event.distance, 10);
};

/**
 * Called when the globe is clicked on. Rotates the camera to face the
 * globe and moves its position.
 */
export const onGlobeMouseUp = (event, geo, root, camera, scene) => {
    // Get point, convert to latitude/longitude
    let latlng = getEventCenter.call(sphere, event);
    let country = geo.search(latlng[0], latlng[1]);
    let isStatic = isStaticClick(event, lastPoint);

    isMouseDown = false;

    // Don't do anything when a country or point is in view, or if a drag occurred.
    if (isStatic && !isClicked) {
        // Make sure a country is clicked on
        if (country) {
            const countryData = countriesJSON[country.code.replace(/[ '.]/g, "")];
            onCountryClick(scene, countryData);

            // Get new camera position
            let temp = new THREE.Mesh();
            temp.position.copy(convertToXYZ(latlng, 1000));
            temp.lookAt(root.position);
            temp.rotateY(Math.PI);

            // Computes the temporary rotation needed to get the country in view
            for (let key in temp.rotation) {
                if (temp.rotation[key] - camera.rotation[key] > Math.PI) {
                    temp.rotation[key] -= Math.PI * 2;
                } else if (camera.rotation[key] - temp.rotation[key] > Math.PI) {
                    temp.rotation[key] += Math.PI * 2;
                }
            }

            // Move the camera to the right location in front of the clicked country.
            const tweenPos = getTween.call(camera, "position", temp.position);
            const positionTimer = d3.timer(tweenPos);
            d3.timeout(() => positionTimer.stop(), 500);

            // Rotate the camera after as it moves to face the globe.
            const tweenRot = getTween.call(camera, "rotation", temp.rotation);
            const rotationTimer = d3.timer(tweenRot);
            d3.timeout(() => rotationTimer.stop(), 500);

            // Set the earth's rotation back to 0 so the correct country is in view.
            const tweenRootRot = getTween.call(root, "rotation", new THREE.Euler(0, Math.PI, 0));
            const rootTimer = d3.timer(tweenRootRot);
            d3.timeout(() => rootTimer.stop(), 500);
        }
    }
};

/**
 * Handles hovering off a country. Sets the materials, cursor, and
 * country back to the default values.
 */
export const onCountryHoverOff = (scene) => {
    if (!isClicked) {
        removeBodyPointer();
        country.update((c) => {});
        isCountryHovered.update((h) => false);
        toggleGlobeVisibility(scene, 0, 0.99, 1);
    }
};
