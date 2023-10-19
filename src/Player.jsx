import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import Glasses from './Pix/Glasses.png';
import Player1 from './Pix/Player1.png';
import Player2 from './Pix/Player2.png';
import { a_mobile_popup, a_over, a_prompt, a_streak, a_tiles, a_turn } from './atoms';
import useTray from './useTray';
import { deckEmpty } from './utils';

const Player = (props) => {
    const { player } = props;
    const [tiles] = useAtom(a_tiles);
    const [over] = useAtom(a_over);
    const [streak] = useAtom(a_streak);
    const [turn, setTurn] = useAtom(a_turn);
    const { replaceTrayTile } = useTray();
    const [prompt] = useAtom(a_prompt);
    const [mobilePopup] = useAtom(a_mobile_popup);

    const id = `player${player}`;
    const src = player === 1 ? Player1 : Player2;
    const alt = `player${player}`;
    const width = 55;

    const onClick = () => {
        setTurn(player);
        !prompt && replaceTrayTile(player);
    };

    const won = _.get(streak, 0)?.player === player;

    const render = () => {
        if (!over) {
            const classes = turn === player || deckEmpty(tiles, player) ? 'not-clickable' : 'clickable';
            const animate = { transform: `rotateY(${player === turn ? 90 : 0}deg)` };

            const transition = player === turn && !over ?
                { repeat: Infinity, repeatType: 'reverse', ease: 'linear', duration: 0.35 } : false;

            return <motion.img className={classes} src={src} alt={alt} style={{ width }}
                animate={animate} transition={transition} onClick={onClick} />;
        }

        const gridArea = '1/1';

        return <div style={{ display: 'grid' }}>
            <img src={src} alt={alt} style={{ gridArea, width }} />
            {won && <motion.img src={Glasses} alt='glasses' style={{ gridArea, width }}
                animate={{ transform: 'translateY(0px)' }} initial={{ transform: 'translateY(-20px)' }}
                transition={{ duration: 1.6 }} />}
        </div>;
    };

    return <div id={id} className='player' style={{ gridArea: `1/${player === 1 ? 1 : 3}`, opacity: mobilePopup ? 0 : 1 }}>
        {render()}
    </div>;
};

export default Player;