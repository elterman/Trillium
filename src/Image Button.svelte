<script>
    import { post } from './utils';

    const { src, width, onClick, style } = $props();

    let scale = $state(1);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== src) {
                return;
            }

            if (scale < 1) {
                scale = 1;
            } else {
                post(onClick);
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div id={src} class='button-base button' onpointerdown={() => (scale = 0.7)} style='{style}; transform: scale({scale})'>
    <img {src} alt='' {width} />
</div>

<style>
    .button {
        background: none;
        border: none;
        border-color: none;
    }

    .button-base:hover {
        background: none;
    }
</style>
