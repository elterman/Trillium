import { atom } from 'jotai';
import _ from 'lodash';
import { APP_STATE, DECK, DEFAULT_ZOOM, DRAW_RANDOM, TRIUM_WIDTH } from './const';
import { calcDims, calcSpans, defer, onMobile, placedTiles } from './utils';

export const a_once = atom(true);
export const a_selected_from = atom(null);
export const a_selected_to = atom(null);
export const a_player_count = atom(2);
export const a_prompt = atom(null);
export const a_surrender = atom(false);
export const a_restart = atom(false);
export const a_confirm = atom(null);
export const a_streak = atom(null);
export const a_help = atom(false);
export const a_options = atom(false);
export const a_deck_visible = atom(true);
export const a_board_dims = atom({ rows: 0, cols: 0 });

const a_state_base = atom(null);

export const a_state = atom(
    get => get(a_state_base),

    (get, set, state) => {
        set(a_state_base, state);

        const props = ['sound', 'zoom', 'n2win', 'player_count', 'board_dims', 'tiles', 'score1', 'score2',
            'place', 'row', 'col', 'turn', 'player', 'bits', 'turns', 'over', 'id', 'tile', 'draw',
        ];

        const json = JSON.stringify(state, props);

        localStorage.setItem(APP_STATE, json);
    }
);

export const a_sound = atom(
    get => {
        const state = get(a_state);
        return state.sound;
    },
    (get, set, sound) => {
        const state = get(a_state);
        set(a_state, { ...state, sound });
    }
);

export const a_turn = atom(
    get => {
        const state = get(a_state);
        return state.turn || 1;
    },
    (get, set, turn) => {
        const state = get(a_state);
        set(a_state, { ...state, turn });
    }
);

export const a_n2win = atom(
    get => {
        const state = get(a_state);
        return state.n2win || 5;
    },
    (get, set, n) => {
        const state = get(a_state);
        set(a_state, { ...state, n2win: n });
    }
);

export const a_zoom = atom(
    get => {
        const state = get(a_state);
        return state.zoom || DEFAULT_ZOOM;
    },
    (get, set, zoom) => {
        const state = get(a_state);
        set(a_state, { ...state, zoom });
        defer(() => set(a_remesh));
    }
);

export const a_draw = atom(
    get => {
        const state = get(a_state);
        return state.draw || DRAW_RANDOM;
    },
    (get, set, draw) => {
        const state = get(a_state);
        set(a_state, { ...state, draw });
    }
);

export const a_over = atom(
    get => {
        const state = get(a_state);
        return state.over;
    },
    (get, set, over) => {
        const state = get(a_state);
        set(a_state, { ...state, over });
    }
);

export const a_scores = atom(
    get => {
        const state = get(a_state);
        return [state.score1 || 0, state.score2 || 0];
    },
    (get, set, [score1, score2]) => {
        const state = get(a_state);
        set(a_state, { ...state, score1, score2 });
    }
);

export const a_tiles = atom(
    get => {
        const state = get(a_state);

        if (!state) {
            return [];
        }

        if (!state.tiles) {
            state.tiles = initDecks();
        }

        return state.tiles;
    },
    (get, set, tiles) => {
        const state = get(a_state);
        set(a_state, { ...state, tiles });
    }
);

export const a_tray_tile = atom(
    get => {
        const tiles = get(a_tiles);

        const tile = _.find(tiles, tile => tile.place === 'tray');
        return tile;
    }
);

export const a_board_params = atom(
    get => {
        const zoom = get(a_zoom);
        const m = TRIUM_WIDTH * zoom / 100;
        const rowHeight = 88 * m;
        const colWidth = 50 * m;
        const gap = { y: 2 * m, x: 4.75 * m };
        const pad = { top: 0, right: 0, bottom: 0, left: 0 };

        return { rowHeight, colWidth, gap, padding: pad };
    }
);

export const a_animated = atom(
    get => {
        const tiles = get(a_tiles);
        return _.some(tiles, tile => tile.animated);
    }
);

export const a_mobile_popup = atom(
    get => onMobile() && (get(a_help) || get(a_options))
);

export const a_remesh = atom(null, (get, set) => {
    const tiles = get(a_tiles);
    const ptiles = placedTiles(tiles);
    const { min_row, max_row, min_col, max_col } = calcSpans(ptiles);
    const span_rows = max_row - min_row + 1;
    const span_cols = max_col - min_col + 1;

    const params = get(a_board_params);
    const { rows: dim_rows, cols: dim_cols } = calcDims(params);

    const rows = Math.max(span_rows + 4, dim_rows);
    const cols = Math.max(span_cols + 2, dim_cols);

    _.each(ptiles, t => {
        t.place.row = Math.floor((rows - span_rows) / 2) + t.place.row - min_row + 1;
        t.place.col = Math.floor((cols - span_cols) / 2) + t.place.col - min_col + 1;
    });

    set(a_board_dims, { rows, cols });
    set(a_message, null);
});

export const a_make_decks = atom(null,
    (get, set) => {
        const tiles = initDecks();
        const draw = get(a_draw);

        if (draw === DRAW_RANDOM) {
            set(a_tiles, tiles);
            return;
        }

        const _tiles1 = _.shuffle(_.filter(tiles, tile => tile.player === 1));
        let _tiles2 = [];

        const sameOrder = false;

        if (sameOrder) {
            _tiles2 = [];

            _.each(_tiles1, t1 => {
                const tile = _.find(tiles, t2 => t2.player === 2 && _.isEqual(t1.bits, t2.bits));
                _tiles2.push(tile);
            });
        } else {
            const solid = (tile, bit) => tile.id.endsWith(`${bit}`.repeat(6));

            do {
                _tiles2 = _.shuffle(_.filter(tiles, tile => tile.player === 2));
            } while ((solid(_tiles1[0], 1) && solid(_tiles2[0], 2)) || (solid(_tiles1[0], 2) && solid(_tiles2[0], 1)));
        }

        set(a_tiles, [..._tiles1, ..._tiles2]);
    }
);

const initDecks = () => {
    const tiles = [];

    for (let i = 0; i < 2; i++) {
        const player = i + 1;
        const deck = _.clone(DECK);

        _.each(deck, (bits, j) => {
            const id = `tile-${player}-${bits}-${j}`.replaceAll(',', '');
            tiles.push({ id, player, bits });
        });
    }

    return tiles;
};

export const a_message_base = atom(null);

export const a_message = atom(
    get => get(a_message_base),

    (get, set, message) => {
        set(a_message_base, message);
        defer(() => set(a_message_base, null), 2000);
    }
);
