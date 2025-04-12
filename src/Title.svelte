<script>
    import { BLUE, OFFWHITE } from './const';

    const title = [
        [
            ['T', BLUE],
            ['H', BLUE],
            ['R', BLUE],
            ['E', BLUE],
            ['E', BLUE],
            ['L', OFFWHITE],
            ['O', OFFWHITE],
            ['G', OFFWHITE],
            ['Y', OFFWHITE],
        ],
    ];
</script>

<div class="title">
    {#each title as word, i (i)}
        <div class="row">
            {#each word as letter, i (i)}
                <div class="char" style="background: {letter[1]};">
                    {letter[0]}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    .title {
        grid-area: 1/1;
        display: grid;
        gap: 2px;
    }

    .row {
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        gap: 2px;
    }

    .char {
        display: grid;
        place-content: center;
        font-family: Poppins;
        font-weight: bold;
        width: calc(min(9dvw, 40px));
        height: calc(min(9dvw, 40px));
        font-size: calc(min(5dvw, 24px));
    }
</style>
