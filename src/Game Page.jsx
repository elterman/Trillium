import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { useEffect } from 'react';
import './App.css';
import Board from './Board';
import Confirmation from './Confirmation';
import Deck from './Deck';
import Help from './Help';
import Options from './Options';
import Pattern from '/Pattern.png';
import Player from './Player';
import Toolbar from './Toolbar';
import Tray from './Tray';
import { a_confirm, a_help, a_once, a_over, a_prompt, a_restart, a_selected_from, a_options, a_animated, a_remesh, } from './atoms';
import { a_board_dims, a_message, a_make_decks, a_draw, a_deck_visible, a_selected_to, a_streak, a_surrender, } from './atoms';
import { a_tiles, a_tray_tile, a_turn } from './atoms';
import { PROMPT_PLAY_AGAIN, PROMPT_START } from './const';
import { usePlaySound } from './usePlaySound';
import useTray from './useTray';
import { deckTileSize, defer, placedTiles, xy } from './utils';
import Scores from './Scores';
import Message from './Message';

const GamePage = () => {
    const [prompt, setPrompt] = useAtom(a_prompt);
    const [tiles] = useAtom(a_tiles);
    const [restart, setRestart] = useAtom(a_restart);
    const [trayTile] = useAtom(a_tray_tile);
    const { addToTray, removeFromTray } = useTray();
    const [, setSelectedFrom] = useAtom(a_selected_from);
    const [, setSelectedTo] = useAtom(a_selected_to);
    const [, setTurn] = useAtom(a_turn);
    const [once, setOnce] = useAtom(a_once);
    const [over, setOver] = useAtom(a_over);
    const [, setStreak] = useAtom(a_streak);
    const [, setSurrender] = useAtom(a_surrender);
    const [confirm, setConfirm] = useAtom(a_confirm);
    const [, setDeckVisible] = useAtom(a_deck_visible);
    const [help] = useAtom(a_help);
    const [options] = useAtom(a_options);
    const [draw] = useAtom(a_draw);
    const [animated] = useAtom(a_animated);
    const [dims, setDims] = useAtom(a_board_dims);
    const [, remesh] = useAtom(a_remesh);
    const playSound = usePlaySound();
    const [, makeDecks] = useAtom(a_make_decks);
    const [, setMessage] = useAtom(a_message);

    useEffect(() => {
        if (trayTile || prompt || _.some(tiles, tile => tile.animated || tile.place?.row)) {
            return;
        }

        setSurrender(false);
        setPrompt(PROMPT_START);

        if (!dims.rows) {
            defer(remesh);
        }
    }, [dims, prompt, remesh, setPrompt, setSurrender, tiles, trayTile]);

    useEffect(() => {
        if (!once) {
            return;
        }

        setOnce(false);

        if (over) {
            setOver(false);
            setStreak(null);

            _.each(tiles, tile => {
                delete tile.place;
                delete tile.turns;
            });

            makeDecks();
            setTurn(1);
        }
    }, [once, over, makeDecks, setOnce, setOver, setStreak, setTurn, tiles]);

    useEffect(() => {
        if (!restart) {
            return;
        }

        setRestart(false);
        setMessage(null);
        setOver(false);
        setStreak(null);
        setSurrender(true);
        removeFromTray();

        const _tiles = placedTiles(tiles);

        _.each(_tiles, tile => {
            const id = tile.id.replace('tile', 'spot');

            const { x: x1, y: y1 } = xy(id);
            const { x: x2, y: y2 } = xy(tile.id);

            tile.translate = { x: x2 - x1, y: y2 - y1 };
            tile.animated = true;
            tile.height = deckTileSize().height;

            delete tile.place;
            delete tile.turns;
        });

        defer(() => {
            setDeckVisible(false);
            defer(() => playSound('dice'), 250);

            defer(() => {
                makeDecks();
                setDeckVisible(true);
            }, 500);
        }, 1000);

        setSelectedFrom(null);
        setSelectedTo(null);
        setTurn(1);
        setDims({ rows: 0, cols: 0 });
    }, [draw, playSound, removeFromTray, restart, setDeckVisible, makeDecks, setDims, setOver, setRestart, setSelectedFrom,
        setSelectedTo, setStreak, setSurrender, setTurn, tiles, setMessage]);

    const renderPrompt = () => {
        const onClick = () => {
            playSound('tap');
            setPrompt(null);

            if (prompt === PROMPT_START) {
                addToTray();
            } else if (prompt === PROMPT_PLAY_AGAIN) {
                setRestart(true);
            }
        };

        const opacity = prompt ? 1 : 0;
        const fontSize = prompt === PROMPT_START ? '1em' : '0.9em';

        return <motion.div className='prompt-outer' animate={{ opacity, transform: `scale(${opacity})` }}>
            <div className={`prompt-inner prompt ${prompt ? '' : 'not-clickable'}`} style={{ fontSize }}
                onClick={onClick}>{prompt}</div>
        </motion.div>;
    };

    const renderOverlay = () => {
        if (animated || !!confirm || !!help || !!options) {
            return <div className='overlay'></div>;
        }

        return null;
    };

    const renderConfirm = () => {
        const onConfirm = (ok) => {
            if (!ok) {
                setConfirm(null);
                return;
            }

            playSound('tap');
            setConfirm(null);

            if (animated) {
                defer(() => setRestart(true), 1000);
            } else {
                setRestart(true);
            }
        };

        const opacity = confirm ? 1 : 0;

        return <motion.div className='prompt-outer' animate={{ opacity, transform: `scale(${opacity})` }} style={{ zIndex: 101 }}>
            <div className={'prompt-inner prompt'} style={{ height: 'initial' }}>
                <Confirmation prompt={confirm} onConfirm={onConfirm} />
            </div>
        </motion.div>;
    };

    const backgroundImage = `radial-gradient(transparent, black 100%), url(${Pattern})`;

    return once && over ? null : <div id='page' className='game-page' style={{ backgroundImage }}>
        <Player player={1} />
        <Scores />
        <Tray />
        <Player player={2} />
        <Deck player={1} />
        <Board />
        <Deck player={2} />
        {!help && !options && renderPrompt()}
        {renderOverlay()}
        {!help && !options && renderConfirm()}
        <Toolbar />
        <Message />
        {help && <Help />}
        {options && <Options />}
    </div>;
};

export default GamePage;
