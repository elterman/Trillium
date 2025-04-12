<script>
    import { fade } from 'svelte/transition';
    import { CELL_SIZE } from './const';
    import { findCell } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';

    const { pos, horz } = $props();
    const { row, col } = pos;
    const area = $derived(`${row}/${col}`);
    const width = `${CELL_SIZE * 0.6}px`;
    const dir = col === 1 && horz ? 'left' : row === 1 && !horz ? 'top' : col === 3 && horz ? 'right' : 'bottom';

    const disabled = $derived.by(() => {
        if (ss.flip) {
            return true;
        }

        if (ss.pair2) {
            return true;
        }

        return false;
    });

    const onPointerDown = () => {
        _sound.play('click');

        ss.steps += 1;

        let cell1, cell2, cell3;

        delete ss.pair1;
        ss.pair2 = { shift: true, row: horz ? row : null, col: horz ? null : col };

        if (horz) {
            cell1 = findCell({ row, col: 1 });
            cell2 = findCell({ row, col: 2 });
            cell3 = findCell({ row, col: 3 });
            ss.pair2.chars = [cell1.char, cell2.char, cell3.char];

            if (col === 1) {
                ss.pair2.dir = 'left';
                cell1.pos = { row, col: 3 };
                cell2.pos = { row, col: 1 };
                cell3.pos = { row, col: 2 };
            } else {
                ss.pair2.dir = 'right';
                cell1.pos = { row, col: 2 };
                cell2.pos = { row, col: 3 };
                cell3.pos = { row, col: 1 };
            }
        } else {
            cell1 = findCell({ row: 1, col });
            cell2 = findCell({ row: 2, col });
            cell3 = findCell({ row: 3, col });
            ss.pair2.chars = [cell1.char, cell2.char, cell3.char];

            if (row === 1) {
                ss.pair2.dir = 'up';
                cell1.pos = { row: 3, col };
                cell2.pos = { row: 1, col };
                cell3.pos = { row: 2, col };
            } else {
                ss.pair2.dir = 'down';
                cell1.pos = { row: 2, col };
                cell2.pos = { row: 3, col };
                cell3.pos = { row: 1, col };
            }
        }
    };
</script>

<div
    class={[`arrow-target target-${dir} no-highlight`, { disabled }]}
    style="grid-area: {area}; width: {width};"
    onpointerdown={onPointerDown}
    transition:fade>
    <div class="arrow {dir}"></div>
</div>

<style>
    .arrow-target {
        z-index: 3;
        display: grid;
        place-content: center;
        aspect-ratio: 1;
        border-radius: 50%;
        place-self: center;
        cursor: pointer;
        transition: opacity 0.3s;
        /* background: #00000020; */
        --off: 85%;
    }

    .arrow-target:hover {
        filter: sepia(1) hue-rotate(180deg) contrast(1.2) brightness(1.2);
    }

    .disabled {
        opacity: 0;
        pointer-events: none;
        cursor: initial;
    }

    .target-top {
        place-self: start center;
        transform: translateY(calc(-1 * var(--off)));
    }

    .target-right {
        place-self: center end;
        transform: translateX(var(--off));
    }

    .target-bottom {
        place-self: end center;
        transform: translateY(var(--off));
    }

    .target-left {
        place-self: center start;
        transform: translateX(calc(-1 * var(--off)));
    }

    .arrow {
        z-index: 3;
        display: grid;
        width: 24px;
        height: 24px;
        background: #5794ca;
    }

    .top {
        clip-path: polygon(50% 25%, 80% 70%, 20% 70%);
    }

    .right {
        clip-path: polygon(75% 50%, 30% 20%, 30% 80%);
    }

    .bottom {
        clip-path: polygon(50% 75%, 80% 30%, 20% 30%);
    }

    .left {
        clip-path: polygon(25% 50%, 70% 20%, 70% 80%);
    }
</style>
