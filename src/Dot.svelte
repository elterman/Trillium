<script>
    import { fade } from 'svelte/transition';
    import { CELL_SIZE, sqrt3 } from './const';
    import { swapPairs } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { post } from './utils';

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
        } else if (pos === 10) {
            y += (sz * sqrt3 * 2) / 4;
        } else if (pos === 11) {
            x = (sz * 3) / 4;
            y += (sz * sqrt3 * 5) / 4;
        } else if (pos === 12) {
            x = (sz * 3) / 4;
            y += (sz * sqrt3 * 5) / 4;
        }

        return `translate(${x}px, ${y}px)`;
    });

    const disabled = $derived.by(() => {
        if (ss.flip) {
            return true;
        }

        if (ss.dot2) {
            return true;
        }

        const dot = ss.dot1;

        if (!dot) {
            return false;
        }

        if (pos === dot) {
            return false;
        }

        if ((pos === 3 && dot === 4) || (pos === 4 && dot === 3)) {
            return false;
        }

        if ((pos === 6 && dot === 7) || (pos === 7 && dot === 6)) {
            return false;
        }

        const diff = Math.abs(pos - dot);

        if (diff === 8) {
            return false;
        }

        if (diff === 1) {
            return true; // overlap
        }

        return false;
    });

    const onPointerDown = () => {
        _sound.play('click');

        if (!ss.dot1) {
            ss.dot1 = pos;
            return;
        }

        if (pos === ss.dot1) {
            delete ss.dot1;
            return;
        }

        ss.dot2 = pos;
        ss.steps += 1;

        post(() => swapPairs(ss.dot1, ss.dot2), 100);
    };
</script>

<div
    class={['dot-target no-highlight', { disabled }]}
    style="width: {width}px; transform: {transform};"
    onpointerdown={onPointerDown}
    onpointerenter={() => (ss.hover_pair = pos)}
    onpointerleave={() => (ss.hover_pair = null)}
    transition:fade>
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
