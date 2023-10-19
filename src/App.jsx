import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import './App.css';
import GamePage from './Game Page';
import BMG from './Pix/BMG.png';
import { a_help, a_state } from './atoms';
import Pattern from '/Pattern.png';
import { APP_STATE } from './const';
import { useForceUpdate } from './useForceUpdate';
import { defer, windowSize } from './utils';

const App = () => {
    const [starting, setStarting] = useState(true);
    const [splash, setSplash] = useState(true);
    const [once, setOnce] = useState(true);
    const [, setState] = useAtom(a_state);
    const [, setHelp] = useAtom(a_help);
    const forceUpdate = useForceUpdate(true);
    const { x: wx, y: wy } = windowSize();
    const [splashBackground, setSplashBackground] = useState('#8A0000');
    const [splashTitle, setSplashTitle] = useState(false);

    useEffect(() => {
        window.addEventListener('resize', forceUpdate);
        return () => window.removeEventListener('resize', forceUpdate);
    }, [forceUpdate]);

    if (once) {
        const loadState = () => {
            let json = localStorage.getItem(APP_STATE);
            let state = JSON.parse(json);

            if (state) {
                return state;
            }

            defer(() => setHelp(true), 1000);

            return { sound: true };
        };

        setOnce(false);

        defer(() => {
            setSplashTitle(true);
        }, 2000);

        defer(() => {
            const state = loadState();
            setState(state);

            setStarting(false);
            defer(() => setSplash(false), 300);
        }, 4000);
    }

    const renderContent = () => {
        const onClick = () => {
            localStorage.clear();
            setSplashBackground('#500000');
        };

        const bmgWidth = Math.min(300, Math.min(wx, wy) * 0.6);

        if (splash) {
            const backgroundImage = `radial-gradient(transparent, black 100%), url(${Pattern}`;

            return <motion.div className="splash" style={{ height: wy, width: wx }}
                animate={{ background: splashBackground, backgroundImage, opacity: starting ? 1 : 0 }} onClick={onClick}>
                {!splashTitle && <img src={BMG} alt="BMG" width={bmgWidth} />}
                {splashTitle && <motion.div className='trillium' animate={{ opacity: splashTitle ? 1 : 0 }}
                    transition={{ duration: 0.5 }}>TRILLIUM</motion.div>}
            </motion.div>;
        }

        if (starting) {
            return null;
        }

        return <div className='app-content' style={{ height: wy }}>
            <GamePage />
        </div>;
    };

    return (
        <motion.div className="app">
            {renderContent()}
        </motion.div>
    );
};

export default App;
