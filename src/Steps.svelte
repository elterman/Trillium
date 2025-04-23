<script>
    import NumberFlow from '@number-flow/svelte';
    import { fade } from 'svelte/transition';
    import { ss } from './state.svelte';

    const scoreReport = $derived.by(() => {
        if (!ss.over) {
            return null;
        }

        const score = ss.score();
        return `  –  ${score === 0 ? 'even' : `${Math.abs(score)} ${score > 0 ? 'over' : 'under'}`} par`;
    });
</script>

<div class="steps">
    {#if ss.cheer}
        <div class="message" transition:fade>
            {ss.cheer}
        </div>
    {:else if ss.surrender}
        <div class="message" transition:fade>
            {ss.surrender}
        </div>
    {:else if scoreReport}
        <div id="steps" class="flow" transition:fade>
            <NumberFlow value={ss.steps} />
            <span>{` swap${ss.steps === 1 ? '' : 's'}`}</span>
            {scoreReport}
        </div>
    {:else}
        <div id="steps" class="flow" transition:fade>
            <NumberFlow value={ss.steps} />
            <span>{` swap${ss.steps === 1 ? '' : 's'}`}</span>
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

    .message {
        grid-area: 1/1;
    }

    .flow {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
    }
</style>
