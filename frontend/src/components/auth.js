import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { addUser, removeUser } from '../redux/features/auth/userSlice';

import { apiUrl } from './utils';


export function AuthMiddleware() {
    const user = useSelector(state => state.user.item);

    if (user) {
        return true
    } else {
        return false
    }
    // const dispatch = useDispatch();

    // const [verifyStatus, setVerifyStatus] = useState(false);


    // useEffect(() => {
    //     if (user && user.from === 'Rednord') {
    //         handleVerify(user.token_access);
    //     }
    // }, [])

    // const handleVerify = tokenAccess => {
    //     fetch(`${apiUrl()}/auth/jwt/verify/`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             token: tokenAccess,
    //         }),
    //     })
    //     .then(res => res.json())
    //     .then(result => setVerifyStatus(result))
    //     .catch(error => console.log(error));
    // }

    // if (verifyStatus.code === 'token_not_valid') {
    //     fetch(`${apiUrl()}/auth/jwt/refresh/`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             refresh: user.token_refresh,
    //         }),
    //     })
    //     .then(res => res.json())
    //     .then(result => {
    //             if (result.access) {
    //                 handleVerify(result.access);
    //                 dispatch(addUser({...user, token_access: result.access}))
    //             } else {
    //                 dispatch(removeUser());
    //                 window.location.href = '/nologin'
    //             }
    //         }
    //     )
    //     .catch(error => console.log(error));

    // } else if (user && verifyStatus.code !== 'token_not_valid') {
    //     return true;
    // } else if (!user) {
    //     return false
    // }
}

export function UserExpiry() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.item);
    
    const userTimestamp = user.timestamp;
    const nowTimestamp = Date.now();
    const deltaTimestamp = nowTimestamp - userTimestamp;

    if (deltaTimestamp > process.env.REACT_APP_EXPIRY_TIME) {
        dispatch(removeUser());
    }
}