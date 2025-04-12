<script>
    import { GREEN, YELLOW } from './const';
    import { tapOrClick } from './utils';

    const span = '<span style=\'margin-top: 10px\'>';
    const unspan = '</span>';
    const hi = '<span style=\'background: #ffffff40;; padding: 0 2px;\'>';

    const content = `<span>Rearrange the grid to reveal the ${hi}three horizontal 3-letter words${unspan} in as few steps as possible.${unspan}${span}•  ${tapOrClick()} a ${hi}dot between cells${unspan} to select a ${hi}pair of adjacent letters${unspan} (vertically or horizontally).${unspan}${span}•  Select ${hi}another pair to swap${unspan} their positions. Note that the two pairs can have ${hi}different orientation${unspan}. ${unspan}${span}•  Use ${hi}arrows to scroll${unspan} columns or rows.${unspan}${span}The solution words must be arranged ${hi}alphabetically${unspan}. Correctly placed words appear in <span style='background: ${GREEN}; padding: 0 2px'>GREEN</span>. Misplaced words appear in <span style='background: ${YELLOW}; padding: 0 2px'>YELLOW</span>.${unspan}`;
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
        background: #80bfff;
        border: 3px solid var(--background);
        width: calc(min(90dvw, 340px));
    }
</style>
