import { useAtom } from 'jotai';
import { a_mobile_popup, a_scores } from './atoms';

const Scores = () => {
    const [scores] = useAtom(a_scores);
    const [mobilePopup] = useAtom(a_mobile_popup);

    if (mobilePopup) {
        return null;
    }

    return <>
        <div className='score' style={{ color: '#CD9BCE', gridArea: '3/1' }}>{scores[0]}</div>
        <div className='score' style={{ color: '#9CCE9B', gridArea: '3/3' }}>{scores[1]}</div>
    </>;
};

export default Scores;