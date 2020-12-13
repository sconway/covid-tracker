<script>
    import { fly } from "svelte/transition";
    import { country, countryInfo, isCountryClicked, isCountryHovered } from "../stores/country.js";
    import { isDataPanelActive } from "../stores/dataPanel.js"
    import { abbreviateNumber } from "../utils/formatUtils.js";
    import { setCountryImageBack } from "../utils/utils.js";
    import { onCountryHoverOff } from "../globeEventHandlers/globeMouseMove";

    const getCountryCovidStats = (countryData, property) => {
        if (countryData && countries && countries.length > 0) {
            const country = countries.find((country) => countryData.countryCode === country.code);
            return country && country[property] ? country[property] : "";
        }

        return "";
    };

    const getCountryInformation = (countryInfo, property) => {
        if (countryInfo) return countryInfo[property];

        return null;
    };

    export let handleClose;
    export let countries;
</script>

<aside class="country-data" transition:fly="{{ x: -200, duration: 1000 }}">
    <a on:click={handleClose} href="javascript:;" class="close-button" />
    
    <h2 class="country-data--country">{ getCountryCovidStats($country, "country") }</h2>

    {#if getCountryCovidStats($country, "confirmed")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Total confirmed cases</p>
        <p class="country-data--metric">{abbreviateNumber(getCountryCovidStats($country, "confirmed"), 0)}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "confirmed") && getCountryCovidStats($country, "recovered") &&
    getCountryCovidStats($country, "deaths")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Active cases</p>
        <p class="country-data--metric">
            { getCountryCovidStats($country, "confirmed") - (getCountryCovidStats($country, "recovered") +
            getCountryCovidStats($country, "deaths")) >= 0 ? abbreviateNumber(getCountryCovidStats($country,
            "confirmed") - (getCountryCovidStats($country, "recovered") + getCountryCovidStats($country, "deaths")), 0)
            : 0 }
        </p>
    </div>
    {/if} {#if getCountryCovidStats($country, "critical")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Critical cases</p>
        <p class="country-data--metric">{abbreviateNumber(getCountryCovidStats($country, "critical"), 0)}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "deaths")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Deaths</p>
        <p class="country-data--metric">{abbreviateNumber(getCountryCovidStats($country, "deaths"), 0)}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "recovered")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Recovered</p>
        <p class="country-data--metric">{abbreviateNumber(getCountryCovidStats($country, "recovered"), 0)}</p>
    </div>
    {/if} {#if getCountryInformation($countryInfo, "population") && getCountryCovidStats($country, "confirmed")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Percentage infected</p>
        <p class="country-data--metric">
            { Number( (getCountryCovidStats($country, "confirmed") / getCountryInformation($countryInfo, "population"))
            * 100 ).toFixed(2) }%
        </p>
    </div>
    {/if} {#if getCountryCovidStats($country, "deaths") && getCountryCovidStats($country, "confirmed")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Average death rate</p>
        <p class="country-data--metric">
            { Number(( getCountryCovidStats($country, "deaths") / getCountryCovidStats($country, "confirmed") ) *
            100).toFixed(2) }%
        </p>
    </div>
    {/if}
</aside>

<style type="text/scss">
    .country-data {
        background: rgba(80, 80, 80, 0.3);
        border-radius: 14px;
        max-width: 500px;
        cursor: initial;
        font-size: 2rem;
        justify-content: center;
        height: calc(100% - 80px);
        padding: 25px 20px;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;

        &--category,
        &--metric {
            margin: 0;
        }

        &--country {
            font-size: 2rem;
            font-weight: 300;
            margin: 0 0 30px;
            color: #fff;
        }

        &--wrapper {
            align-items: center;
            display: inline-block;
            color: #ffffff;
            margin-bottom: 15px;
            margin-right: 10px;
            width: calc(50% - 15px);
        }

        &--category {
            color: #ffffff;
            font-size: 1.1rem;
            font-weight: 300;
        }

        &--metric {
            font-size: 4rem;
            font-weight: 100;
            margin-bottom: 5px;
        }
    }

    .close-button {
        background: #aaaaaa;
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: -12.5px;
        top: 50px;
        transition: background-color 300ms ease;
        height: 25px;
        width: 25px;

        &::before,
        &::after {
            background-color: #ffffff;
            content: "";
            height: 1px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            transition: background-color 300ms ease;
            width: 16px;
        }

        &::after {
            transform: translate(-50%, -50%) rotate(-45deg);
        }

        &:hover {
            background-color: #ffffff;

            &::before,
            &::after {
                background-color: #000000;
            }
        }
    }

    /* @media (min-width: 1068px) {
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
    } */
</style>
