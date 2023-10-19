import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { a_message } from './atoms';

const Message = () => {
    const [message] = useAtom(a_message);

    return <motion.div className='message' animate={{ opacity: message ? 1 : 0 }} transition={{ duration: message ? 0.3 : 0 }}>
        {message}
    </motion.div>;
};

export default Message;