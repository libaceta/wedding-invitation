import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EventHeader from "./EventHeader";
import InvitationForm from "./InvitationForm";
import { get } from "../../utils/RestUtil";

import styles from './EventConfirmationPage.module.css';


const EventConfirmationPage = (props) => {

    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        console.log('getting guests by eventId: ' + eventId);
        get("/guests", [{key: 'eventId', value: eventId}]).then(
            (response) => {
                setGuests(response);
            }
        );
    }, [eventId]);

    return (
        <div className={styles.container}>
            <EventHeader />
            <InvitationForm guests={guests} eventId={eventId}/>
        </div>
    )
}

export default EventConfirmationPage;