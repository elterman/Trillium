<script>
    import { CELL_GAP, CELL_SIZE } from './const';
    import { findCell, isHorz } from './shared.svelte';
    import { post } from './utils';

    const { pair, other } = $props();
    const horz = isHorz(pair);
    const area = `${pair.r1}/${pair.c1}/span ${horz ? 1 : 2}/span ${horz ? 2 : 1}`;
    const cell1 = findCell({ row: pair.r1, col: pair.c1 });
    const cell2 = findCell({ row: pair.r2, col: pair.c2 });
    const width = `${CELL_SIZE}px`;
    const fsz = `${(CELL_SIZE * 16) / 30}px`;
    const csz = CELL_SIZE + CELL_GAP;
    let transform = $state('none');
    let charTransform = $state('none');
    const cellStyle = `width: ${width}; font-size: ${fsz};`;

    $effect(() => {
        post(() => {
            transform = `translate(${(other.c1 - pair.c1) * csz}px, ${(other.r1 - pair.r1) * csz}px) rotate(${horz ? 90 : -90}deg)`;
            charTransform = `rotate(${horz ? -90 : 90}deg)`;
        });
    });
</script>

<div class="tile {horz ? 'horz' : 'vert'}" style="grid-area: {area}; gap: {CELL_GAP}px; transform: {transform};">
    {#each [cell1, cell2] as cell, i (i)}
        <div class="cell" style={cellStyle}>
            <div class="char" style="transform: {charTransform}">{cell.char}</div>
        </div>
    {/each}
</div>

<style>
    .tile {
        pointer-events: none;
        display: grid;
        background: var(--background);
        z-index: 2;
    }

    .horz {
        transform-origin: 25% 50%;
        grid-auto-flow: column;
    }

    .vert {
        transform-origin: 50% 25%;
    }

    .tile,
    .char {
        transition: transform 1s;
    }

    .cell {
        display: grid;
        place-content: center;
        aspect-ratio: 1;
        font-family: Arial;
        font-weight: bold;
        background: #f0f8ff;
    }
</style>
