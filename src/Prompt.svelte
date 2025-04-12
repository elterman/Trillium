<script>
    import { Motion } from 'svelte-motion';
    import { DAILY, PROMPT_PLAY_AGAIN, PROMPT_RESET_STATS, PROMPT_SURRENDER, X, YOU_GAVE_UP, YOU_GAVE_UP_STATS_RESET } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { onResetStats, onStart } from './shared.svelte';
    import { _prompt, _stats, ss } from './state.svelte';

    const label = $derived(_prompt.id);
    const cheer = $derived(label.endsWith('!'));

    const onAnimationComplete = () => {
        if (_prompt.opacity == 0) {
            _prompt.set(ss.over ? PROMPT_PLAY_AGAIN : null);
        }
    };

    const onSurrender = () => {
        ss.surrender = _stats.plays && !ss.replay ? YOU_GAVE_UP_STATS_RESET : YOU_GAVE_UP;

        for (const cell of ss.cells) {
            cell.pos = cell.home;
        }

        if (!ss.replay) {
            onResetStats();
        }
    };
</script>

{#if label}
    <Motion
        animate={{ opacity: _prompt.opacity, transform: `scale(${_prompt.opacity})` }}
        transition={{ type: 'spring', damping: 15 }}
        {onAnimationComplete}
        let:motion>
        <div class="prompt" use:motion>
            {#if label === PROMPT_PLAY_AGAIN}
                {#if DAILY}
                    <PromptPanel ops={[{ label: 'Replay this puzzle?', onClick: () => onStart(true) }]} />
                {:else}
                    <PromptPanel
                        ops={[
                            { label: 'Replay?', onClick: () => onStart(true) },
                            { label: 'Play new?', onClick: onStart },
                        ]} />
                {/if}
            {:else if label === PROMPT_SURRENDER}
                <PromptPanel ops={[{ label, onClick: onSurrender }, { label: X }]} />
            {:else if label === PROMPT_RESET_STATS}
                <PromptPanel ops={[{ label, onClick: onResetStats }, { label: X }]} />
            {:else}
                <PromptPanel ops={[{ label }]} readOnly={cheer} />
            {/if}
        </div>
    </Motion>
{/if}

<style>
    .prompt {
        grid-area: 4/1;
        place-self: center;
        transform: scale(0);
        z-index: 1;
    }
</style>
