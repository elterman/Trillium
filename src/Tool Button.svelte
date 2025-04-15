<script>
    import { post } from './utils';

    const { id, src, width = 44, disabled, onClick } = $props();

    let scale = $state(1);
    let timer3 = $state(false);

    const classes = $derived(['button-base no-highlight button gradient-gold', { disabled }]);
    const style = $derived(`width: ${width}px; height: ${width}px; transform: scale(${scale})`);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== id) {
                return;
            }

            if (e.propertyName === 'opacity' || e.propertyName === 'background-color' || e.propertyName === 'filter') {
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

    const onPointerDown = () => {
        if (timer3) {
            return;
        }

        scale = 0.7;

        timer3 = post(() => (timer3 = null), 500);
    };
</script>

<div {id} class={classes} onpointerdown={onPointerDown} {style}>
    <img class="img" {src} alt="" {width} />
</div>

<style>
    .button {
        place-self: center;
        display: grid;
        place-items: center;
        border-radius: 25%;
        transition:
            all 0.3s,
            transform 0.1s;
    }

    .button:hover {
        filter: sepia(1);
    }

    .disabled {
        cursor: initial;
        pointer-events: none;
        background: #888888;
    }

    .button:focus {
        outline: none !important;
    }

    .img {
        grid-area: 1/1;
        filter: invert(1);
    }
</style>
