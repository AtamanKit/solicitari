import React, { useState } from 'react';

import { Form, Button } from 'react-bootstrap';

import { apiUrl } from './utils';


export default function PassReset() {
    const [validated, setValidated] = useState(false);

    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [response, setResponse] = useState('initial');

    const [loader, setLoader] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();

        setValidated(true);

        setLoader(true);

        const urlList = window.location.pathname.split('/');
        const uid = urlList[2];
        const token = urlList[3];

        fetch(`${apiUrl()}/auth/users/reset_password_confirm/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: uid,
                token: token,
                new_password: password,
                re_new_password: password2,
            })
        })
        .then(res => res.text())
        .then(result => setResponse(result))
        .catch(error => console.log(error));
    }

    let buttonTitle = 'Trimiteti'
    if (loader) {
        buttonTitle = 'Se incarca...'
    }

    if (response === '') {
        window.location.href = '/schimbareparolasucces'
    }

    return(
        <React.Fragment>
            <h1>INTRODUCETI PAROLA NOUA</h1>
            <Form
                noValidate
                validated={validated}
                className='form'
                onSubmit={handleSubmit}
            >
                {
                    response.includes('This password is too short. It must contain at least 8 characters')
                    ?   <Form.Label
                            style={{
                                color:'red',
                                backgroundColor:'yellow',
                                border:'1px solid',
                                borderRadius:'4px',
                                padding:'.2em .7em .2em .7em',
                                width:'100%',
                            }}
                        >
                            Parola trebuie sa contina cel putin 8 caractere
                        </Form.Label>
                    :   []
                }
                {
                    response.includes("The two password fields didn't match")
                    ?   <Form.Label
                            style={{
                                color:'red',
                                backgroundColor:'yellow',
                                border:'1px solid',
                                borderRadius:'4px',
                                padding:'.2em .7em .2em .7em',
                                width:'100%',
                            }}
                        >
                            Parola si confirmarea ei nu coincid
                        </Form.Label>
                    :   []
                }
                <Form.Group className='mb-3'>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        required
                        placeholder='Introduceti parola noua'
                        type='password'
                        onChange={
                            e => {
                                    setPassword(e.target.value);
                                    setLoader(false);
                            }
                        }
                    />
                    <Form.Control.Feedback type='invalid'>
                        Introduceti parola
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        placeholder='Confirmati parola'
                        type='password'
                        onChange={
                            e => {
                                setPassword2(e.target.value);
                                setLoader(false);
                            } 
                        }
                    />
                    <Form.Control.Feedback type='invalid'>
                        Introduceti confirmare parola
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Button
                        className='button'
                        type='submit'
                    >
                        { buttonTitle }
                    </Button>
                </Form.Group>
            </Form>
        </React.Fragment>
    )
}