<script>
    import Cell from './Cell.svelte';
    import { CELL_SIZE, sqrt3 } from './const';
    import { makePuzzle } from './shared.svelte';
    import { ss } from './state.svelte';
    import { post } from './utils';
    import Trillium from '$lib/images/Trillium.webp';
    import Dot from './Dot.svelte';
    import Arrow from './Arrow.svelte';

    const csz = CELL_SIZE;

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
    class="board {ss.flip ? 'flipped' : ''} {ss.dot2?.shift ? 'no-overflow' : ''}"
    style="width: {csz * 4}px; height: {csz * 1.5 * sqrt3 + csz}px; ">
    {#each ss.cells as cell (cell.home)}
        <Cell {cell} />
    {/each}
    <img class="img" src={Trillium} alt="Trillium" width={csz * 0.8} style="margin-top: {(csz / 2.6) * sqrt3}px" />
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as pos (pos)}
        <Dot {pos} />
    {/each}
    {#each [1, 3, 4, 6, 7, 9] as pos (pos)}
        <Arrow {pos} />
    {/each}
</div>

<style>
    .board {
        grid-area: 3/1;
        display: grid;
        justify-self: center;
        transition: linear transform 0.5s;
        margin-bottom: 15px;
        /* background: #00000040; */
    }

    .no-overflow {
        overflow: hidden;
    }

    .flipped {
        transform: rotateY(90deg);
    }

    .img {
        grid-area: 1/1;
        place-self: center;
    }
</style>
