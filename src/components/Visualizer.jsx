import styles from './Visualizer.module.css'

const Visualizer = ({ size, data }) => {

    return (
        <div className={styles.container}>
            {data.map((bar, index) => (
                <div key={index} className={styles.bar} style={{ height: (bar / 255) * 80 + 'vh', background: 'rgb(' + (bar / 255) * 240 + ', 110, 110)' }}></div>
            ))}
        </div>
    )
}

export default Visualizer