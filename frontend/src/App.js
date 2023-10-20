import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

import React, { useLayoutEffect, useRef, useState } from 'react';

import NavBar from './components/navbar';
import CallsList from './components/callsList';
import Record from './components/record';
import Detail from './components/detail';
import PageTwoButtons from './components/pageTwoButtons';
import PageNoButtons from './components/pageNoButtons';
import SigninActivation from './components/signinActivation';
import PassReset from './components/passReset';

import { elementPath, wsUrl } from './components/utils';
import { AuthMiddleware, UserExpiry } from './components/auth';

import { useDispatch, useSelector } from 'react-redux';
import { incrementItemCall } from './redux/features/call/itemCallSlice';
import { incrementCall } from './redux/features/call/countCallSlice';
import { incrementItemChat } from './redux/features/chat/itemChatSlice';

import ringer from './media/sound/message_notification.mp3';


const pathname = elementPath();

const callNotifSocket = new WebSocket(`${wsUrl()}/notifcall/notifcallroom/`);
const chatNotifSocket = new WebSocket(`${wsUrl()}/notifchat/notifchatroom/`);


let notifSound = new Audio(ringer);

let grFromNav = false;

function App(props) {
  // const handleNotifChatSocket = (office) => {

  // }

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.item);

  // make variables for finding if chat is open and with what group is open
  const chatSnack = useRef(null);

  // const chatItems = useSelector(state => state.itemChat.items);

  // Function to control user information lifetime
  UserExpiry();
  
  let isAuthenticated = AuthMiddleware();


  if (pathname.type === '') {
    window.location.href = 
      `/solicitariconsumatori/Administratie`
  }

  // Collect group name from chat window from navbar component
  // for controling if chat window is open with the same group name
  // as group name from messages
  const groupFromNav = group => {
    grFromNav = group;
  }

  useLayoutEffect(() => {
      // Socket for calls notification
      callNotifSocket.addEventListener('open', (event) => {
        console.log('Websocket Call Notification')
      });

      callNotifSocket.addEventListener('message', (event) => {
        const dataFromServer = JSON.parse(event.data);
        if (user && dataFromServer.user !== user.email) {
          dispatch(
            incrementItemCall({
                'id': dataFromServer.id,
                'city': dataFromServer.city,
                'pt': dataFromServer.pt,
                'content': dataFromServer.content,
                'status': dataFromServer.status,
                'date': dataFromServer.date,
                'seen': false,
              }
            )
          );
          dispatch(incrementCall());
          notifSound.play();
        }
      });
  });

  useLayoutEffect(() => {
      // Notification for chat socket
      chatNotifSocket.addEventListener('open', (event) => {
        console.log('Notification Chat Websocket')
      });

      chatNotifSocket.addEventListener('message', (event) => {
        const dataFromServer = JSON.parse(event.data);
        dispatch(
          incrementItemChat({
            'id': dataFromServer.id,
            'group': dataFromServer.group,
            'seen': !chatSnack.current || grFromNav && grFromNav !== dataFromServer.group ? false : true,
          })
        );
      });
  });

  return (
    <React.Fragment>
      <header>
        <NavBar 
          notifChatSocket={chatNotifSocket}
          chatWindow={chatSnack}
          groupToApp={groupFromNav}
          pushNotifButton={user => props.pushNotification(user)}
          pushSlashButton={user => props.unPushNotification(user)}
        />
      </header>
      
      {
        (pathname.type === '' ||
        pathname.type === 'solicitariconsumatori') &&
        isAuthenticated
        ? <div 
            id="callsListId"
            className="App-content-calls"
          >
            <CallsList />
          </div>
        : (pathname.type === '' ||
          pathname.type === 'solicitariconsumatori') &&
          isAuthenticated === false
          ? window.location.href = '/nologin'
          : []
      }
      {
        pathname.type === 'detalii'
        ? <div className="App-content">
            <Detail />
          </div>
        : []
      }
      {
        pathname.type === 'record' &&
        isAuthenticated
        ? <div className="App-content">
            <Record 
              socket={callNotifSocket}
            />
          </div>
        : pathname.type === 'record'  &&
          isAuthenticated === false
          ? window.location.href = '/nologin'
          : []
      }
      {
        pathname.type === 'successrecord'
        ? <div className="App-content">
            <PageTwoButtons 
              pageContent='ATI INREGISTRAT CU SUCCES SOLICITARE'
              firstButtonHref='/record'
              firstButtonContent='Mai ingregistrati'
              secondButtonHref='/'
              secondButtonContent='Registru solicitari'
            />
          </div>
        : []
      }
      {
        pathname.type === 'niciunrezultat'
        ? <div className="App-content">
            <PageNoButtons
              content='NU A FOST GASIT NICI UN REZULTAT'
            />
          </div>
        : []
      }
      {
        pathname.type === 'verificatiemail'
        ? <div className="App-content">
            <PageNoButtons
              content='VERIFICATI EMAIL PENTRU ACTIVAREA CONTULUI'
            />
          </div>
        : []
      }
      {
        pathname.type === 'activaticont'
        ? <div className="App-content">
            <SigninActivation />
          </div>
        : []
      }
      {
        pathname.type === 'activaresucces'
        ? <div className="App-content">
            <PageNoButtons 
              content='ATI INREGISTRAT CU SUCCES CONTUL'
            />
          </div>
        : []
      }
      {
        pathname.type === 'schimbareparola'
        ? <div className="App-content">
            <PassReset />
          </div>
        : []
      }
      {
        pathname.type === 'resetparolaemail'
        ? <div className="App-content">
            <PageNoButtons
              content='VERIFICATI EMAIL PENTRU RESETAREA PAROLEI'
            />
          </div>
        : []
      }
      {
        pathname.type === 'schimbareparolasucces'
        ? <div className="App-content">
            <PageNoButtons
              content='ATI SCHIMBAT CU SUCCES PAROLA'
            />
          </div>
        : []
      }
    </React.Fragment>
  );
}

export default App;
