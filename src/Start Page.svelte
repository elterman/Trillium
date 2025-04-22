<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { APP_STATE, DAILY, GAME_PAGE } from './const';
    import Help from './Help.svelte';
    import PromptButton from './Prompt Button.svelte';
    import { dayOfYear, isSolved, onStart, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _stats, ss } from './state.svelte';
    import { focusOnApp, post, windowSize } from './utils';

    let content = $state(null);
    let scale = $state(1);

    $effect(() => {
        post(() => {
            const { y: wy } = windowSize();
            const pageHi = content.getBoundingClientRect().height + 70;

            if (pageHi > wy) {
                scale = wy / pageHi;
            }
        });

        focusOnApp();
    });

    const reloadGame = (job) => {
        ss.cells = job.cells;

        const chars = job.cells.map((cell) => cell.char);
        ss.words = [chars.slice(6).join('') + chars[0], chars.slice(0, 4).join(''), chars.slice(3, 7).reverse().join('')];

        ss.steps = job.steps;
        ss.discovered = job.discovered;
        ss.initial = job.initial;
        ss.replay = job.replay;

        if (isSolved()) {
            ss.over = true;
        }
    };

    onMount(() => {
        post(() => {
            const json = localStorage.getItem(APP_STATE);
            const job = JSON.parse(json);

            if (job) {
                _stats.plays = job.plays;
                _stats.total_steps = job.total_steps;
                _stats.best = job.best;

                if (!DAILY) {
                    reloadGame(job);
                } else {
                    ss.day = job.day;

                    const doy = dayOfYear();

                    if (ss.day === doy) {
                        ss.replay = job.replay;
                        reloadGame(job);
                    } else {
                        localStorage.clear();
                        ss.day = doy;
                        persist(true);
                    }
                }
            } else if (DAILY) {
                ss.day = dayOfYear();
            }
        }, 2000);
    });

    const onGoToGame = () => {
        ss.page = GAME_PAGE;

        if (!ss.cells) {
            _sound.play('score2');
            onStart();
        }
    };

    const onDemo = () => {
        window.open('https://youtube.com/shorts/87pgUPZcpdE');
    };
    // const style = 'height: 40px; font-size: 18px; font-family: "Playfair Italic"; font-weight: bold';
</script>

<div class="start-page" in:fade={{ duration: 100 }} out:fade={{ duration: 200 }}>
    <div class="content" bind:this={content} style="transform: scale({scale})">
        <div class="title gradient-gold gradient-text">Trillium</div>
        <Help />
        <div class="buttons">
            <PromptButton op={{ label: 'Demo', onClick: onDemo }} />
            <PromptButton op={{ label: ss.cells ? 'Back to Game' : 'Play', onClick: onGoToGame }} />
        </div>
    </div>
    <div class="version">1947</div>
</div>

<style>
    .start-page {
        grid-area: 1/1;
        height: 100dvh;
        display: grid;
        place-content: center;
        z-index: 100;
    }

    .content {
        display: grid;
        gap: 50px;
    }

    .buttons {
        grid-area: 3/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        gap: 20px;
    }

    .title {
        place-self: center;
        font-size: 64px;
        font-family: Playfair Italic;
        font-weight: 600;
        color: var(--gold);
        filter: drop-shadow(4px 4px 4px black);
    }

    .version {
        display: none;
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: #ffffff30;
        padding: 6px 15px 3px;
        border-radius: 50vh;
        font-family: Poppins;
    }
</style>
