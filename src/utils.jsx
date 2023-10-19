import _ from 'lodash';
import { TRIUM_RATIO, TRIUM_WIDTH } from './const';

export const windowSize = () => {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

    return { x, y };
};

export const onMobile = () => typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;

export const scrollClass = () => `root-scroll ${onMobile() ? 'root-scroll-mobile' : ''}`;

const inView = ob => {
    if (!ob) {
        return;
    }

    const e = document.getElementById(ob.id);

    if (!e) {
        return;
    }

    const r1 = { x1: e.offsetLeft, y1: e.offsetTop };
    r1.x2 = r1.x1 + e.offsetWidth;
    r1.y2 = r1.y1 + e.offsetHeight;

    const s = document.getElementById('mesh');
    const r2 = { x1: s.offsetLeft + s.scrollLeft, y1: s.offsetTop + s.scrollTop };
    r2.x2 = r2.x1 + s.offsetWidth;
    r2.y2 = r2.y1 + s.offsetHeight;

    return r1.x1 >= r2.x1 && r1.x2 <= r2.x2 && r1.y1 >= r2.y1 && r1.y2 <= r2.y2;
};

export const scrollTo = ob => {
    if (!ob) {
        return;
    }

    if (inView(ob)) {
        return false;
    }

    const e = document.getElementById(ob.id);

    if (!e) {
        return false;
    }

    e.scrollIntoView({ behavior: 'smooth' });

    return true;
};

export const clientRect = obid => {
    const ob = document.getElementById(obid);
    const r = ob?.getBoundingClientRect();

    return r;
};

export const xy = obid => {
    const r = clientRect(obid);

    return { x: r?.left, y: r?.top };
};

export const isScrollable = obid => {
    const ob = document.getElementById(obid);
    const horz = ob.scrollWidth > ob.clientWidth;
    const vert = ob.scrollHeight > ob.clientHeight;

    return { horz, vert };
};

export const placedTiles = (tiles) => _.filter(tiles, tile => tile.place?.row);

export const neighbors = (tiles, row, col) => {
    const adjs = [
        { row: row - 1, col },
        { row, col: col + 1 },
        { row: row + 1, col },
        { row, col: col - 1 },
    ];

    const _tiles = placedTiles(tiles);
    const obs = [];

    _.each(adjs, a => {
        const tile = _.find(_tiles, tile => tile.place.row === a.row && tile.place.col === a.col);
        obs.push(tile);
    });

    return obs;
};

export const deckTileSize = () => {
    const page = clientRect('page');
    const tray = clientRect('tray');
    const toolbar = clientRect('toolbar');

    if (!page?.height || !tray?.height || !toolbar?.height) {
        return { height: 0, width: 0 };
    }

    const h = page.height - 10 - tray.height - 20 - toolbar.height - 20;
    const height = Math.min(h / 14, TRIUM_WIDTH * 0.7);

    return { height, width: height * TRIUM_RATIO };
};

export const deckEmpty = (tiles, player) => {
    const _tiles = _.filter(tiles, tiles => tiles.player === player && !tiles.place);
    return _tiles.length === 0;
};

export const calcSpans = (tiles) => {
    let min_row = Number.MAX_VALUE;
    let min_col = Number.MAX_VALUE;
    let max_row = 0;
    let max_col = 0;

    _.each(tiles, tile => {
        const { row, col } = tile.place;

        min_row = Math.min(min_row, row);
        min_col = Math.min(min_col, col);
        max_row = Math.max(max_row, row);
        max_col = Math.max(max_col, col);
    });

    return { min_row, max_row, min_col, max_col };
};

export const calcDims = (boardParams) => {
    const { rowHeight, colWidth, gap, padding: pad } = boardParams;
    const r = clientRect('board');

    let rows = Math.floor((r.height - pad.bottom + gap.y) / (rowHeight + gap.y));
    let cols = Math.floor((r.width - pad.right + gap.x) / (colWidth + gap.x));

    if (rows % 2 === 0) {
        rows -= 1;
    }

    if (cols % 2 === 0) {
        cols -= 1;
    }

    return { rows, cols };
};

export const defer = (fn, ms = 1) => _.delay(fn, ms);