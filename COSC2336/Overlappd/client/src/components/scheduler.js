
import Day from "./scheduler/day";
import TimeButton from "./scheduler/timeButton";
import TimeSlot from "./scheduler/timeSlot";
import "./scheduler.css";
//import {useSelector, useDispatch} from "react-redux";
//import { incrementUsers, decrementUsers, incrementSchedule, decrementSchedule } from "../features/schedule/scheduleSlice";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import UserList from './scheduler/userList';

function Scheduler(props) {
    //const readUsers = useSelector(state => state.users);
    //const readSchedule = (x, y) => useSelector(state => state.schedule[x][y]);
    //const dispatch = useDispatch();

    const buttonArray = [...Array(7).keys()];

    return (

        <Container className="d-flex justify-content-end">
            <Container>
                <h1>{props.title}</h1>
                <Row className="d-flex flex-nowrap">
                    <Day dayOfWeek="Full Availability" />
                    <Day dayOfWeek="Monday"    y={0} />
                    <Day dayOfWeek="Tuesday"   y={1} />
                    <Day dayOfWeek="Wednesday" y={2} />
                    <Day dayOfWeek="Thursday"  y={3} />
                    <Day dayOfWeek="Friday"    y={4} />
                    <Day dayOfWeek="Saturday"  y={5} />
                    <Day dayOfWeek="Sunday"    y={6} />
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="8-9am" x={0} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={0} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="9-10am" x={1} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={1} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="10-11am" x={2} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={2} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="11-12pm" x={3} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={3} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="12-1pm" x={4} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={4} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="1-2pm" x={5} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={5} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="2-3pm" x={6} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={6} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="3-4pm" x={7} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={7} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="4-5pm" x={8} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={8} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="5-6pm" x={9} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={9} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="6-7pm" x={10} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={10} y={i} key={i} />)}
                </Row>
                <Row className="d-flex flex-nowrap">
                    <TimeSlot time="7-8pm" x={11} />
                    {buttonArray.map((timeButton, i) => <TimeButton x={11} y={i} key={i} />)}
                </Row>
                <h2>Minimum overlap size: <Badge bg="primary">{props.hours}</Badge></h2>
                <h2>Minimum percent of attendees: <Badge bg="primary">{props.percent}</Badge></h2>
            </Container>
            <UserList />
        </Container>
    );  
}

export default Scheduler;