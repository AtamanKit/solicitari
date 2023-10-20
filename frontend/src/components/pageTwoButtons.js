import React from 'react';

import {
    Row,
    Button,
    Stack,
} from 'react-bootstrap';


export default function PageTwoButtons(props) {
    return (
        <React.Fragment>
            <Row>
                <h1
                    style={{textAlign: 'center'}}
                >
                    { props.pageContent }
                </h1>
            </Row>

            <Row
                style={{
                    backgroundColor: 'white',
                    padding: '.5em .5em .5em .5em',
                    borderRadius: '.5em',
                }}
            >
                <Stack
                    gap={2}
                    // className='col-md-5 mx-auto'
                    direction='horizontal'
                >
                    <Button
                        variant='outline-secondary'
                        href={props.firstButtonHref}
                        onClick={props.firstButtonClick}
                        style={{
                            width: props.buttonWidth
                        }}
                    >
                        { props.firstButtonContent }
                    </Button>
                    <Button
                        href={props.secondButtonHref}
                        onClick={props.secondButtonClick}
                        style={{
                            width: props.buttonWidth
                        }}
                    >
                        { props.secondButtonContent }
                    </Button>
                </Stack>
            </Row>
        </React.Fragment>
    )
}