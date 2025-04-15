<script>
    import Board from './Board.svelte';
    import { GAME_PAGE } from './const';
    import Countdown from './Countdown.svelte';
    import Discovered from './Discovered.svelte';
    import Prompt from './Prompt.svelte';
    import { ss } from './state.svelte';
    import Stats from './Stats.svelte';
    import Steps from './Steps.svelte';
    import Toolbar from './Toolbar.svelte';
</script>

<div class="game-page {ss.page === GAME_PAGE ? 'opacity' : ''}">
    <Stats />
    <Steps />
    <Board />
    <Countdown />
    <Discovered />
    <Prompt />
    <Toolbar />
</div>

<style>
    .game-page {
        place-self: center;
        grid-area: 1/1;
        display: grid;
        place-content: center;
        grid: auto auto / auto;
        gap: 20px;
        padding: 10px 0;
        opacity: 0;
        transition: opacity 0.5s;
    }

    .opacity {
        opacity: 1;
    }
</style>
