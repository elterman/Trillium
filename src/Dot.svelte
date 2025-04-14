<script>
    import { fade } from 'svelte/transition';
    import { CELL_SIZE } from './const';
    import { swapPairs } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { post, samePair, samePos } from './utils';

    const { pos, horz } = $props();
    const { row, col } = pos;
    const pair = { r1: row, c1: col, r2: row + (horz ? 0 : 1), c2: col + (horz ? 1 : 0) };
    const area = $derived(`${row}/${col}/span ${horz ? 1 : 2}/span ${horz ? 2 : 1}`);
    const width = `${CELL_SIZE * 0.73}px`;

    const overlap = (p1, p2) => {
        const pos1 = { row: p1.r1, col: p1.c1 };
        const pos2 = { row: p1.r2, col: p1.c2 };
        const pos3 = { row: p2.r1, col: p2.c1 };
        const pos4 = { row: p2.r2, col: p2.c2 };

        return samePos(pos1, pos3) || samePos(pos1, pos4) || samePos(pos2, pos3) || samePos(pos2, pos4);
    };

    const disabled = $derived.by(() => {
        if (ss.flip) {
            return true;
        }

        if (ss.pair2) {
            return true;
        }

        if (!ss.pair1) {
            return false;
        }

        if (samePair(pair, ss.pair1)) {
            return false;
        }

        if (overlap(pair, ss.pair1)) {
            return true;
        }

        return false;
    });

    const onPointerDown = () => {
        _sound.play('click');

        if (!ss.pair1) {
            ss.pair1 = pair;
            return;
        }

        if (samePair(pair, ss.pair1)) {
            delete ss.pair1;
            return;
        }

        ss.pair2 = pair;
        ss.steps += 1;

        post(() => swapPairs(ss.pair1, ss.pair2), 100);
    };
</script>

<div
    class={['dot-target no-highlight', { disabled }]}
    style="grid-area: {area}; width: {width};"
    onpointerdown={onPointerDown}
    onpointerenter={() => (ss.hover_pair = pair)}
    onpointerleave={() => (ss.hover_pair = null)}
    transition:fade>
    <div class="dot {samePair(pair, ss.hover_pair) ? 'hover' : ''}"></div>
</div>

<style>
    .dot-target {
        z-index: 3;
        display: none;
        aspect-ratio: 1;
        border-radius: 50%;
        place-self: center;
        cursor: pointer;
        transition: opacity 0.3s;
        /* background: #00000020; */
    }

    .disabled {
        opacity: 0;
        pointer-events: none;
        cursor: initial;
    }

    .dot {
        width: 12px;
        aspect-ratio: 1;
        background: steelblue;
        border-radius: 50%;
        place-self: center;
    }
</style>
