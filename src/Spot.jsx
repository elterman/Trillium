import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { a_message, a_over, a_selected_from, a_selected_to, a_surrender, a_tiles, a_zoom } from './atoms';
import { TRIUM_DIMS, TRIUM_RATIO, TRIUM_WIDTH } from './const';
import { neighbors, placedTiles, xy } from './utils';
import { usePlaySound } from './usePlaySound';

const Spot = (props) => {
    let { row, col } = props;

    const [zoom] = useAtom(a_zoom);
    const [from] = useAtom(a_selected_from);
    const [to, setTo] = useAtom(a_selected_to);
    const [tiles, setTiles] = useAtom(a_tiles);
    const [over] = useAtom(a_over);
    const [surrender] = useAtom(a_surrender);
    const playSound = usePlaySound();
    const [, setMessage] = useAtom(a_message);

    const isTo = to && row === to.row && col === to.col;
    const id = `spot ${row}/${col}`;
    const gridArea = `${row || 1}/${col || 2}`;
    const selectedSector = isTo ? to.sector : null;

    const width = TRIUM_WIDTH * zoom;
    const height = width / TRIUM_RATIO;

    const onClick = (sector) => {
        const ftile = from.tile;
        let delta = sector - (from.sector + (ftile.turns || 0));

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

            if (bit && b !== bit) {
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
            setMessage('Too few neighbors!');
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
                setMessage('No islands!');
                return;
            }
        }

        ftile.turns = _turns;
        setTo({ id, row, col, sector });
        playSound('click');

        const { x: x1, y: y1 } = xy(ftile.id);
        const { x: x2, y: y2 } = xy(id);

        ftile.translate = { x: x2 - x1, y: y2 - y1 };
        ftile.animated = true;

        setTiles([...tiles]);
    };

    const renderSpot = () => {
        const renderSector = (sector) => {
            let pointerEvents = 'all';

            if (!from) {
                pointerEvents = 'none';
            }

            const cursor = pointerEvents === 'all' ? 'pointer' : 'initial';

            return <path key={sector} d='M362,418 6,620 720,620 Z' fill='none' style={{ pointerEvents, cursor }}
                transform={`rotate(${(sector * 120) % 360}, 362, 418)`} onClick={() => onClick(sector)} />;
        };

        const viewBox = `0 0 ${TRIUM_DIMS.X} ${TRIUM_DIMS.Y}`;
        const xmlns = 'http://www.w3.org/2000/svg';
        const offwhite = '#FFFFFF20';
        const strokeWidth = 8;

        return <svg style={{ gridArea: '1/1' }} width={width} height={height} viewBox={viewBox} xmlns={xmlns}>
            <g stroke={offwhite} strokeLinejoin='round' strokeWidth={strokeWidth} fill='none'>
                {_.map([0, 1, 2], sector => renderSector(sector))}
            </g>
            {/* selected mark */}
            {_.isNumber(selectedSector) && <circle id='selected' cx='50%' cy='85%' r='5%' fill='none' stroke='#fff' strokeWidth='4'
                transform={`rotate(${(selectedSector) * 120}, 362, 418)`} />}
            {/* border */}
            {<path d='M363,6 720,620 0,620 Z' fill='none' stroke={offwhite} strokeLinejoin='round'
                strokeWidth={strokeWidth} />}
        </svg>;

    };

    return <motion.div id={id} className='tile spot' style={{ gridArea }}
        animate={{ opacity: over || surrender ? 0 : 1 }} transition={{ duration: 1 }}>
        {renderSpot()}
    </motion.div>;
};

export default Spot;