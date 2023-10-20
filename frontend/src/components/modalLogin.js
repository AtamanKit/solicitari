import {
    Modal
} from 'react-bootstrap';

import SigninGoogle from './signinGoogle';
import SigninFacebook from './signinFacebook';

import SignIn from './signIn';
import LogIn from './logIn';
import PassResetEmail from './passResetEmail';

import { useState } from 'react';


export default function ModalLogin(props) {
    const [resetPass, setResetPass] = useState(false);

    return(
        <Modal show={props.show} onHide={props.close}>
                <Modal.Header closeButton>
                    {
                        !resetPass
                        ?   props.loginStatus
                            ?   <Modal.Title>Logati-va cu una din metode</Modal.Title>
                            :   <Modal.Title>Inregistrati-va</Modal.Title>
                        :   <Modal.Title>Resetare parola</Modal.Title>
                    }
                </Modal.Header>
                <div style={{
                        backgroundColor: 'rgb(210, 210, 210)',
                        height: '1px',
                    }}
                />
                {
                    !resetPass
                    ?   <div>
                            <Modal.Body>
                                <SigninGoogle />
                                <SigninFacebook />
                            </Modal.Body>
                            <div style={{
                                backgroundColor: 'rgb(210, 210, 210)',
                                height: '1px',
                                }}
                            />
                        </div>
                    :   []
                }
                <Modal.Body>
                    {
                        props.loginStatus
                        ?   resetPass
                            ?   <PassResetEmail />
                            :   <LogIn 
                                    forgotPassword={() =>
                                        setResetPass(true)
                                    }
                                />
                        :   <SignIn />
                    }
                </Modal.Body>
            </Modal>
    )
}


