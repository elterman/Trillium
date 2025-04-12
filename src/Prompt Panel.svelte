<script>
    import PromptButton from './Prompt Button.svelte';

    const { ops, readOnly = false } = $props();
</script>

<div class='prompt-panel {readOnly ? 'read-only' : ''}'>
    {#each ops as op, i (i)}
        <PromptButton {op} />
    {/each}
</div>

<style>
    .prompt-panel {
        display: grid;
        grid-auto-flow: column;
        gap: 10px;
    }

    .read-only {
        pointer-events: none;
    }
</style>
