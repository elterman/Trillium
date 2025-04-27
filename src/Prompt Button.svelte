<script>
    import { X } from './const';
    import { _prompt } from './state.svelte';
    import { post } from './utils';

    const { op } = $props();

    let scale = $state(1);
    const x = $derived(op.label === X);
    const style = $derived(`transform: scale(${scale})`);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== op.label) {
                return;
            }

            if (scale < 1) {
                scale = 1;
            } else {
                post(op.onClick);
                _prompt.opacity = 0;
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div
    id={op.label}
    class={['button-base no-highlight button gradient-gold', { x }]}
    style={`${op.style}; ${style}`}
    onpointerdown={() => (scale = 0.8)}>
    {op.label}
</div>

<style>
    .button {
        cursor: pointer;
        height: 36px;
        font-size: calc(min(6dvw, 20px));
        border-radius: 50vh;
        box-sizing: border-box;
        padding: 0px 15px 3px;
        font-family: 'Playfair Italic';
        font-weight: bold;
    }

    .button:hover {
        filter: sepia(1);
    }

    /* .text-only {
        background: none;
        color: var(--gold);
        font-size: 17px;
    } */

    .x {
        aspect-ratio: 1;
        padding: 0;
    }
</style>
