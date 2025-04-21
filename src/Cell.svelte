<script>
    import { BLUE, CELL_SIZE, CELL_CONTENT_SIZE, GREEN, OFFWHITE, sqrt3, YELLOW } from './const';
    import { inPlace, isSolved, onOver, persist, secondDot, wordRevealedAt } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { post } from './utils';

    const { cell } = $props();
    const { char, home, pos } = $derived(cell);
    const id = $derived(`cell-${home}`);

    const transform = $derived.by(() => {
        const sz = CELL_SIZE;
        const off = (sz * 1.5) / sqrt3;
        let x = 0;
        let y = 0;

        if (pos === 2) {
            x = sz * 0.5;
            y = off;
        } else if (pos === 3) {
            x = sz;
            y = off * 2;
        } else if (pos === 4) {
            x = sz * 1.5;
            y = off * 3;
        } else if (pos === 5) {
            x = sz * 0.5;
            y = off * 3;
        } else if (pos === 6) {
            x = -sz * 0.5;
            y = off * 3;
        } else if (pos === 7) {
            x = -sz * 1.5;
            y = off * 3;
        } else if (pos === 8) {
            x = -sz;
            y = off * 2;
        } else if (pos === 9) {
            x = -sz * 0.5;
            y = off;
        }

        return `translate(${x}px, ${y}px)`;
    });

    const width = `${CELL_CONTENT_SIZE * 0.85}px`;
    const fsz = `${(CELL_CONTENT_SIZE * 14) / 30}px`;
    let color = $state(BLUE);
    const zi = $derived(inPair(ss.dot2) ? 2 : inPair(ss.dot1) ? 1 : 0);
    const pairColor = OFFWHITE;

    const hidden = $derived.by(() => {
        // if (isOrtho() && (inPair(ss.pair1) || inPair(ss.pair2))) {
        //     return true;
        // }

        // if (ss.dot2?.shift && (pos.row === ss.pair2.row || pos.col === ss.pair2.col)) {
        //     return true;
        // }

        return false;
    });

    const inPair = (dot) => {
        if (!dot) {
            return false;
        }

        if (pos === dot) {
            return true;
        }

        const dot2 = secondDot(dot);

        return pos === dot2;
    };

    $effect(() => {
        if (inPair(ss.dot1) || inPair(ss.dot2)) {
            color = pairColor;
            return;
        }

        const prevColor = color;
        const wob = wordRevealedAt(pos);
        const newColor = wob ? (inPlace(wob) ? GREEN : YELLOW) : BLUE;

        post(() => (color = newColor), prevColor === pairColor || prevColor === newColor ? 0 : 1000);
    });

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== id) {
                return;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (ss.dot2) {
                _sound.play('cluck');
            }

            delete ss.dot1;
            delete ss.dot2;

            if (isSolved()) {
                onOver();
            }

            persist();
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div
    {id}
    class="cell {hidden ? 'hidden' : ''} {ss.surrender ? 'surrender' : ''}"
    style="width: {CELL_SIZE}px; transform: {transform}; z-index: {zi}">
    <div
        class="content {color !== pairColor && inPair(ss.hover_pair) ? 'hover' : ''} {ss.over ? 'pulse' : ''}"
        style="width: {width}; font-size: {fsz}; background: {color};">
        {char}
    </div>
</div>

<style>
    .cell {
        grid-area: 1/1;
        place-self: start center;
        transition: transform 1s;
        aspect-ratio: 1;
        border-radius: 50%;
        /* background: gold; */
        display: grid;
        place-content: center;
    }

    .hidden {
        opacity: 0;
    }

    .surrender {
        transition: transform 1s;
        transition-delay: 0.5s;
    }

    .content {
        border-radius: 50%;
        display: grid;
        place-content: center;
        aspect-ratio: 1;
        font-family: Arial;
        font-weight: bold;
        transition:
            filter 0.2s,
            background-color 0.2s,
            transform 0.2s;
    }

    .pulse {
        animation: pulse 0.2s alternate 6 ease-in-out;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.85);
        }
    }

    .hover {
        filter: hue-rotate(10deg) contrast(1.1) brightness(1.1);
    }
</style>
