import React, { useState } from 'react';

import { Form, Button } from 'react-bootstrap';

import { apiUrl } from './utils';

import { useDispatch } from 'react-redux';
import { addUser } from '../redux/features/auth/userSlice';


export default function LogIn(props) {
    const [email, setEmail] = useState(false);
    const [password, setPassword] = useState(false);

    const [validated, setValidated] = useState(false);
    const [loader, setLoader] = useState(false);

    const [loginPass, setLoginPass] = useState(true);

    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();

        setValidated(true);

        setLoader(true);

        fetch(`${apiUrl()}/auth/jwt/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })            
        })
        .then(res => res.json())
        .then(result => getUser(result))
        .catch(error => console.log(error))
    }

    const getUser = tokens => {
        if (tokens.access) {
            fetch(`${apiUrl()}/auth/users/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${tokens.access}`,
                },
            })
            .then(res => res.json())
            .then(result => handleStorage(
                                result,
                                tokens.access,
                                tokens.refresh,
                            )
            )
            .catch(error => console.log(error))

            setLoginPass(true)
        } else if (tokens.detail === 'No active account found with the given credentials') {
            setLoginPass(false)
        }
    }

    const handleStorage = (userData, tokenAccess, tokenRefresh) => {
        const user = JSON.parse(
            `{
                "user_id": "${userData.id}",
                "first_name": "${userData.first_name}",
                "last_name": "${userData.last_name}",
                "email": "${userData.email}",
                "image_url": "user_image",
                "from": "Rednord",
                "token_access": "${tokenAccess}",
                "token_refresh": "${tokenRefresh}",
                "timestamp": "${Date.now()}"
            }`
        );

        dispatch(addUser(user));

        // localStorage.setItem('userEmail', userData.email);

        window.location.href = '/';
    }

    const loginButton =
        !loader
        ?   'Log In'
        :   'Incarcare...'

    return(
        <React.Fragment>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
            >
                {
                    !loginPass
                    ?   <Form.Label 
                            style={{
                                color: 'red',
                                backgroundColor: 'yellow',
                                padding: '.2rem .2rem .2rem .7rem',
                                width: '100%',
                                border: '1px solid',
                                borderRadius: '4px',
                            }}
                        >
                            Ati introdus gresit unul din campuri sau adresa email nu este verificata
                        </Form.Label>
                    :   []
                }
                <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='Trebuie sa contina @'
                        onChange={e => {
                                        setEmail(e.target.value);
                                        setLoader(false)
                                    }
                                }
                    />
                    <Form.Control.Feedback type='invalid'>
                        Introduceti un email valid
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Parola'
                        onChange={e => {
                                    setPassword(e.target.value);
                                    setLoader(false)
                                }
                            }
                    />
                    <Form.Control.Feedback type='invalid'>
                        Introduceti parola
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Button 
                        className='button'
                        type='submit'
                    >
                        { loginButton }
                    </Button>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label
                        style={{
                            color:'blue',
                            fontSize:'1em',
                            textDecoration:'underline',
                            cursor:'pointer',
                        }}
                        onClick={props.forgotPassword}
                    >
                        Ati uitat parola?
                    </Form.Label>
                </Form.Group>
            </Form>
        </React.Fragment>
    )
}