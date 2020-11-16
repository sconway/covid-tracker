import { country, countryInfo, isCountryClicked, isCountryHovered } from "../stores/country.js";
import { setCountryImage } from "../utils/utils.js";

export const addBodyPointer = () => {
    document.body.classList.add("pointer");
}

export const removeBodyPointer = () => {
    document.body.classList.remove("pointer");
}

/**
 * Handles the act of hovering on a country. Sets that country's name
 * and updates the material to show it.
 *
 */
export const onCountryHover = (scene, countryData) => {
    country.update((c) => countryData);
    isCountryHovered.update((h) => true);
    toggleGlobeVisibility(scene, 1, 0.6, 0.4);
    addBodyPointer();
};

/**
 * Called when a country is clicked on. Handles moving the globe,
 * removing the points, and setting the state.
 */
export const onCountryClick = (scene, countryData) => {
    const countryCode = countryData.countryCode ? countryData.countryCode.toLowerCase() : "";
    onCountryHover(scene, countryData);
    isCountryClicked.update((c) => true);
    isCountryHovered.update((h) => false);
    countryInfo.update(c => countryData);
    setCountryImage(scene, countryCode);
    removeBodyPointer();
};

/**
 * Used to decrease/increase the earth and back map's opacity depending
 * on whether or not a country is hovered on.
 */
export const toggleGlobeVisibility = (scene, materialOpacity, earthOpacity, mapOpacity) => {
    if (scene.getObjectByName("earth").material.opacity !== earthOpacity) {
        const overlay = scene.getObjectByName("overlay");

        if (overlay) overlay.material.opacity = materialOpacity;

        scene.getObjectByName("earth").material.opacity = earthOpacity;
        scene.getObjectByName("back-map").material.opacity = mapOpacity;
    }
};
