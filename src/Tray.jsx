import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import Handshake from './Pix/Handshake.png';
import V1 from './Pix/V1.png';
import V2 from './Pix/V2.png';
import Tile from './Tile';
import { a_help, a_options, a_over, a_tray_tile, a_zoom } from './atoms';
import { TRIUM_RATIO, TRIUM_WIDTH } from './const';
import { isScrollable, onMobile } from './utils';

const Tray = () => {
    const [tile] = useAtom(a_tray_tile);
    const [zoom] = useAtom(a_zoom);
    const [over] = useAtom(a_over);
    const [help] = useAtom(a_help);
    const [options] = useAtom(a_options);

    const placing = tile?.animated && !tile?.height;

    const width = TRIUM_WIDTH * zoom;
    const height = width / TRIUM_RATIO;

    const render = () => {
        if (help || (onMobile() && options)) {
            return null;
        }

        if (over) {
            const src = over === 1 ? V1 : over === 2 ? V2 : Handshake;

            return <motion.img src={src} alt='draw' width={88} style={{ placeSelf: 'center' }}
                animate={{ scale: 1 }} initial={{ scale: 0 }} transition={{ duration: 1.2 }} />;
        }

        if (tile && !placing) {
            return <Tile tile={tile} height={tile.height} />;
        }

        return null;
    };

    const renderOverboard = () => {
        const sb = isScrollable('board');
        const margin = `0 ${sb.vert ? '12px' : 0} ${sb.horz ? '12px' : 0} 0`;

        return <div className='overboard' style={{ margin }}>
            <div style={{ position: 'relative', left: sb.vert ? '6px' : 0 }}>
                <Tile tile={tile} />
            </div>
        </div>;
    };

    return <>
        <div id='tray' className='tray' style={{ width, height }}>{render()}</div>
        {placing && renderOverboard()}
    </>;
};

export default Tray;