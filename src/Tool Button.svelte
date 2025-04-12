<script>
    import { fade } from 'svelte/transition';
    import { post } from './utils';

    const { id, src, width = 34, disabled, onClick, tooltip } = $props();

    let scale = $state(1);
    let tip = $state(false);
    let timer1 = $state(null);
    let timer2 = $state(null);
    let timer3 = $state(false);

    const classes = $derived(['button-base no-highlight button', { disabled }]);
    const style = $derived(`width: ${width}px; height: ${width}px; transform: scale(${scale})`);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== id) {
                return;
            }

            if (e.propertyName === 'opacity' || e.propertyName === 'background-color') {
                return;
            }

            if (scale < 1) {
                scale = 1;
            } else {
                post(onClick);
            }

            if (timer1 || timer2) {
                return;
            }

            timer1 = post(() => {
                timer1 = null;
                tip = true;

                timer2 = post(() => {
                    timer2 = null;
                    tip = false;
                }, 1500);
            });
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
    {#if tooltip && tip}
        <div class="tooltip" transition:fade>
            <span class="gradient-text">{tooltip}</span>
        </div>
    {/if}
    <img class="img" {src} alt="" {width} />
</div>

<style>
    .button {
        place-self: center;
        display: grid;
        place-items: center;
        background: #80bfff;
        border-radius: 25%;
        transition:
            all 0.3s,
            transform 0.1s;
    }

    .button:hover {
        background: #f0f8ff;
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

    .tooltip {
        grid-area: 1/1;
        display: grid;
        border: none;
        background: #000000c0;
        font-family: Poppins;
        font-size: 12px;
        padding: 8px 12px 5px;
        border-radius: 50vh;
        transform: translateY(-190%);
        /* text-wrap-mode: nowrap; */
    }
</style>
