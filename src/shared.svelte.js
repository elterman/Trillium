import { dict4 } from '$lib/dicts/dict4';
import { pool } from '$lib/dicts/pool';
import { cloneDeep, sample } from 'lodash-es';
import { APP_STATE, CHEER_BEST_SCORE, CHEER_EXCELLENT, CHEER_GOOD_JOB, CHEER_OUTSTANDING, CHEER_TRANSCENDENT, DAILY, EDGES, PROMPT_PLAY_AGAIN, SECTIONS } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { iofpos, posofi, post } from './utils';

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

    let prompt = PROMPT_PLAY_AGAIN;

    if (ss.surrender) {
        _sound.play('cluck');
    } else {
        const cheer = () => {
            if (ss.steps < 6) {
                prompt = CHEER_TRANSCENDENT;
            } else if (ss.steps < 11) {
                prompt = CHEER_OUTSTANDING;
            } else if (ss.steps < 21) {
                prompt = CHEER_EXCELLENT;
            } else {
                prompt = CHEER_GOOD_JOB;
            }
        };

        if (!ss.replay) {
            _stats.plays += 1;
            _stats.total_steps += ss.steps;
        }

        if (!ss.replay && (ss.steps < _stats.best || _stats.best === 0)) {
            _stats.best = ss.steps;

            if (_stats.plays > 1) {
                prompt = CHEER_BEST_SCORE;
            } else {
                cheer();
            }
        } else {
            cheer();
        }
    }

    delete ss.replay;

    post(() => doOver(prompt), 500);
};

export const secondDot = (dot) => dot < 9 ? dot + 1 : 1;

const randomPuzzle = () => {
    const pickWords = () => {
        let w1, w2, w3;

        do {
            do w1 = sample(dict4); while (w1[0] == w1[3]);

            let dict = dict4.filter(w => w[0] === w1[3]);
            do w2 = sample(dict); while (w2[0] === w2[3]);

            dict = dict4.filter(w => w[0] === w1[0] && w[3] === w2[3]);
            w3 = sample(dict);
        } while (!w1 || !w2 || !w3);

        return [w1, w2, w3];
    };

    ss.words = pickWords();
    // const letters = shuffle(ss.words[0].concat(ss.words[1].slice(1, 4)).concat(ss.words[2].slice(1, 3)));

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

const pickDaily = () => {
    const doy = dayOfYear();
    const daily = pool[doy - 1];

    ss.cells = [];

    ss.words = [
        [daily[0], daily[2], daily[4]].join(''),
        [daily[6], daily[8], daily[10]].join(''),
        [daily[12], daily[14], daily[16]].join('')
    ];

    for (let i = 0; i < daily.length - 1; i += 2) {
        const char = daily[i];
        const ix = daily[i + 1];

        const home = posofi(i / 2);
        const pos = posofi(ix);

        ss.cells.push({ char, home, pos });
    }
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
    delete ss.surrender;

    persist();
};

export const onResetStats = () => {
    // makePool();

    if (_stats.plays === 0) {
        return;
    }

    _stats.plays = 0;
    _stats.best = _stats.total_steps = 0;
    persist();

    _stats.reset = true;
    post(() => delete _stats.reset, 1500);
};

export const makePool = () => {
    const pool = [];

    for (let i = 0; i < 366; i++) {
        randomPuzzle();

        const daily = ss.cells.map((cell) => `${cell.char}${iofpos(cell.pos.row, cell.pos.col)}`).join('');
        pool.push(daily);
    }

    return pool;
};

export const persist = (statsOnly = false) => {
    const json = statsOnly ? { ..._stats } :
        {
            ..._stats, day: ss.day || 0, cells: ss.cells, steps: ss.steps,
            replay: ss.replay, initial: ss.initial
        };

    localStorage.setItem(APP_STATE, JSON.stringify(json));
};

export const findCell = (pos) => ss.cells.find((cell) => cell.pos === pos);

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
    for (let i=0; i < 9; i++) {
        const char = ss.cells[i].char;
        const cell = findCell(i + 1);

        if (cell.char !== char) {
            return false;
        }
    }

    return true;
};

export const dayOfYear = () => {
    const date = new Date();
    const year = date.getFullYear();
    const day = (Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000;

    return day;
};

export const swapCells = (pos1, pos2) => {
    const cell1 = findCell(pos1);
    const cell2 = findCell(pos2);

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
