<script>
    import { CELL_GAP, CELL_SIZE } from './const';
    import { post } from './utils';

    const { row, col, dir, chars } = $props();
    const area = `${row || 1}/${col || 1}/span ${row ? 1 : 3}/span ${row ? 3 : 1}`;
    const width = `${CELL_SIZE}px`;
    const fsz = `${(CELL_SIZE * 16) / 30}px`;
    const csz = CELL_SIZE + CELL_GAP;
    let transform = $state('none');
    const cellStyle = `width: ${width}; font-size: ${fsz};`;

    const relative = $derived.by(() => {
        let off = '';

        if (row && dir === 'right') {
            off = 'right';
        } else if (col && dir === 'down') {
            off = 'bottom';
        }

        if (off) {
            off = `${off}: ${csz}px;`;
        }

        return off;
    });

    if ((row && dir === 'left') || (col && dir === 'up')) {
        chars.push(chars[0]);
    } else {
        chars.unshift(chars[2]);
    }

    $effect(() => {
        post(() => (transform = `translate${row ? 'X' : 'Y'}(${dir === 'left' || dir === 'up' ? '-' : ''}${csz}px)`));
    });
</script>

<div class="slider {row ? 'horz' : ''}" style="grid-area: {area}; gap: {CELL_GAP}px; {relative} transform: {transform};">
    {#each chars as ch, i (i)}
        <div class="cell" style={cellStyle}>
            <div class="char">{ch}</div>
        </div>
    {/each}
</div>

<style>
    .slider {
        position: relative;
        display: grid;
        background: var(--background);
        z-index: 2;
        transition: transform 0.7s;
        pointer-events: none;
    }

    .horz {
        grid-auto-flow: column;
    }

    .cell {
        display: grid;
        place-content: center;
        aspect-ratio: 1;
        font-family: Arial;
        font-weight: bold;
        background: #80bfff;
    }
</style>
