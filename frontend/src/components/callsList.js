import {
    Table,
    Spinner,
    Modal,
    Form,
    Row,
    Col,
    Button,
} from 'react-bootstrap';

import
    React, {
    useEffect,
    useState,
    useLayoutEffect,
} from 'react';

import { 
    apiUrl,
    elementPath,
    officeAbrUp,
    handleToday,
} from './utils';

import ContextMenu from './contextMenu';

import { useSelector } from 'react-redux';

// const callListSocket = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws/call_list/call_list_room/`)

const date = handleToday();

export default function CallsList() {
    const [calls, setCalls] = useState(false);
    const [record, setRecord] = useState('');

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const user = useSelector(state => state.user.item);

    const pathname = elementPath();

    let office = '';

    if (pathname.typeTwo !== 'Administratie') {
            office = pathname.typeTwo
        }

    useEffect(() => {
        if (pathname.typeTwo === 'cautati'){
            let office = pathname.typeThree;
            let sector = pathname.typeFour;
            let city = pathname.typeFive;
            let pt = pathname.typeSix;
            let status = pathname.typeSeven;
            let stare = pathname.typeEight;

            fetch(`${apiUrl()}/gen_app/searched_records/${office}/${sector}/${city}/${pt}/${status}/${stare}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(result => setCalls(result.sort().reverse()))
            .catch(error => console.log(error))
        } else {
            fetch(apiUrl() + `/gen_app/callspath/calls/?office=${officeAbrUp(office)}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(result => setCalls(result.sort().reverse()))
            .catch(error => console.log(error))
        }
    }, []);

    // useLayoutEffect(() => {
    //     callListSocket.addEventListener('open', (event) => {
    //         console.log('Call List WebSocket Connected');
    //     });

    //     callListSocket.addEventListener('message', (event) => {

    //     })
    // });

    // document.getElementById(`${record.id}`).onselect
    // document.addEventListener('select', () => console.log('selected'))


    function modifWindow() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight)
    }

    window.addEventListener(
        'resize', modifWindow
    )

    const handleCall = (id) => {
        // setCallId(id);

        fetch(apiUrl() + `/gen_app/callspath/calls/${id}/`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(result => setRecord(result))
        .catch(error => console.log(error))
    }

    const contextItem = option => {
        if (option !== "Detalii") {
            if (option === "Neexecutat") {
                document.getElementById(`state_${record.id}`).innerText = option;
                document.getElementById(`state_${record.id}`).style.color = 'white';
                document.getElementById(`state_${record.id}`).style.backgroundColor = 'rgb(168, 54, 54)';

                document.getElementById(`dateEx_${record.id}`).innerText = '';
            }
            else if (option === "In executare") {
                document.getElementById(`state_${record.id}`).innerText = option;
                document.getElementById(`state_${record.id}`).style.color = 'black';
                document.getElementById(`state_${record.id}`).style.backgroundColor = 'rgb(194, 199, 40)';

                document.getElementById(`dateEx_${record.id}`).innerText = `${date.fullDate} ${user.first_name} ${user.last_name}`;
            }
            // else if (option === "Executat") {
            //     document.getElementById(`state_${record.id}`).innerText = option;
            //     document.getElementById(`state_${record.id}`).style.color = 'black';
            //     document.getElementById(`state_${record.id}`).style.backgroundColor = 'rgb(92, 156, 107)';

            //     document.getElementById(`dateEx_${record.id}`).innerText = `${date.fullDate} ${user.first_name} ${user.last_name}`
            // }

            updateExecutionField(option)
        } else if (option === "Detalii") {
            window.location.href = `/detalii/${record.id}`
            // handleShow()
        }
    }

    // window.document.addEventListener('dblclick', () => {
    //     window.location.href = `/detalii/${record.id}`
    // }) 

    const updateExecutionField = async () => {
        try {
            const response = await fetch(`${apiUrl()}/gen_app/get_executed/${record.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    remark: false,
                    state: document.getElementById(`state_${record.id}`).innerText,
                    email_ex: document.getElementById(`state_${record.id}`).innerText === 'Neexecutat' ? '' : user.email,
                    name_ex: document.getElementById(`state_${record.id}`).innerText === 'Neexecutat' ? '' : `${user.first_name} ${user.last_name}`,
                    date_ex: document.getElementById(`state_${record.id}`).innerText === 'Neexecutat' ? '' : date.fullDate,
                })
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

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
    //     .catch(error => console.log(error))
    // }

    // const handleSubmit = () => {
    //     if (stare && !remark) {
    //         updateExecutionField(stare);
    //     } else if (!stare && remark) {
    //         fetchRemark(remark);
    //     } else if (stare && remark) {
    //         updateExecutionField(stare);
    //         fetchRemark(remark);
    //     }

    //     setShow(false);
    // }
    if (!calls) {
        return(
            <Spinner 
                animation='border' 
                variant='light'
                style={{
                    marginTop: '10em',
                }}
            />
        )
    } else if (calls.length === 0) {
      window.location.href = '/niciunrezultat'
    } else {
        return(
            <React.Fragment>
                <Table
                    className={width > 900 ? 'table-sol' : 'table-sol-sm'}
                    striped bordered hover
                >
                    <thead>
                        {
                            width > 768
                            ? <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Numar</th>
                            : ''
                        }
                        <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Oficiu</th>
                        {
                            width > 992
                            ? <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}
                                    style={{
                                        width:'10em',
                                    }}
                                >
                                    Data
                                </th>
                            : ''
                        }
                        {
                            width > 470
                            ? <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Localitate</th>
                            : ''
                        }
                        {
                            width > 1300
                            ? <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Sector</th>
                            : ''
                        }
                        {
                            width > 1300
                            ? <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>PT</th>
                            : ''
                        }
                        {
                            width > 992
                            ? <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Nume</th>
                            : ''
                        }
                        {
                            width > 768
                            ? <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Telefon</th>
                            : ''
                        }
                        <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Cont</th>
                        <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Status</th>
                        <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Deranjament</th>
                        {
                            width > 1300
                            ? <th className={width > 900 ? 'th-sol' : 'th-sol-sm'}>Remarca</th>
                            : ''
                        }
                        <th 
                            className={width > 900 ? 'th-sol' : 'th-sol-sm'}
                            style={{
                                width:'9em',
                            }}
                        >
                            Stare
                        </th>
                        {
                            width > 1300
                            ?   <th 
                                    className={width > 900 ? 'th-sol' : 'th-sol-sm'}
                                    style={{
                                        width: '10em'
                                    }}
                                >
                                    Data executarii
                                </th>
                            :   ''
                        }
                    </thead>
                    <tbody>
                        {
                            calls.map(call => 
                                <tr
                                    key={`callList_${call.id}`}
                                    id={call.id}
                                    onContextMenu={
                                        e => handleCall(call.id)
                                    }
                                    onDoubleClick={
                                        () => window.location.href = `/detalii/${call.id}/`
                                    }
                                >
                                    {
                                        width > 768
                                        ? <td 
                                                id={`id_${call.id}`}
                                            >
                                                { call.id }
                                            </td>
                                        : ''
                                    }
                                    {
                                        call.office === 'UN'
                                        ?   <td
                                                style={{
                                                    backgroundColor: 'rgb(180, 60, 60)',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                { call.office }
                                            </td>
                                        :   call.office === 'FL'
                                                ?   <td
                                                        style={{
                                                            backgroundColor: 'rgb(87, 107, 148)',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        { call.office }
                                                    </td>
                                                :   call.office === 'GL'
                                                        ?   <td
                                                                style={{
                                                                    backgroundColor: 'rgb(150, 150, 150)',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                { call.office }
                                                            </td>
                                                        :   call.office === 'RS'
                                                                ?   <td
                                                                        style={{
                                                                            backgroundColor: 'rgb(130, 100, 200)',
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        { call.office }
                                                                    </td>
                                                                :   ''
                                    }
                                    {
                                        width > 992
                                        ? <td>{ call.date_reg } { call.name_reg }</td>
                                        : ''
                                    }
                                    {
                                        width > 470
                                        ? <td>{ call.city }</td>
                                        : ''
                                    }
                                    {
                                        width > 1300
                                        ? <td>{ call.sector }</td>
                                        : ''
                                    }
                                    {
                                        width > 1300
                                        ? <td>{ call.pt }</td>
                                        : ''
                                    }
                                    {   
                                        width > 992
                                        ? <td>{ call.name }</td>
                                        : ''
                                    }
                                    {
                                        width > 768
                                        ? <td>{ call.telephone }</td>
                                        : ''
                                    }
                                    <td>{ call.account }</td>
                                    {
                                        call.status === 'NORMAL'
                                        ?   <td
                                                style={{
                                                    backgroundColor: 'rgb(235, 200, 56)'
                                                }}
                                            >
                                                { call.status }
                                            </td>
                                        :   <td
                                                style={{
                                                    backgroundColor: 'rgb(199, 84, 84)'
                                                }}
                                            >
                                                { call.status }
                                            </td>
                                    }
                                    <td>{ call.content }</td>
                                    {
                                        width > 1300
                                        ? <td>{ call.remark }</td>
                                        : ''
                                    }
                                    {
                                        call.state === "Neexecutat"
                                        ?   <td 
                                                id={`state_${call.id}`}
                                                style={{
                                                    backgroundColor: 'rgb(168, 54, 54)',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                { call.state }
                                            </td>
                                        : call.state === "In executare"
                                                ?   <td
                                                        id={`state_${call.id}`}
                                                        style={{
                                                            backgroundColor: 'rgb(194, 199, 40)',
                                                            color: 'black',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        { call.state }
                                                    </td>
                                                :   <td
                                                        id={`state_${call.id}`}
                                                        style={{
                                                            backgroundColor: 'rgb(92, 156, 107)',
                                                            color: 'black',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        { call.state }
                                                    </td>
                                    }
                                    {
                                        width > 1300
                                        ?   <td
                                                id={`dateEx_${call.id}`}
                                            >
                                                { call.date_ex } { call.name_ex }
                                            </td>
                                        :   ''
                                    }
                                    
                                </tr>
                            )
                        }
                    </tbody>
                </Table>

                <ContextMenu
                    targetId='callsListId'
                    options={[ "Detalii", "Neexecutat", "In executare"]}
                    classes={{
                        listWrapper: 'contextMenuListWrapper',
                        listItem: 'contextMenuListItem'
                    }}
                    getContextItem={contextItem}
                />
                {/* <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modificati solicitare</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form
                                onSubmit={handleSubmit}
                            >
                                <Row className='mb-3' xs={2}>
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
                                </Row>
                                <div
                                    style={{
                                        display: 'flex',
                                        padding: '1em 0 1em 0',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '1px',
                                            backgroundColor: 'lightgray',
                                            width: '30%',
                                            margin: '.8em 1em 0 .5em'
                                        }}
                                    />
                                    <div
                                        style={{
                                            color:'cadetblue'
                                        }}
                                    >
                                        Date inregistrare
                                    </div>
                                    <div
                                        style={{
                                            height: '1px',
                                            backgroundColor: 'lightgray',
                                            width: '30%',
                                            margin: '.8em 0 0 1em'
                                        }}
                                    />
                                </div>
                                <Row className='mb-3' xs={1}>
                                    <Form.Group>
                                        <Form.Label>Data</Form.Label>
                                        <Form.Control
                                            placeholder={record.date_reg}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className='mb-3' xs={2}>
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
                                <div
                                    style={{
                                        display: 'flex',
                                        padding: '1em 0 1em 0',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '1px',
                                            backgroundColor: 'lightgray',
                                            width: '30%',
                                            margin: '.8em 1em 0 .5em'
                                        }}
                                    />
                                    <div
                                        style={{
                                            color:'cadetblue'
                                        }}
                                    >
                                        Date deranjament
                                    </div>
                                    <div
                                        style={{
                                            height: '1px',
                                            backgroundColor: 'lightgray',
                                            width: '30%',
                                            margin: '.8em 0 0 1em'
                                        }}
                                    />
                                </div>
                                <Row className='mb-3' xs={1}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Localitate</Form.Label>
                                        <Form.Control
                                            placeholder={record.city}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className='mb-3' xs={3}>
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
                                <Row className='mb-3' xs={1}>
                                    <Form.Group>
                                        <Form.Label>Nume</Form.Label>
                                        <Form.Control
                                            placeholder={record.name}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className='mb-3' xs={2}>
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
                                <Row className='mb-3' xs={2}>
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
                                    <Form.Group>
                                        <Form.Label>Remarca</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            defaultValue={record.remark}
                                            onChange={e => setRemark(e.target.value)}
                                        />
                                    </Form.Group>
                                </Row>
                                <div
                                    style={{
                                        display: 'flex',
                                        padding: '1em 0 1em 0',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '1px',
                                            backgroundColor: 'lightgray',
                                            width: '30%',
                                            margin: '.8em 1em 0 .5em'
                                        }}
                                    />
                                    <div
                                        style={{
                                            color:'cadetblue'
                                        }}
                                    >
                                        Date executare
                                    </div>
                                    <div
                                        style={{
                                            height: '1px',
                                            backgroundColor: 'lightgray',
                                            width: '30%',
                                            margin: '.8em 0 0 1em'
                                        }}
                                    />
                                </div>
                                <Row className='mb-3' xs={1}>
                                    <Form.Group>
                                        <Form.Label>Data, executare</Form.Label>
                                        <Form.Control
                                            placeholder={record.date_ex}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className='mb-3' xs={2}>
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
                                                        record.date_ex === ''
                                                        ?   setStare(e.target.value) 
                                                        :   setStare(false)
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
                                <Row className='mb-3' xs={1}>
                                    <Button
                                        className='button'
                                        type='submit'
                                    >
                                        Trimiteti date
                                    </Button>
                                </Row>
                            </Form>
                        </Modal.Body>
                </Modal> */}
            </React.Fragment>
        )
    }
}