/* eslint-disable max-len */
import { motion } from 'framer-motion';
import _ from 'lodash';
import { onMobile, scrollClass, windowSize } from './utils';
import { useAtom } from 'jotai';
import { a_options } from './atoms';
import { useEffect } from 'react';

const Help = () => {
    const [, setOptions] = useAtom(a_options);
    useEffect(() => setOptions(false), [setOptions]);

    const { x: wx, y: wy } = windowSize();
    const warning = onMobile() && (wx < 600 || wy < 600);
    const classes = `${scrollClass()} help-content`;
    const gridArea = onMobile() ? '2/1/2/span 3' : '2/2';
    const margin = onMobile() ? '0 2em' : 0;

    return <>
        <div className='help-header'> TRILLIUM</div>
        <motion.div className='help' style={{ gridArea, margin }} animate={{ opacity: 1 }}>
            <div className={classes} style={{ overflowX: 'hidden' }}>
                {warning && <>
                    <Item text="•600 × 600 is the recommended minimum screen size.•" />
                    <div className='divider' /></>}
                <Item text="Trillium is a strategy game for two players." />
                <Item text="There are two decks of square tiles – one deck for each player." />
                <Item text="There are 12 tiles in each deck initially." />
                <Item text="Each tile is divided into four sectors, colored either red or blue." />
                <Item text="The color of the knob in the center of each tile indicates which player the tile belongs to." />
                <Item text="The winner is the first player to arrange 5 of their tiles in a straight line, in any direction, including diagonals." />
                <div className='divider' />
                <Item text="Players take turns drawing a single tile from their deck and placing it in the recatangular grid on the board." />
                <Item text="Tiles can be drawn either randomly (default) or sequentially. Set your preference in Settings." />
                <Item text="Each tile on the board (except for the first one) must always be •adjacent to• (share a side with) •at least one other tile.•" />
                <Item text="•The two sectors sharing a side must be of the same color.•" />
                <Item text="Before placing the tile from the deck on the board, the player can •reposition and/or rotate any of their tiles• already on the board, subject to the following restrictions:" />
                <Item text=" The color-matching rule must be followed." />
                <Item text=" The repositioned tile must be adjacent to •the same or a greater• number of tiles as at the previous position." />
                <Item text=' All tiles on the board must form one •contiguous• block – no "islands" are allowed.' />
                <Item text="To move a tile, first click on one of its sectors to select it, then click on a sector in the grid to indicate how the tile should be positioned on the board. A tile can be •rotated in place• this way as well." />
                <Item text="Once the player places the tile from the deck on the board, the turn goes to the other player." />
                <Item text="You can •skip your turn• by clicking on the other player's icon. You must skip your turn if you are unable to place your next tile anywhere on the board." />
                <Item text="The game is declared a draw if neither player has achieved the objective by the time the last tile is placed on the board." />
            </div>
        </motion.div>
    </>;
};

export default Help;

const Item = props => {
    let { text } = props;
    let off = 0;

    if (text.startsWith(' ')) {
        text = text.slice(1);
        off = 30;
    }

    const runs = _.split(text, '•');

    return (
        <div className="help-item" style={{ padding: `7px 5px 7px ${off}px` }}>
            <span className='help-bullet' />
            <div>
                {_.map(runs, (run, i) => {
                    return (
                        <span key={i} style={{ color: `${i % 2 ? '#FFF' : '#D9E2FFD0'}` }}>
                            {run}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};
