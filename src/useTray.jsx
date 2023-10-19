import { useAtom } from 'jotai';
import _ from 'lodash';
import { a_draw, a_tiles, a_tray_tile, a_turn } from './atoms';
import { DRAW_RANDOM } from './const';
import { usePlaySound } from './usePlaySound';
import { deckTileSize, defer, xy } from './utils';

const useTray = () => {
    const [tiles, setTiles] = useAtom(a_tiles);
    const [turn] = useAtom(a_turn);
    const [trayTile] = useAtom(a_tray_tile);
    const [draw] = useAtom(a_draw);
    const playSound = usePlaySound();

    const addToTray = (player) => {
        if (!player) {
            player = turn;
        }

        const _tiles = _.filter(tiles, tile => tile.player === player && !tile.place);

        let tile = _.first(_tiles);

        if (draw === DRAW_RANDOM && _tiles.length > 1) {
            tile = _.sample(_tiles);
        }

        if (!tile) {
            return false;
        }

        defer(() => playSound('tap'), 1400);

        const { x: x1, y: y1 } = xy(tile.id);
        const { x: x2, y: y2 } = xy('tray');

        tile.translate = { x: x2 - x1, y: y2 - y1 };
        tile.animated = true;

        setTiles([...tiles]);
        return true;
    };

    const removeFromTray = () => {
        if (!trayTile) {
            return;
        }

        const id = trayTile.id.replace('tile', 'spot');

        const { x: x1, y: y1 } = xy('tray');
        const { x: x2, y: y2 } = xy(id);

        trayTile.translate = { x: x2 - x1, y: y2 - y1 };
        trayTile.animated = true;
        trayTile.height = deckTileSize().height;
    };

    const replaceTrayTile = (player) => {
        removeFromTray();
        addToTray(player);
    };

    const onTransformToTrayComplete = (tile) => {
        delete tile.translate;
        delete tile.row;
        delete tile.col;
        tile.place = 'tray';

        setTiles([...tiles]);
    };

    return { addToTray, removeFromTray, replaceTrayTile, onTransformToTrayComplete };
};

export default useTray;