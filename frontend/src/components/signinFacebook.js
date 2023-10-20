import FacebookLogin from '@greatsumini/react-facebook-login';

import { apiUrl } from './utils';

import { useDispatch } from 'react-redux';
import { addUser } from '../redux/features/auth/userSlice';


export default function SigninFacebook() {
    const dispatch = useDispatch();

    const responseFacebook = response => {
        let nameList = response.name.split(' ');
        const given_name = nameList[0];
        const family_name = nameList[1];

        fetch(`${apiUrl()}/auth/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: response.email,
                first_name: given_name,
                last_name: family_name,
                user_from: 'Facebook',
                password: 'rednordpassword',
                re_password: 'rednordpassword',
            })
        })
        .catch(error => console.log(error))

        const user = JSON.parse(
            `{
                "user_id": "${response.id}",
                "first_name": "${given_name}",
                "last_name": "${family_name}",
                "email": "${response.email}",
                "image_url": "${response.picture.data.url}",
                "from": "Facebook",
                "timestamp": "${Date.now()}"
            }`
        )

        dispatch(addUser(user));

        // localStorage.setItem('userEmail', response.email)

        window.location.href='/';

    }

    return (
        
        <FacebookLogin
            style={{
                width: '100%',
                margin: '1em 15em 0 .05em'
            }}
            appId='692473602198678'
            onProfileSuccess={responseFacebook}
            onFail={error => {
                console.log('Login Failed!', error);
            }}
            className='button-facebook'
        />
    )
}