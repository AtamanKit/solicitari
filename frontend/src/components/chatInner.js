// import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';


export default function ChatInner(props) {
    return(
        <div>
            <Grid container
                style={{
                    margin: '0 0 .8em 0'
                }}
            >
                <Grid xs={2} />
                <Grid xs={10}>
                    <div
                        style={{
                            display:'flex',
                            // alignContent:'center',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'lightgray',
                                height: '1px',
                                width:  '20%',
                                margin: '.5em .5em 0 0'
                            }}
                        />
                        <div
                            style={{
                                textAlign: 'center',
                                margin: '0 0 .5em 0',
                                color: 'gray',
                                fontSize: '10px',
                            }}
                        >
                            { props.date }
                        </div>
                        <div
                            style={{
                                backgroundColor: 'lightgray',
                                height: '1px',
                                width: '20%',
                                margin: '.5em 0 0 .5em'
                            }}
                        />
                    </div>
                </Grid>
            </Grid>
            {
                props.innerPaperMessages.map(paperMessage =>
                    
                    paperMessage.em === props.innerEmail ?
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid xs={4}/>
                                <Grid xs={8}
                                    style={{
                                        backgroundColor: 'gray',
                                        color: 'white',
                                        fontSize: '12px',
                                        padding: '.5em .5em .5em 1em',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <div>{ paperMessage.msg }</div>
                                    <div
                                        style={{
                                            textAlign: 'right',
                                            margin: '.5em 0 0 0',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        { paperMessage.dt.split('\n')[1] }
                                    </div>
                                </Grid>
                            </Grid> 
                        </CardContent>
                    :
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid xs={2}>
                                    <Avatar
                                        src={paperMessage.im}
                                    />
                                </Grid>
                                <Grid xs={6}
                                    style={{
                                        backgroundColor:'lightyellow',
                                        padding: '.5em .5em .5em 1em',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '14px',
                                        }}
                                    >
                                        { paperMessage.nm }
                                    </div>
                                    <div
                                        style={{
                                            color: 'gray',
                                            fontSize: '12px',
                                        }}
                                    >
                                        <div>{ paperMessage.msg }</div>
                                        <div
                                            style={{
                                                textAlign: 'right',
                                                margin: '.5em 0 0 0',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            { paperMessage.dt.split('\n')[1] }
                                        </div>
                                    </div>
                                </Grid>
                                <Grid xs={4}/>
                            </Grid>
                        </CardContent>
                )
            }
        </div>
    )
}