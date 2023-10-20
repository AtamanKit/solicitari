import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { addUser, removeUser } from '../redux/features/auth/userSlice';

import { apiUrl } from './utils';


export function AuthMiddleware() {
    const user = useSelector(state => state.user.item);
    const dispatch = useDispatch()

    const [verifyStatus, setVerifyStatus] = useState(false);

    useEffect(() => {
        if (user) {
            handleVerify(user.token_access);
        } else {
            console.log('wwwwwwwwwwwwwwwww')
            return false
        }
    }, [])
    
    const handleVerify = tokenAccess => {
        fetch(`${apiUrl()}/auth/jwt/verify/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: tokenAccess,
            }),
        })
        .then(res => res.json())
        .then(result => setVerifyStatus(result))
        .catch(error => console.log(error));
    }

    // const handleRefresh = (verifyStatus) => {
        console.log('verifyStatus', verifyStatus);
        if (verifyStatus.code === 'token_not_valid') {
            fetch(`${apiUrl()}/auth/jwt/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh: user.token_refresh,
                }),
            })
            .then(res => res.json())
            .then(result => {
                    if (result.access) {
                        console.log('qqqqqqqqqqqqqqqqqqqqq');
                        handleVerify(result.access);
                        dispatch(addUser({...user, token_access: result.access}))
                    } else {
                        console.log('ppppppppppppppppp')
                        dispatch(removeUser());
                    }
                }
            )
            .catch(error => console.log(error));

        } else if (user && verifyStatus.code !== 'token_not_valid') {
            console.log('sssssssssssssssssssssssssssssssssss')
            return true
        }
    // }
} 