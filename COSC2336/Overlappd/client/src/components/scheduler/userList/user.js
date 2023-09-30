import React from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { setUser } from "../../../features/user/userSlice";
import {useSelector, useDispatch} from "react-redux";

function User(props) {
    const {user, value} = props;
    const dispatch = useDispatch();

    const userSelect = () => {
        dispatch(setUser({user: value}))
    }

    return (
        <ToggleButton id={user} value={value} style={{minWidth: "15rem"}} variant="outline-primary" onClick={userSelect}>
            <p>{user}</p>
        </ToggleButton>
    )
}

export default User;