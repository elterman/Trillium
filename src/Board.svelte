<script>
    import Arrow from './Arrow.svelte';
    import Cell from './Cell.svelte';
    import { CELL_GAP, CELL_SIZE, COLS, ROWS } from './const';
    import Dot from './Dot.svelte';
    import { isOrtho, makePuzzle } from './shared.svelte';
    import Slider from './Slider.svelte';
    import { ss } from './state.svelte';
    import Tile from './Tile.svelte';
    import { post } from './utils';

    const key = (cell) => {
        const { row, col } = cell.home;
        return row * 10 + col;
    };

    const canDot = (pos, horz) => {
        if (ss.over || ss.surrender) {
            return false;
        }

        if (horz) {
            if (pos.col === COLS) {
                return false;
            }
        } else if (pos.row === ROWS) {
            return false;
        }

        return true;
    };

    const canArrow = (pos, horz) => {
        if (ss.over || ss.surrender) {
            return false;
        }

        if (horz) {
            if (pos.col === 2) {
                return false;
            }
        } else if (pos.row === 2) {
            return false;
        }

        return true;
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
    style="grid: repeat({ROWS}, {CELL_SIZE}px)/repeat({COLS}, {CELL_SIZE}px); gap: {CELL_GAP}px">
    {#each ss.cells as cell (key(cell))}
        <Cell {cell} />
        {@const pos = cell.home}
        {#if canDot(pos, true)}
            <Dot {pos} horz />
        {/if}
        {#if canDot(pos, false)}
            <Dot {pos} horz={false} />
        {/if}
        {#if canArrow(pos, true)}
            <Arrow {pos} horz />
        {/if}
        {#if canArrow(pos, false)}
            <Arrow {pos} horz={false} />
        {/if}
    {/each}
    {#if isOrtho()}
        <Tile pair={ss.pair1} other={ss.pair2} />
        <Tile pair={ss.pair2} other={ss.pair1} />
    {:else if ss.pair2?.shift}
        {@const { row, col, dir, chars } = ss.pair2}
        <Slider {row} {col} {dir} {chars}/>
    {/if}
</div>

<style>
    .board {
        grid-area: 3/1;
        display: grid;
        justify-self: center;
        transition: linear transform 0.5s;
        margin: 15px;
    }

    .no-overflow {
        overflow: hidden;
    }

    .flipped {
        transform: rotateY(90deg);
    }
</style>
