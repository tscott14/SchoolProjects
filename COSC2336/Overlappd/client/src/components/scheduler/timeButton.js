import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { incrementSchedule, decrementSchedule } from "../../features/schedule/scheduleSlice";
import { flipAvailability } from "../../features/user/userSlice";
import Col from 'react-bootstrap/Col';

function TimeButton(props) {
    const {x, y} = props;
    const user = useSelector(state => state.user.user);

    const readUsers = useSelector(state => state.schedule.users);
    const readGroupSchedule = useSelector(state => state.schedule.schedule[x][y]);
    const readSchedule = useSelector(state => state.user.schedule[user][x][y]);
    const dispatch = useDispatch();
    const opacity = readGroupSchedule/readUsers;
    
    

    const handleAvailability = () => {
        dispatch(flipAvailability({user: user, x: x, y: y}))
        if (readSchedule == false) {
            dispatch(incrementSchedule({x: x, y: y}))
        }
        else {
            dispatch(decrementSchedule({x: x, y: y}))
        }
        //console.log("usersAvailable: " + readGroupSchedule)
        //console.log("users: " + readUsers)
        //console.log("opacity: " + opacity)
    }

    return (
        <Col as="Button" size="lg" style={{backgroundColor: readGroupSchedule ? `rgba(255,0,0,${opacity})` : "rgba(255,255,255,1)", minWidth: "6rem"}} variant="outline-primary" onClick={handleAvailability}>
        <p></p>
        </Col>
    );  
}

export default TimeButton;