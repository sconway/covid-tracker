<script>
    import { fade } from "svelte/transition";
    import { isDataPanelActive } from "../stores/dataPanel.js"

    const handleClose = () => {
        isDataPanelActive.update(() => false)
    }
</script>

<div class="wrapper" transition:fade>
    <h2 class="heading">Data Source Information</h2>
    <a on:click={handleClose} href="javascript:;" class="close-button" />

    <aside class="data-sources">
        <h3 class="data-sources__question">Where does this information come from?</h3>
        <p class="data-sources__answer">
            Data is sourced from institutions like Johns Hopkins CSSE, CDC, WHO, and a few others. This web application
            imports the aforementioned data via a public API which can be viewed <a href="https://rapidapi.com/Gramzivi/api/covid-19-data/details">here</a>.
        </p>

        <h3 class="data-sources__question">How up to date is the data?</h3>
        <p class="data-sources__answer">
            Each country updates their official report data differently. Some countries update every hour, while other countries update every day. It can be assumed that each countries statistics are up to date for a given day.
        </p>

        <h3 class="data-sources__question">Why are some countries missing data?</h3>
        <p class="data-sources__answer">
            The data displayed is the data that each country reports. Some countries do not report certain metrics, so we are unable to display this data.
        </p>

        <h3 class="data-sources__question">How are percentages computed?</h3>
        <p class="data-sources__answer">
            There are a number of different percentages displayed, and they are computed as follows:
        </p>

        <ul class="data-sources__list">
            <li class="data-sources__list-item">
                <span class="data-sources__metric">Percentage of population infected: </span>
                (confirmed cases / population) * 100
            </li>
            <li class="data-sources__list-item">
                <span class="data-sources__metric">Average death rate: </span>
                (deaths / confirmed cases) * 100
            </li>
            <li class="data-sources__list-item">
                <span class="data-sources__metric">Active cases: </span>
                confirmed cases - (deaths + recovered)
            </li>
        </ul>
    </aside>
</div>

<style type="text/scss">
    .wrapper {
        background-color: #0f151d;
        cursor: initial;
        overflow: scroll;
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 3;
    }

    .heading {
        color: #ffffff;
        font-size: 3rem;
        margin: 25px 0 0;
        text-align: center;
    }

    .close-button {
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 20px;
        height: 30px;
        width: 30px;

        &::before,
        &::after {
            background-color: #ffffff;
            content: "";
            height: 1px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            transition: width 300ms ease;
            width: 35px;
        }

        &::after {
            transform: translate(-50%, -50%) rotate(-45deg);
        }

        &:hover {
            &::before,
            &::after {
                width: 40px;
            }
        }
    }

    .data-sources {
        color: #ffffff;
        margin: 0 auto;
        padding: 40px;
        width: 70%;

        &__question {
            font-size: 2rem;
            margin: 40px 0 20px;
        }

        &__answer {
            font-size: 1.1rem;
            line-height: 1.4;
        }

        &__list-item {
            color: #3fcaa3;
            font-size: 1.4rem;
            line-height: 1.4;
        }

        &__metric {
            color: #fff;
            font-size: 1.1rem;
        }
    }
</style>
