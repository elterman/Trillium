import { PROMPT_PLAY_AGAIN, START_PAGE } from './const';

export const ss = $state({
    page: START_PAGE,
    discovered: [],
    steps: 0,
});

export const _prompt = $state({
    id: PROMPT_PLAY_AGAIN,
    opacity: 1,

    set: (id) => {
        _prompt.id = id;
        _prompt.opacity = id ? 1 : 0;
    }
});

export const _stats = $state({
    steps: 0,
    plays: 0,
    total_steps: 0,
    best: 0,
    ave: () => _stats.plays ? Math.round(_stats.total_steps / _stats.plays) : 0,
});
