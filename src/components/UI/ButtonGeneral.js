
import styles from './ButtonGeneral.module.css';

const ButtonGeneral = props => {

    const onActionHandler = () => {
        if (props.onAction) {
            if (typeof props.index === 'number') {
                props.onAction(undefined, props.index);
            } else {
                props.onAction();
            }
        }
    }

    return (
        <button className={styles.button}
            type={props.type || 'button'}
            onClick={onActionHandler}
        >{props.label}</button>
    )
}

export default ButtonGeneral;