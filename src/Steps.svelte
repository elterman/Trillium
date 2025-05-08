<script>
    import NumberFlow from '@number-flow/svelte';
    import { fade } from 'svelte/transition';
    import { ss } from './state.svelte';
    import { isAppleDevice } from './utils';

    const scoreReport = $derived.by(() => {
        if (!ss.over || ss.steps === 0) {
            return null;
        }

        const score = ss.score();
        return `  •  ${score === 0 ? 'even' : `${Math.abs(score)} ${score > 0 ? 'over' : 'under'}`} par`;
    });

    const apple = isAppleDevice();
    const gaveUp = $derived(ss.over && ss.steps === 0);
</script>

<div class="steps">
    {#if ss.cheer}
        <div class="message" transition:fade>
            {ss.cheer}
        </div>
    {:else if !gaveUp}
        <div id="steps" class="flow {apple ? 'apple' : ''}" transition:fade={{ duration: gaveUp ? 0 : 400 }}>
            <NumberFlow value={ss.steps} />
            <span>{` swap${ss.steps === 1 ? '' : 's'}`}</span>
            {#if scoreReport}
                <span>{scoreReport}</span>
            {/if}
        </div>
    {/if}
</div>

<style>
    .steps {
        grid-area: 2/1;
        display: grid;
        height: 40px;
        grid-auto-flow: column;
        font-family: 'Playfair Italic';
        font-weight: bold;
        font-size: 25px;
        place-self: center;
        place-items: center;
        color: var(--gold);
    }

    .apple {
        font-weight: 500;
    }

    .message {
        grid-area: 1/1;
    }

    .flow {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
    }
</style>
