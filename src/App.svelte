<script>
    import * as d3 from "d3";
    import * as THREE from "THREE";
    import * as TWEEN from "@tweenjs/tween.js";
    // import * as countryDetails from "../json/countries.json";
    import { onDestroy, onMount } from "svelte";
    import DataSourceInfo from "./components/DataSourceInfo.svelte"
    import FullCountryStatistics from "./components/FullCountryStatistics.svelte"
    import ShortCountryStatistics from "./components/ShortCountryStatistics.svelte"
    import { fetchCountryData } from "./api/api";
    import { country, countryInfo, isCountryClicked, isCountryHovered } from "./stores/country.js";
    import { isDataPanelActive } from "./stores/dataPanel.js"
    import { onCountryHoverOff, unsubscribeCountryClick } from "./globeEventHandlers/globeMouseMove";
    import { initScene } from "./utils/sceneUtils/scene";
    import { loadMap } from "./utils/mapUtils/loadMap";
    import { setCountryImageBack } from "./utils/utils.js";

    let camera;
    let cloud;
    let controls;
    let countries;
    let earth;
    let root;
    let renderer;
    let scene;

    /**
     * Initializes the scene, renderer, and camera.
     */
    const initThreeJSObjects = () => {
        const canvas = d3
            .select("#three-container")
            .append("canvas")
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight);

        canvas.node().getContext("webgl");

        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas.node(),
        });
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    };

    /**
     * Called when the DOM is unmounted. Removes the subscription for handling country clicks.
     */
    onDestroy(unsubscribeCountryClick);

    /**
     * Called when the DOM is first mounted.
     */
    onMount(async () => {
        countries = await fetchCountryData();
        const loadingScreen = document.getElementById("loadingScreen");
        loadingScreen.classList.add("active");
        
        initThreeJSObjects();
        initScene(scene, renderer, camera);
        loadMap(scene, renderer, camera);
        setEarthAndClouds();
        animate();
    });

    /**
     * Loop used for rendering and updating values.
     */
    const animate = (time) => {
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    const getCountryCovidStats = (countryData, property) => {
        if (countryData && countries && countries.length > 0) {
            const country = countries.find(country => countryData.countryCode === country.code);
            return country && country[property] ? country[property] : "";
        }

        return "";
    }

    const setEarthAndClouds = () => {
        cloud = scene.getObjectByName("cloud");
        root = scene.getObjectByName("root");
    };

    /**
     * Called by the animation function about 60 times per second. 
     * Updates any values that are used for animation or control.
     */
    const update = () => {
      if (!$isCountryHovered && !$isDataPanelActive) {
        if (cloud) cloud.rotation.y += 0.000625;
        if (root && !$isCountryClicked) root.rotation.y += 0.0005;
        // update any transitions on existing tweens
        TWEEN.default.update();
      }
    };

    /**
    * Called when the back button is clicked. Updates the shared state, 
    * and sets the globe images back to their original state.
    */
    const handleBackButtonClick = () => {
        isCountryClicked.update((c) => false);
        countryInfo.update((c) => {});
        setCountryImageBack(scene);
        onCountryHoverOff(scene);
    }

    const handleInfoClick = () => {
        isDataPanelActive.update(() => true)
    }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<main>
    <img on:click={handleInfoClick} class="info-icon" alt="data source information" title="Data source information, and how percentages are calculated" src="images/info.png" />

    <h2 class="country-name" class:active="{$isCountryClicked}">{getCountryCovidStats($country, "country")}</h2>
    
    {#if $isDataPanelActive}
        <DataSourceInfo />
    {/if}

    {#if $isCountryClicked}
        <FullCountryStatistics countries={countries} />
    {/if}

    {#if $isCountryHovered}
        <ShortCountryStatistics countries={countries} />
    {/if}

    {#if $isCountryClicked}
        <div class="back-button__wrapper" on:click={handleBackButtonClick}>
            <span class="back-button__arrow"></span>
            <span class="back-button">Back</span>
        </div>
    {/if}

    <div class="container" class:active="{$isCountryClicked}" id="three-container"></div>
</main>

<style type="text/scss">
    :global(body) {
        cursor: grab;
        font-family: 'Play', sans-serif;
        margin: 0;
        padding: 0;
    }
    
    :global(body.pointer) {
        cursor: pointer !important;
    }

    main {
        background-color: #0f151d;
    }

    p {
        margin: 0;
    }

    .back-button {
        color: #fff;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: letter-spacing 250ms ease;
    }

    .back-button__arrow {
        background-color: #ffffff;
        margin-right: 12px;
        position: relative;
        height: 2px;
        width: 20px;
        transition: margin-right 250ms ease;

        &::before {
            background-color: #ffffff;
            content: "";
            height: 2px;
            width: 10px;
            top: -3px;
            left: -2px;
            position: absolute;
            transform: rotate(-45deg);
        }

        &::after {
            background-color: #ffffff;
            content: "";
            height: 2px;
            width: 10px;
            left: -2px;
            top: 3px;
            position: absolute;
            transform: rotate(45deg);
        }
    }

    .back-button__wrapper {
        align-items: center;
        cursor: pointer;
        display: flex;
        position: absolute;
        right: 20px;
        top: 20px;
        z-index: 2;

        &:hover {
            .back-button__arrow {
                margin-right: 15px;
            }

            .back-button {
                letter-spacing: 3px;
            }
        }
    }

    .container {
        position: relative;
        transition: transform 500ms ease;
        z-index: 0;
    }

    .container.active {
        transform: translateX(20%);
    }

    .country-name {
        color: #ffffff;
        font-size: 4rem;
        letter-spacing: 5px;
        line-height: 1.2;
        margin: 0;
        position: absolute;
        top: 20px;
        text-align: center;
        text-transform: uppercase;
        transition: top 300ms ease;
        width: 100%;
        z-index: 2;

        &.active {
            top: 10px;
        }
    }

    .info-icon {
        cursor: pointer;
        height: 30px;
        width: 30px;
        position: absolute;
        left: 20px;
        top: 20px;
        z-index: 4;
    }
</style>
