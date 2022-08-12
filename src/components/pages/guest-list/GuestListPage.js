import { Fragment, useEffect, useState } from "react";
import { BsCheckCircle, BsSquare, BsXCircle } from "react-icons/bs";
import { useParams } from "react-router-dom";

import { get } from "../../utils/RestUtil";
import { ATTEND_RESPONSE_ENUM } from "../../utils/AttendResponseEnum";

import styles from './GuestListPage.module.css';
import { accentFold } from "../../utils/StringUtils";


const GuestListPage = (props) => {
    console.log('Load GuestListPage')

    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        console.log('getting guests by eventId: ' + eventId);
        get("/guests", [{key: 'eventId', value: eventId}]).then(
            (response) => {
                const list = Array.from(response).sort((a, b) => {
                    if (accentFold(a.name.toLowerCase()) < accentFold(b.name.toLowerCase())) {
                        return -1;
                    }
                    if (accentFold(b.name.toLowerCase()) < accentFold(a.name.toLowerCase())) {
                        return 1;
                    }
                    return 0;
                });
                setGuests(list);
            }
        );
    }, [eventId]);
    return(
        <Fragment>
            <div>
                <h1 className={`${styles.title} ${styles.center}`}>Rocy Y Mati</h1>
                <div className={styles.data}>
                    <div>
                        <span className={styles.bold}>CANTIDAD DE INVITADOS: </span>
                        <span>{guests.length}</span>
                    </div>
                    <div>
                        <span className={styles.bold}>CANTIDAD DE CONFIRMADOS: </span>
                        <span>{guests.filter(guest => guest.attend === ATTEND_RESPONSE_ENUM.YES).length}</span>
                    </div>
                    <div>
                        <span className={styles.bold}>CANTIDAD DE RECHAZADOS: </span>
                        <span>{guests.filter(guest => guest.attend === ATTEND_RESPONSE_ENUM.NO).length}</span>
                    </div>
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.row}>
                    <div style={{width: '50%'}}>
                        <span className={styles.bold}>NOMBRE</span>
                    </div>
                    <div style={{width: '35%'}}>
                        <span className={styles.bold}>TELÉFONO</span>
                    </div>
                    <span></span>
                </div>
                {guests.map((guest, index) => 
                    <Fragment>
                        <hr className={styles.line} />
                        <div className={styles.row}
                            key={index}>
                                <div style={{width: '50%'}}>
                                    <span>{guest.name}</span>
                                </div>
                                <div style={{width: '35%'}}>
                                    <span>{guest.phone}</span>
                                </div>
                                {guest.attend === ATTEND_RESPONSE_ENUM.YES && <BsCheckCircle className={styles['icon-success']} />}
                                {guest.attend === ATTEND_RESPONSE_ENUM.NO && <BsXCircle className={styles['icon-error']} />}
                                {guest.attend === ATTEND_RESPONSE_ENUM.UNCONFIRMED && <BsSquare className={styles['icon-none']} />}
                        </div>
                    </Fragment>
                )}
            </div>
        </Fragment>
    )
}

export default GuestListPage;