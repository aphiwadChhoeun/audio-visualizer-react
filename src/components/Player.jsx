import { useContext, useMemo } from 'react';
import Source from './Source';
import Controls from './Controls';

import PlayerCore, { PLAY_STATE, SUBSCRIBE_EVENT } from '../lib/PlayerCore';
import PlayerContext from '../context/PlayerContext';
import Visualizer from './Visualizer';
import Timeline from './Timeline';

import './Player.css';

const Player = () => {
    const [state, setState] = useContext(PlayerContext);
    const { playerState, core, currentTime, duration } = useMemo(() => {
        return state;
    }, [state]);

    const fileHandler = async (file) => {
        let newPlayerState = state.playerState;
        let newBars = [...state.bars];
        if (state.core) {
            state.core.dispatch(PLAY_STATE.PAUSE);
            await state.core.dispose();
            newPlayerState = false;
            newBars = Array(newBars.length).fill(0);
        }

        const tempCore = new PlayerCore(URL.createObjectURL(file));

        tempCore.subscribe(SUBSCRIBE_EVENT.ANALYSER, (data) => {
            processBarData(data);
        });

        tempCore.subscribe(SUBSCRIBE_EVENT.PLAYER, (data) => {
            playerEventHanlder(data);
        });

        setState((state) => {
            return {
                ...state,
                playerState: newPlayerState,
                bars: newBars,
                core: tempCore,
            };
        });
    };

    const processBarData = (data) => {
        let filterAmount = Math.ceil(data.length * 0.7);
        let interval = Math.floor(filterAmount / state.bars.length);
        let d = [];
        for (let i = 0; i < state.bars.length; i++) {
            d.push(data[i * interval]);
        }

        setState((state) => {
            return {
                ...state,
                bars: [...d],
            };
        });
    };

    const playerEventHanlder = (data) => {
        const { state, payload } = data;
        switch (state) {
            case PLAY_STATE.END:
                setState((state) => {
                    return {
                        ...state,
                        playerState: false,
                    };
                });
                break;
            case PLAY_STATE.SEEKING:
                const { currentTime, duration } = payload;

                setState((state) => {
                    return {
                        ...state,
                        currentTime: (currentTime * 100) / duration,
                    };
                });
                break;
            default:
        }
    };

    const controlHandler = () => {
        if (!playerState) {
            core.dispatch(PLAY_STATE.PLAY);
        } else {
            core.dispatch(PLAY_STATE.PAUSE);
        }

        setState((state) => {
            return {
                ...state,
                playerState: !state.playerState,
            };
        });
    };

    return (
        <div className="player-container">
            <div className="control-bar">
                <div className="controller">
                    <Source fileHandler={fileHandler} />
                    <Controls
                        playerState={playerState}
                        clickHandler={() => controlHandler()}
                    />
                    <div>{/* volume control */}</div>
                </div>
                <Timeline current={currentTime} total={duration} />
            </div>
            <Visualizer size={20} data={state.bars} />
        </div>
    );
};

export default Player;
