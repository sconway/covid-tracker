<script>
    import { fly } from "svelte/transition";
    import { country, countryInfo, isCountryClicked, isCountryHovered } from "../stores/country.js";
    import { abbreviateNumber } from "../utils/formatUtils.js";

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

    export let countries;
</script>

<aside class="country-data">
    <h2 class="country-data--country">{ getCountryCovidStats($country, "country") }</h2>

    {#if getCountryCovidStats($country, "confirmed") && getCountryCovidStats($country, "recovered") &&
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
    {/if}
</aside>

<style type="text/scss">
    .country-data {
        cursor: initial;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;

        &--country {
            font-size: 2rem;
            font-weight: 300;
            margin: 0 0 30px;
            color: #fff;
        }

        &--category {
            color: #ffffff;
            font-size: 1.1rem;
            font-weight: 300;
            margin-bottom: 5px;
        }

        &--metric {
            color: #ffffff;
            font-size: 4rem;
            font-weight: 100;
            margin-bottom: 5px;
            margin-top: 0;
        }
    }
</style>
