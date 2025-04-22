<script>
    import { fade } from 'svelte/transition';
    import { CELL_CONTENT_SIZE, CELL_SIZE, sqrt3 } from './const';
    import { swapCellsAt, swapSections } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { post } from './utils';

    const { pos } = $props();
    const width = CELL_CONTENT_SIZE * 0.6;

    const transform = $derived.by(() => {
        const sz = CELL_SIZE;
        let x = 0;
        let y = (sz - width) / 2;

        if (pos === 1) {
            x = sz / 4;
            y += (sz * sqrt3) / 4;
        } else if (pos === 2) {
            x = (sz * 3) / 4;
            y += (sz * sqrt3 * 3) / 4;
        } else if (pos === 3) {
            x = (sz * 5) / 4;
            y += (sz * sqrt3 * 5) / 4;
        } else if (pos === 4) {
            x = sz;
            y += (sz * sqrt3 * 6) / 4;
        } else if (pos === 5) {
            y += (sz * sqrt3 * 6) / 4;
        } else if (pos === 6) {
            x = -sz;
            y += (sz * sqrt3 * 6) / 4;
        } else if (pos === 7) {
            x = -(sz * 5) / 4;
            y += (sz * sqrt3 * 5) / 4;
        } else if (pos === 8) {
            x = -(sz * 3) / 4;
            y += (sz * sqrt3 * 3) / 4;
        } else if (pos === 9) {
            x = -sz / 4;
            y += (sz * sqrt3) / 4;
        } else if (pos === 10) {
            y += (sz * sqrt3 * 2) / 4;
        } else if (pos === 11) {
            x = (sz * 3) / 4;
            y += (sz * sqrt3 * 5) / 4;
        } else if (pos === 12) {
            x = (-sz * 3) / 4;
            y += (sz * sqrt3 * 5) / 4;
        }

        return `translate(${x}px, ${y}px)`;
    });

    const onPointerDown = () => {
        _sound.play('click');

        if (pos === 2 || pos === 5 || pos === 8) {
            post(() => swapSections(pos), 100);
        } else {
            post(() => swapCellsAt(pos), 100);
        }

        ss.steps += 1;
    };
</script>

<div
    class="dot-target no-highlight"
    style="width: {width}px; transform: {transform};"
    onpointerdown={onPointerDown}
    onpointerenter={() => (ss.hover_pair = pos)}
    onpointerleave={() => (ss.hover_pair = null)}
    transition:fade>
    {#if pos === 2 || pos === 5 || pos === 8}
        <div class="circle"></div>
    {/if}
    <div class="dot"></div>
</div>

<style>
    .dot-target {
        grid-area: 1/1;
        place-self: start center;
        z-index: 3;
        display: grid;
        aspect-ratio: 1;
        border-radius: 50%;
        cursor: pointer;
        transition: opacity 0.3s;
        /* background: #00000020; */
    }

    .dot {
        grid-area: 1/1;
        width: 13%;
        aspect-ratio: 1;
        background: var(--gold);
        border-radius: 50%;
        place-self: center;
    }

    .circle {
        grid-area: 1/1;
        width: 32%;
        aspect-ratio: 1;
        box-sizing: border-box;
        border: 1px solid var(--gold);
        border-radius: 50%;
        place-self: center;
    }
</style>
