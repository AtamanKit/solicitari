import React, {
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';

import {
    Nav, 
    Navbar,
    Container,
    NavDropdown,
    Button,
    Modal,
    Image,
    Offcanvas,
    ListGroup,
    Row,
    Col,
    Table
} from 'react-bootstrap';

import Snackbar from '@mui/material/Snackbar';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';

import { AiOutlineBell } from 'react-icons/ai';
import {  IoChatbubblesOutline, IoSettingsOutline } from 'react-icons/io5';
import { BsSearch } from 'react-icons/bs';
import { BsFillBellFill, BsFillBellSlashFill }  from 'react-icons/bs';


import {
    elementPath,
    apiUrl,
    wsUrl,
    handleToday,
} from './utils';


import Search from './search';
import Chat from './chat';

import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../redux/features/auth/userSlice';
import { seenToTrue, seenAllTrue } from '../redux/features/call/itemCallSlice';
import { decrementCall, decrementCallAll } from '../redux/features/call/countCallSlice';
import { chatSeenToTrue } from '../redux/features/chat/itemChatSlice';
import { incrementItemChat, decrementChat } from '../redux/features/chat/itemChatSlice';
// import { decrementChat } from '../redux/features/chat/countChatSlice';
// import user_image from '../images/user_icon.png';

import ModalLogin from './modalLogin';

import PageTwoButtons from './pageTwoButtons';


const pathname = elementPath();
const date = handleToday();
const pushToken = localStorage.getItem('sub_token');

// if (pushNotification === null) {
//     console.log('reject')
// } else {
//     console.log('yes')
// }

// const red = red[500];
const theme = createTheme({
    palette: {
        primary:
            {
                main: red[600]
            }
    }
})

// let notifOffice = 0;

export default function NavBar(props) {
    const [offices, setOffices] = useState([]);

    const [searchShow, setSearchShow] = useState(false);
    const handleSearchClose = () => setSearchShow(false);
    const handleSearchShow = () => setSearchShow(true)

    const [authShow, setAuthShow] = useState(false);
    const handleAuthClose = () => setAuthShow(false);

    const [loginActive, setLoginActive] = useState(false);

    const [messageShow, setMessageShow] = useState(false);
    const handleMessageClose = () => setMessageShow(false);

    const [notifShow, setNotifShow] = useState(false);
    const handleNotifClose = () => setNotifShow(false);

    const [groupName, setGroupName] = useState('');
    const [chatShow, setChatShow] = useState(false);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(false);
    const [msResult, setMsResult] = useState(false);

    const [vertical] = useState('bottom');
    const [horizontal] = useState('right');

    const [chatMessages, setChatMessages] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(state => state.user.item);

    const callItems = useSelector(state => state.itemCall.items);
    const counterCall = useSelector(state => state.countCall.value);

    // const countChat = useSelector(state => state.countChat.value);
    const countChat = useSelector(state => state.itemChat.value);
    const chatItems = useSelector(state => state.itemChat.items);

    const [missingChat, setMissingChat] = useState(false);

    const [pushCounter, setPushCounter] = useState(pushToken);

    // console.log('Notification.permission', Notification.permission)

    // console.log(countChat)

    // const userImg = 
    //     user.image_url === 'user_image'
    //     ?   user_image
    //     :   user.image_url
    
    const handleSignin = () => {
        setAuthShow(true);
        setLoginActive(false);
    }

    const handleLogin = () => {
        setAuthShow(true);
        setLoginActive(true);
    }

    const handleClosedChat = () => {
        setChatShow(false);
        socket.close();
        setMessages([]);
        setSocket(false);
        props.groupToApp(false);
        // window.location.reload();
    }

    // Sending message to websocket
    const handleMessage = (name, message, email, image) => {
        socket.send(
            JSON.stringify({
                'name': name,
                'message': message,
                'email': email,
                'image': image,
                'date': date.fullDate,
            })
        );

        // Seding messages to database
        fetch(`${apiUrl()}/chat/chatspath/messages/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: date.fullDate.split('\n')[0],
                group: groupName,
                content: [{
                        nm: name,
                        msg: message,
                        em: email,
                        im: image,
                        dt: date.fullDate,
                }],        
            })
        })
        .then(res => res.json())
        .then(result => setMsResult(result))
        .catch(error => console.log(error))
    }

    const getChatMessages = (office) => {
        fetch(`${apiUrl()}/chat/get_chat_messages/${office}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json())
        .then(result => setChatMessages(result))
        .catch(error => console.log(error))
    }

    async function handleNotifCall(callItemId, callItemSeen){
        if (!callItemSeen) {
            dispatch(seenToTrue(callItemId))
            let result = await dispatch(decrementCall(1))
            if (result) {
                window.location.href = `/detalii/${callItemId}`
            }
        }
    }

    const handleChatButton = () => {
        if (user) {
            setMessageShow(true);
            offices.map((office) => {
                let counter = 0;
                localStorage.setItem(`count_${office.name}`, 0);
                chatItems.map(chatItem => 
                    chatItem.group === office.name && chatItem.seen === false
                    ?   localStorage.setItem(`count_${office.name}`, counter += 1)
                    :   []
                )
            });
        };
    }

    useEffect(() => {
        // Get offices from server
        fetch(apiUrl() + '/gen_app/offices/', {
            method: 'GET',
        })
        .then(res => res.json())
        .then(result => setOffices(result))
        .catch(error => console.log(error));

        // Get last id from chat messages in Local Storage
        // wish in my case is first element in the array
        // and send it to the server for obtaining the 
        // missing messages
        // console.log(chatItems[0].id)
        if (chatItems.length !== 0) {
            fetch(`${apiUrl()}/chat/get_chat_missing/${chatItems[0].id}/`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(result => setMissingChat(result))
            .catch(error => console.log(error))
        }
    }, [])

    useEffect(() => {
        if (missingChat && missingChat.length > 0) {
            missingChat.map(item => {
                dispatch(
                    incrementItemChat({
                        'id': item.id,
                        'group': item.group,
                        'seen': false,
                    })
                )
                // console.log(item.id);
            })
        };
    }, [missingChat])
    // Websockets on message and open handling
    useLayoutEffect(() => {
        if (socket) {
            socket.addEventListener('open', (event) => {
                console.log('WebSocket Chat Connected');
            });

            socket.addEventListener('message', (event) => {
                const dataFromServer = JSON.parse(event.data)
                setMessages([
                    ...messages,
                    {
                        nm: dataFromServer.name,
                        msg: dataFromServer.message,
                        em: dataFromServer.email,
                        im: dataFromServer.image,
                        dt: dataFromServer.date,
                    }
                ]);

            });
        };
    });

    // console.log(socket)
    
    useLayoutEffect(() => {
        if (msResult) {
            props.notifChatSocket.send(
                JSON.stringify({
                    'id': msResult.id,
                    'group': msResult.group,
                })
            )
        }
    }, [msResult]);

    // useLayoutEffect(() => {
    //     offices.map(office => {
    //             let counter = 0;
                
    //         }
    //     )
    // }, [chatItems])

    // useLayoutEffect(() => {
    //     fetch(`${apiUrl()}/chat/chatspath/messages/`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             date: date.fullDate,
    //             group: groupName,
    //             content: messages,        
    //         })
    //     })
    // }, [])

    // console.log(messages);
    // console.log(socket);

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
            <Navbar 
                bg='light' 
                expand='lg' 
                fixed='top'
            >
                <Container>
                    <Navbar.Brand 
                        href='/'
                        style={
                            pathname.type === ''
                            ?   {
                                    // color: 'blue',
                                    textDecoration: 'underline',
                                }
                            :   []
                        }
                    >
                        Solicitari consumatori
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='me-auto'>
                            <Nav.Link 
                                href='/record/'
                                style={
                                    pathname.type === 'record'
                                    ?   {
                                            // color: 'blue',
                                            textDecoration: 'underline',
                                        }
                                    :   []
                                }
                            >
                                Inregistrati
                            </Nav.Link>
                            <NavDropdown
                                title='Setari'
                            >
                                <NavDropdown.Item
                                    href='https://rednord.org/adaug-pt' target='_blank'
                                >
                                    Adaugati PT
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href='https://rednord.org/sterg-pt' target='_blank'
                                >
                                    Stergeti PT
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar>
                        <Nav>
                            <Button
                                className='btn-nav'
                                onClick={handleSearchShow}
                            >
                                <BsSearch 
                                    style={{
                                        fontSize: '1.4em',
                                        margin: '0 0 .2em 0'
                                    }}
                                />
                            </Button>
                            <Button 
                                className='btn-nav'
                                onClick={handleChatButton
                                    // user ? setMessageShow(true) : []
                                }
                            >
                                <Badge
                                    badgeContent={countChat}
                                    color="primary"
                                >
                                    <IoChatbubblesOutline 
                                        className='icon-size' 
                                    />
                                </Badge>
                            </Button>
                            <Button className='btn-nav'
                                onClick={() =>
                                    user ? setNotifShow(true) : []
                                }
                            >
                                <Badge
                                    badgeContent={counterCall} 
                                    color="primary"
                                >
                                    <AiOutlineBell className='icon-size' />
                                </Badge>
                            </Button>
                            {
                                user === ''
                                ?   <NavDropdown
                                        title='Autentificare'
                                    >
                                        <NavDropdown.Item
                                            onClick={handleLogin}
                                        >
                                            Log In
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            onClick={handleSignin}
                                        >
                                            Inregistrare
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                :   <div
                                        style={{
                                            display: 'flex',
                                        }}
                                    >
                                        {/* <Image
                                            src={userImg}
                                            roundedCircle={true}
                                            style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                            }}
                                        /> */}
                                        <Avatar 
                                            src={user.image_url}
                                        />
                                        <NavDropdown
                                            title={user.first_name}
                                        >
                                            <NavDropdown.Item
                                                onClick={
                                                    () => {
                                                        /// Remove user ///
                                                        dispatch(removeUser());
                                                        /// Unsubscribe from Push Notifications ///
                                                        setPushCounter(false);
                                                        localStorage.removeItem('sub_token');
                                                        props.pushSlashButton(user.email);
                                                    }
                                                }
                                            >
                                                Log Out
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </div>
                            }
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>
            {
                pathname.type === 'nologin'
                ? <div className="App-content">
                    <PageTwoButtons
                        pageContent='NU SINTETI AUTENTIFICAT'
                        firstButtonContent='Log In'
                        firstButtonClick={() => {
                            setAuthShow(true);
                            setLoginActive(true);
                        }} 
                        secondButtonContent='Inregistrare'
                        secondButtonClick={() => {
                            setAuthShow(true);
                            setLoginActive(false);
                        }}
                        buttonWidth='10em'
                    />
                </div>
                : []
            }

            <Modal show={searchShow} onHide={handleSearchClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cautati solicitare</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Search />
                </Modal.Body>
            </Modal>
            <ModalLogin 
                show={authShow}
                close={handleAuthClose}
                loginStatus={loginActive}
            />

            <Offcanvas
                show={messageShow}
                onHide={handleMessageClose}
                placement='end'
                backdropClassName='backdrop-offcanvas'
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        Trimiteti mesaj
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <h6>Alegeti un grup</h6>
                    <ListGroup>
                        {
                            offices.map(office =>
                                <ListGroup.Item
                                    variant='light'
                                    action
                                    key={`chatGroup_${office._id}`}
                                    onClick={
                                        () => {
                                                // fetch(`${apiUrl()}/chat/get_chat_messages/${office.name}/`)
                                                getChatMessages(office.name)
                                                setMessageShow(false);
                                                setChatShow(true);
                                                setGroupName(office.name);
                                                setSocket(
                                                    new WebSocket(`${wsUrl()}/chat/${office.name}/`)
                                                );
                                                if (localStorage.getItem(`count_${office.name}`) > 0){
                                                    dispatch(chatSeenToTrue(office.name));
                                                    dispatch(decrementChat(localStorage.getItem(`count_${office.name}`)));
                                                    // dispatch(decrementChat());
                                                    localStorage.setItem(`count_${office.name}`, 0);
                                                };
                                                props.groupToApp(office.name);
                                            }
                                    }
                                >
                                    {/* {
                                        chatItems.map(chatItem =>
                                            chatItem.group === office.name ? notifOffice += 1 : []
                                        )
                                    } */}
                                    <Badge
                                        badgeContent={
                                            parseInt(localStorage.getItem(`count_${office.name}`))
                                        }
                                        color='primary'
                                    >
                                        {office.name}
                                    </Badge>
                                </ListGroup.Item>    
                            )
                            
                        }
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas
                show={notifShow}
                onHide={handleNotifClose}
                placement='end'
                backdropClassName='backdrop-offcanvas'
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        Sectiune notificari
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                {/* <Button> */}
                                    {
                                        !pushCounter
                                        ?   <BsFillBellFill 
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                                onClick={
                                                    () => {
                                                        setPushCounter(true);
                                                        props.pushNotifButton(user.email);
                                                    }
                                                }
                                            />
                                        :   <BsFillBellSlashFill
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                                onClick={
                                                    () => {
                                                        setPushCounter(false);
                                                        localStorage.removeItem('sub_token');
                                                        props.pushSlashButton(user.email);
                                                    }
                                                }
                                            />
                                    }
                                {/* </Button> */}
                            </Grid>
                            <Grid xs={6}>
                                <p
                                    style={{
                                        textAlign:'right',
                                        textDecoration:'underline',
                                        color:'cornflowerblue',
                                        cursor: 'pointer',
                                    }}

                                    onClick={() => {
                                            dispatch(decrementCallAll());
                                            dispatch(seenAllTrue());
                                        }
                                    }
                                >
                                    Marcati toate ca citite
                                </p>
                            </Grid>
                        </Grid>
                    </CardContent>
                   {
                    callItems.map(callItem =>
                        <CardContent>
                            <Grid container spacing={2}
                                style={{
                                    backgroundColor:'rgb(240, 240, 240)',
                                    padding: '.5em .5em .5em .5em',
                                    borderRadius: '15px',
                                }}
                            >
                                <Grid xs={2}>
                                    <Avatar
                                        style={{
                                            backgroundColor: callItem.status === 'NORMAL' && !callItem.seen
                                            ?   'rgb(235, 200, 56)' 
                                            :   callItem.status === 'URGENT' && !callItem.seen
                                            ?   'rgb(199, 84, 84)'
                                            :   'lightgrey',
                                            color: callItem.status === 'NORMAL' && !callItem.seen
                                                    ? 'black'
                                                    : callItem.status === 'URGENT' && !callItem.seen
                                                    ? 'white'
                                                    : callItem.status === 'NORMAL' && callItem.seen
                                                    ?   'gray'
                                                    : 'white'
                                        }}
                                    >
                                        {
                                            callItem.status === 'NORMAL' ? 'N' : 'U'
                                        }
                                    </Avatar>
                                </Grid>
                                <Grid xs={10}>
                                    <div
                                        style={{
                                            cursor: !callItem.seen ? 'pointer' : []
                                        }}
                                        onClick={() => handleNotifCall(callItem.id, callItem.seen)}
                                    >
                                        <div
                                            style={{
                                                fontWeight:'bold',
                                                fontStyle:'italic',
                                                color: !callItem.seen ? 'black' : 'gray' ,
                                            }}
                                        >
                                            Defect nou, Nr. { callItem.id }
                                        </div>
                                        <div
                                            style={{
                                                color: !callItem.seen ? 'black' : 'gray',
                                            }}
                                        >
                                            Loc. { callItem.city }, { callItem.pt }, { callItem.content.toLowerCase() }
                                        </div>
                                        <div
                                            style={{
                                                fontSize:'12px',
                                                fontStyle: 'Italic',
                                                color: 'gray',
                                                margin: '0 0 0 12em'
                                            }}
                                        >
                                            { callItem.date }
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>    
                    )
                   }
                    {/* <Table
                    className='table-sol'
                    striped bordered hover
                    >
                    {
                       callItems.map(callItem =>
                            <>
                                <tr
                                    key={`callItem_${callItem.id}`}
                                >
                                    <td xs={1}>{ JSON.parse(callItem).id }</td>
                                    <td xs={3}>{ JSON.parse(callItem).city }</td>
                                    <td xs={3}>{ JSON.parse(callItem).pt }</td>
                                    <td xs={5}>{ JSON.parse(callItem).content }</td>
                                </tr>
                               
                            </>
                        ) */}
                    {/* // let callJson = JSON.parse(c)}{
                    callItems.map(callItem =>  */}
                    {/* //     console.log(JSON.parse(callItem).content)
                    // )
                    } */}
                    {/* </Table> */}
                </Offcanvas.Body>
            </Offcanvas>

            <Snackbar
                open={chatShow}
                message='Note archive'
                onClose={handleClosedChat}
                anchorOrigin={{vertical, horizontal}}
                ref={props.chatWindow}
            >
                <Container>
                    <Chat
                        nameOfGroup={groupName}
                        chatButton={
                            (
                                name, 
                                message,
                                email,
                                image,
                            ) => handleMessage(
                                    name,
                                    message,
                                    email,
                                    image,
                                )
                        }
                        paperMessages={messages}
                        oldPaperMessages={chatMessages}
                    />
                </Container>
            </Snackbar>
            </ThemeProvider>
        </React.Fragment>
      );
}