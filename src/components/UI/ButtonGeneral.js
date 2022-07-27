
import styles from './ButtonGeneral.module.css';

const ButtonGeneral = props => {

    return (
        <button className={styles.button}
            type={props.type || 'button'}
            onClick={props.onAction}
        >{props.label}</button>
    )
}

export default ButtonGeneral;