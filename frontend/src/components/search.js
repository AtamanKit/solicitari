import {
    Form,
    Row,
    Col,
    Button,
} from 'react-bootstrap';

import React, 
    { 
        useEffect,
        useState,
    } from 'react';

import { apiUrl, elementPath } from './utils';

export default function Search() {
    const pathname = elementPath()

    const [sectorValue, setSectorValue] = useState('Sector');
    const [cityValue, setCityValue] = useState('Localitate');
    const [ptValue, setPtValue] = useState('PT');
    const [statusValue, setStatusValue] = useState('Status');
    const [stareValue, setStareValue] = useState('Stare');

    const [offices, setOffices] = useState([]);
    const [office, setOffice] = useState(false);
    const [officeData, setOfficeData] = useState([]);

    const [sector, setSector] = useState(false);
    const [sectorData, setSectorData] = useState([]);

    const [city, setCity] = useState(false);
    const [cityData, setCityData] = useState([]);

    const [pt, setPt] = useState(false);

    const [status, setStatus] = useState(false);

    const [stare, setStare] = useState(false);


    useEffect(() => {
        fetch(`${apiUrl()}/gen_app/offices/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json())
        .then(result => setOffices(result))
        .catch(error => console.log(error))
    }, []);

    const handleOffices = (office) => {
        fetch(`${apiUrl()}/gen_app/office_data/${office}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => setOfficeData(result))
        .catch(error => console.log(error))

        setOffice(office);
        setSector(false);
        setCity(false);

        setSectorValue('Sector');
        setCityValue('Localitate');
        setPtValue('PT');
    }

    const handleSectors = (sector) => {
        fetch(`${apiUrl()}/gen_app/sector_data/${office}/${sector}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => setSectorData(result))
        .catch(error => console.log(error))

        setSector(sector);
        setCity(false);

        setSectorValue(sector);
        
        setCityValue('Localitate');
        setPtValue('PT');
    }

    const handleCities = (city) => {
        fetch(`${apiUrl()}/gen_app/city_data/${office}/${sector}/${city}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => setCityData(result))
        .catch(error => console.log(error))

        setCity(city);

        setCityValue(city);

        setPtValue('PT');
    }

    const handlePts = (pt) => {
        setPt(pt);

        setPtValue(pt);
    }

    const handleStatus = (status) => {
        setStatus(status);

        setStatusValue(status)
    }

    const handleStare = (stare) => {
        setStare(stare);

        setStareValue(stare)
    }

    const handleButton = () => {
        // Here we'll control if pathname contain word 'cautati'
        // and create a new pathname without word 'cautati'
        // let pathnameList = window.location.pathname.split('/')
        // pathnameList.splice(0, 1);
        // let newPathname = '';
        // for (let i = 0; i < pathnameList.length; i++) {
        //     if (pathnameList[i] !== 'cautati') {
        //         newPathname = newPathname + '/' + pathnameList[i]
        //     } else {
        //         break;
        //     }
        // }

        window.location.href = 
            `/solicitariconsumatori/cautati/${office}/${sector}/${city}/${pt}/${status}/${stare}`
    }

    return(
        <React.Fragment>
            <Form className='mb-3'
                // onSubmit={
                //     handleSubmit
                // }
            >
                <Form.Group 
                    className='mb-3'
                >
                    {/* <Form.Label>Oficiul</Form.Label> */}
                    <Form.Select
                        onChange={
                            e => handleOffices(e.target.value)
                        }
                    >
                        <option>Oficiul</option>
                        {   
                            offices.map(office =>
                                    <option>{ office.name }</option>
                                )
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group 
                    className='mb-3'
                >
                    {/* <Form.Label>Sector</Form.Label> */}
                    <Form.Select
                        onChange={
                            e => handleSectors(e.target.value)
                        }
                        value={sectorValue}
                    >
                        <option
                            className='alegeti'
                        >
                            Sector
                        </option>
                        {
                            officeData.sectors !== undefined
                            ?   officeData.sectors.map(sector =>
                                    <option>{ sector }</option>
                                )
                            :   ''
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group 
                    className='mb-3'
                >
                    {/* <Form.Label>Localitate</Form.Label> */}
                    <Form.Select
                        onChange={
                            e => handleCities(e.target.value)
                        }
                        value={cityValue}
                    >
                        <option
                            className='alegeti'
                        >
                            Localitate
                        </option>
                        {
                            officeData.cities !== undefined &&
                            !sector
                            ?   officeData.cities.map(city =>
                                    <option>{ city }</option>
                                )
                            :   sectorData.cities !== undefined &&
                                sector
                                ?   sectorData.cities.map(city =>
                                        <option>{ city }</option>
                                    )
                                :   ''
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group 
                    className='mb-3'
                >
                    <Form.Select
                        onChange={
                            e => handlePts(e.target.value)
                        }
                        value={ptValue}
                    >
                        <option
                            className='alegeti'
                        >
                            PT
                        </option>
                        {
                            officeData.pts !== undefined &&
                            !sector &&
                            !city
                            ?   officeData.pts.map(pt =>
                                    <option>{ pt }</option>
                                )
                            :   sectorData.pts !== undefined &&
                                sector &&
                                !city
                                ?   sectorData.pts.map(pt =>
                                    <option>{ pt }</option>
                                )
                                :   cityData.pts !== undefined &&
                                    city
                                    ?   cityData.pts.map(pt =>
                                            <option>{ pt }</option>
                                        )
                                    :   ''
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group
                    className='mb-3'
                >
                    <Form.Select
                        onChange={
                            e => handleStatus(e.target.value)
                        }
                        value={statusValue}
                    >
                        <option
                            className='alegeti'
                        >
                            Status
                        </option>
                        <option>URGENT</option>
                        <option>NORMAL</option>
                    </Form.Select>
                </Form.Group>
                {/* <Form.Group
                    className='mb-3'
                >
                    <Form.Select
                        defaultValue='Proba'
                    >
                        <option
                            className='alegeti'
                        >
                            Deranjament
                        </option>
                    </Form.Select>
                </Form.Group> */}
                <Form.Group
                    as={Col}
                    className='mb-3'
                >
                    <Form.Select
                        value={stareValue}
                        onChange={
                            e => handleStare(e.target.value)
                        }
                    >
                        <option>Stare</option>
                        <option>Neexecutat</option>
                    </Form.Select>
                </Form.Group>
                <Row>
                    <Button
                        className='button-search'
                        // type='submit'
                        onClick={handleButton}
                    >
                        Cautati
                    </Button>
                </Row>
            </Form>
        </React.Fragment>
    )
}