<script>
    import { X } from './const';
    import { _prompt } from './state.svelte';
    import { isAppleDevice, post } from './utils';
    import imgX from '$lib/images/X.webp';

    const { op } = $props();

    let scale = $state(1);
    const x = $derived(op.label === X);
    const style = $derived(`transform: scale(${scale})`);
    const apple = isAppleDevice();

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
    class={[`button-base no-highlight button ${apple ? 'apple' : ''} gradient-gold`, { x }]}
    style={`${op.style}; ${style}`}
    onpointerdown={() => (scale = 0.8)}>
    {#if x}
        <img src={imgX} alt="X" width={13} />
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

    .button:hover {
        filter: sepia(1);
    }

    .apple {
        font-weight: 500;
    }

    /* .text-only {
        background: none;
        color: var(--gold);
        font-size: 17px;
    } */

    .x {
        width: 36px;
        padding-bottom: 1px;
        font-weight: normal;
    }
</style>
