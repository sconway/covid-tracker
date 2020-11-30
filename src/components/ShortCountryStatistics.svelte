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

<aside class="country-data">
    {#if getCountryCovidStats($country, "confirmed") && getCountryCovidStats($country, "recovered") &&
    getCountryCovidStats($country, "deaths")}
    <div class="country-data--wrapper">
        <p class="country-data--category country-data--category__yellow">Active cases</p>
        <p class="country-data--metric">
            { getCountryCovidStats($country, "confirmed") - (getCountryCovidStats($country, "recovered") +
            getCountryCovidStats($country, "deaths")) >= 0 ? numberFormat.format(getCountryCovidStats($country,
            "confirmed") - (getCountryCovidStats($country, "recovered") + getCountryCovidStats($country, "deaths"))) : 0
            }
        </p>
    </div>
    {/if} {#if getCountryCovidStats($country, "critical")}
    <div class="country-data--wrapper">
        <p class="country-data--category country-data--category__orange">Critical cases</p>
        <p class="country-data--metric">{numberFormat.format(getCountryCovidStats($country, "critical"))}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "deaths")}
    <div class="country-data--wrapper">
        <p class="country-data--category country-data--category__red">Deaths</p>

        <p class="country-data--metric">{numberFormat.format(getCountryCovidStats($country, "deaths"))}</p>
    </div>
    {/if} {#if getCountryCovidStats($country, "recovered")}
    <div class="country-data--wrapper">
        <p class="country-data--category country-data--category__green">Recovered</p>
        <p class="country-data--metric">{numberFormat.format(getCountryCovidStats($country, "recovered"))}</p>
    </div>
    {/if}
</aside>

<style type="text/scss">
    .country-data {
        align-items: center;
        display: flex;
        font-size: 2rem;
        justify-content: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        z-index: 2;

        &--wrapper {
            color: #ffffff;
            padding: 12px 20px;
            text-align: center;
        }

        &--metric {
            margin: 0;
        }

        &--category {
            margin: 0 0 10px;

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
</style>
