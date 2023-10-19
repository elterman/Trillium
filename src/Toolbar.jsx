import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import Check from './Pix/Check.png';
import Cog from './Pix/Cog.png';
import Help from './Pix/Help.png';
import Mail from './Pix/Mail.png';
import Restart from './Pix/Restart.png';
import X from './Pix/X.png';
import Watch from './Pix/YouTube.png';
import { a_confirm, a_help, a_message, a_options, a_over, a_prompt } from './atoms';

const Toolbar = () => {
    const [, setConfirm] = useAtom(a_confirm);
    const [prompt] = useAtom(a_prompt);
    const [confirm] = useAtom(a_confirm);
    const [over] = useAtom(a_over);
    const [message] = useAtom(a_message);
    const [help, setHelp] = useAtom(a_help);
    const [options, setOptions] = useAtom(a_options);

    const bg = (color, disabled = false) => {
        if (disabled) {
            color = '808080';
        }

        return `radial-gradient(circle at 10% 10%, #${color} 0%, #${color}20 90%)`;
    };

    const renderButton = (props) => {
        const { src, color, width, disabled, onClick } = props;
        const pointerEvents = disabled ? 'none' : 'all';
        const background = bg(color, disabled);
        const classes = `btn-img ${disabled ? 'btn-img-disabled' : ''}`;

        return <div className='button' style={{ pointerEvents, background }} onClick={onClick}>
            <img className={classes} src={src} alt='restart' width={width} />
        </div>;
    };

    const renderRestart = () => {
        const disabled = !!prompt || !!confirm || !!over || message;
        return renderButton({ src: Restart, color: '00D26A', width: 24, disabled, onClick: () => setConfirm('Start over?') });
    };

    const renderWatch = () => {
        return <a href="https://youtu.be/95TNVAb0z3w" target="_blank" rel="noopener noreferrer">
            {renderButton({ src: Watch, color: 'E6351C', width: 25, disabled: !!message })}</a>;
    };

    const renderHelp = () => {
        return renderButton({
            src: help ? X : Help, color: '219DE1', width: help ? 18 : 13, disabled: !!message,
            onClick: () => setHelp(!help)
        });
    };

    const renderMail = () => {
        return <a href="mailto:bmgomg@gmail.com?subject=Trillium" target="_blank" rel="noopener noreferrer">
            {renderButton({ src: Mail, color: 'FF5EDE', width: 23, disabled: !!message })}</a>;
    };
    const renderOptions = () => {
        return renderButton({
            src: options ? Check : Cog, color: '7F5EFF', width: options ? 20 : 25, disabled: !!message,
            onClick: () => setOptions(!options)
        });
    };

    return <motion.div id='toolbar' className='toolbar' animate={{ opacity: message ? 0 : 1 }}>
        {!help && !options && renderRestart()}
        {help && renderWatch()}
        {!options && renderHelp()}
        {help && renderMail()}
        {!help && renderOptions()}
    </motion.div>;
};

export default Toolbar;