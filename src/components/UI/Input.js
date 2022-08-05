import { Fragment } from 'react';

import styles from './Input.module.css';

const Input = (props) => {
    return (
        <Fragment>
            <label className={styles.label}>{props.label}</label>
            <input className={styles['input-rounded']} />
        </Fragment>
    );
}

export default Input;