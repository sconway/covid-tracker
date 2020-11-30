<script>
    import { fly } from "svelte/transition";
    import { country, countryInfo, isCountryClicked, isCountryHovered } from "../stores/country.js";

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

    let numberFormat = Intl.NumberFormat();

    export let countries;
</script>

<aside class="country-data" transition:fly="{{ x: -200, duration: 1000 }}">
    {#if getCountryInformation($countryInfo, "capital")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Capital city:</p>
        <p class="country-data--metric">{getCountryInformation($countryInfo, "capital")}</p>
    </div>
    {/if} {#if getCountryInformation($countryInfo, "population")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Population:</p>
        <p class="country-data--metric">{numberFormat.format(getCountryInformation($countryInfo, "population"))}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "confirmed")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Total confirmed cases:</p>
        <p class="country-data--metric">{numberFormat.format(getCountryCovidStats($country, "confirmed"))}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "confirmed") && getCountryCovidStats($country, "recovered") &&
    getCountryCovidStats($country, "deaths")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Active cases:</p>
        <p class="country-data--metric">
            { getCountryCovidStats($country, "confirmed") - (getCountryCovidStats($country, "recovered") +
            getCountryCovidStats($country, "deaths")) >= 0 ? numberFormat.format(getCountryCovidStats($country,
            "confirmed") - (getCountryCovidStats($country, "recovered") + getCountryCovidStats($country, "deaths"))) : 0
            }
        </p>
    </div>
    {/if} {#if getCountryCovidStats($country, "critical")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Critical cases:</p>
        <p class="country-data--metric">{numberFormat.format(getCountryCovidStats($country, "critical"))}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "deaths")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Deaths:</p>

        <p class="country-data--metric">{numberFormat.format(getCountryCovidStats($country, "deaths"))}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "recovered")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Recovered:</p>
        <p class="country-data--metric">{numberFormat.format(getCountryCovidStats($country, "recovered"))}</p>
    </div>
    {/if} {#if getCountryInformation($countryInfo, "population") && getCountryCovidStats($country, "confirmed")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Percentage of population infected:</p>
        <p class="country-data--metric">
            { Number( (getCountryCovidStats($country, "confirmed") / getCountryInformation($countryInfo, "population"))
            * 100 ).toFixed(2) }%
        </p>
    </div>
    {/if} {#if getCountryCovidStats($country, "deaths") && getCountryCovidStats($country, "confirmed")}
    <div class="country-data--wrapper">
        <p class="country-data--category">Average death rate:</p>
        <p class="country-data--metric">
            { Number(( getCountryCovidStats($country, "deaths") / getCountryCovidStats($country, "confirmed") ) *
            100).toFixed(2) }%
        </p>
    </div>
    {/if}
</aside>

<style type="text/scss">
    .country-data {
        font-size: 2rem;
        justify-content: center;
        max-height: 85%;
        overflow: scroll;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;

        &--category,
        &--metric {
            margin: 0;
        }

        &--wrapper {
            align-items: center;
            display: flex;
            font-size: 2.6vw;
            color: #ffffff;
            padding: 10px 20px;
            text-align: center;
        }

        &--category {
            color: #ffffff;
            font-size: 1.8vw;
            margin-right: 15px;

            &__green {
                color: green;
            }

            &__yellow {
                color: yellow;
            }

            &__orange {
                color: orange;
            }

            &__red {
                color: red;
            }
        }
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
