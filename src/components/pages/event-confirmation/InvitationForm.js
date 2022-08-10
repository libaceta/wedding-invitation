import { Fragment, useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

import Input from '../../UI/Input';
import RadioButtonGroup from '../../UI/RadioButtonGroup';
import CompanyCard from './CompanyCard';
import InputAutocomplete from '../../UI/InputAutocomplete';
import ButtonGeneral from '../../UI/ButtonGeneral';
import ConfirmationModal from '../../ConfirmationModal';

import { post } from '../../utils/RestUtil';
import { ATTEND_RESPONSE_ENUM } from '../../utils/AttendResponseEnum';

import styles from './InvitationForm.module.css';

const phoneReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return {value: action.val, isValid: action.val.match(/^\d{10}$/)};
    } else if (action.type === 'INPUT_BLUR') {
      return {value: state.value, isValid: state.value.match(/^\d{10}$/)}
    }
    return {value: '', isValid: false}
  }

const InvitationForm = props => {
    const navigate = useNavigate();
    
    const [responseInvitation, setResponseInvitation] = useState();
    const [hasCompany, setHasCompany] = useState();
    const [selectedGuests, setSelectedGuests] = useState([]);
    const [guestOptions, setGuestOptions] = useState([]);
    const [confirmationModalData, setConfirmationModalData] = useState({show: false, title: '', message: ''});
    const [formIsValid, setFormIsValid] = useState(false);

    const [phoneState, dispatchPhone] = useReducer(phoneReducer, {value: '', isValid: true})

    const radioGroupInviteResponse = [{value: 'Y', label:'Si, contá conmigo'}, {value: 'N', label:'No puedo, lo siento'}];
    const radioGroupCompany = [{value: 'Y', label:'Si'}, {value: 'N', label:'No'}];

    const { isValid: phoneIsValid } = phoneState;

    const phoneInputRef = useRef();

    useEffect(() => {
        const options = props.guests.map(guest =>  { return {id: guest.id, value: guest.name, checked: guest.attend === ATTEND_RESPONSE_ENUM.YES} });
        setGuestOptions(options);
    }, [props.guests]);

    useEffect(() => {
        const identifier = setTimeout(() => {
            setFormIsValid(
                phoneIsValid && selectedGuests.length > 0
            );
        }, 500);
    
        return () => {
            clearTimeout(identifier);
        }
    }, [phoneIsValid, selectedGuests]);
    
    const phoneChangeHandler = (event) => {
        dispatchPhone({type: 'USER_INPUT', val: event.target.value});
    };

    const validatePhoneHandler = () => {
        dispatchPhone({type: 'INPUT_BLUR'});
    };

    const onCheckHandler = (value) => {
        if (value === 'N') {
            setSelectedGuests(prevSelectedGuests => { return [prevSelectedGuests[0]] });
        }
        setResponseInvitation(value);
    }

    const onHasCompanyHandler = (value) => {
        if (value === 'N') {
            setSelectedGuests(prevSelectedGuests => { return [prevSelectedGuests[0]] });
        }
        setHasCompany(value);
    }

    const onSubmitHandler = (e) => {
        console.log('submit');
        e.preventDefault();
        dispatchPhone({type: 'INPUT_BLUR'});
        if (formIsValid) {
            const guests = selectedGuests.map((guest, index) =>  {
                let guestTransform = {id: guest.id, name: guest.value, attend: responseInvitation === 'Y' ? ATTEND_RESPONSE_ENUM.YES : ATTEND_RESPONSE_ENUM.NO}
                if (index === 0) {
                    guestTransform.phone = phoneState.value;
                }
                return guestTransform;
            });
            console.log(guests);
            post('/events/' + props.eventId + '/confirm-invitations', undefined, guests).then((response) => {
                setConfirmationModalData({show: true, title: 'Su confirmación fue enviada correctamente', message: '', icon: 'SUCCESS', navigate: '/thanks'});
            }).catch((error) => {
                setConfirmationModalData({show: true, title: 'Error al enviar su confirmación', message: 'Por favor intentelo de nuevo más tarde', icon: 'ERROR'});
            });
        } else if (!phoneIsValid) {
            phoneInputRef.current.focus();
        }
    }

    const onSelectGuest = (guest, index) => {
        console.log("select")
        setGuestOptions(prevGuestOptions => {
            prevGuestOptions.splice(prevGuestOptions.indexOf(guest), 1);
            return prevGuestOptions;
        });
        setSelectedGuests(prevSelectedGuests => {
            if (typeof index === 'undefined') {
                prevSelectedGuests.unshift(guest);
            } else {
                prevSelectedGuests = [...prevSelectedGuests, guest];
            }
            return prevSelectedGuests;
        });
        console.log(selectedGuests);
    }

    const onDeselectGuest = (guest) => {
        console.log("deselect")
        setGuestOptions(prevGuestOptions => {
            return [...prevGuestOptions, guest];
        });
        setSelectedGuests(prevSelectedGuests => {
            let index = prevSelectedGuests.indexOf(guest);
            if (index !== -1) prevSelectedGuests.splice(index, 1);
            return prevSelectedGuests;
        });
        console.log(selectedGuests);
    }

    const hideConfirmationModal = () => {
        setConfirmationModalData({show: false, title: '', message: ''});
    }

    return (
        <Fragment>
            <form className={styles.form} onSubmit={onSubmitHandler}>
                <section className={styles['form-section']}>
                    <InputAutocomplete 
                        label="NOMBRE Y APELLIDO"
                        suggestions={guestOptions}
                        onSelect={onSelectGuest}
                        onDeselect={onDeselectGuest}
                        notExistsError="El nombre ingresado no se encuentra en la lista de invitados"
                        checkedError="El invitado ya confirmó su asistencia" />
                    <Input 
                        ref={phoneInputRef}
                        label="NÚMERO DE TELÉFONO"
                        pattern="\d*"
                        maxlength="10"
                        onChange={phoneChangeHandler}
                        onBlur={validatePhoneHandler} />
                    {!phoneIsValid && <span className={styles['check-error']}>Escriba el número de teléfono sin 0 y sin 15</span>}
                </section>
                <fieldset className={styles['fieldset-radio-group']}>
                    <legend>VENÍS AL EVENTO?</legend>
                    <RadioButtonGroup onCheck={onCheckHandler} options={radioGroupInviteResponse}/>
                </fieldset>
                {responseInvitation === "Y" &&
                    <fieldset className={styles['fieldset-radio-group']}>
                        <legend>VENÍS ACOMPAÑADO?</legend>
                        <RadioButtonGroup onCheck={onHasCompanyHandler} options={radioGroupCompany}/>
                    </fieldset>
                }
                {responseInvitation === 'Y' && hasCompany === 'Y' && 
                    <CompanyCard 
                        guests={guestOptions}
                        selectedGuests={selectedGuests}
                        onSelect={onSelectGuest}
                        onDeselect={onDeselectGuest}
                    />
                }
                <div className={styles['container-button']}>
                    <ButtonGeneral
                        type="submit"
                        label="CONFIRMAR"
                    />
                </div>
            </form>
            {confirmationModalData.show && 
                <ConfirmationModal onClose={hideConfirmationModal}
                    title={confirmationModalData.title}
                    message={confirmationModalData.message}
                    icon= {confirmationModalData.icon}
                    navigate={confirmationModalData.navigate} />
            }
        </Fragment>
    );
}

export default InvitationForm;