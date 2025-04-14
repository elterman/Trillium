<script>
    import { fade } from 'svelte/transition';
    import { DAILY } from './const';
    import { ss } from './state.svelte';
    import { dayOfYear } from './shared.svelte';
    import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';

    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);

    const timeToMidnight = () => {
        const now = new Date();
        const midnight = new Date(now.getTime());
        midnight.setHours(24, 0, 0, 0); // next midnight
        const ms = midnight.getTime() - now.getTime();

        const s = Math.floor((ms / 1000) % 60);
        const m = Math.floor((ms / (1000 * 60)) % 60);
        const h = Math.floor(ms / (1000 * 60 * 60));
        return { h, m, s };
    };

    let message = $state();

    $effect(() => {
        if (!DAILY) {
            return;
        }

        const timer = setInterval(() => {
            if (!ss.day) {
                return;
            }

            const doy = dayOfYear();

            if (ss.day === doy) {
                const { h, m, s } = timeToMidnight();
                hours = h;
                minutes = m;
                seconds = s;
            } else {
                clearInterval(timer);
                message = 'Restart to play today\'s puzzle.';
            }
        }, 1000);
    });
</script>

{#if DAILY && ss.over}
    {#if hours || minutes || seconds}
        <div class="countdown" transition:fade>
            <span>Next puzzle in  </span>
            <NumberFlowGroup>
                <div class="group">
                    <NumberFlow value={hours} format={{ minimumIntegerDigits: 2 }} />
                    <NumberFlow prefix=":" value={minutes} format={{ minimumIntegerDigits: 2 }} />
                    <NumberFlow prefix=":" value={seconds} format={{ minimumIntegerDigits: 2 }} />
                </div>
            </NumberFlowGroup>
        </div>
    {:else}
        <div class="countdown" transition:fade>{message}</div>
    {/if}
{/if}

<style>
    .countdown {
        grid-area: 3/1;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        place-self: end center;
        transform: translateY(13px);
        color: #f0f8ff;
        font-family: Poppins;
        font-size: 15px;
    }

    .group {
        display: grid;
        grid-auto-flow: column;
        font-family: Roboto Mono;
    }
</style>
