import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EventHeader from "./EventHeader";
import InvitationForm from "./InvitationForm";
import LoadingSpinner from "../../UI/Spinner";

import { get } from "../../utils/RestUtil";

import styles from './EventConfirmationPage.module.css';
import ConfirmationModal from "../../ConfirmationModal";


const EventConfirmationPage = (props) => {
    console.log('Load EventConfirmationPage')

    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);
    const [loadingGuestsStatus, setLoadingGuestsStatus] = useState('none');

    useEffect(() => {
        console.log('getting guests by eventId: ' + eventId);
        get("/guests", [{key: 'eventId', value: eventId}]).then(
            (response) => {
                setGuests(response);
                setLoadingGuestsStatus('ok');
            },
            (error) => {
                setLoadingGuestsStatus('error');
            }
        );
    }, [eventId]);

    const hideConfirmatioModal = () => {
        setLoadingGuestsStatus('checked');
    }

    return (
        <div className={styles.container}>
            {loadingGuestsStatus === 'none' && <LoadingSpinner animation="border" variant="primary" />}
            {loadingGuestsStatus === 'error' && 
                <ConfirmationModal onClose={hideConfirmatioModal}
                    title='Error'
                    message='Error al obtener la lista de invitados'
                    icon='ERROR' />
            }
            <EventHeader />
            <InvitationForm guests={guests} eventId={eventId}/>
        </div>
    )
}

export default EventConfirmationPage;