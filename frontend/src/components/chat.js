import { useEffect, useState, useRef } from 'react';

import ChatInner from './chatInner';

import TextareaAutosize from '@mui/material/TextareaAutosize';

import Form from 'react-bootstrap/Form';

import { IoMdSend } from 'react-icons/io';

import { useSelector } from 'react-redux';


export default function Chat(props) {
    const user = useSelector(state => state.user.item);

    const name = `${user.first_name} ${user.last_name}`;
    const email = user.email;
    const image = user.image_url

    const [message, setMessage] = useState('');
    const scrollBottom = useRef(null);

    useEffect(() => {
        document.querySelector('#chatInput').onkeyup = function(e) {
            if (e.keyCode === 13) {
                props.chatButton(name, message, email, image)
                setMessage('')

            }
        }

        scrollBottom.current.scrollIntoView()

    })

    return(
        <div
            style={{
                backgroundColor: 'gray',
                padding: '2em .5em .5em .5em',
                borderRadius: '.8em'
            }}
        >
            <Form
                className='form'
            >
                <Form.Label
                    style={{
                        color: 'gray',
                    }}
                >
                    Mesaje, grup "{props.nameOfGroup}"
                </Form.Label>
                <div
                    style={{
                        backgroundColor: 'lightgray',
                        height: '1px',
                        marginBottom: '1em',
                    }}
                />
                <div
                    style={{
                        height: 300,
                        width: 300,
                        overflow:'auto',
                    }}
                >   {
                        props.oldPaperMessages ?
                            props.oldPaperMessages.map(oldPaperMessage => 
                                oldPaperMessage !== 'Null' ?
                                    <ChatInner
                                        date={oldPaperMessage.date}
                                        innerPaperMessages={oldPaperMessage.content}
                                        innerEmail={email}
                                    />
                                :   []
                            )
                        :
                            []
                    }
                    <ChatInner
                        date='Azi'
                        innerPaperMessages={props.paperMessages}
                        innerEmail={email}
                    />
                    <div  ref={scrollBottom}/>
                </div>
                <div
                    style={{
                        display:'flex',
                        marginTop: '1em',
                    }}
                >
                    <TextareaAutosize
                        id='chatInput'
                        style={{
                            border: '1px solid lightgray',
                            borderRadius: '.5em',
                            width: '100%',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />
                    <IoMdSend
                        id='chatButton' 
                        className='button-send'
                        onClick={() => {
                                props.chatButton(
                                    name,
                                    message,
                                    email,
                                    image,
                                );
                                setMessage('')
                            }
                        } 
                    />
                </div>
            </Form>
        </div>
    )
}