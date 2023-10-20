import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

import store, { persistor } from './redux/app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { apiUrl } from './components/utils';

////////////////// Working Push Notifications //////////////////
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

let swRegistration = null;

// const userEmail = localStorage.getItem('userEmail');

if ('serviceWorker' in navigator && 'PushManager' in window) {
console.log('Service Worker and Push are supported');

navigator.serviceWorker.register('/sw.js')
.then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;

    fetch(`${apiUrl()}/push/vapid_public_key/`, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(result => localStorage.setItem('vapidPublicKey', result.vapid_public_key))
    .catch(error => console.log(error));

    // if (userEmail) {
    //   navigator.serviceWorker.controller.postMessage({
    //     user: userEmail,
    //   })
    // };
})
.catch(function(error) {
    console.error('Service Worker Error', error);
});
} else {
console.warn('Push messaging is not supported');
}

const applicationServerPublicKey = localStorage.getItem('vapidPublicKey');

// const pushToken = localStorage.getItem('sub_token');

// if (pushToken) {
//   console.log('There is token');
// } else {
//   console.log('No token');
// }

function newSubscriptionOnServer(userEmail, subscriptionObject) {
  fetch(`${apiUrl()}/push/update_push_model/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: userEmail,
      sub_token: subscriptionObject,
    })
  })
  .then(res => res.json())
  .then(result => console.log(result))
  .catch(error => console.log(error))
}

function removeSubscriptionOnServer(userEmail) {
  fetch(`${apiUrl()}/push/update_push_model/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: userEmail,
    })
  })
  .then(res => res.json())
  .then(result => console.log(result))
  .catch(error => console.log(error))
}

function subscribeUser(user) {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription){
    newSubscriptionOnServer(user, subscription)
    localStorage.setItem('sub_token', JSON.stringify(subscription));

    console.log('User is subscribed');
  })
  .catch(function(error){
    console.error('Failed to subscribe the user:', error);
  });
}

function unsubscribeUser(user) {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      removeSubscriptionOnServer(user)
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
}

///////////////////////////// React ///////////////////////////////
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider
        clientId='608489420991-hpt3kmmhmqh6h92m4fik9smpfuvk618o.apps.googleusercontent.com'
      >
        <App 
          pushNotification={subscribeUser}
          unPushNotification={unsubscribeUser}
        />
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
