<script>
    import { fly } from "svelte/transition";
    import { country, countryInfo, isCountryClicked, isCountryHovered } from "../stores/country.js";
    import { abbreviateNumber } from "../utils/formatUtils.js";

    export let totals;
</script>

<aside class="intro" in:fly="{{ x: -200, duration: 750, delay: 500 }}">
    <p class="intro--title">COVID-19 has claimed the lives of</p>
    <p class="intro--total">{abbreviateNumber(totals[0].deaths, 2)}</p>
    <p class="intro--title">people worldwide.</p>
    <p class="intro--description">
        Explore and track information about COVID-19 cases in each country around the world.
    </p>
</aside>

<style type="text/scss">
    .intro {
        cursor: initial;
        position: absolute;
        left: 15px;
        top: 50px;
        width: 275px;
        z-index: 2;

        &--description {
            color: #ffffff;
            font-size: 1.1rem;
            line-height: 1.4;
        }

        &--title {
            color: #ffffff;
            font-size: 1.6rem;
            font-weight: 300;
            line-height: 1.4;
            margin-bottom: 5px;
            margin-top: 0;
        }

        &--total {
            color: #ffffff;
            font-size: 7rem;
            font-weight: 100;
            margin-bottom: 5px;
            margin-top: 0;
            text-transform: uppercase;
        }
    }
</style>
