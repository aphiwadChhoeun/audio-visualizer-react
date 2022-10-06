export const PLAY_STATE = {
    PLAY: 'play',
    PAUSE: 'pause',
    END: 'end',
    SEEKING: 'seeking'
}

export const SUBSCRIBE_EVENT = {
    ANALYSER: 'analyser',
    PLAYER: 'player'
}

export function normalizeData(data) {
    const temp = [...data]
    const processed = temp.map(item => {
        return item / 255
    })

    return processed
}

export default class PlayerCore {
    constructor(path) {
        this.audio = document.createElement('audio')
        this.audio.src = path
        this.audio.currentTime = 0

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        this.analyser = this.audioCtx.createAnalyser()
        this.analyser.fftSize = 256

        const bufferSize = this.analyser.frequencyBinCount
        this.dataArray = new Uint8Array(bufferSize)

        this.source = this.audioCtx.createMediaElementSource(this.audio)
        this.source.connect(this.analyser)
        this.analyser.connect(this.audioCtx.destination)

        this.audio.addEventListener('ended', () => {
            this.audio.currentTime = 0
            cancelAnimationFrame(this.animationId)
            this.callbacks.get(SUBSCRIBE_EVENT.ANALYSER).forEach(callback => {
                callback.call(null, Array(this.dataArray.length).fill(0))
            })
            this.callbacks.get(SUBSCRIBE_EVENT.PLAYER).forEach(callback => {
                callback.call(null, {
                    state: PLAY_STATE.END
                })
            })
        })

        this.animationId = null
        this.callbacks = new Map()
        this.callbacks.set(SUBSCRIBE_EVENT.ANALYSER, [])
        this.callbacks.set(SUBSCRIBE_EVENT.PLAYER, [])
    }

    subscribe(event, callback) {
        let temp = this.callbacks.get(event)
        if (!temp) return

        temp.push(callback)
        this.callbacks.set(event, temp)
    }

    dispatch(type, payload = null) {
        this.playingState = !this.playingState

        switch (type) {
            case PLAY_STATE.PLAY:
                this.play()
                break;
            case PLAY_STATE.PAUSE:
                this.pause()
                break;
            default:
        }
    }

    play() {
        // if (this.audioCtx.state == 'suspended') {
        this.audio.play()
        this.animate()
        // }
    }

    pause() {
        // if (this.audioCtx.state == 'runnings') {
        this.audio.pause()
        cancelAnimationFrame(this.animationId)
        // }
    }

    animate() {
        this.analyser.getByteFrequencyData(this.dataArray)
        this.callbacks.get(SUBSCRIBE_EVENT.ANALYSER).forEach(callback => {
            callback.call(null, normalizeData(this.dataArray))
        })
        this.callbacks.get(SUBSCRIBE_EVENT.PLAYER).forEach(callback => {
            callback.call(null, {
                state: PLAY_STATE.SEEKING,
                payload: {
                    currentTime: this.audio.currentTime,
                    duration: this.audio.duration
                }
            })
        })

        this.animationId = requestAnimationFrame(this.animate.bind(this))
    }

    async dispose() {
        await this.audioCtx.close()
        this.analyser.disconnect()
        this.source.disconnect()
    }
}