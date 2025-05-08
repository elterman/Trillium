<script>
    import { fade } from 'svelte/transition';
    import { GAME_PAGE, YOU_GAVE_UP } from './const';
    import Help from './Help.svelte';
    import PromptButton from './Prompt Button.svelte';
    import { calculatePar, dayOfYear, isSolved, onStart, persist } from './shared.svelte';
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
        ss.initial = job.initial;
        ss.steps = job.steps;
        ss.discovered = job.discovered;
        ss.replay = job.replay;

        if (isSolved()) {
            ss.over = true;
            ss.steps = 0;
            
            calculatePar();

            if (_stats.plays === 0) {
                ss.surrender = YOU_GAVE_UP;
            }
        }
    };

    const loadGame = () => {
        const json = localStorage.getItem(ss.appKey());
        const job = JSON.parse(json);

        if (job) {
            _stats.plays = job.plays;
            _stats.total_score = job.total_score;
            _stats.best = job.best;

            if (!ss.daily) {
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
        } else if (ss.daily) {
            ss.day = dayOfYear();
        }
    };

    const onGoToGame = () => {
        ss.page = GAME_PAGE;

        if (ss.cells) {
            post(isSolved, 1000);
        } else {
            _sound.play('score2');
            onStart();
        }
    };

    const onDemo = () => {
        window.open('https://youtube.com/shorts/FD6-WvNu_7A');
    };

    const onBinge = () => {
        ss.daily = false;
        loadGame();
        onGoToGame();
    };

    const onDaily = () => {
        ss.daily = true;
        loadGame();
        onGoToGame();
    };
</script>

<div class="start-page" in:fade={{ duration: 100 }} out:fade={{ duration: 200 }}>
    <div class="content" bind:this={content} style="transform: scale({scale})">
        <div class="title">
            <div class="gradient-gold gradient-text">Trillium</div>
            {#if ss.daily}
                <div class="subtitle gradient-gold gradient-text">daily</div>
            {/if}
        </div>
        <Help />
        {#if ss.daily === undefined}
            <div class="buttons">
                <PromptButton op={{ label: 'Daily', onClick: onDaily }} />
                <PromptButton op={{ label: 'Binge', onClick: onBinge }} />
            </div>
        {:else}
            <div class="buttons">
                <PromptButton op={{ label: 'Demo', onClick: onDemo }} />
                <PromptButton op={{ label: ss.cells ? 'Back to Game' : 'Play', onClick: onGoToGame }} />
            </div>
        {/if}
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
        filter: drop-shadow(0 0 3px black);
    }

    .title {
        place-self: center;
        font-size: 64px;
        font-family: Playfair Italic;
        font-weight: 600;
        color: var(--gold);
        filter: drop-shadow(4px 4px 4px black);
        justify-items: center;
    }

    .subtitle {
        font-size: 24px;
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
