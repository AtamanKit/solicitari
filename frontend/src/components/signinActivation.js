import React from 'react';

import {
    Row,
    Button,
    Stack 
} from 'react-bootstrap';

import { apiUrl } from './utils';


export default function SigninActivation() {
    const handleActivation = () => {
        const urlList = window.location.pathname.split('/');
        const uid = urlList[2];
        const token = urlList[3];

        fetch(`${apiUrl()}/auth/users/activation/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: uid,
                token: token,
            })
        })
        .then(res => res.json())
        .then(result => console.log(result))
        .then(error => console.log(error));

        window.location.href = '/activaresucces'
    }

    return(
        <React.Fragment>
            <Row>
                <h1
                    style={{
                        textAlign: 'center',
                    }}
                >
                    ACTIVATI CONTUL APASIND BUTONUL:
                </h1>
            </Row>
            <Row
                style={{
                    backgroundColor: 'white',
                    padding: '.5em .5em .5em .5em',
                    borderRadius: '.5em',
                }}
            >
                <Stack 
                    gap={2}
                    direction='horizontal'
                >
                    <Button
                        onClick={handleActivation}
                    >
                        Activati contul
                    </Button>
                </Stack>
            </Row>
        </React.Fragment>
    )
}