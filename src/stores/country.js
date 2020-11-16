import { writable } from "svelte/store";

export const country = writable({});
export const countryInfo = writable({});
export const isCountryClicked = writable(false);
export const isCountryHovered = writable(false);
