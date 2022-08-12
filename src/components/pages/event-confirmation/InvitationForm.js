import { Fragment, useEffect, useReducer, useRef, useState } from 'react';

import Input from '../../UI/Input';
import RadioButtonGroup from '../../UI/RadioButtonGroup';
import CompanyCard from './CompanyCard';
import InputAutocomplete from '../../UI/InputAutocomplete';
import ButtonGeneral from '../../UI/ButtonGeneral';
import ConfirmationModal from '../../ConfirmationModal';

import { post } from '../../utils/RestUtil';
import { ATTEND_RESPONSE_ENUM } from '../../utils/AttendResponseEnum';

import styles from './InvitationForm.module.css';

const nameReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return {value: action.val, isValid: action.val.userInput && action.val.selected};
    } else if (action.type === 'INPUT_BLUR') {
        let isValid = action.val ? action.val.userInput && action.val.selected : state.value ? state.isValid : false;
        return {value: state.value, isValid: isValid};
    }
    return {value: '', isValid: false}
}

const phoneReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return {value: action.val, isValid: action.val.match(/^\d{10}$/)};
    } else if (action.type === 'INPUT_BLUR') {
        return {value: state.value, isValid: state.value.match(/^\d{10}$/)};
    }
    return {value: '', isValid: false}
}

const InvitationForm = props => {
    console.log('Load InvitationForm');
    const [responseInvitation, setResponseInvitation] = useState();
    const [hasCompany, setHasCompany] = useState();
    const [selectedGuests, setSelectedGuests] = useState([]);
    const [guestOptions, setGuestOptions] = useState([]);
    const [confirmationModalData, setConfirmationModalData] = useState({show: false, title: '', message: ''});
    const [formIsValid, setFormIsValid] = useState(false);

    const [nameState, dispatchName] = useReducer(nameReducer, {value: '', isValid: true})
    const [phoneState, dispatchPhone] = useReducer(phoneReducer, {value: '', isValid: true})

    const radioGroupInviteResponse = [{value: 'Y', label:'Si, contá conmigo'}, {value: 'N', label:'No puedo, lo siento'}];
    const radioGroupCompany = [{value: 'Y', label:'Si'}, {value: 'N', label:'No'}];

    const { isValid: nameIsValid } = nameState;
    const { isValid: phoneIsValid } = phoneState;

    const phoneInputRef = useRef();
    const nameInputRef = useRef();

    useEffect(() => {
        const options = props.guests.map(guest =>  { return {id: guest.id, value: guest.name, checked: guest.attend === ATTEND_RESPONSE_ENUM.YES} });
        console.log('Load Guest options: ' + options.length);
        setGuestOptions(options);
    }, [props.guests]);

    useEffect(() => {
        const identifier = setTimeout(() => {
            setFormIsValid(
                phoneIsValid && nameIsValid && selectedGuests.length > 0
            );
        }, 500);
    
        return () => {
            clearTimeout(identifier);
        }
    }, [phoneIsValid, nameIsValid, selectedGuests]);

    const nameChangeHandler = (event) => {
        dispatchName({type: 'USER_INPUT', val: event});
    };

    const validateNameHandler = (event) => {
        dispatchName({type: 'INPUT_BLUR', val: event});
    };
    
    const phoneChangeHandler = (event) => {
        dispatchPhone({type: 'USER_INPUT', val: event.target.value});
    };

    const validatePhoneHandler = () => {
        dispatchPhone({type: 'INPUT_BLUR'});
    };

    const onCheckHandler = (value) => {
        if (value === 'N') {
            setHasCompany();
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
        e.preventDefault();
        dispatchName({type: 'INPUT_BLUR'});
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
            console.log('sended');
        } else if (!nameIsValid) {
            nameInputRef.current.focus();
        } else if (!phoneIsValid) {
            phoneInputRef.current.focus();
        }
    }

    const onSelectGuest = (guest, index) => {
        if (selectedGuests.includes(guest)) {
            return;
        }
        console.log("select")
        setGuestOptions(prevGuestOptions => {
            prevGuestOptions.splice(prevGuestOptions.indexOf(guest), 1);
            return prevGuestOptions;
        });
        let selectedGuestsNew = [...selectedGuests];
        if (typeof index === 'undefined') {
            selectedGuestsNew.unshift(guest);
        } else {
            selectedGuestsNew.push(guest);
        }
        console.log(selectedGuestsNew);
        setSelectedGuests(selectedGuestsNew);
    }

    const onDeselectGuest = (guest) => {
        if (!selectedGuests.includes(guest)) {
            return;
        }
        console.log("deselect")
        setGuestOptions(prevGuestOptions => {
            return [...prevGuestOptions, guest];
        });
        setSelectedGuests(prevSelectedGuests => {
            let index = prevSelectedGuests.indexOf(guest);
            if (index !== -1) prevSelectedGuests.splice(index, 1);
            return prevSelectedGuests;
        });
    }

    const hideConfirmationModal = () => {
        setConfirmationModalData({show: false, title: '', message: ''});
    }

    return (
        <Fragment>
            <form className={styles.form} onSubmit={onSubmitHandler}>
                <section className={styles['form-section']}>
                    <InputAutocomplete 
                        ref={nameInputRef}
                        label="NOMBRE Y APELLIDO"
                        suggestions={guestOptions}
                        onSelect={onSelectGuest}
                        onDeselect={onDeselectGuest}
                        notExistsError="El nombre ingresado no se encuentra en la lista de invitados"
                        checkedError="El invitado ya confirmó su asistencia"
                        onChange={nameChangeHandler}
                        onBlur={validateNameHandler} />
                    {/* {!nameState.showSuggestions && !nameState.selected && nameState.userInput && <span className={styles['check-error']}>{props.notExistsError}</span>} */}
                    {nameIsValid && nameState.option && nameState.option.checked && <span className={styles['check-error']}>El invitado ya confirmó su asistencia</span>}
                    {!nameIsValid && <span className={styles['check-error']}>Escribí tu nombre y seleccionalo de la lista</span>}
                    <Input 
                        ref={phoneInputRef}
                        label="NÚMERO DE TELÉFONO"
                        pattern="\d*"
                        maxlength="10"
                        onChange={phoneChangeHandler}
                        onBlur={validatePhoneHandler} />
                    {!phoneIsValid && <span className={styles['check-error']}>Escribí tu número de teléfono sin 0 y sin 15</span>}
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