import React from 'react'

export const initialState = {
    core: null,
    playerState: false,
    bars: Array(50).fill(0)
}

const PlayerContext = React.createContext(initialState)

export default PlayerContext