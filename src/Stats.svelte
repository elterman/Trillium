<script>
    import NumberFlow from '@number-flow/svelte';
    import { _stats } from './state.svelte';
    import { isAppleDevice } from './utils';

    const apple = isAppleDevice();
    const classes = $derived(`item ${apple ? 'apple' : ''} ${_stats.reset ? 'reset' : ''} gradient-gold`);
    const ave = $derived(_stats.ave());
</script>

<div class="stats">
    <div class={classes}>puzzles  <NumberFlow value={_stats.plays} /></div>
    {#if _stats.plays}
        <div class={classes}>ave  {`${ave < 0 ? '' : '+'}`}<NumberFlow value={ave} /></div>
        <div class={classes}>best  {`${_stats.best < 0 ? '' : '+'}`}<NumberFlow value={_stats.best} /></div>
    {:else}
        <div class={classes}>ave</div>
        <div class={classes}>best</div>
    {/if}
</div>

<style>
    .stats {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        grid: auto / 1.3fr 1fr 1fr;
        height: 28px;
        width: 90%;
        place-self: center;
    }

    .item {
        width: 94%;
        box-sizing: border-box;
        font-family: 'Playfair Italic';
        font-weight: bold;
        font-size: 15px;
        border-radius: 50vh;
        height: 90%;
        padding: 0 0 2px;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        place-content: center;
        place-self: center;
        transition: 0.2s;
    }

    .apple {
        font-weight: 500;
    }

    .reset {
        background: #ffff80;
    }
</style>
