<script>
    import NumberFlow from '@number-flow/svelte';
    import { fade } from 'svelte/transition';
    import { ss } from './state.svelte';
</script>

<div class="steps">
    {#if ss.surrender}
        <div class="message" transition:fade>
            {ss.surrender}
        </div>
    {:else}
        <div style="grid-area: 1/1" transition:fade>
            <NumberFlow value={ss.steps} /> swap{ss.steps === 1 ? '' : 's'}
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

</style>
