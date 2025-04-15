<script>
    import NumberFlow from '@number-flow/svelte';
    import { _stats } from './state.svelte';

    const classes = $derived(`item ${_stats.reset ? 'reset' : ''} gradient-gold`);
</script>

<div class="stats">
    <div class={classes}>puzzles  <NumberFlow value={_stats.plays} /></div>
    <div class={classes}>ave  <NumberFlow value={_stats.ave()} /></div>
    <div class={classes}>best  <NumberFlow value={_stats.best} /></div>
</div>

<style>
    .stats {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        grid: auto / 1.3fr 1fr 1fr;
        height: 28px;
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

    .reset {
        background: #ffff80;
    }
</style>
