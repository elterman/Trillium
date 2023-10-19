import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import Trium1 from './Pix/Trium1.png';
import Trium10 from './Pix/Trium10.png';
import Trium11 from './Pix/Trium11.png';
import Trium12 from './Pix/Trium12.png';
import Trium2 from './Pix/Trium2.png';
import Trium3 from './Pix/Trium3.png';
import Trium4 from './Pix/Trium4.png';
import Trium5 from './Pix/Trium5.png';
import Trium6 from './Pix/Trium6.png';
import Trium7 from './Pix/Trium7.png';
import Trium8 from './Pix/Trium8.png';
import Trium9 from './Pix/Trium9.png';
import { a_board_dims, a_board_params, a_message, a_n2win, a_over, a_player_count, a_prompt, a_scores, } from './atoms';
import { a_selected_from, a_selected_to, a_streak, a_tiles, a_turn, a_zoom } from './atoms';
import { TRIUM_DIMS, TRIUM_RATIO, TRIUM_WIDTH } from './const';
import { usePlaySound } from './usePlaySound';
import useTray from './useTray';
import { neighbors, deckEmpty, placedTiles, calcDims, defer } from './utils';

const Tile = (props) => {
    let { tile, height } = props;

    const [zoom] = useAtom(a_zoom);
    const [from, setFrom] = useAtom(a_selected_from);
    const [to, setTo] = useAtom(a_selected_to);
    const [tiles, setTiles] = useAtom(a_tiles);
    const [turn, setTurn] = useAtom(a_turn);
    const [playerCount] = useAtom(a_player_count);
    const [boardDims, setDims] = useAtom(a_board_dims);
    const [over, setOver] = useAtom(a_over);
    const [streak] = useAtom(a_streak);
    const [n2win] = useAtom(a_n2win);
    const [, setStreak] = useAtom(a_streak);
    const { addToTray, onTransformToTrayComplete } = useTray();
    const [, setPrompt] = useAtom(a_prompt);
    const playSound = usePlaySound();
    const [boardParams] = useAtom(a_board_params);
    const [scores, setScores] = useAtom(a_scores);
    const [, setMessage] = useAtom(a_message);

    const { place } = tile;
    const { row, col } = place || {};
    const inDeck = !place;
    const inTray = place === 'tray';
    const placed = !!place?.row;
    const isFrom = from?.tile === tile;
    const isTo = to && row === to.row && col === to.col;
    const gridArea = `${row || 1}/${col || 2}`;
    const pcolors = ['purple', 'darkgreen'];
    const selectedSector = isFrom ? from.sector : isTo ? to.sector : null;

    let width;

    if (height && inDeck) {
        width = height * TRIUM_RATIO;
    } else {
        width = TRIUM_WIDTH * zoom;
        height = width / TRIUM_RATIO;
    }

    const onClick = (sector) => {
        if (!isFrom) {
            setFrom({ tile, sector });
            playSound('click');

            return;
        }

        const setTransform = () => {
            const ftile = from.tile;
            let delta = sector - (from.sector + (isFrom ? 0 : (ftile.turns || 0)));

            if (delta > 2) {
                delta -= 4;
            } else if (delta < -2) {
                delta += 4;
            }

            const _turns = (ftile.turns || 0) + delta;

            let ok = true;

            const norm = (bits, turns) => {
                bits = [...bits, ...bits, ...bits];
                bits = bits.slice(4 - turns, 8 - turns);
                return bits;
            };

            const bits = norm(ftile.bits, _turns);
            let adjs = neighbors(tiles, row, col);
            let count = 0;

            _.each(bits, (bit, i) => {
                const adj = adjs[i];

                if (!adj || adj === ftile) {
                    return;
                }

                count += 1;

                const abits = norm(adj.bits, adj.turns);

                const j = i < 2 ? i + 2 : i - 2;
                const b = abits[j];

                if (b && b !== bit) {
                    ok = false;
                    return false;
                }
            });

            if (!ok) {
                setMessage('Color mismatch!');
                return;
            }

            adjs = neighbors(tiles, ftile.place.row, ftile.place.col);
            const _count = _.filter(adjs, a => !!a).length;

            if (_count > count) {
                return;
            }

            if (ftile.place !== 'tray') {
                const _tiles = _.cloneDeep(placedTiles(tiles));
                const stile = _.find(_tiles, tile => _.isEqual(tile.place, ftile.place));
                stile.place = { row, col };

                const countContiguous = () => {
                    let count = 0;

                    const visit = (tile) => {
                        if (tile.visited) {
                            return;
                        }

                        count += 1;
                        tile.visited = true;

                        const adjs = neighbors(_tiles, tile.place.row, tile.place.col);
                        _.each(adjs, a => a && visit(a));
                    };

                    visit(stile);
                    return count;
                };

                count = countContiguous();

                if (count < _tiles.length) {
                    return;
                }
            }

            ftile.turns = _turns;
            setTo({ id: tile.id, row, col, sector });

            ftile.animated = true;
            setTiles([...tiles]);
        };

        if (sector === from.sector) {    // unselect?
            setFrom(null);
            playSound('click');
        } else if (placed) {   // on board?
            setTransform();
        } else {    // tray, different sector
            setFrom({ tile, sector });
            playSound('click');
        }
    };

    const onRotateComplete = () => {
        if (tile.animated && !tile.translate) {
            onTransformComplete();
        }
    };

    const onTransformComplete = () => {
        if (tile.animated) {
            delete tile.animated;
        }

        if (inDeck && !tile.height) {
            tile.translate && onTransformToTrayComplete(tile);
            return;
        }

        if (tile.height) {
            delete tile.height;
            delete tile.translate;
            delete tile.place;

            setTiles([...tiles]);
            return;
        }

        if (!from) {
            return;
        }

        setFrom(null);
        setTo(null);

        playSound('cluck');
        tile.place = { row: to.row, col: to.col };
        delete tile.translate;

        const _over = checkOver();

        if (inTray && !_over) {
            const nextTurn = turn < playerCount ? turn + 1 : 1;

            if (deckEmpty(tiles, nextTurn)) {
                setOver('draw');
                defer(() => playSound('draw'), 500);
                defer(() => setPrompt('PLAY AGAIN?'), 2000);
            } else {
                setTurn(nextTurn);
                addToTray(nextTurn);
            }
        }

        reboard();

        tile.flash = true;
        setTiles([...tiles]);

        defer(() => {
            tile.flash = false;
            setTiles([...tiles]);
        }, 1000);
    };

    const reboard = () => {
        let { rows, cols } = boardDims;
        const { rowHeight, colWidth, gap } = boardParams;
        const dims = calcDims(boardParams);
        const board = document.getElementById('board');
        const { row: _r, col: _c } = tile.place;
        const _tiles = placedTiles(tiles);
        let xrows = 0;
        let xcols = 0;
        let dy = 0;
        let dx = 0;

        if (_r === 1 || _r > rows - 2) {
            xrows = Math.ceil(dims.rows / 2);

            if (_r === 1) {
                _.each(_tiles, t => t.place.row += xrows);
                dy = xrows * (rowHeight + gap.y);
            }
        }

        if (_c === 1 || _c > cols - 2) {
            xcols = Math.ceil(dims.cols / 2);

            if (_c === 1) {
                _.each(_tiles, t => t.place.col += xcols);
                dx = xcols * (colWidth + gap.x);
            }
        }

        if (dx || dy) {
            defer(() => board.scrollTo(dx, dy));
        }

        if (xrows) {
            rows += xrows;
        };

        if (xcols) {
            cols += xcols;
        };

        setDims({ rows, cols: Math.max(3, cols) });
    };

    const checkOver = () => {
        const sides = ['nw', 'n', 'ne', 'e'];
        const _tiles = _.filter(tiles, t => t.player === turn && t.place?.row);
        let _over = false;

        const getTile = (row, col) => _.find(_tiles, t => t.place.row === row && t.place.col === col);

        _.each(sides, side => {
            let streak = [tile];

            const step = (i, up) => {
                let { row: r, col: c } = tile.place;

                if (side === 'nw') {
                    r = r + (up ? -1 : 1) * i;
                    c = c + (up ? -1 : 1) * i;
                } else if (side === 'n') {
                    r = r + (up ? -1 : 1) * i;
                } else if (side === 'ne') {
                    r = r + (up ? -1 : 1) * i;
                    c = c + (up ? 1 : -1) * i;
                } else {    // 'e'
                    c = c + (up ? 1 : -1) * i;
                }

                const t = getTile(r, c);

                if (!t) {
                    return false;
                }

                streak.push(t);

                if (streak.length === n2win) {
                    const p = tile.player;

                    _over = true;
                    setOver(p);
                    setStreak(streak);

                    const [s1, s2] = scores;
                    setScores([s1 + (p === 1 ? 1 : 0), s2 + (p === 2 ? 1 : 0)]);

                    defer(() => playSound(`player${p}wins`), 500);
                    defer(() => setPrompt('PLAY AGAIN?'), 3000);
                }

                return true;
            };

            for (let i = 0; i < n2win - 1; i++) {
                if (!step(i + 1, true) || _over) {
                    break;
                }
            }

            for (let i = 0; i < n2win; i++) {
                if (!step(i + 1, false) || _over) {
                    break;
                }
            }

            if (_over) {
                return false;
            }
        });

        return _over;
    };

    const renderSpot = () => {
        const inverted = tile.turns % 2 === 1;
        const y = inverted ? 362 : 418;

        const renderSector = (sector) => {
            const pointerEvents = inDeck || over || tile.player !== turn ? 'none' : 'all';
            const cursor = pointerEvents === 'all' ? 'pointer' : 'initial';

            return <path key={sector} d='M362,418 6,620 720,620 Z' fill='none' style={{ pointerEvents, cursor }}
                transform={`rotate(${(sector * 120 - (inverted ? 60 : 0)) % 360}, 362, ${y})`}
                onClick={() => onClick(sector)} />;
        };

        const viewBox = `0 0 ${TRIUM_DIMS.X} ${TRIUM_DIMS.Y}`;
        const xmlns = 'http://www.w3.org/2000/svg';
        const offwhite = '#FFFFFF20';
        const strokeWidth = 18;

        return <svg style={{ gridArea: '1/1' }} width={width} height={height} viewBox={viewBox} xmlns={xmlns}>
            <g stroke={offwhite} strokeLinejoin='round' strokeWidth={strokeWidth} fill='none'>
                {_.map([0, 1, 2], sector => renderSector(sector))}
            </g>
            {/* selected mark */}
            {_.isNumber(selectedSector) && <circle id='selected' cx='50%' cy='90%' r='5%' fill='none' stroke='#fff' strokeWidth='5'
                transform={`rotate(${(selectedSector) * 120 - (inverted ? 60 : 0)}, 362, ${y})`} />}
            {/* border */}
            {<path d='M363,6 720,620 0,620 Z' fill='none' stroke={offwhite} strokeLinejoin='round'
                strokeWidth={strokeWidth} />}
        </svg>;
    };

    const renderBits = () => {
        const i = _.last(tile.id.split('-'));
        const src = [Trium1, Trium2, Trium3, Trium4, Trium5, Trium6, Trium7, Trium8, Trium9, Trium10, Trium11, Trium12][i];
        const gridArea = '1/1';

        return <div className='tile' style={{ gridArea: '1/1' }}>
            <img style={{ gridArea }} src={src} alt={`tile${i + 1}`} width={width} height={height} />
        </div>;
    };

    const classes = `tile ${tile.animated ? 'tile-animated' : ''}`;
    const knobSize = `${0.35 * height}px`;
    const background = `radial-gradient(circle at 10% 10%, white 0%, ${pcolors[tile.player - 1]} 60%)`;
    const transition = { duration: tile.translate || (isFrom && from?.tile.id === to?.id) ? 1 : 0, delay: inDeck && !tile.height ? 0.5 : 0 };

    const renderContent = () => {
        const rotate = `rotate(${(tile.turns || 0) * 60}deg)`;
        const translate = `translateY(${height * 0.17}px)`;

        return <>
            <motion.div className='tile-content' animate={{ transform: rotate }} transition={transition} onAnimationComplete={onRotateComplete}>
                {renderBits()}
                {renderSpot()}
            </motion.div>
            <div className='tile-glow' style={{ width: height, height, transform: translate }} />
            <motion.div className='tile-glow-extra' style={{ width: height, height, transform: translate }}
                animate={{ opacity: tile.flash ? 1 : 0 }} transition={{ delay: tile.flash ? 0.15 : 0, duration: 0.5 }} />
            <div className='knob' style={{ width: knobSize, height: knobSize, background, transform: translate }} />
        </>;
    };

    let animate;
    let initial;

    if (inDeck && tile.height) {    // returning to deck from board?
        initial = { transform: `translate(${tile.translate?.x || 0}px, ${tile.translate?.y || 0}px)` };
        animate = { transform: 'translate(0px, 0px)' };
    } else {
        const normalHeight = TRIUM_WIDTH / TRIUM_RATIO * zoom;
        let scale = 1;

        if (tile.animated && props.height) {
            scale = inDeck ? normalHeight / props.height : props.height / normalHeight;
        }

        animate = { transform: `translate(${tile.translate?.x || 0}px, ${tile.translate?.y || 0}px) scale(${scale})` };
        initial = { transform: 'translate(0px, 0px) scale(1)' };
    }

    return <motion.div id={tile.id} className={classes} style={{ gridArea }}
        animate={animate} transition={transition} initial={initial} onAnimationComplete={onTransformComplete}>
        <motion.div className='tile'
            animate={{ opacity: !over || over === 'draw' || _.find(streak, t => t === tile) ? 1 : (tile.place?.row ? 0.25 : 0) }}
            transition={{ duration: 1 }}>
            {renderContent()}
        </motion.div>
    </motion.div>;
};

export default Tile;