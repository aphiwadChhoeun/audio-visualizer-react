import Button from './Button';
import { Play, Pause } from 'react-feather';

const Controls = ({ playerState, clickHandler }) => {
    return (
        <div className="controls-container">
            <Button onClick={clickHandler}>
                {playerState ? <Pause color="#fff" /> : <Play color="#fff" />}
            </Button>
        </div>
    );
};

export default Controls;
