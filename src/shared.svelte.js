import { dict4 } from '$lib/dicts/dict4';
import { pool } from '$lib/dicts/pool';
import { cloneDeep, random, sampleSize } from 'lodash-es';
import { APP_STATE, COLS, DAILY, CHEER_BEST_SCORE, CHEER_EXCELLENT, CHEER_GOOD_JOB, CHEER_OUTSTANDING, PROMPT_PLAY_AGAIN, CHEER_TRANSCENDENT, ROWS } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { iofpos, posofi, post, samePos } from './utils';

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

export const swapPairs = (p1, p2) => {
    const swap = (cell1, cell2) => {
        const p = { ...cell1.pos };
        cell1.pos = { ...cell2.pos };
        cell2.pos = p;
    };

    const cell1 = findCell({ row: p1.r1, col: p1.c1 });
    const cell3 = findCell({ row: p2.r1, col: p2.c1 });
    swap(cell1, cell3);

    const cell2 = findCell({ row: p1.r2, col: p1.c2 });
    const cell4 = findCell({ row: p2.r2, col: p2.c2 });
    swap(cell2, cell4);
};

const randomPuzzle = () => {
    const hasAnagrams = () => {
        const wordPairs = () => {
            const words = ss.words;

            const count = words.length;
            const pairs = [];

            for (let i = 0; i < count; i++) {
                for (let j = 0; j < count; j++) {
                    if (words[i] !== words[j]) {
                        pairs.push([words[i], words[j]]);
                    }
                }
            }

            return pairs;
        };

        const pairs = wordPairs();

        for (const p of pairs) {
            const w1 = Array.from(p[0]).sort().join('');
            const w2 = Array.from(p[1]).sort().join('');

            if (w1 === w2) {
                return true;
            }
        }

        return false;
    };

    do {
        ss.words = sampleSize(dict4, 3).sort();
        const letters = [...ss.words.join('')];

        ss.cells = letters.map((char, i) => {
            const { row, col } = posofi(i);
            return { char, home: { row, col }, pos: { row, col } };
        });

        const wordRevealed = () => {
            for (let i = 0; i < ROWS; i++) {
                if (isWordRevealedAt(i + 1)) {
                    return true;
                }
            }

            return false;
        };

        do {
            for (let i = 0; i < 4; i++) {
                let p1, p2;

                if (i % 2 === 0) {
                    let r1 = random(1, ROWS);
                    let c1 = random(1, COLS - 1);
                    p1 = { r1, c1, r2: r1, c2: c1 + 1 };

                    r1 = r1 < ROWS ? r1 + 1 : 1;
                    c1 = random(1, COLS - 1);
                    p2 = { r1, c1, r2: r1, c2: c1 + 1 };
                } else {
                    let c1 = random(1, COLS);
                    let r1 = random(1, ROWS - 1);
                    p1 = { r1, c1, r2: r1 + 1, c2: c1 };

                    c1 = c1 < COLS ? c1 + 1 : 1;
                    r1 = random(1, ROWS - 1);
                    p2 = { r1, c1, r2: r1 + 1, c2: c1 };
                }

                swapPairs(p1, p2);
            }
        } while (wordRevealed()); // ensure no words are revealed after swapping pairs
    } while (hasAnagrams()); // ensure no anagrams in the generated words
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
    delete ss.pair1;
    delete ss.pair2;

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
    let json = statsOnly ? { ..._stats } :
        {
            ..._stats, day: ss.day || 0, cells: ss.cells, steps: ss.steps, discovered: ss.discovered,
            replay: ss.replay, initial: ss.initial
        };

    localStorage.setItem(APP_STATE, JSON.stringify(json));
};

export const findCell = (pos) => ss.cells.find((cell) => samePos(pos, cell.pos));

const wordAt = (row) => {
    let word = '';

    for (let col = 1; col <= COLS; col++) {
        const cell = findCell({ row, col });
        word += cell.char;
    }

    return word;
};

export const isWordRevealedAt = (row) => {
    const word = wordAt(row);
    return ss.words.includes(word) ? word : null;
};

export const log = (value) => console.log($state.snapshot(value));

export const isHorz = pair => pair.r1 === pair.r2;

export const isOrtho = () => ss.pair2 && !ss.pair2?.shift && isHorz(ss.pair1) !== isHorz(ss.pair2);

export const inPlace = (word, row) => row - 1 === ss.words.indexOf(word);

export const isSolved = (silent = false) => {
    let solved = 0;

    for (let row = 1; row <= ROWS; row++) {
        const word = isWordRevealedAt(row);

        if (!word) {
            continue;
        }

        if (!ss.discovered.includes(word)) {
            ss.discovered.push(word);

            if (!ss.surrender && !silent) {
                _sound.play('won', { rate: 3 });
            }
        }

        if (inPlace(word, row)) {
            solved += 1;
        }
    }

    return solved === ROWS;
};

export const dayOfYear = () => {
    const date = new Date();
    const year = date.getFullYear();
    const day = (Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000;

    return day;
};
