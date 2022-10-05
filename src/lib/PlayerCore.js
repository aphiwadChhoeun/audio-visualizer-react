export const PLAY_STATE = {
    PLAY: 'play',
    PAUSE: 'pause'
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

        const source = this.audioCtx.createMediaElementSource(this.audio)
        source.connect(this.analyser)
        this.analyser.connect(this.audioCtx.destination)

        this.audio.addEventListener('ended', () => {
            console.log('ended')
            this.audio.currentTime = 0
        })

        this.animationId = null
        this.callbacks = []
    }

    subscribe(callback) {
        this.callbacks.push(callback)
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
        console.log(this.audioCtx.state)

        // if (this.audioCtx.state == 'runnings') {
        this.audio.pause()
        cancelAnimationFrame(this.animationId)
        // }
    }

    animate() {
        this.analyser.getByteFrequencyData(this.dataArray)
        this.callbacks.forEach(callback => {
            callback.call(null, this.dataArray)
        })

        this.animationId = requestAnimationFrame(this.animate.bind(this))
    }
}