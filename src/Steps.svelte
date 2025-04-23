<script>
    import NumberFlow from '@number-flow/svelte';
    import { fade } from 'svelte/transition';
    import { ss } from './state.svelte';

    let flip = $state(false);
    let par = $state(null);
    const parMessage = $derived.by(() => {
        if (par === null) {
            return '';
        }

        return `  –  ${par === 0 ? 'even' : `${Math.abs(par)} ${par > 0 ? 'over' : 'under'}`} par`;
    });

    $effect(() => {
        flip = ss.over;

        if (!ss.over) {
            par = null;
        }

        const onTransitionEnd = (e) => {
            if (e.target.id !== 'steps') {
                return false;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (flip) {
                flip = false;
                par = ss.steps - ss.par;
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div class="steps">
    {#if ss.surrender}
        <div class="message" transition:fade>
            {ss.surrender}
        </div>
    {:else}
        <div id="steps" class="flow {flip ? 'flipped' : ''}" transition:fade>
            <NumberFlow value={ss.steps} />
            <span>{` swap${ss.steps === 1 ? '' : 's'}`}</span>
            {parMessage}
        </div>
    {/if}
</div>

<style>
    .steps {
        grid-area: 2/1;
        display: grid;
        height: 40px;
        grid-auto-flow: column;
        font-family: 'Playfair Italic';
        font-weight: bold;
        font-size: 25px;
        place-self: center;
        place-items: center;
        color: var(--gold);
    }

    .message {
        grid-area: 1/1;
    }

    .flow {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        transition: linear transform 0.3s;
    }

    .flipped {
        transform: rotateX(90deg);
    }
</style>
