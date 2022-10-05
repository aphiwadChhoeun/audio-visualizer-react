const Controls = ({playerState, clickHandler}) => {
    return (
        <div className="controls-container">
            <button onClick={clickHandler}>{playerState ? 'Pause' : 'Play'}</button>
        </div>
    )
}

export default Controls