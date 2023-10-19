import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { useEffect } from 'react';
import Tile from './Tile';
import { a_deck_visible, a_mobile_popup, a_tiles, a_zoom } from './atoms';
import { DECK } from './const';
import { useForceUpdate } from './useForceUpdate';
import { clientRect, deckTileSize, defer } from './utils';

const Deck = (props) => {
    const [tiles] = useAtom(a_tiles);
    const [zoom] = useAtom(a_zoom);
    const [deckVisible] = useAtom(a_deck_visible);
    const forceUpdate = useForceUpdate();
    const [mobilePopup] = useAtom(a_mobile_popup);

    useEffect(() => {
        forceUpdate();
    }, [forceUpdate, zoom]);

    useEffect(() => {
        const onResize = () => {
            defer(forceUpdate, 1000);
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [forceUpdate]);

    if ((clientRect('board')?.height || 0) < 100) {
        return null;
    }

    const { player } = props;
    const _tiles = _.filter(tiles, tile => tile.player === player);
    const id = `deck${player}`;
    const gridArea = `2/${player === 1 ? 1 : 3}`;
    const { height: th, width: tw } = deckTileSize();
    const grid = `repeat(${DECK.length}, ${th}px) / ${tw}px`;

    return (
        <motion.div id={id} className='deck' style={{ gridArea, grid, gap: th / 15 }}
            animate={{ opacity: mobilePopup ? 0 : 1 }}>
            {_.map(_tiles, (tile, i) => {
                const id = tile.id.replace('tile', 'spot');

                return <motion.div id={id} key={i} style={{ display: 'grid', gridArea: `${i + 1}/${1}`, width: tw, height: th }}
                    animate={{ transform: `rotateY(${deckVisible ? 0 : 90}deg)` }} transition={{ duration: 0.4 }}>
                    {!tile.place && <Tile tile={tile} height={th} />}
                </motion.div>;
            })}
        </motion.div>
    );
};

export default Deck;