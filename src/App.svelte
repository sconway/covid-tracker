<script>
    import * as d3 from "d3";
    import * as THREE from "THREE";
    import * as TWEEN from "@tweenjs/tween.js";

    import { onDestroy, onMount } from "svelte";
    import IntroInfo from "./components/IntroInfo.svelte"
    import DataSourceInfo from "./components/DataSourceInfo.svelte"
    import FullCountryStatistics from "./components/FullCountryStatistics.svelte"
    import ShortCountryStatistics from "./components/ShortCountryStatistics.svelte"
    import { fetchCountryData, fetchTotalsData } from "./api/api";
    import { country, countryInfo, isCountryClicked, isCountryHovered } from "./stores/country.js";
    import { isDataPanelActive } from "./stores/dataPanel.js"
    import { overlay } from "./stores/overlay"
    import { listeners } from "./stores/listeners.js"
    import { onCountryHoverOff, unsubscribeCountryClick, unsubscribeOverlay } from "./globeEventHandlers/globeMouseMove";
    import { initScene, emptyScene } from "./utils/sceneUtils/scene";
    import { loadMap } from "./utils/mapUtils/loadMap";
    import { debounce, setCountryImageBack } from "./utils/utils.js";

    let camera;
    let cloud;
    let countries;
    let earth;
    let root;
    let renderer;
    let scene;
    let totals;

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
    onDestroy(() => {
        unsubscribeCountryClick();
        unsubscribeOverlay();
    });

    /**
     * Called when the DOM is first mounted.
     */
    onMount(async () => {
        countries = await fetchCountryData();
        totals = await fetchTotalsData();

        // Remove the loading screen when the app is fully loaded.
        const loadingScreen = document.getElementById("loadingScreen");
        loadingScreen.classList.add("active");
        
        // Reset things when the window resizes so mouseover behavior is consistent.
        window.addEventListener("resize", onWindowResize, false);
        
        init();
    });

    const init = () => {
        initThreeJSObjects();
        initScene(scene, renderer, camera);
        loadMap(scene, renderer, camera);
        setEarthAndClouds();
        animate();
    }

    /**
     * Loop used for rendering and updating values.
     */
    const animate = (time) => {
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    /**
     * Called by the animation function about 60 times per second. 
     * Updates any values that are used for animation or control.
     */
     const update = () => {
      if (!$isCountryHovered && !$isDataPanelActive) {
        // update any transitions on existing tweens
        TWEEN.default.update();
      }
    };
    
    const getCountryCovidStats = (countryData, property) => {
        if (countryData && countries && countries.length > 0) {
            const country = countries.find(country => countryData.countryCode === country.code);
            return country && country[property] ? country[property] : "";
        }

        return "";
    }

    const setEarthAndClouds = () => {
        root = scene.getObjectByName("root");
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

    const handleClose = () => {
        isCountryClicked.update((c) => false);
        countryInfo.update((c) => {});
        onCountryHoverOff(scene);
    }
    
    const resetScene = () => {
        const container = document.getElementById("three-container");

        cancelAnimationFrame(animate);
        emptyScene(container);

        overlay.update((o) => null);

        camera = null;
        cloud = null;
        earth = null;
        root = null;
        renderer = null;
        scene = null;
    }

    const removeListeners = () => {
        $listeners.forEach((listener) => {
            document.removeEventListener(listener.type, listener.function)
        });
    }

    const onWindowResize = debounce(() => {
        resetScene();
        removeListeners();
        init();
    }, 500);
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;600&display=swap" rel="stylesheet">
</svelte:head>

<main>
    <p on:click={handleInfoClick} class="info-link">About</p>

    {#if !$isCountryHovered && !$isCountryClicked && totals}
        <IntroInfo totals={totals} />
    {/if}

    {#if $isDataPanelActive}
        <DataSourceInfo />
    {/if}

    {#if $isCountryClicked}
        <FullCountryStatistics countries={countries} handleClose={handleClose} />
    {/if}

    {#if $isCountryHovered}
        <ShortCountryStatistics countries={countries} />
    {/if}

    <div class="container" class:active="{$isCountryClicked}" id="three-container"></div>
</main>

<style type="text/scss">
    :global(body) {
        cursor: grab;
        font-family: 'Montserrat', sans-serif;
        margin: 0;
        padding: 0;
    }
    
    :global(body.pointer) {
        cursor: pointer !important;
    }

    main {
        background-color: #000000;
        height: 100%;
        width: 100%;
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
        position: absolute;
        right: 0;
        height: 100%;
        width: 85%;
        /* transition: transform 500ms ease; */
        /* transform: translateX(15%); */
        z-index: 0;
    }

    /* .container.active {
        transform: translateX(20%);
    } */

    .country-name {
        color: #ffffff;
        font-size: 2rem;
        font-weight: 300;
        letter-spacing: 1px;
        line-height: 1.2;
        margin: 0;
        position: absolute;
        left: 15px;
        top: 60px;
        transition: top 300ms ease;
        z-index: 2;
    }

    .info-link {
        color: rgb(102, 100, 100);
        cursor: pointer;
        position: absolute;
        right: 20px;
        bottom: 40px;
        text-shadow: 0px 0px 1px transparent;
        transition: all 300ms ease;
        z-index: 3;

        &:hover {
            color: #ffffff;
            text-shadow: 0px 0px 1px #ffffff;
        }
    }
</style>
