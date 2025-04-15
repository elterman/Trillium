<script>
    import { fade } from 'svelte/transition';
    import { clientRect, scrollClass } from './utils';
    import { dict4 } from '$lib/dicts/dict4';

    let style = $state('');
    const dict = dict4.sort();

    $effect(() => {
        const onResize = () => {
            const r = clientRect('.game-page');
            style = `left: ${r.x - 5}px; top: ${r.y}px; width: ${r.width + 10}px; height: ${r.height - 70}px;`;
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
        border: 2px solid #ffe4ad80;
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
        background: var(--gold);
        opacity: 0.7;
        font-weight: bold;
        border-radius: 50%;
        width: 20px;
        aspect-ratio: 1;
        place-self: start;
    }

    .section-content {
        grid-area: 1/2;
        color: var(--gold);
        font-family: Roboto Mono;
    }
</style>
