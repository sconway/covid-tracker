<script>
    import * as d3 from "d3";
    import * as THREE from "THREE";
    import * as TWEEN from "@tweenjs/tween.js";
    import { onMount } from "svelte";
    import { fetchCountryData } from "./api/api";
    import { country, countryInfo, isCountryClicked, isCountryHovered } from "./stores/country.js";
    import { onCountryHoverOff } from "./globeEventHandlers/globeMouseMove";
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
    let numberFormat = Intl.NumberFormat();

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
            alpha: true,
            antialias: true,
            canvas: canvas.node(),
        });
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    };

    /**
     * Called when the DOM is first mounted.
     */
    onMount(async () => {
        countries = await fetchCountryData();
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

    const getCountryInformation = (countryInfo, property) => {
        if (countryInfo) return countryInfo[property];

        return null;
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
      if (!$isCountryHovered) {
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

    let countryName = getCountryCovidStats($country, "country");
    let confirmedCases = getCountryCovidStats($country, "confirmed");
    let criticalCases = getCountryCovidStats($country, "critical");
    let deaths = getCountryCovidStats($country, "deaths");
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<main>
    <h2 class="country-name" class:active="{$isCountryClicked}">{getCountryCovidStats($country, "country")}</h2>
    
    <aside class="country-data" class:active="{$isCountryClicked}">
        {#if $isCountryClicked && getCountryInformation($countryInfo, "capital")}
            <div class="country-data--wrapper">
                <p class="country-data--category">
                    Capital city: 
                </p>
                <p class="country-data--metric">
                    {getCountryInformation($countryInfo, "capital")}
                </p>
            </div>
        {/if}

        {#if $isCountryClicked && getCountryInformation($countryInfo, "population")}
            <div class="country-data--wrapper">
                <p class="country-data--category">
                    Population: 
                </p>
                <p class="country-data--metric">
                    {getCountryInformation($countryInfo, "population")}
                </p>
            </div>
        {/if}

        {#if $isCountryClicked && getCountryInformation($countryInfo, "population") && getCountryCovidStats($country, "confirmed")}
            <div class="country-data--wrapper">
                <p class="country-data--category">
                    Percentage of population infected: 
                </p>
                <p class="country-data--metric">
                    {
                        Number(
                            (getCountryCovidStats($country, "confirmed") / 
                            getCountryInformation($countryInfo, "population")) * 100
                        ).toFixed(2)
                    }%
                </p>
            </div>
        {/if}

        {#if $isCountryClicked && getCountryCovidStats($country, "deaths") && getCountryCovidStats($country, "confirmed")}
            <div class="country-data--wrapper">
                <p class="country-data--category">
                    Death rate: 
                </p>
                <p class="country-data--metric">
                    {
                        Number((
                            getCountryCovidStats($country, "deaths") / 
                            (getCountryCovidStats($country, "confirmed") + getCountryCovidStats($country, "recovered"))
                        ) * 100).toFixed(2)
                    }%   
                </p>
            </div>
        {/if}

        {#if getCountryCovidStats($country, "confirmed")}
          <div class="country-data--wrapper">
              <p class="country-data--category country-data--category__yellow">
                  Confirmed cases{#if $isCountryClicked}:{/if}
              </p>
              <p class="country-data--metric">
                  {numberFormat.format(getCountryCovidStats($country, "confirmed"))}
              </p>
          </div>
        {/if}

        {#if getCountryCovidStats($country, "critical")}
          <div class="country-data--wrapper">
              <p class="country-data--category country-data--category__orange">
                  Critical cases{#if $isCountryClicked}:{/if}
              </p>
              <p class="country-data--metric">
                  {numberFormat.format(getCountryCovidStats($country, "critical"))} 
              </p>
          </div>
        {/if}

        {#if getCountryCovidStats($country, "deaths")}
          <div class="country-data--wrapper">
              <p class="country-data--category country-data--category__red">
                  Deaths{#if $isCountryClicked}:{/if}
              </p>
              
              <p class="country-data--metric">
                  {numberFormat.format(getCountryCovidStats($country, "deaths"))} 
              </p>
          </div>
        {/if}

        {#if getCountryCovidStats($country, "recovered")}
          <div class="country-data--wrapper">
              <p class="country-data--category country-data--category__green">
                  Recovered{#if $isCountryClicked}:{/if}
              </p>
              <p class="country-data--metric">
                  {numberFormat.format(getCountryCovidStats($country, "recovered"))} 
              </p>
          </div>
        {/if}

    </aside>

    {#if $isCountryClicked}
        <div class="back-button__wrapper" on:click={handleBackButtonClick}>
            <span class="back-button__arrow"></span>
            <span class="back-button">Back</span>
        </div>
    {/if}

    <div class="container" class:active="{$isCountryClicked}" id="three-container"></div>
</main>

<style>
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
        background-color: #232323;
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
    }

    .back-button__arrow::after {
        background-color: #ffffff;
        content: "";
        height: 2px;
        width: 10px;
        left: -2px;
        top: 3px;
        position: absolute;
        transform: rotate(45deg);
    }

    .back-button__arrow::before {
        background-color: #ffffff;
        content: "";
        height: 2px;
        width: 10px;
        top: -3px;
        left: -2px;
        position: absolute;
        transform: rotate(-45deg);
    }

    .back-button__wrapper {
        align-items: center;
        cursor: pointer;
        display: flex;
        position: absolute;
        right: 20px;
        top: 20px;
        z-index: 2;
    }

    .back-button__wrapper:hover > .back-button__arrow {
        margin-right: 15px;
    }

    .back-button__wrapper:hover > .back-button {
        letter-spacing: 3px;
    }

    .container {
        position: relative;
        transition: transform 500ms ease;
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
    }

    .country-name.active {
        top: 10px;
    }

    .country-data {
        align-items: center;
        display: flex;
        font-size: 2rem;
        justify-content: center;
        position: absolute;
        bottom: 0;
        width: 100%;
    }

    .country-data.active {
        bottom: initial;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: auto;
    }

    .country-data.active .country-data--wrapper {
        align-items: center;
        display: flex;
        font-size: 24px;
    }

    .country-data.active .country-data--category {
        color: #ffffff;
        font-size: 18px;
        margin-right: 15px;
    }

    .country-data--wrapper {
        color: #ffffff;
        padding: 12px 20px;
        text-align: center;
    }

    .country-data--category__green {
        color: green;
    }
    
    .country-data--category__yellow {
        color: yellow;
    }
    
    .country-data--category__orange {
        color: orange;
    }
    
    .country-data--category__red {
        color: red;
    }

    @media (min-width: 1068px) {
        .country-data.active .country-data--wrapper {
            font-size: 28px;
        }

        .country-data.active .country-data--category {
        font-size: 22px;
    }
    }

    @media (min-width: 1400px) {
        .country-data.active .country-data--wrapper {
            font-size: 32px;
        }

        .country-data.active .country-data--category {
        font-size: 26px;
    }
    }
</style>
