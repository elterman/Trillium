<script>
    import { fade } from 'svelte/transition';
    import { CELL_SIZE, sqrt3 } from './const';

    const { pos } = $props();
    const width = CELL_SIZE * 0.6;

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
        }

        return `translate(${x}px, ${y}px)`;
    });
</script>

<div class={['dot-target no-highlight']} style="width: {width}px; transform: {transform};" transition:fade>
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

    .disabled {
        opacity: 0;
        pointer-events: none;
        cursor: initial;
    }

    .dot {
        width: 13%;
        aspect-ratio: 1;
        background: var(--gold);
        border-radius: 50%;
        place-self: center;
    }
</style>
