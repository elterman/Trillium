import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { a_draw, a_n2win, a_over, a_scores, a_sound, a_tiles, a_zoom } from './atoms';
import { DEFAULT_ZOOM, DRAW_RANDOM, DRAW_SEQ } from './const';
import { onMobile, placedTiles } from './utils';

const Options = () => {
    const [sound, setSound] = useAtom(a_sound);
    const [zoom, setZoom] = useAtom(a_zoom);
    const [n2win, setN2win] = useAtom(a_n2win);
    const [draw, setDraw] = useAtom(a_draw);
    const [scores, setScores] = useAtom(a_scores);
    const [tiles] = useAtom(a_tiles);
    const [over] = useAtom(a_over);

    const placed = placedTiles(tiles).length > 0;
    const canReset = scores[0] || scores[1];
    const classes = `prompt-inner prompt reset-score ${canReset ? 'clickable' : 'not-clickable'}`;

    return <motion.div className='options' animate={{ opacity: 1 }} style={{ background: onMobile() ? 'none' : '#7F5EFF20' }}>
        {<Option prompt='sounds' on={sound} onClick={() => setSound(!sound)} />}
        <div style={{ height: '1em' }} />
        <div style={{ opacity: placed ? 0.25 : 1 }}>Tiles To Win:</div>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '1.5em', justifyContent: 'start' }}>
            {<Option prompt='4' on={n2win === 4} disabled={placed && !over} onClick={() => setN2win(4)} />}
            {<Option prompt='5' on={n2win === 5} disabled={placed && !over} onClick={() => setN2win(5)} />}
        </div>
        <div style={{ height: '1em' }} />
        <div>Draw Tiles From Deck:</div>
        {<Option prompt='sequentially' on={draw === DRAW_SEQ} onClick={() => setDraw(DRAW_SEQ)} />}
        {<Option prompt='randomly' on={draw === DRAW_RANDOM} onClick={() => setDraw(DRAW_RANDOM)} />}
        <div style={{ height: '1em' }} />
        <div>Tile Size:</div>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '1.5em' }}>
            {<Option prompt='S' on={zoom === 0.85} onClick={() => setZoom(0.85)} />}
            {<Option prompt='M' on={zoom === 1} onClick={() => setZoom(DEFAULT_ZOOM)} />}
            {<Option prompt='L' on={zoom === 1.2} onClick={() => setZoom(1.2)} />}
        </div>
        <div style={{ height: '1em' }} />
        <div className={classes} style={{ opacity: canReset ? 1 : 0.25 }} onClick={() => setScores([0, 0])}>reset score</div>
    </motion.div>;
};

export default Options;

const Option = (props) => {
    const { prompt, on, disabled, onClick } = props;
    const opacity = disabled ? 0.25 : 1;

    const onPointerDown = (e) => {
        e.stopPropagation();
        !disabled && onClick();
    };

    const classes = `option ${disabled ? 'non-clickable' : 'clickable'}`;

    return <motion.div className={classes} animate={{ opacity }} onPointerDown={onPointerDown}>
        <div className='round-button' animate={{ opacity: on ? 1 : 0 }} >
            <motion.div className='option-bullet' animate={{ opacity: on ? 1 : 0 }} />
        </div>
        <div className='option-prompt'>
            {prompt}
        </div>
    </motion.div>;
};