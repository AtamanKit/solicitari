import React, { useState, useEffect } from 'react';

import { 
    apiUrl,
    textToList,
    officeAbrUp,
    handleToday,
} from './utils';

import {
    Button,
    Col,
    Row,
    Form,
} from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';
import { incrementCall } from '../redux/features/call/countCallSlice';

import RecordDesktop from './recordDesktop';
import RecordMobile from './recordMobile';

const date = handleToday();

// const subToken = localStorage.getItem('sub_token');

export default function Record(props) {
    const [offices, setOffices] = useState([]);
    const [office, setOffice] = useState('');

    const [cities, setCities] = useState('');
    const [city, setCity] = useState('');

    const [sector, setSector] = useState('');

    const [name, setName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [account, setAccount] = useState('');
    const [pt, setPt] = useState('');
    const [feader, setFeader] = useState('');
    // const [status, setStatus] = useState('NORMAL');

    const [ptFeader, setPtFeader] = useState({});
    const [ptUngheni, setPtUngheni] = useState('');

    const [damages, setDamages] = useState('');
    const [content, setContent] = useState('');

    const [remark, setRemark] = useState('');

    const [validated, setValidated] = useState(false);

    const [callResponse, setCallResponse] = useState('');

    const [width, setWidth] = useState(window.innerWidth);

    const user = useSelector(state => state.user.item);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(apiUrl() + '/gen_app/offices/', {
            method: 'GET',
        })
        .then(res => res.json())
        .then(result => setOffices(result))
        .catch(error => console.log(error))

        fetch(apiUrl() + '/gen_app/damages/',{
            method: 'GET',
        })
        .then(res => res.text())
        .then(result => setDamages(result))
        .catch(error => console.log(error))
    }, [])

    const getCities = (office_name) => {
        if (office_name !== 'Alegeti...') {
            fetch(apiUrl() + '/gen_app/get_cities/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    office: office_name,
                })
            })
            .then(res => res.text())
            .then(result => setCities(result))
            .catch(error => console.log(error))

            setOffice(office_name);
        }
    }
    

    let cities_list = textToList(cities);


    function getSector() {
        fetch(apiUrl() + '/gen_app/get_sector/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                office: office,
                pt: ptSubmit,
            })
        })
        .then(res => res.text())
        .then(result => setSector(result))
        .catch(error => console.log(error))
    }


    const getPtFeader = (accountNum) => {
        if (accountNum.length >= 6) {
            if (office !== 'Ungheni') {
                fetch(apiUrl() + '/gen_app/get_pt/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        office: office,
                        city: city,
                        account: accountNum,
                    })
                })
                .then(res => res.json())
                .then(result => setPtFeader(result))
                .catch(error => console.log(error))
            } else {
                fetch(apiUrl() + '/gen_app/get_pt/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        office: office,
                        city: city,
                    })
                })
                .then(res => res.text())
                .then(result => setPtUngheni(result))
                .catch(error => console.log(error))
            };

            setAccount(accountNum);
        }
        
    }


    let ptVar = 'Alegeti...';
    let feaderVar = 'Introduceti';
    let ptListUngheni = [];
    let ptSubmit = '';
    let feaderSubmit = '';

    
    if (office !== 'Ungheni') {
        if (ptFeader.pt !== undefined){
            ptVar = ptFeader.pt;
            ptSubmit = ptVar;

        };

        if (ptFeader.feader !== undefined){
            feaderVar = ptFeader.feader;
            feaderSubmit = 'F' + feaderVar;

        };
    } else {
        ptListUngheni = textToList(ptUngheni);
        ptSubmit = pt;
        feaderSubmit = 'F' + feader;
    }


    if (ptSubmit === 'Alegeti...') {
        ptSubmit = '';
    };
    if (feaderSubmit === 'FIntroduceti') {
        feaderSubmit = '';
    }


    let damages_list = textToList(damages);


    const handleSubmit = e => { 
	console.log("######################## test")
        e.preventDefault();

        setValidated(true);

        // let dateName = `${date.fullDate} ${user.first_name} ${user.last_name}`

        let status = 'NORMAL';
        
        if (
            content === 'Conductor rupt' ||
            content === 'Fumega panoul electric' ||
            content === 'Tensiune marita'
        ) {
            status = 'URGENT';
        }

        // console.log(dateName);

        fetch(apiUrl() + '/gen_app/callspath/calls/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                office: officeAbrUp(office),
                city: city,
                date_reg: date.fullDate,
                sector: sector,
                pt: ptSubmit,
                feader: feaderSubmit,
                account: account,
                name: name,
                telephone: telephone,
                content: content,
                status: status,
                remark: remark,
                email_reg: `${user.email}`,
                name_reg: `${user.first_name} ${user.last_name}`,
            })
        })
        .then(res => res.text())
        .then(result => setCallResponse(result))
        .catch(error => console.log(error))
    };


    if (
        !callResponse.includes('This field may not be blank.') &&
        callResponse.includes('id')
    ) {
        // dispatch(incrementCall());
        const callToSocket = JSON.parse(callResponse);
        props.socket.send(
            JSON.stringify({
                "id": callToSocket.id,
                "city": callToSocket.city,
                "pt": callToSocket.pt,
                "content": callToSocket.content,
                "status": callToSocket.status,
                "user": user.email,
                "date": date.fullDate
            })
        );

        fetch(`${apiUrl()}/push/push_notifications/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                office: office,
                content: content,
                sender: user.email,
            })
        })
        .then(res => res.json())
        .then(result => console.log(result))
        .catch(error => console.log(error));


        // fetch(`${apiUrl()}/push/update_push_model/`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         sub_token: subToken,
        //         sender: user.email,
        //     })
        // })
        // .then(res => res.json())
        // .then(result => console.log(result))
        // .catch(error => console.log(error));


        window.location.pathname = '/successrecord';
    }

    function modifWindow() {
        setWidth(window.innerWidth)
    }

    window.addEventListener(
        'resize', modifWindow
    )


    return (
        <React.Fragment>
            <h1
                style={{
                    marginTop: width > 992 ? '7%' :
                                width > 768 ? '15%' :
                                width > 576 ? '25%' :
                                '30%'
                }}
            >
                INREGISTRATI SOLICITARE
            </h1>
            <Form 
                className='form'
                // validated={validated}
                onSubmit={handleSubmit}
            >
                {
                    callResponse.includes('This field may not be blank.')
                    ?   <Row>
                            <Form.Label style={{color: 'red'}}>
                                Nu ati introdus unul din campurile obligatorii
                            </Form.Label>
                        </Row>
                    :   ''
                }
                {
                    width > 992 ?
                    <RecordDesktop 
                        chGetCities={arg=>getCities(arg)}
                        chOffices={offices}
                        chSetCity={arg=>setCity(arg)}
                        chCities_list={cities_list}
                        chSetName={arg=>setName(arg)}
                        chSetTelephone={arg=>setTelephone(arg)}
                        chGetPtFeader={arg=>getPtFeader(arg)}
                        chOffice={office}
                        chPtVar={ptVar}
                        chSetPt={arg=>setPt(arg)}
                        chPtListUngheni={ptListUngheni}
                        chFeaderVar={feaderVar}
                        chSetFeader={arg=>setFeader(arg)}
                    />  :
                    <RecordMobile
                        chGetCities={arg=>getCities(arg)}
                        chOffices={offices}
                        chSetCity={arg=>setCity(arg)}
                        chCities_list={cities_list}
                        chSetName={arg=>setName(arg)}
                        chSetTelephone={arg=>setTelephone(arg)}
                        chGetPtFeader={arg=>getPtFeader(arg)}
                        chOffice={office}
                        chPtVar={ptVar}
                        chSetPt={arg=>setPt(arg)}
                        chPtListUngheni={ptListUngheni}
                        chFeaderVar={feaderVar}
                        chSetFeader={arg=>setFeader(arg)}
                    />
                }
                <Row className='mb-3'>
                    <Form.Group as={Col} controlId='formGridMalfunction'>
                        <Form.Label>Deranjament</Form.Label>
                        <Form.Label
                            style={{
                                color: 'red',
                                marginLeft: '.2em',
                            }}
                        >*
                        </Form.Label>   
                        <Form.Select 
                            defaultValue='Alegeti...'
                            onChange={
                                e => {
                                    setContent(e.target.value);
                                    getSector();
                                }
                            }
                        >
                            <option style={{fontWeight: 'bold'}}>Alegeti...</option>
                            {
                                damages_list.map(damage => 
                                    <option>{ damage }</option>
                                )
                            }
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group>
                        <Form.Label>Remarca</Form.Label>
                        <Form.Control 
                            as='textarea'
                            placeholder='Introduceti'
                            onChange={
                                e => setRemark(e.target.value)
                            }
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group 
                        style={{
                            marginTop: '.5em',
                        }}
                    >
                        <Form.Label
                                    style={{
                                        color: 'red',
                                        marginRight: '.2em',
                                    }}
                                >*
                        </Form.Label>
                        <Form.Label
                            style={{
                                color: 'gray',
                                fontSize: '15px',
                            }}
                        >
                            Camp obligatoriu
                        </Form.Label>
                    </Form.Group>
                </Row>
                <Row>
                    <Button 
                        variant='primary' 
                        type='submit' 
                        size='lg'
                        className='button'
                    >
                        Submit
                    </Button>
                </Row>
            </Form>
        </React.Fragment>
    )
}
