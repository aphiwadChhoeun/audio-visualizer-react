import styles from './Visualizer.module.css';

const Visualizer = ({ size, data }) => {
    return (
        <div className={styles.container}>
            {data.map((bar, index) => (
                <div
                    key={index}
                    className={styles.bar}
                    style={{
                        height: bar * 80 + 'vh',
                        backgroundImage:
                            'linear-gradient(to bottom, rgba(' +
                            bar * 240 +
                            ',37,103,1), rgba(' +
                            bar * 250 +
                            ',38,151,1), rgba(' +
                            bar * 240 +
                            ',37,103,1))',
                    }}
                ></div>
            ))}
        </div>
    );
};

export default Visualizer;
