import { Fragment, useCallback, useEffect, useState } from 'react';

import Input from './UI/Input';

import styles from './InvitationForm.module.css';
import RadioButtonGroup from './UI/RadioButtonGroup';
import CompanyCard from './CompanyCard';
import InputAutocomplete from './UI/InputAutocomplete';
import ButtonGeneral from './UI/ButtonGeneral';

const InvitationForm = props => {
    const [responseInvitation, setResponseInvitation] = useState();
    const [hasCompany, setHasCompany] = useState();
    const [selectedGuests, setSelectedGuests] = useState([]);
    const [guestOptions, setGuestOptions] = useState([]);

    const radioGroupInviteResponse = [{value: 'Y', label:'Si, contá conmigo'}, {value: 'N', label:'No puedo, lo siento'}];
    const radioGroupCompany = [{value: 'Y', label:'Si'}, {value: 'N', label:'No'}];

    useEffect(() => {
        const options = props.guests.map(guest =>  { return {id: guest.id, value: guest.name, checked: guest.attend} });
        setGuestOptions(options);
    }, [props.guests]);
    

    const onCheckHandler = (value) => {
        setResponseInvitation(value);
    }

    const onHasCompanyHandler = (value) => {
        setHasCompany(value);
    }

    const onSubmitHandler = (e) => {
        console.log('submit');
        const guests = selectedGuests.map(guest =>  { return {id: guest.id, name: guest.value, attend: guest.checked} });
        console.log(guests);
        e.preventDefault();
    }

    const onSelectGuest = (guest) => {
        console.log("select")
        setGuestOptions(prevGuestOptions => {
            prevGuestOptions.splice(prevGuestOptions.indexOf(guest), 1);
            return prevGuestOptions;
        });
        setSelectedGuests(prevSelectedGuests => {
            return [...prevSelectedGuests, guest];
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
                    <Input label="NÚMERO DE TELÉFONO"/>
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
        </Fragment>
    );
}

export default InvitationForm;