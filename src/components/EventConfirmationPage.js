import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import InvitationForm from "./InvitationForm";
import { get } from "./utils/RestUtil";


const EventConfirmationPage = (props) => {

    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        console.log(eventId);
        get("/guests", [{key: 'eventId', value: eventId}]).then(
            (response) => {
                setGuests(response.body);
            }
        );
    }, [eventId]);

    return (
        <InvitationForm guests={guests}/>
    )
}

export default EventConfirmationPage;