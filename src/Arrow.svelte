<script>
    import { CELL_SIZE, sqrt3 } from './const';

    const { pos } = $props();
    const width = CELL_SIZE * 0.6;

    const transform = $derived.by(() => {
        const sz = CELL_SIZE;
        const off = sz * sqrt3;
        const off1 = sz / 2;
        const off2 = off1 / 2;
        const off3 = off2 * sqrt3;
        let deg = 0;
        let x = 0;
        let y = (sz - width) / 2;

        if (pos === 1) {
            deg = 60;
            x = sz / 4 + off3;
            y += off / 4 - off2;
        } else if (pos === 3) {
            deg = 240;
            x = (sz * 5) / 4 + off3;
            y += (off * 5) / 4 - off2;
        } else if (pos === 4) {
            deg = 180;
            x = sz;
            y += (off * 6) / 4 + off1;
        } else if (pos === 6) {
            x = -sz;
            y += (off * 6) / 4 + off1;
        } else if (pos === 7) {
            deg = -60;
            x = -(sz * 5) / 4 - off3;
            y += (off * 5) / 4 - off2;
        } else if (pos === 9) {
            deg = 120;
            x = -sz / 4 - off3;
            y += off / 4 - off2;
        }

        return `translate(${x}px, ${y}px) rotate(${deg}deg)`;
    });
</script>

<div class="arrow-target" style="width: {width}px; transform: {transform};">
    <div class="content">
        <div class="circle"></div>
        <div class="arrow"></div>
    </div>
</div>

<style>
    .arrow-target {
        grid-area: 1/1;
        place-self: start center;
        display: grid;
        z-index: 3;
        place-content: center;
        aspect-ratio: 1;
        border-radius: 50%;
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

    .content {
        display: grid;
        width: 24px;
        aspect-ratio: 1;
    }

    .arrow {
        grid-area: 1/1;
        clip-path: polygon(0% 50%, 60% 15%, 60% 85%);
        background: #c9bd89;
    }

    .circle {
        grid-area: 1/1;
        place-self: center end;
        border-radius: 50vh;
        width: 15px;
        height: 6px;
        background: #c9bd89;
    }
</style>
