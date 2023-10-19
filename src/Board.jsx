import { useAtom } from 'jotai';
import _ from 'lodash';
import { useEffect } from 'react';
import Spot from './Spot';
import Tile from './Tile';
import { a_board_dims, a_board_params, a_help, a_once, a_options, a_remesh, a_surrender, a_tiles, a_tray_tile } from './atoms';
import { neighbors, placedTiles, scrollClass, defer } from './utils';

const Board = () => {
    const [dims] = useAtom(a_board_dims);
    let { rows, cols } = dims;
    const [help] = useAtom(a_help);
    const [options] = useAtom(a_options);
    const [params] = useAtom(a_board_params);
    const [tiles] = useAtom(a_tiles);
    const [trayTile] = useAtom(a_tray_tile);
    const [surrender] = useAtom(a_surrender);
    const [, remesh] = useAtom(a_remesh);
    const [once] = useAtom(a_once);

    const { rowHeight, colWidth, gap, padding: pad } = params;

    useEffect(() => {
        if (once) {
            defer(remesh);
        }

        window.addEventListener('resize', remesh);
        return () => window.removeEventListener('resize', remesh);
    }, [once, remesh]);

    const renderCell = (key) => {
        const style = { opacity: 0.05, width: colWidth, height: rowHeight, border: '1px solid white', pointerEvents: 'none' };
        return true && <div key={key} style={style} />;
    };

    const _tiles = placedTiles(tiles);
    const zIndex = surrender ? 4 : 0;

    const style = {
        placeSelf: 'center', display: 'grid',
        grid: `repeat(${rows}, ${rowHeight}px)/ repeat(${cols}, ${colWidth}px)`,
        gap: `${gap.y}px ${gap.x}px`, padding: `${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px`,
    };

    return (
        <div id='board' className={`${scrollClass()}`} style={{ gridArea: '2/2', zIndex, opacity: help || options ? 0 : 1 }}
            onDoubleClick={remesh}>
            <div id='mesh' style={style}>
                {_.map(_.range(1, rows + 1), row => {
                    return _.map(_.range(1, cols + 1), col => {
                        const key = `${row}/${col}`;
                        const tile = _.find(_tiles, tile => tile.place.row === row && tile.place.col === col);

                        if (tile) {
                            return <Tile key={key} tile={tile} height={tile.height} />;
                        }

                        if (_.isEmpty(_tiles) && row === (rows + 1) / 2 && col === (cols + 1) / 2 && trayTile) {
                            return <Spot key={key} row={row} col={col} />;
                        }

                        const adjs = neighbors(tiles, row, col);
                        return _.some(adjs, a => !!a) ? <Spot key={key} row={row} col={col} /> : renderCell(key);
                    });
                })}
            </div>
        </div>
    );
};

export default Board;