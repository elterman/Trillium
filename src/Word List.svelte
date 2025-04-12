<script>
    import { fade } from 'svelte/transition';
    import { clientRect, scrollClass } from './utils';
    import { dict3 } from '$lib/dicts/dict3';

    let style = $state('');
    const dict = dict3.sort();

    $effect(() => {
        const onResize = () => {
            const r = clientRect('.game-page');
            style = `left: ${r.x - 25}px; top: ${r.y}px; width: ${r.width + 50}px; height: ${r.height - 70}px;`;
        };

        onResize();

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });

    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
</script>

<div class="wordlist" {style} transition:fade={{ duration: 200 }}>
    <div class="content {scrollClass()}" tabindex="-1">
        {#each ABC as ch (ch)}
            {@const words = dict.filter((word) => word.startsWith(ch))}
            {#if words.length}
                <div class="section">
                    <div class="section-header">{ch}</div>
                    <div class="section-content">
                        {words.filter((word) => word.startsWith(ch)).join(' ')}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .wordlist {
        position: absolute;
        z-index: 3;
        justify-self: center;
        display: grid;
        padding: 18px 10px 18px;
        box-sizing: border-box;
        font-family: Poppins;
        font-size: 14px;
        background: #000000c0;
        border: 2px solid #80bfff80;
        border-radius: 10px;
        backdrop-filter: blur(10px);
    }

    .content {
        display: grid;
        align-content: start;
        gap: 5px;
    }

    .section {
        display: grid;
        grid: auto / auto 1fr;
        gap: 20px;
    }

    .section-header {
        grid-area: 1/1;
        display: grid;
        place-content: center;
        background: var(--blue);
        font-weight: bold;
        border-radius: 50%;
        width: 20px;
        aspect-ratio: 1;
        place-self: start;
    }

    .section-content {
        grid-area: 1/2;
        color: var(--blue);
        font-family: Roboto Mono;
    }

    .root-scroll {
        display: grid;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .root-scroll::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    .root-scroll::-webkit-scrollbar-thumb:hover {
        /* background: #fff5; */
        background: #80bfffd0;
    }

    .root-scroll::-webkit-scrollbar-thumb {
        border-radius: 50vw;
        /* background: #fff4; */
        background: #80bfffb0;
    }

    /* .root-scroll::-webkit-scrollbar-track {
        background: #fff2;
    } */

    .root-scroll::-webkit-scrollbar-track:hover {
        background: #ffffff05;
    }

    .root-scroll-mobile::-webkit-scrollbar {
        width: 2px;
        height: 2px;
    }

    .root-scroll-mobile::-webkit-scrollbar-thumb {
        border-radius: 1px;
    }
</style>
