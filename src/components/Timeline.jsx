import styles from './Timeline.module.css';

const Timeline = ({ current, total }) => {
    return (
        <div className={styles.container}>
            <input
                className={styles.timeline}
                type="range"
                max={total}
                value={current}
            />
        </div>
    );
};

export default Timeline;
