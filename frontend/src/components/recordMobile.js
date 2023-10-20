import { Row, Form, Col } from 'react-bootstrap';

export default function RecordMobile(props) {
    return (
        <>
            <Row className='mb-3'>
                <Form.Group as={Col} controlId='formGridState'>
                    <Form.Label>Oficiul</Form.Label>
                    <Form.Label
                        style={{
                            color: 'red',
                            marginLeft: '.2em',
                        }}
                    >
                        *
                    </Form.Label>
                    <Form.Select
                        required
                        defaultValue='Alegeti...'
                        onChange={
                            e => props.chGetCities(e.target.value)
                        }
                    >
                        <option style={{fontWeight: 'bold'}}>Alegeti...</option>
                        {
                            props.chOffices.map(office =>
                                <option>{ office.name }</option>
                            )
                        }
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row className='mb-3'>
                <Form.Group as={Col} controlId='formGridCity'>
                    <Form.Label>Localitate</Form.Label>
                    <Form.Label
                        style={{
                            color: 'red',
                            marginLeft: '.2em',
                        }}
                    >
                        *
                    </Form.Label>
                    <Form.Select
                        required
                        defaultValue='Alegeti...'
                        onChange={
                            e => {
                                props.chSetCity(e.target.value);
                            }
                        }
                    >
                        <option style={{fontWeight: 'bold'}}>Alegeti...</option>
                        {
                            props.chCities_list.map(city =>
                                <option>{ city }</option>
                            )
                        }
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row className='mb-3'>
                <Form.Group as={Col} controlId='formGridName'>
                    <Form.Label>Nume</Form.Label>
                    <Form.Label
                        style={{
                            color: 'red',
                            marginLeft: '.2em',
                        }}
                    >
                        *
                    </Form.Label>
                    <Form.Control
                        required
                        placeholder='Introduceti'
                        onChange={
                            e => props.chSetName(e.target.value)
                        }
                    />
                </Form.Group>
            </Row>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>Telefon</Form.Label>
                    <Form.Label
                        style={{
                            color: 'red',
                            marginLeft: '.2em',
                        }}
                    >
                        *
                    </Form.Label>
                    <Form.Control
                        type='number'
                        required
                        placeholder='Introduceti'
                        onChange={
                            e => props.chSetTelephone(e.target.value)
                        }
                    />
                </Form.Group>
            </Row>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>Cont</Form.Label>
                    <Form.Label
                        style={{
                            color: 'red',
                            marginLeft: '.2em',
                        }}
                    >
                        *
                    </Form.Label>
                    <Form.Control
                        // required
                        type='number'
                        placeholder='Introduceti'
                        onChange={
                            e => props.chGetPtFeader(e.target.value)
                        }
                    />
                </Form.Group>
            </Row>
            <Row className='mb-3'>
                <Form.Group as={Col} controlId='formGridPT'>
                    <Form.Label>PT</Form.Label>
                    <Form.Label
                        style={{
                            color: 'red',
                            marginLeft: '.2em',
                        }}
                    >
                        *
                    </Form.Label>
                    {
                        props.chOffice !== 'Ungheni'
                        ?   <Form.Select
                                defaultValue='Alegeti...'
                                multiple
                            >
                                <option>{props.chPtVar}</option>
                            </Form.Select>
                        :   <Form.Select
                                defaultValue='Alegeti...'
                                onChange={
                                    e => props.chSetPt(e.target.value)
                                }
                            >
                                <option style={{fontWeight: 'bold'}}>
                                    Alegeti...
                                </option>
                                {
                                    props.chPtListUngheni.map(ptUngheniElement =>
                                        <option>{ ptUngheniElement }</option>
                                    )
                                }
                        </Form.Select>
                    }
                </Form.Group>
            </Row>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>Fider</Form.Label>
                    <Form.Label
                        style={{
                            color: 'red',
                            marginLeft: '.2em',
                        }}
                    >
                        *
                    </Form.Label>
                    {
                        props.chOffice !== 'Ungheni'
                        ?   <Form.Control
                                type='number'
                                placeholder='Introduceti'
                                onChange={
                                    e => props.chSetFeader(e.target.value)
                                }
                            />
                        :   <Form.Control
                                type='number'
                                placeholder='Introduceti'
                                onChange={
                                    e => props.chSetFeader(e.target.value)
                                }
                            />
                    }
                </Form.Group>
            </Row>
        </>
    )
}