import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Backdrop } from './Modal';

import styles from "./Spinner.module.css";

const Spinner = props => {
    return <div className={styles.container}>
            <div className={styles['spinner-container']}>
                <div className={styles['loading-spinner']}>
            </div>
        </div>
    </div>
}

const portalElement = document.getElementById('overlays');

const LoadingSpinner = () => {
  return (
    <Fragment>
        {ReactDOM.createPortal(<Backdrop />, portalElement)}
        {ReactDOM.createPortal(<Spinner />, portalElement)}
    </Fragment>
  );
}

export default LoadingSpinner