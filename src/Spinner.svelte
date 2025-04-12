<script>
    const { height = 62 } = $props();
</script>

<div class="spinner" style="height: {height}px">
    {#snippet dot(width, x, y)}
        {@const scale = height / 62}
        <div class="dot" style="width: {width * scale}px; transform: translate({x * scale}px, {y * scale}px)"></div>
    {/snippet}

    {@render dot(12, 0, -25)}
    {@render dot(11, 18, -18)}
    {@render dot(10, 25, 0)}
    {@render dot(9, 18, 18)}
    {@render dot(8, 0, 25)}
    {@render dot(7, -18, 18)}
    {@render dot(6, -25, 0)}
    {@render dot(5, -18, -18)}
</div>

<style>
    .spinner {
        /* background: #ffffff40; */
        z-index: 1;
        display: grid;
        aspect-ratio: 1;
        animation: spinner 2s infinite linear;
    }

    .dot {
        grid-area: 1/1;
        place-self: center;
        box-sizing: border-box;
        border-radius: 50%;
        aspect-ratio: 1;
        background: #80bfff;
    }

    @keyframes spinner {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }
</style>
