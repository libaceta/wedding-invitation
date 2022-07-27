import { Fragment, useState } from 'react';

import Input from './UI/Input';

import styles from './InvitationForm.module.css';
import RadioButtonGroup from './UI/RadioButtonGroup';
import CompanyCard from './CompanyCard';

const InvitationForm = props => {
    const [responseInvitation, setResponseInvitation] = useState();
    const [hasCompany, setHasCompany] = useState();

    const radioGroupInviteResponse = [{value: 'Y', label:'Si, contá conmigo'}, {value: 'N', label:'No puedo, lo siento'}];
    const radioGroupCompany = [{value: 'Y', label:'Si'}, {value: 'N', label:'No'}];

    const onCheckHandler = (value) => {
        setResponseInvitation(value);
    }

    const onHasCompanyHandler = (value) => {
        setHasCompany(value);
    }

    return (
        <Fragment>
            <form className={styles.form}>
                <section className={styles['form-section']}>
                    <Input label="NOMBRE Y APELLIDO"/>
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
                    <CompanyCard />
                }
            </form>
        </Fragment>
    );
}

export default InvitationForm;