import { useState } from 'react';

import {
    Form,
    Button
} from 'react-bootstrap';

import { apiUrl } from './utils';


export default function PassResetEmail() {
    const [validated, setValidated] = useState(false);

    const [email, setEmail] = useState('');

    const [resetResponse, setResetResponse] = useState('initial');

    const [loader, setLoader] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();

        setValidated(true);

        setLoader(true);

        fetch(`${apiUrl()}/auth/users/reset_password/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        })
        .then(res => res.text())
        .then(result => setResetResponse(result))
        .catch(error => console.log(error))
        
    }

    if (resetResponse === '') {
        window.location.
        href = 'resetparolaemail';
    }

    let buttonTitle = 'Trimiteti';
    if (loader) {
        buttonTitle = 'Incarcare...'
    }


    return(
        <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            {
                resetResponse.includes('User with given email does not exist')
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
                        Nu exista un cont cu astfel de email
                    </Form.Label>
                :   []
            }
            {
                resetResponse.includes('Enter a valid email address')
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
                        Eroare email
                    </Form.Label>
                :   []
            }
            <Form.Group className='mb-3'>
                <Form.Label>
                    Email
                </Form.Label>
                <Form.Control
                    required
                    placeholder='Trebuie sa contina @'
                    type='email'
                    onChange={
                        e => {
                                setEmail(e.target.value);
                                setLoader(false);
                        }
                    }
                />
                <Form.Control.Feedback type='invalid'>
                    Introduceti un email valid
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Button
                    className='button'
                    type='sumbit'
                >
                    { buttonTitle }
                </Button>
            </Form.Group>
        </Form>
    )
}