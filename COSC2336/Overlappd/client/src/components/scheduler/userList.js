import React from 'react';
import User from './userList/user';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Container from 'react-bootstrap/Container';

function UserList() {
    return (
        <Container>
            <h1>Users</h1>
            <ToggleButtonGroup vertical classNametype="radio" name="options" defaultValue={0}>
                <User user="Waltah" value={0} />
                <User user="Jesse" value={1} />
                <User user="Hank" value={2} />
                <User user="Skyler" value={3} />
            </ToggleButtonGroup>
        </Container>
    )
}

export default UserList;