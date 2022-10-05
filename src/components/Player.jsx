import { useContext, useMemo } from "react"
import Source from "./Source"
import Controls from "./Controls"

import PlayerCore, { PLAY_STATE } from '../lib/PlayerCore'
import PlayerContext from "../context/PlayerContext"
import Visualizer from "./Visualizer"

const Player = () => {
    const [state, setState] = useContext(PlayerContext)
    const { playerState, core } = useMemo(() => {
        return state
    }, [state])

    const fileHandler = (file) => {
        const tempCore = new PlayerCore(URL.createObjectURL(file))

        tempCore.subscribe((data) => {
            let filterAmount = Math.ceil(data.length * 0.7)
            let interval = Math.floor(filterAmount / state.bars.length)
            let d = []
            for (let i = 0; i < state.bars.length; i++) {
                d.push(data[i * interval])
            }

            setState(state => {
                return {
                    ...state,
                    bars: [...d]
                }
            })
        })

        setState(state => {
            return {
                ...state,
                core: tempCore
            }
        })
    }

    const controlHandler = () => {
        if (!playerState) {
            core.dispatch(PLAY_STATE.PLAY)
        } else {
            core.dispatch(PLAY_STATE.PAUSE)
        }

        setState(state => {
            return {
                ...state,
                playerState: !state.playerState
            }
        })
    }

    return (
        <div className="player-container">
            <Source fileHandler={fileHandler} />
            <Controls playerState={playerState} clickHandler={() => controlHandler()} />
            <Visualizer size={20} data={state.bars} />
        </div>
    )
}

export default Player