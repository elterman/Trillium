<script>
    import { CELL_SIZE, sqrt3 } from './const';
    import { makePuzzle } from './shared.svelte';
    import { ss } from './state.svelte';
    import { post } from './utils';

    const key = (cell) => {
        const { row, col } = cell.home;
        return row * 10 + col;
    };

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== 'board') {
                return false;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (ss.flip) {
                ss.flip = false;
                post(makePuzzle);
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div
    id="board"
    class="board {ss.flip ? 'flipped' : ''} {ss.pair2?.shift ? 'no-overflow' : ''}"
    style="width: {CELL_SIZE * 4}px; height: {CELL_SIZE * 2 * sqrt3}px; ">
    <!-- {#each ss.cells as cell (key(cell))}
    {/each} -->
</div>

<style>
    .board {
        grid-area: 3/1;
        display: grid;
        justify-self: center;
        transition: linear transform 0.5s;
        margin: 15px;
        background: #00000040;
    }

    .no-overflow {
        overflow: hidden;
    }

    .flipped {
        transform: rotateY(90deg);
    }
</style>
