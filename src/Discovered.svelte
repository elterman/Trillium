<script>
    import { fade } from 'svelte/transition';
    import { _prompt, ss } from './state.svelte';
</script>

<div class='discovered {_prompt.id || ss.surrender ? 'transparent' : ''}'>
    {#each ss.words as word, i (i)}
        <div class='word {ss.discovered.includes(word) ? '' : 'hidden'}' transition:fade={{ delay: 1 }}>
            {word}
        </div>
    {/each}
</div>

<style>
    .discovered {
        grid-area: 4/1;
        display: grid;
        grid-auto-flow: column;
        grid: auto / 1fr 1fr 1fr;
        height: calc(min(9dvw, 40px));
        transition: opacity 0.3s;
    }

    .word {
        width: 90%;
        box-sizing: border-box;
        font-family: Arial;
        font-size: 14px;
        font-weight: bold;
        border-radius: 50vh;
        height: 22px;
        background: #80D880;
        display: grid;
        place-content: center;
        place-self: center;
        transition: background-color 1s, border-width 1s, color 1s, border-color 1s;
    }

    .hidden {
        background: none;
        color: transparent;
        border: 1px solid #80bfff;
    }

    .transparent {
        opacity: 0;
    }
</style>
