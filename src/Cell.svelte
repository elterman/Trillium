<script>
    import { BLUE, CELL_GAP, CELL_SIZE, GREEN, OFFWHITE, YELLOW } from './const';
    import { inPlace, isOrtho, isSolved, isWordRevealedAt, onOver, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { post } from './utils';

    const { cell } = $props();
    const { home, pos } = $derived(cell);
    const id = $derived(`${home.row * 10 + home.col}`);
    const area = $derived(`${home.row}/${home.col}`);
    const csz = CELL_SIZE + CELL_GAP;
    const transform = $derived(`translate(${(pos.col - home.col) * csz}px, ${(pos.row - home.row) * csz}px)`);
    const width = `${CELL_SIZE}px`;
    const fsz = `${(CELL_SIZE * 16) / 30}px`;
    let color = $state(BLUE);
    const zi = $derived(inPair(ss.pair2) ? 2 : inPair(ss.pair1) ? 1 : 0);
    const pairColor = OFFWHITE;

    const hidden = $derived.by(() => {
        if (isOrtho() && (inPair(ss.pair1) || inPair(ss.pair2))) {
            return true;
        }

        if (ss.pair2?.shift && (pos.row === ss.pair2.row || pos.col === ss.pair2.col)) {
            return true;
        }

        return false;
    });

    const inPair = (pair) => {
        if (!pair) {
            return false;
        }

        const { row: r, col: c } = pos;
        const { r1, c1, r2, c2 } = pair;

        return (r === r1 && c === c1) || (r === r2 && c === c2);
    };

    $effect(() => {
        if (inPair(ss.pair1) || inPair(ss.pair2)) {
            color = pairColor;
            return;
        }

        const prevColor = color;
        const word = isWordRevealedAt(cell.pos.row);
        const newColor = word ? (inPlace(word, cell.pos.row) ? GREEN : YELLOW) : BLUE;

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

            if (ss.pair2) {
                _sound.play('cluck');
            }

            delete ss.pair1;
            delete ss.pair2;

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
    style="grid-area: {area}; transform: {transform}; z-index: {zi}">
    <div
        class="content {color !== pairColor && inPair(ss.hover_pair) ? 'hover' : ''} {ss.over ? 'pulse' : ''}"
        style="width: {width}; font-size: {fsz}; background: {color};">
        {cell.char}
    </div>
</div>

<style>
    .cell {
        transition: transform 1s;
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
