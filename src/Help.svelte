<script>
    import Example from '$lib/images/Example.webp';
    import { scrollClass, tapOrClick } from './utils';

    const span = '<span style=\'margin: 10px 10px 0 0\'>';
    const hi = '<span style=\'color: lightgreen;\'>';
    const imgStyle = ' width=250 style=\'place-self: center; margin: 20px 4px 0 0;\'';
    const ul = '<ul style=\'margin: 15px 0 0 0;\'>';
    const li = '<li style=\'margin: 5px 0 0 -20px;\'>';

    const content = `<span style='margin-right: 10px;'>Restore order in the Trillium!</span>${span}Rearrange letters to reveal ${hi}three connected 4-letter words</span> in as few steps as possible. In this example, the words are FANG, GLUE, and FLEE:</span><img src=${Example} ${imgStyle}>${ul}${li}${tapOrClick()} a ${hi}dot</span> between two ${hi}adjacent letters to swap</span> them.</li>${li}${tapOrClick()} a ${hi}star</span> to ${hi}swap two 3-letter blocks</span>.</li>${li}The words must read from ${hi}left to right</span>.</li></ul>`;
</script>

<div class="help">
    <div class="content {scrollClass()}" tabindex="-1">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html content}
    </div>
</div>

<style>
    .help {
        grid-area: 2/1;
        justify-self: center;
        display: grid;
        border-radius: 20px;
        padding: 18px 10px 18px 18px;
        box-sizing: border-box;
        font-family: Poppins;
        background: #00000020;
        border: 2px solid #ffe4ad80;
        width: calc(min(90dvw, 340px));
        max-height: 470px;
        color: var(--gold);
        filter: drop-shadow(0 0 3px black);
    }

    .content {
        display: grid;
        align-content: start;
    }
</style>
