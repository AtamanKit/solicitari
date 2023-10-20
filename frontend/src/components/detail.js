import React, { useState, useEffect } from 'react';

import {
    apiUrl,
    elementPath,
    handleToday,
} from './utils';

import {
    Form,
    Row,
    Col,
    Button,
} from 'react-bootstrap';

import Grid from '@mui/material/Grid';

import { useSelector } from 'react-redux';

const pathname = elementPath();

const date = handleToday();

export default function Detail() {
    const [record, setRecord] = useState('');

    const [remark, setRemark] = useState(false);
    const [stare, setStare] = useState(false);

    const [validated, setValidated] = useState(false);

    const user = useSelector(state => state.user.item);

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        fetch(`${apiUrl()}/gen_app/callspath/calls/${pathname.typeTwo}/`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(result => setRecord(result))
        .catch(error => console.log(error))
    }, [])

    const updateExecutionField = async () => {
        try {
            const response = await fetch(`${apiUrl()}/gen_app/get_executed/${record.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    remark: remark,
                    state: stare,
                    email_ex: stare === 'Neexecutat' ? '' : user.email,
                    name_ex: stare === 'Neexecutat' ? '' : `${user.first_name} ${user.last_name}`,
                    date_ex: stare === 'Neexecutat' ? '' : date.fullDate
                })
            });
            const result = await response.json();
            goToUrl(result);
        } catch (error) {
            console.log(error);
        }
    }

    const goToUrl = (serverResponse) => {
        console.log(serverResponse.message)
        if (serverResponse.message === 'Successfully updated record'
            || serverResponse.message === 'No action in updating') {
                window.location.href = '/'
            }
    }

    // const fetchUnexecuted = (st, rmk) => {
    //     if (!rmk) {
    //         console.log('nu remark')
    //         fetch(`${apiUrl()}/gen_app/callspath/unexecuted/${record.id}/`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 state: st,
    //                 email_ex: user.email,
    //                 name_ex: `${user.first_name} ${user.last_name}`,
    //                 date_ex: date.fullDate
    //             })
    //         })
    //         .then(res => res.json())
    //         .then(result => console.log(result))
    //         .catch(error => console.log(error))
    //     } else {
    //         console.log('da remark')
    //         fetch(`${apiUrl()}/gen_app/callspath/unexecuted/${record.id}/`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 state: st,
    //                 email_ex: user.email,
    //                 name_ex: `${user.first_name} ${user.last_name}`,
    //                 date_ex: date.fullDate
    //             })
    //         })
    //         .then(fetchRemark(rmk))
    //         .catch(error => console.log(error))
    //     };

    //     // window.location.href = '/';
    // }

    // const fetchRemark = (arg) => {
    //     fetch(`${apiUrl()}/gen_app/callspath/remark/${record.id}/`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             remark: arg,
    //         })
    //     })
    //     .then(res => res.json())
    //     .then(result => console.log(result))
    //     .catch(error => console.log(error));

    //     // window.location.href = '/'
    // }

    // console.log('remark', remark);
    // console.log('stare', stare);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        setValidated(true);

        await updateExecutionField();
        
        // if (stare && !remark) {
        //     console.log('stare && !remark');
        //     fetchUnexecuted(stare, remark);
        // } else if (!stare && remark) {
        //     console.log('!stare && remark');
        //     fetchRemark(remark);
        // } else if (stare && remark) {
        //     console.log('stare && remark')
        //     fetchUnexecuted(stare, remark);
        // }

        // console.log(exeCheck);
        // if (exeCheck.message
        //     && exeCheck.message === 'Successfully updated record') {
        //     window.location.href = '/';
        // }
    }

    function modifWindow() {
        setWidth(window.innerWidth)
    }

    window.addEventListener(
        'resize', modifWindow
    )

    return(
        <React.Fragment>
            <h1
                style={{
                    marginTop: width > 992 ? '7%' :
                                width > 768 ? '15%' :
                                width > 576 ? '25%' :
                                '30%'
                }}
            >
                DETALII SOLICITARE
            </h1>
            <Form
                noValidate
                validated={validated}
                className='form-detail'
                onSubmit={handleSubmit}
            >
                <Row className='mb-3' xs={1} md={3}>
                    <Form.Group as={Col}>
                        <Form.Label>Numar</Form.Label>
                        <Form.Control
                            placeholder={record.id}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Oficiul</Form.Label>
                        <Form.Control
                            placeholder={record.office}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            placeholder={record.date_reg}
                            disabled
                        />
                    </Form.Group>
                </Row>
                
                <Grid container
                    style={{
                        margin: '2em 0 2em 0'
                    }}
                >
                    <Grid xs={5}>
                        <div
                            style={{
                                height: '1px',
                                backgroundColor: 'lightgray',
                                // width: '30%',
                                margin: '1em 0 0 0'
                            }}
                        />
                    </Grid>
                    <Grid
                        style={{
                            textAlign:'center'
                        }}
                        xs={2}
                    >
                        <div
                            style={{
                                color:'cadetblue',
                                // align: 'center',
                            }}
                        >
                            Date inregistrare
                        </div>
                    </Grid>
                    <Grid xs={5}>
                        <div
                            style={{
                                height: '1px',
                                backgroundColor: 'lightgray',
                                // width: '30%',
                                margin: '1em 0 0 0'
                            }}
                        />
                    </Grid>
                </Grid>
                 
                <Row className='mb-3' xs={1} md={2}>
                    <Form.Group as={Col}>
                        <Form.Label>Nume, cine a inregistrat</Form.Label>
                        <Form.Control
                            placeholder={record.name_reg}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            placeholder={record.email_reg}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Grid container
                    style={{
                        margin: '2em 0 2em 0'
                    }}
                >
                    <Grid xs={5}>
                        <div
                            style={{
                                height: '1px',
                                backgroundColor: 'lightgray',
                                // width: '30%',
                                margin: '1em 0 0 0'
                            }}
                        />
                    </Grid>
                    <Grid
                        style={{
                            textAlign:'center'
                        }}
                        xs={2}
                    >
                        <div
                            style={{
                                color:'cadetblue',
                                // align: 'center',
                            }}
                        >
                            Date deranjament
                        </div>
                    </Grid>
                    <Grid xs={5}>
                        <div
                            style={{
                                height: '1px',
                                backgroundColor: 'lightgray',
                                // width: '30%',
                                margin: '1em 0 0 0'
                            }}
                        />
                    </Grid>
                </Grid>

                <Row className='mb-3' xs={1} md={4}>
                    <Form.Group as={Col}>
                        <Form.Label>Localitate</Form.Label>
                        <Form.Control
                            placeholder={record.city}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Sector</Form.Label>
                        <Form.Control
                            placeholder={record.sector}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>PT</Form.Label>
                        <Form.Control
                            placeholder={record.pt}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Fider</Form.Label>
                        <Form.Control
                            placeholder={record.feader}
                            disabled
                        />
                    </Form.Group>
                </Row>
                {/* <Row className='mb-3' xs={1}>
                    <Form.Group>
                        <Form.Label>Nume</Form.Label>
                        <Form.Control
                            placeholder={record.name}
                            disabled
                        />
                    </Form.Group>
                </Row> */}
                <Row className='mb-3' xs={1} md={3}>
                    <Form.Group>
                        <Form.Label>Nume</Form.Label>
                        <Form.Control
                            placeholder={record.name}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Telefon</Form.Label>
                        <Form.Control
                            placeholder={record.telephone}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Cont</Form.Label>
                        <Form.Control
                            placeholder={record.account}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Row className='mb-3' xs={1} md={2}>
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            style={{
                                backgroundColor: `${
                                    record.status === "NORMAL"
                                    ?   'rgb(235, 200, 56)'
                                    :   'rgb(199, 84, 84)'
                                }`
                            }}
                            placeholder={record.status}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Deranjament</Form.Label>
                        <Form.Control
                            placeholder={record.content}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Row className='mb-3' xs={1}>
                    <Form.Group 
                        controlId='formGridName'
                        className='mb-3'
                    >
                        <Form.Label>
                            <span
                                style={{
                                    fontWeight:'bold',
                                }}
                            >
                                Remarca:
                            </span>
                            <span
                                style={{
                                    fontStyle:'italic',
                                    margin: '0 0 0 .2em'
                                }}
                            >
                                ({record.remark})
                            </span>
                            <span
                                style={{
                                    color:'red',
                                    margin: '0 0 0 .2em'
                                }}
                            >
                                *
                            </span>
                        </Form.Label>
                        {/* <Form.Label
                        >
                            {record.remark}
                        </Form.Label> */}

                        {
                            stare !== 'Executat'
                            ?   <Form.Control
                                    placeholder='Introduceti'
                                    onChange={e => setRemark(e.target.value)}
                                />
                            :   <>
                                    <Form.Control
                                        required
                                        // as='textarea'
                                        // defaultValue={record.remark}
                                        placeholder='Introduceti'
                                        onChange={e => setRemark(e.target.value)}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        Introduceti remarca
                                    </Form.Control.Feedback>
                                </>
                        }
                        
                    </Form.Group>
                </Row>

                <Grid container
                    style={{
                        margin: '2em 0 2em 0'
                    }}
                >
                    <Grid xs={5}>
                        <div
                            style={{
                                height: '1px',
                                backgroundColor: 'lightgray',
                                // width: '30%',
                                margin: '1em 0 0 0'
                            }}
                        />
                    </Grid>
                    <Grid
                        style={{
                            textAlign:'center'
                        }}
                        xs={2}
                    >
                        <div
                            style={{
                                color:'cadetblue',
                                // align: 'center',
                            }}
                        >
                            Date executare
                        </div>
                    </Grid>
                    <Grid xs={5}>
                        <div
                            style={{
                                height: '1px',
                                backgroundColor: 'lightgray',
                                // width: '30%',
                                margin: '1em 0 0 0'
                            }}
                        />
                    </Grid>
                </Grid>

                <Row className='mb-3' xs={1} md={3}>
                    <Form.Group>
                        <Form.Label>Data, executare</Form.Label>
                        <Form.Control
                            placeholder={record.date_ex}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Nume, executant</Form.Label>
                        <Form.Control
                            placeholder={record.name_ex}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Email, executant</Form.Label>
                        <Form.Control
                            placeholder={record.email_ex}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Row className='mb-3' xs={1}>
                    <Form.Group>
                        <Form.Label>Stare</Form.Label>
                        <Form.Select
                            style={{
                                backgroundColor: `${
                                    !stare &&
                                    record.state === "Neexecutat" ||
                                    stare === "Neexecutat"
                                    ?   'rgb(168, 54, 54)'
                                    :   !stare &&
                                        record.state === "In executare" ||
                                        stare === "In executare"
                                        ?   'rgb(194, 199, 40)'
                                        :   !stare &&
                                            record.state === "Executat" ||
                                            stare === "Executat"
                                            ?   'rgb(92, 156, 107)'
                                            :   ''
                                }`,
                                color: `${
                                    !stare &&
                                    record.state === "Neexecutat" ||
                                    stare === "Neexecutat"
                                    ?   'white'
                                    :   'black'
                                }`
                            }}
                            onChange={
                                e => { 
                                        setStare(e.target.value)
                                        // record.date_ex === ''
                                        // ?   setStare(e.target.value) 
                                        // :   setStare(false)
                                    }
                            }
                        >
                            <option
                                style={{
                                    backgroundColor: `${
                                        record.state === "Neexecutat"
                                        ?   'rgb(168, 54, 54)'
                                        :   record.state === "In executare"
                                            ?   'rgb(194, 199, 40)'
                                            :   'rgb(92, 156, 107)'
                                    }`,
                                    color: `${
                                        record.state === "Neexecutat"
                                        ?   'white'
                                        :   'black'
                                    }`
                                }}
                            >
                                { record.state }
                            </option>
                            <option
                                style={{
                                    backgroundColor: 'white',
                                    color: 'black'
                                }}
                            >
                                Neexecutat
                            </option>
                            <option
                                style={{
                                    backgroundColor: 'white',
                                    color: 'black'
                                }}
                            >
                                In executare
                            </option>
                            <option
                                style={{
                                    backgroundColor: 'white',
                                    color: 'black'
                                }}
                            >
                                Executat
                            </option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Grid>
                    <Button
                        type='submit'
                        style={{
                            width: '100%',
                            margin: '1em 0 0 0'
                        }}
                    >
                        Trimiteti date
                    </Button>
                </Grid>
            </Form>
        </React.Fragment>
    )
}