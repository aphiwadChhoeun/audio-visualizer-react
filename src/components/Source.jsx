import { useRef, useState } from 'react';
import { Upload } from 'react-feather';
import Button from './Button';

import styles from './Source.module.css';

const Source = ({ fileHandler }) => {
    const inputRef = useRef(null);
    const [filename, setFilename] = useState(null);

    const clickHandler = () => {
        inputRef.current?.click();
    };

    const fileOpenHandler = (file) => {
        fileHandler(file);
        setFilename(file.name);
    };

    return (
        <div className={styles.container}>
            <Button onClick={() => clickHandler()}>
                <Upload color="#fff" />
            </Button>
            <input
                ref={inputRef}
                type="file"
                onChange={(e) => fileOpenHandler(e.target.files[0])}
            />

            <div className={styles.filename}>{filename}</div>
        </div>
    );
};

export default Source;
