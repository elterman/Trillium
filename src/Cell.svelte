<script>
    import { BLUE, CELL_SIZE, GREEN, OFFWHITE, sqrt3, YELLOW } from './const';
    import { inPlace, isSolved, onOver, persist, swapCells, wordRevealedAt } from './shared.svelte';
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

    const width = `${CELL_SIZE * 0.85}px`;
    const fsz = `${(CELL_SIZE * 14) / 30}px`;
    let color = $state(BLUE);
    const zi = $derived(pos === ss.sel2 ? 2 : pos === ss.sel1 ? 1 : 0);
    const cursor = $derived((ss.sel1 && ss.sel2) || disabled ? 'initial' : 'pointer');
    const pairColor = OFFWHITE;

    const disabled = $derived.by(() => {
        if (!ss.sel1 || ss.sel2) {
            return false;
        }

        const sel = ss.sel1;

        if (pos === 1) {
            if (sel === 5 || sel === 6) {
                return true;
            }
        } else if (pos < 4) {
            if (sel > 4) {
                return true;
            }
        } else if (pos === 4) {
            if (sel === 8 || sel === 9) {
                return true;
            }
        } else if (pos < 7) {
            if (sel < 4 || sel > 7) {
                return true;
            }
        } else if (pos === 7) {
            if (sel === 2 || sel === 3) {
                return true;
            }
        } else if (sel > 1 && sel < 7) {
            return true;
        }
    });

    $effect(() => {
        if (pos === ss.sel1 || pos === ss.sel2) {
            color = pairColor;
            return;
        }

        const prevColor = color;
        // const wob = wordRevealedAt(pos);
        // const newColor = wob ? (inPlace(wob) ? GREEN : YELLOW) : BLUE;

        let newColor = BLUE;

        if ((pos < 5 && ss.words[1][pos - 1] === char) || (pos > 6 && ss.words[0][pos - 7] === char) || ss.words[2][7 - pos] === char) {
            newColor = GREEN;
        }

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

            if (ss.sel2) {
                _sound.play('cluck');
            }

            delete ss.sel1;
            delete ss.sel2;

            if (isSolved()) {
                onOver();
            }

            persist();
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });

    const onPointerDown = () => {
        _sound.play('click');

        if (!ss.sel1) {
            ss.sel1 = pos;
            return;
        }

        if (pos === ss.sel1) {
            delete ss.sel1;
            return;
        }

        ss.sel2 = pos;
        ss.steps += 1;

        post(() => swapCells(ss.sel1, ss.sel2), 100);
    };
</script>

<div
    {id}
    class="cell {disabled ? 'disabled' : ''} {ss.surrender ? 'surrender' : ''}"
    style="width: {CELL_SIZE}px; transform: {transform}; z-index: {zi}; cursor: {cursor}"
    onpointerdown={onPointerDown}>
    <div class="content {ss.over ? 'pulse' : ''}" style="width: {width}; font-size: {fsz}; background: {color};">
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

    .cell:hover {
        filter: hue-rotate(10deg) contrast(1.1) brightness(1.1);
    }

    .disabled {
        filter: grayscale(1);
        opacity: 0.5;
    }

    .disabled:hover {
        filter: grayscale(1);
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
</style>
