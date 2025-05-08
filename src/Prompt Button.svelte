<script>
    import { X } from './const';
    import { _prompt } from './state.svelte';
    import { isAppleDevice, post } from './utils';
    import imgX from '$lib/images/X.webp';

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

    const apple = isAppleDevice();
</script>

<div
    id={op.label}
    class={[`button-base no-highlight button ${apple ? 'apple' : ''} gradient-gold`, { x }]}
    style={`${op.style}; ${style}`}
    onpointerdown={() => (scale = 0.8)}>
    {#if x}
        <img src={imgX} alt="X" width={14} />
    {:else}
        {op.label}
    {/if}
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

    .apple {
        font-weight: 500;
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
        padding: 0 0 1px 0;
        font-weight: normal;
    }
</style>
