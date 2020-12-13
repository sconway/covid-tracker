<script>
    import { fade } from "svelte/transition";
    import { isDataPanelActive } from "../stores/dataPanel.js"

    const handleClose = () => {
        isDataPanelActive.update(() => false)
    }
</script>

<div class="wrapper" transition:fade>
    <!-- <h2 class="heading">Data Source Information</h2> -->
    <a on:click={handleClose} href="javascript:;" class="close-button" />

    <aside class="data-sources">
        <h2 class="data-sources__heading">About COVID-19 Tracker</h2>
        <p class="data-sources__answer">
            This project is intended to help provide visibility into the status of each country with regards to the COVID-19 pandemic.
            The 3D interactive world map is built with the Three.js Javascript library, with help from the D3.js library performing computations
            to figure out which country is being interacted with. The whole project is built in the Svelte Javascript framework and is partially
            an exercise to gain more experience with this framework.
        </p>

        <h3 class="data-sources__question">Sources</h3>
        <ul class="data-sources__list">
            <li class="data-sources__list-item">
                John Hopkins CSSE
            </li>
            <li class="data-sources__list-item">
                CDC
            </li>
            <li class="data-sources__list-item">
                WHO
            </li>
        </ul>

        <h3 class="data-sources__question">How up to date is the data?</h3>
        <p class="data-sources__answer">
            Each country updates their official report data differently. Some countries update every hour, while other countries update every day. It can be assumed that each countries statistics are up to date for a given day.
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
        background-color: #000000;
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
        padding: 20px;
        width: 60%;

        &__heading {
            font-size: 2rem;
            font-weight: 300;
            margin-bottom: 30px;
        }

        &__question {
            font-size: 2rem;
            margin: 40px 0 20px;
        }

        &__answer {
            font-size: 1.3rem;
            font-weight: 300;
            line-height: 1.5;
        }

        &__list {
            padding: 0;
        }

        &__list-item {
            font-size: 1.4rem;
            line-height: 1.4;
            list-style: none;
            margin-bottom: 10px;
            padding-left: 30px;
            position: relative;

            &::before {
                background-color: gray;
                border-radius: 50%;
                content: "";
                height: 15px;
                width: 15px;
                position: absolute;
                left: 0px;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        &__metric {
            color: #fff;
            font-size: 1.1rem;
        }
    }
</style>
