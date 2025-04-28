import { APP_DAILY_STATE, APP_STATE, PROMPT_PLAY_AGAIN, START_PAGE } from './const';

export const ss = $state({
    page: START_PAGE,
    discovered: [],
    steps: 0,
    score: () => ss.steps - ss.par,
    appKey: () => ss.daily ? APP_DAILY_STATE : APP_STATE,
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
    total_score: 0,
    best: 0,
    ave: () => _stats.plays ? Math.round(_stats.total_score / _stats.plays) : 0,
});
