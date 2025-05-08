<script>
    import StartPage from '../Start Page.svelte';
    import GamePage from '../Game Page.svelte';
    import Splash from '../Splash.svelte';
    import { post, underMouse } from '../utils';
    import { ss } from '../state.svelte';
    import { START_PAGE } from '../const';
    import WordList from '../Word List.svelte';

    $effect(() => {
        const disable = (e) => {
            e.preventDefault();
        };

        window.addEventListener('contextmenu', disable);
        window.addEventListener('dblclick', disable);

        return () => {
            window.removeEventListener('contextmenu', disable);
            window.removeEventListener('dblclick', disable);
        };
    });

    let splash = $state(true);
    post(() => (splash = false), 2000);

    const onPointerDown = (e) => {
        if (!ss.showDictionary) {
            return;
        }

        if (underMouse(e, ['.wordlist', '#tb-wordlist', '#tb-sound'])) {
            return;
        }

        ss.showDictionary = false;
    };
</script>

<div class="app" onpointerdown={onPointerDown}>
    <div class="vignette"></div>
    <GamePage />

    {#if ss.showDictionary}
        <WordList />
    {/if}

    {#if ss.page === START_PAGE}
        <StartPage />
    {/if}

    {#if splash}
        <Splash />
    {/if}
</div>

<style>
    :root {
        --gold: #ffe4ad;
        --background: #1e4614;
        --offwhite: #f0f8ff; /* aliceblue */
        --blue: #80bfff; /* lighter blue */
    }

    :global {
        body {
            margin: 0;
            overflow: hidden;
        }

        .button-base {
            box-sizing: border-box;
            cursor: pointer;
            display: grid;
            place-content: center;
            transition: transform 0.1s;
        }

        .button-base:focus {
            outline: none !important;
        }

        .no-highlight {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .gradient-gray {
            background: -webkit-linear-gradient(-90deg, #888888, #888888 50%, #888888 100%);
        }

        .gradient-gold {
            background: -webkit-linear-gradient(-90deg, #ede2c5, #ffe4ad 50%, #d8ac3c 100%);
        }

        .gradient-green {
            background: -webkit-linear-gradient(-90deg, #80d880, #8fd65f 50%, #649800 100%);
        }

        .gradient-text {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .root-scroll {
            display: grid;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }

        .root-scroll::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        .root-scroll::-webkit-scrollbar-thumb:hover {
            /* background: #fff5; */
            background: #ffe4add0;
        }

        .root-scroll::-webkit-scrollbar-thumb {
            border-radius: 50vw;
            /* background: #fff4; */
            background: #ffe4adb0;
        }

        /* .root-scroll::-webkit-scrollbar-track {
        background: #fff2;
        } */

        .root-scroll::-webkit-scrollbar-track:hover {
            background: #ffffff05;
        }

        .root-scroll-mobile::-webkit-scrollbar {
            width: 2px;
            height: 2px;
        }

        .root-scroll-mobile::-webkit-scrollbar-thumb {
            border-radius: 1px;
        }
    }

    .app {
        display: grid;
        height: 100dvh;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
        touch-action: manipulation;
        outline: none !important;
        background: var(--background);
        background-image: url('$lib/images/Pattern.webp');
        /* background-size: 150px; */
    }

    .vignette {
        grid-area: 1/1;
        background-image: radial-gradient(transparent, black 150%);
    }

    @font-face {
        font-family: Playfair Italic;
        src: url('$lib/fonts/PlayfairDisplay-Italic.ttf');
    }

    @font-face {
        font-family: Poppins;
        src: url('$lib/fonts/Poppins-Regular.ttf');
    }

    @font-face {
        font-family: Roboto;
        src: url('$lib/fonts/Roboto-Regular.ttf');
    }

    @font-face {
        font-family: 'Roboto Condensed';
        src: url('$lib/fonts/RobotoCondensed-Medium.ttf');
    }

    @font-face {
        font-family: 'Roboto Mono';
        src: url('$lib/fonts/RobotoMono-Regular.ttf');
    }
</style>
