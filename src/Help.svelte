<script>
    import { GREEN, YELLOW } from './const';
    import { scrollClass, tapOrClick } from './utils';
    import Trillium from '$lib/images/Trillium.webp';

    const span = '<span style=\'margin: 10px 10px 0 0\'>';
    const unspan = '</span>';
    const hi = '<span style=\'color: lightgreen;\'>';
    const colorStyle = ' padding: 0 2px; color: black; text-shadow: none;';

    const content = `<span style='margin-right: 10px;'>Rearrange letters to reveal ${hi}three connected 4-letter words${unspan} in as few steps as possible. In this example, the words are TIDE, ECHO, and TRIO:${unspan}<img src=${Trillium} width=80 style='place-self: center; margin-top: 10px;'>${span}The words must must read from ${hi}left to right${unspan}.${unspan}${span}•  ${tapOrClick()} a ${hi}dot between cells${unspan} to select a ${hi}pair of adjacent letters${unspan}.${unspan}${span}•  Select ${hi}another pair to swap${unspan} their positions.${unspan}${span}•  Use ${hi}arrows to scroll${unspan} along the edges of the puzzle.${unspan}${span} Correctly placed unscrambled words appear in <span style='background: ${GREEN};${colorStyle}'>GREEN</span>. Misplaced words appear in <span style='background: ${YELLOW};${colorStyle}'>YELLOW</span>.${unspan}`;
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
        max-height: 460px;
        color: var(--gold);
        text-shadow: 2px 2px 2px black;
    }

    .content {
        display: grid;
        align-content: start;
    }
</style>
