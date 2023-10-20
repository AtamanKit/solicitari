import { useGoogleLogin } from '@react-oauth/google';

import { Form, Button } from 'react-bootstrap';

import { FcGoogle } from 'react-icons/fc';

import { apiUrl } from './utils';

import { useDispatch } from 'react-redux';
import { addUser } from '../redux/features/auth/userSlice';

// import axios from 'axios';


export default function SigninGoogle() {
    const dispatch = useDispatch();

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log(tokenResponse);
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenResponse.access_token}`
                }
            })
            .then(result => result.json())
            .then(res => {handleSubmit(res)})
            .catch(error => console.log(error))
        }
    })

    const handleSubmit = response => {
        fetch(`${apiUrl()}/auth/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: response.email,
                first_name: response.given_name,
                last_name: response.family_name,
                user_from: 'Google',
                password: 'rednordpassword',
                re_password: 'rednordpassword',
            })
        })
        .catch(error => console.log(error))

        const user = JSON.parse(
            `{
                "user_id": "${response.sub}",
                "first_name": "${response.given_name}",
                "last_name": "${response.family_name}",
                "email": "${response.email}",
                "image_url": "${response.picture}",
                "from": "Google",
                "timestamp": "${Date.now()}"
            }`
        )

        dispatch(addUser(user));

        // localStorage.setItem('userEmail', response.email);

        window.location.href='/';
    }
    
    return(
        <Form
            style={{
                // width: '100%',
                // margin: '0 0 0 15%',
            }}
        >
            <Button
                className='button-google'
                onClick={() => login()}
            >
                Login with Google
                <FcGoogle 
                    style={{
                        margin: '0 0 .1rem .5rem'
                    }}
                />
            </Button>
        </Form>
    )
}