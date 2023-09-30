import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementSchedule, decrementSchedule } from "../../features/schedule/scheduleSlice";
import { flipAvailability } from "../../features/user/userSlice";
import Col from 'react-bootstrap/Col';

function Day(props) {
    const {y} = props;
    const user = useSelector(state => state.user.user);

    let i = 0;
    const readSchedule = useSelector(state => state.user.schedule[user][i][y]);
    const dispatch = useDispatch();
    
    const handleAvailability = () => {
        for (i = 0; i < 12; i++) {
            dispatch(flipAvailability({user: user, x: i, y: y}))
            if (readSchedule == false) {
                dispatch(incrementSchedule({x: i, y: y}))
            }
            else {
                dispatch(decrementSchedule({x: i, y: y}))
            }
        }
    }

    return (
        <Col as="Button" style={{backgroundColor: false ? 'red' : 'white', minWidth: "6rem"}} onClick={handleAvailability}>
            <p>{props.dayOfWeek}</p>
        </Col>
    );  
}

export default Day;