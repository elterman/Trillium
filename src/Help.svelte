<script>
    import { GREEN, YELLOW } from './const';
    import { tapOrClick } from './utils';

    const span = '<span style=\'margin-top: 10px\'>';
    const unspan = '</span>';
    const hi = '<span style=\'color: lightgreen;\'>';

const content = `<span>Rearrange the grid to reveal the ${hi}three connected 4-letter words${unspan} in as few steps as possible. In this example, the words are TIDE, ECHO, and TRIO:${unspan}${span}The solution words must must read ${hi}from left to right${unspan}.${unspan}${span}•  ${tapOrClick()} a ${hi}dot between cells${unspan} to select a ${hi}pair of adjacent letters${unspan}.${unspan}${span}•  Select ${hi}another pair to swap${unspan} their positions.${unspan}${span}•  Use ${hi}arrows to scroll${unspan} the edges of the puzzle.${unspan}${span} Unscrambled words appear in <span style='background: ${GREEN}; padding: 0 2px; color: black;'>GREEN</span> if placed correctly. Otherwise, they appear in <span style='background: ${YELLOW}; padding: 0 2px; color: black;'>YELLOW</span>.${unspan}`;
</script>

<div class="help">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html content}
</div>

<style>
    .help {
        grid-area: 2/1;
        justify-self: center;
        display: grid;
        border-radius: 20px;
        padding: 18px;
        box-sizing: border-box;
        font-family: Poppins;
        background: #00000020;
        border: 2px solid var(--gold);
        width: calc(min(90dvw, 340px));
        color: var(--gold);
    }
</style>
