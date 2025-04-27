import { dict4 } from '$lib/dicts/dict4';
import { pool } from '$lib/dicts/pool';
import { cloneDeep, sample } from 'lodash-es';
import { APP_STATE, CHEER_BEST_SCORE, CHEER_EXCELLENT, CHEER_GREAT, CHEER_PERFECT, CHEER_PHENOMENAL, CHEER_YOU_DID_IT, DAILY, EDGES, PROMPT_PLAY_AGAIN, SECTIONS } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { post } from './utils';

let over = $state(false);

export const onOver = () => {
    if (over) {
        return;
    }

    over = true;

    const doOver = (prompt) => {
        ss.over = true;

        post(() => {
            ss.flip = false;
            _sound.play('won');

            post(() => {
                _prompt.set(prompt);

                if (prompt !== PROMPT_PLAY_AGAIN) {
                    post(() => {
                        _prompt.set(null);
                        post(() => _prompt.set(PROMPT_PLAY_AGAIN));
                    }, 2000);
                }
            }, 1000);
        }, 300);
    };

    if (ss.surrender) {
        _sound.play('cluck');
    } else {
        const score = ss.score();
        let bestScore = false;

        const cheer = () => {
            if (score < 0) {
                ss.cheer = CHEER_PHENOMENAL;
            } else if (bestScore && _stats.plays > 1) {
                ss.cheer = CHEER_BEST_SCORE;
            } else if (score === 0) {
                ss.cheer = CHEER_PERFECT;
            } else if (score === 1) {
                ss.cheer = CHEER_EXCELLENT;
            } else if (score === 2) {
                ss.cheer = CHEER_GREAT;
            } else {
                ss.cheer = CHEER_YOU_DID_IT;
            }

            post(() => delete ss.cheer, 3000);
        };

        if (!ss.replay) {
            _stats.plays += 1;
            _stats.total_score += score;
        }

        if (!ss.replay && (score < _stats.best || _stats.best === 0)) {
            _stats.best = score;
            bestScore = true;
        }

        post(cheer);
    }

    delete ss.replay;

    post(() => doOver(PROMPT_PLAY_AGAIN), 500);
};

export const secondDot = (dot) => dot < 9 ? dot + 1 : 1;

const randomPuzzle = () => {
    const pickWords = () => {
        let w1, w2, w3;

        do {
            do w1 = sample(dict4); while (w1[0] == w1[3]);

            let dict = dict4.filter(w => w[0] === w1[3]);

            if (dict.length > 0) {
                do w2 = sample(dict); while (w2[0] === w2[3]);

                dict = dict4.filter(w => w[0] === w1[0] && w[3] === w2[3]);
                w3 = sample(dict);
            }
        } while (!w1 || !w2 || !w3);

        return [w1, w2, w3];
    };

    ss.words = pickWords();

    ss.cells = [
        { char: ss.words[0][3], home: 1, pos: 1 },
        { char: ss.words[1][1], home: 2, pos: 2 },
        { char: ss.words[1][2], home: 3, pos: 3 },
        { char: ss.words[2][3], home: 4, pos: 4 },
        { char: ss.words[2][2], home: 5, pos: 5 },
        { char: ss.words[2][1], home: 6, pos: 6 },
        { char: ss.words[0][0], home: 7, pos: 7 },
        { char: ss.words[0][1], home: 8, pos: 8 },
        { char: ss.words[0][2], home: 9, pos: 9 },
    ];

    const wordsRevealed = () => wordRevealedAt(1) || wordRevealedAt(7);

    do {
        let dots = [1, 3, 4, 6, 7, 9, 10, 11, 12];

        for (let i = 0; i < 30; i++) {
            swapCellsAt(sample(dots));
        }

        dots = [2, 5, 8];

        for (let i = 0; i < 10; i++) {
            swapSections(sample(dots));
        }
    } while (wordsRevealed());
};

export const makePool = () => {
    const pool = [];

    for (let i = 0; i < 366; i++) {
        randomPuzzle();

        const daily = ss.cells.map((cell) => `${cell.char}${cell.pos}`).join('');
        pool.push(daily);
    }

    return pool;
};

const pickDaily = () => {
    const doy = dayOfYear();
    const daily = pool[doy - 1];

    // ss.cells = [];

    // ss.words = [
    //     [daily[0], daily[2], daily[4]].join(''),
    //     [daily[6], daily[8], daily[10]].join(''),
    //     [daily[12], daily[14], daily[16]].join('')
    // ];

    // for (let i = 0; i < daily.length - 1; i += 2) {
    //     const char = daily[i];
    //     const ix = daily[i + 1];

    //     const home = posofi(i / 2);
    //     const pos = posofi(ix);

    //     ss.cells.push({ char, home, pos });
    // }

};

export const makePuzzle = () => {
    ss.cells = [];

    post(() => {
        if (DAILY) {
            pickDaily();
        } else if (ss.replay) {
            // replay mode, use the initial scramble to restore the game state
            ss.cells = cloneDeep(ss.initial);
        } else {
            randomPuzzle();
            ss.initial = cloneDeep(ss.cells); // save the initial scramble for replay purposes
        }

        calculatePar();
        persist();
    });
};

export const onStart = (replay = false) => {
    _sound.play('dice');
    over = false;

    if (ss.cells) {
        ss.flip = true;

        if (replay) {
            ss.replay = true;
        }
    } else {
        makePuzzle();
    }

    ss.discovered = [];
    ss.steps = 0;

    delete ss.over;
    delete ss.cheer;
    delete ss.surrender;

    persist();
};

export const onResetStats = () => {
    // makePool();

    if (_stats.plays === 0) {
        return;
    }

    _stats.plays = 0;
    _stats.best = _stats.total_score = 0;
    persist();

    _stats.reset = true;
    post(() => delete _stats.reset, 1500);
};

export const persist = (statsOnly = false) => {
    const json = statsOnly ? { ..._stats } : {
        ..._stats, day: ss.day || 0, cells: ss.cells, steps: ss.steps, replay: ss.replay, initial: ss.initial
    };

    localStorage.setItem(APP_STATE, JSON.stringify(json));
};

export const findCell = (pos, cells = ss.cells) => cells.find((cell) => cell.pos === pos);

const wordAt = (row) => {
    const edge = EDGES[row - 1];

    let word = '';

    for (const p of edge) {
        const cell = findCell(p);
        word += cell.char;
    }

    return word;
};

export const wordRevealedAt = (pos) => {
    for (const row of [1, 2, 3]) {
        const edge = EDGES[row - 1];

        if (!edge.includes(pos)) {
            continue;
        }

        const word = wordAt(row);

        if (ss.words.includes(word)) {
            return { word, row };
        }
    }

    return null;
};

export const log = (value) => console.log($state.snapshot(value));

export const isSolved = () => {
    const words = EDGES.map((edge) => edge.map((p) => findCell(p).char).join(''));

    for (const word of words) {
        if (!dict4.includes(word)) {
            return false;
        }
    }

    calculatePar();

    return true;
};

export const dayOfYear = () => {
    const date = new Date();
    const year = date.getFullYear();
    const day = (Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000;

    return day;
};

export const swapCells = (pos1, pos2, cells = ss.cells) => {
    const cell1 = findCell(pos1, cells);
    const cell2 = findCell(pos2, cells);

    const sum = cell1.pos + cell2.pos;
    cell1.pos = sum - cell1.pos;
    cell2.pos = sum - cell1.pos;
};

export const swapCellsAt = (dot) => {
    let pos1, pos2;

    if (dot === 1 || dot === 3 || dot === 4 || dot === 6 || dot === 7 || dot === 9) {
        pos1 = dot;
        pos2 = dot < 9 ? dot + 1 : 1;
    } else if (dot === 10) {
        pos1 = 2;
        pos2 = 9;
    } else if (dot === 11) {
        pos1 = 3;
        pos2 = 5;
    } else if (dot === 12) {
        pos1 = 6;
        pos2 = 8;
    }

    swapCells(pos1, pos2);
};

export const swapSections = (pos) => {
    const sec1 = SECTIONS[pos === 2 ? 'top' : pos === 5 ? 'right' : 'left'];
    const sec2 = SECTIONS[pos === 2 ? 'right' : pos === 5 ? 'left' : 'top'];

    for (let i = 0; i < 3; i++) {
        swapCells(sec1[i], sec2[i]);
    }
};

const whichSection = (pos) => {
    if (pos === 1 || pos === 2 || pos === 9) {
        return 'top';
    } else if (pos === 3 || pos === 4 || pos === 5) {
        return 'right';
    } else if (pos === 6 || pos === 7 || pos === 8) {
        return 'left';
    }
};

export const calculatePar = () => {
    const cells = ss.initial.map(cell => ({ home: cell.home, pos: cell.pos }));

    let swaps = 0;

    const maybeSwapSections = (pos) => {
        const cell = findCell(pos, cells);
        const posSection = whichSection(cell.pos);
        const homeSection = whichSection(cell.home);

        if (posSection !== homeSection) {
            const sec1 = SECTIONS[posSection];
            const sec2 = SECTIONS[homeSection];

            for (let i = 0; i < 3; i++) {
                swapCells(sec1[i], sec2[i], cells);
            }

            swaps += 1;
        }
    };

    maybeSwapSections(1);
    maybeSwapSections(4);
    maybeSwapSections(7);

    const maybeSwapCells = (pos) => {
        const cell = findCell(pos, cells);

        if (cell.pos !== cell.home) {
            swapCells(cell.pos, cell.home, cells);
            swaps += 1;
        }
    };

    for (const sec in SECTIONS) {
        const section = SECTIONS[sec];

        for (let i = 0; i < section.length; i++) {
            maybeSwapCells(section[i]);
        }
    }

    ss.par = swaps;
};