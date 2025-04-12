<script>
    import Dictionary from '$lib/images/Dictionary.webp';
    import Help from '$lib/images/Help.webp';
    import ResetStats from '$lib/images/Reset Stats.webp';
    import SoundOff from '$lib/images/Sound Off.webp';
    import SoundOn from '$lib/images/Sound On.webp';
    import Surrender from '$lib/images/Surrender.webp';
    import { PROMPT_RESET_STATS, PROMPT_SURRENDER, START_PAGE } from './const';
    import { _sound } from './sound.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const onHelp = () => {
        ss.page = START_PAGE;
    };

    const onDictionary = () => {
        ss.showDictionary = !ss.showDictionary;

        if (_prompt.id == PROMPT_SURRENDER || _prompt.id == PROMPT_RESET_STATS) {
            _prompt.opacity = 0;
        }
    };

    const onSurrender = () => {
        if (_prompt.id == PROMPT_SURRENDER) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');

        _prompt.set(PROMPT_SURRENDER);
    };

    const onResetStats = () => {
        if (_prompt.id == PROMPT_RESET_STATS) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_RESET_STATS);
    };

    const onSound = () => {
        _sound.on = !_sound.on;

        if (_sound.on) {
            _sound.play('won', { rate: 4 });
        }
    };
</script>

<div class="toolbar">
    <ToolButton id='tb-help' src={Help} onClick={onHelp} />
    <ToolButton id='tb-wordlist' src={Dictionary} onClick={onDictionary} />
    <ToolButton id='tb-surrender' src={Surrender} onClick={onSurrender} disabled={ss.over || ss.surrender || ss.showDictionary} />
    <ToolButton id='tb-reset-stats' src={ResetStats} onClick={onResetStats} disabled={_stats.plays === 0 || ss.showDictionary} />
    <ToolButton id='tb-sound' src={_sound.on ? SoundOn : SoundOff} onClick={onSound} />
</div>

<style>
    .toolbar {
        grid-area: 5/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        place-content: center;
        gap: 10px;
    }
</style>
