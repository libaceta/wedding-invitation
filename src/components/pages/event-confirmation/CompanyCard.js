import { useState } from 'react';

import ButtonGeneral from '../../UI/ButtonGeneral';
import InputAutocomplete from '../../UI/InputAutocomplete';

import styles from './CompanyCard.module.css';

const CompanyCard = props => {
    const [persons, setPersons] = useState([{name: '', tel: ''}]);

    const addSectionHandler = () => {
        setPersons((prevPersons) => {
            return [...prevPersons, {name: '', tel: ''}];
        });
    }

    const selectGuestHandler = (guest, index) => {
        setPersons((prevPersons) => {
            prevPersons[index].name = guest.value;
            return [...prevPersons];
        });
        props.onSelect(guest, index);
    }

    const removeSectionHandler = (guest, index) => {
        if (guest) {
            props.onDeselect(guest);
        } else if (typeof index !== 'undefined') {
            let newPersonList = [...persons];
            let personRemoved = newPersonList.splice(index, 1)[0];
            setPersons(newPersonList);
            
            let guestToRemove = props.selectedGuests.filter(guest => guest.value === personRemoved.name);
            if (guestToRemove && guestToRemove.length > 0) {
                props.onDeselect(guestToRemove[0]);
            }
        }
    }

    return (
        <div>
            <span>AGREGÁ A TUS INVITADOS</span>
            {
                persons.map((person, index) =>
                    <div className={styles.card} key={index}>
                        <section className={styles['form-section']}>
                            <InputAutocomplete
                                index={index}
                                label="NOMBRE Y APELLIDO"
                                suggestions={props.guests}
                                onSelect={selectGuestHandler}
                                onDeselect={removeSectionHandler}
                                notExistsError="El nombre ingresado no se encuentra en la lista de invitados"
                                checkedError="El invitado ya confirmó su asistencia"
                            />
                        </section>
                        {index > 0 && <ButtonGeneral index={index} label="REMOVER" onAction={removeSectionHandler} /> }
                    </div>
                )
            }
            <div className={styles['button-add']}>
                <ButtonGeneral label="AGREGAR INVITADO" onAction={addSectionHandler} />
            </div>
        </div>
    )
}

export default CompanyCard;