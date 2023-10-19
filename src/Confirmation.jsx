const Confirmation = (props) => {
    const { prompt, onConfirm } = props;

    return <div className='confirmation'>
        <div style={{ gridArea: '1/1/1/span 2', placeSelf: 'center' }}>{prompt}</div>
        <div className='confirmation-option' style={{ gridArea: '2/1', justifySelf: 'end' }}
            onClick={() => onConfirm(true)}>Yes</div>
        <div className='confirmation-option' style={{ gridArea: '2/2', justifySelf: 'start' }}
            onClick={() => onConfirm(false)}>No</div>
    </div>;
};

export default Confirmation;