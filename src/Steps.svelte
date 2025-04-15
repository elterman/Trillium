<script>
    import NumberFlow from '@number-flow/svelte';
    import { fade } from 'svelte/transition';
    import { YOU_GAVE_UP_STATS_RESET } from './const';
    import { ss } from './state.svelte';
</script>

<div class="steps">
    {#if ss.surrender}
        <div class="message {ss.surrender === YOU_GAVE_UP_STATS_RESET ? 'reset' : ''}" transition:fade>
            {ss.surrender}
        </div>
    {:else}
        <div style="grid-area: 1/1" transition:fade>
            <NumberFlow value={ss.steps} /> step{ss.steps === 1 ? '' : 's'}
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

    .reset {
        font-size: 14px;
        margin-top: -1px;
    }
</style>
