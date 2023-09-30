import React, { useState } from "react";
import Col from 'react-bootstrap/Col';

function TimeSlot(props) {
    //click on button and full day becomes available; in other words, fullday becomes 'true'
    const [available, setAvailable] = useState(false);                                         
    
    // const dayChanger = () => {
    //     setFullDay({...fullDay, fullDay.available: !available, color: 'red'});
    // }

    return (
            <Col as="Button" style={{backgroundColor: available ? 'red' : 'white', minWidth: "6rem"}} onClick={() => setAvailable(!available)}>
                <p>{props.time}</p>
            </Col>
    );  
}

export default TimeSlot;