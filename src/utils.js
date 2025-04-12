import { COLS } from './const';

export const windowSize = () => {
    const d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = e.clientWidth || g.clientWidth,
        y = e.clientHeight || g.clientHeight;

    return { x, y };
};

export const clientRect = selector => {
    const ob = document.querySelector(selector);
    const r = ob?.getBoundingClientRect();

    return r;
};

export const underMouse = (event, selectors) => {
    for (const selector of selectors) {
        const r = clientRect(selector);

        if (!r) {
            continue;
        }

        const x = event.clientX;
        const y = event.clientY;

        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            return true;
        }
    }

    return false;
};

export const focusOnApp = () => {
    document.querySelector('.app')?.focus();
};

export const isAlpha = (char) => /^[a-z]$/i.test(char);

export const isTouchable = () => navigator.maxTouchPoints > 0;

export const tapOrClick = (lower = false) => {
    const verb = isTouchable() ? 'Tap' : 'Click';
    return lower ? verb.toLowerCase() : verb;
};

export const scrollClass = () => `root-scroll ${isTouchable() ? 'root-scroll-mobile' : ''}`;

export const post = (fn, ms) => setTimeout(fn, ms);

export const samePos = (one, two) => one?.row === two.row && one?.col === two.col;

export const samePair = (p1, p2) => {
    if (!p1 || !p2) {
        return false;
    }

    if (samePos({ row: p1.r1, col: p1.c1 }, { row: p2.r1, col: p2.c1 }) && samePos({ row: p1.r2, col: p1.c2 }, { row: p2.r2, col: p2.c2 })) {
        return true;
    }

    return false;
};

export const posofi = (i, cols = COLS) => {
    const row = Math.floor(i / cols) + 1;
    const col = i % cols + 1;

    return { row, col };
};

export const iofpos = (row, col, cols = COLS) => {
    return (row - 1) * cols + (col - 1);
};
