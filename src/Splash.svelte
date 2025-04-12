<script>
    import { fade } from 'svelte/transition';
    import { windowSize } from './utils';
    import BMG from '$lib/images/BMG.webp';

    let bmgWidth = $state(0);
    let classes = $state('splash');

    $effect(() => {
        let { x: wx, y: wy } = windowSize();
        bmgWidth = Math.min(300, Math.min(wx, wy) * 0.6);
    });

    const onPointerDown = () => {
        localStorage.clear();
        classes = 'splash dark';
    };
</script>

<div class={classes} out:fade={{ duration: 300 }} onpointerdown={onPointerDown}>
    <img src={BMG} alt='' width={bmgWidth} />
</div>

<style>
    .splash {
        grid-area: 1/1;
        display: grid;
        background: #8a0000;
        background-image: radial-gradient(transparent, black 100%);
        place-content: center;
        color: #f0f8ff;
        z-index: 300;
        transition: background-color 0.3s;
    }

    .dark {
        background-color: #500000;
    }
</style>
