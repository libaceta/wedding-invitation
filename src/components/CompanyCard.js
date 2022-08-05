import { useState } from 'react';

import styles from './CompanyCard.module.css';
import ButtonGeneral from './UI/ButtonGeneral';

import Input from './UI/Input';

const CompanyCard = props => {
    const [persons, setPersons] = useState([{name: '', tel: ''}]);

    const addSectionHandler = () => {
        setPersons((prevPersons) => {
            return [...prevPersons, {name: '', tel: ''}];
        });
    }

    const removeSectionHandler = (index) => {
        let newPersonList = [...persons];
        newPersonList.splice(index, 1);
        setPersons(newPersonList);
    }

    return (
        <div>
            <span>AGREGÁ A TUS INVITADOS</span>
            {
                persons.map((person, index) =>
                    <div className={styles.card} key={index}>
                        <section className={styles['form-section']}>
                            <Input label="NOMBRE Y APELLIDO"/>
                        </section>
                        {index > 0 && <ButtonGeneral label="REMOVER" onAction={removeSectionHandler} /> }
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