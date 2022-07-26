import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import Modal from './UI/Modal';

import classes from './ConfirmationModal.module.css';

const ConfirmationModal = props => {

    const navigate = useNavigate();

    const onClose = () => {
        if (props.navigate) {
            navigate(props.navigate);
        }
        if (props.onClose) {
            props.onClose();
            return;
        }
    }

    return <Modal onClose={props.onClose}>
        <div className={classes.title}>
            <h3>{props.title}</h3>
        </div>
        <div className={classes.message}>
            {props.icon === 'SUCCESS' && <BsCheckCircle className={classes['icon-success']} />}
            {props.icon === 'ERROR' && <BsXCircle className={classes['icon-error']} />}
            {props.message && <span style={{marginLeft: '1rem'}}>{props.message}</span>}
        </div>
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={onClose}>CERRAR</button>
        </div>
    </Modal>
}

export default ConfirmationModal;