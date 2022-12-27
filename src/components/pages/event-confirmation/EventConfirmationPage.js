import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EventHeader from "./EventHeader";
import InvitationForm from "./InvitationForm";
import LoadingSpinner from "../../UI/Spinner";

import { get } from "../../utils/RestUtil";

import styles from './EventConfirmationPage.module.css';


const EventConfirmationPage = (props) => {
    console.log('Load EventConfirmationPage')

    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);
    const [loadingGuests, setLoadingGuests] = useState(true);

    useEffect(() => {
        console.log('getting guests by eventId: ' + eventId);
        get("/guests", [{key: 'eventId', value: eventId}]).then(
            (response) => {
                setGuests(response);
                setLoadingGuests(false);
            }
        );
    }, [eventId]);

    return (
        <div className={styles.container}>
            {loadingGuests && <LoadingSpinner animation="border" variant="primary" />}
            <EventHeader />
            <InvitationForm guests={guests} eventId={eventId}/>
        </div>
    )
}

export default EventConfirmationPage;