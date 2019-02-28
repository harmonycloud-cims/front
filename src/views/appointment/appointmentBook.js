import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Table, TableRow, TableCell, TableHead, TableBody, Typography, Button, FormGroup, InputBase } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const patient = {
    name: 'CHAN, ORANGE(陈橙)',
    documentType: 'HKIC',
    documentNumber: 'TM00200772(2)',
    birth: "26-Jul-1967",
    age: 51
};
const ww = [];
for (let i=0 ; i<9;i++) {
    ww.push({
        date: i,
        clinc: i,
        encounterType: i,
        room: i,
        status: i,
    })
}
function mapStateToProps(state) {
    return {
        clinicList: state.updateUser.clinicList,
        encounterList: state.updateUser.encounterList,
        roomList: state.updateUser.roomList,
    };
}
const style = {
    border: {
        border: '2px solid #B8BCB9',
    },
    border_title: {
        backgroundColor: '#B8BCB9',
        height: 30,
        paddingTop: 10,
        paddingLeft: 10,
        fontWeight: 600
    },
    border_title1: {
        height: 30,
        paddingTop: 12,
        paddingLeft: 12,
        fontWeight: 600
    },
    table_row: {
        height: 31
    },
    table_header: {
        fontSize: 15,
        fontWeight: 600
    },
    right: {
        marginTop: 20
    },
    right_body: {
        padding: 20
    }
};
class AppointmentBook extends Component {
    constructor(props){
        super(props);
        this.state = {
            patient: patient,
            clinic: this.props.clinicList[0],
            type: this.props.encounterList[0],
            clinicRoomList: this.props.roomList,
            showRoomList: this.props.roomList,
            appointmentBook: ww,
            room: this.props.roomList[0]
        }
    }
    componentDidMount() {
        let clinicId = this.props.clinicList[0].clinicId;
        let clinicRoomList = _.takeWhile(this.props.roomList, function(o) { return o.clinicId === clinicId; });
        this.setState({ clinicRoomList, showRoomList: clinicRoomList });
    }
    changeInformation = (e, name) =>{
        this.setState({[name]: e.target.value});
    };
    render() {
        const { classes } = this.props;
        return (
            <div className={'detail_warp'}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography component={'div'} className={classes.border}>
                            <Typography component={'div'} className={classes.border_title}>
                                Appointment History
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell >Clinic</TableCell>
                                        <TableCell >Encounter Type</TableCell>
                                        <TableCell >Room</TableCell>
                                        <TableCell >Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.appointmentBook.map((item, index) =>
                                            <TableRow key={index} className={classes.table_row}>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>{item.clinic}</TableCell>
                                                <TableCell>{item.encounterType}</TableCell>
                                                <TableCell>{item.room}</TableCell>
                                                <TableCell>{item.status}</TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography component={'div'}>
                            <Typography component={'div'} className={classes.border_title1}>
                                Appointment Booking
                            </Typography>
                            <Typography component={'div'} className={classes.right}>
                                <Typography component={'div'} className={'f_fr'}>
                                    <Button color={'primary'} variant={'outlined'}>Book</Button>
                                </Typography>
                                <FormGroup component={'div'} className={classes.right_body}>
                                    <FormGroup>
                                        <Typography component={'div'}>Clinic</Typography>
                                        <select style={{width: '100%'}} className={'select_input'} value={this.state.clinic} onChange={(...arg) => this.changeInformation(...arg, 'clinic')}>
                                            {
                                                this.props.clinicList.map(item => <option key={item.clinicId} value={item.clinicId}>{item.clinicName}</option>)
                                            }
                                        </select>
                                    </FormGroup>
                                    <FormGroup row>
                                        <FormGroup>
                                            <Typography component={'div'}>Encounter Type</Typography>
                                            <select style={{width: 120}} className={'phone_select_input'} value={this.state.type} onChange={(...arg) => this.changeInformation(...arg, 'type')}>
                                                {
                                                    this.props.encounterList.map(item => <option key={item.encounterTypeId} value={item.encounterTypeId}>{item.encounterType}</option>)
                                                }
                                            </select>
                                        </FormGroup>
                                        <FormGroup>
                                            <Typography component={'div'}>Room</Typography>
                                            <select style={{width: 120}} className={'phone_select_input'} value={this.state.room} onChange={(...arg) => this.changeInformation(...arg, 'room')}>
                                                {
                                                    this.state.clinicRoomList.map(item => <option key={item.roomId} value={item.roomId}>{item.roomName}</option>)
                                                }
                                            </select>
                                        </FormGroup>
                                        <FormGroup>
                                            <Typography component={'div'}>Date/Time</Typography>
                                            <InputBase style={{width: 120}} type={'date'} className={'phone_select_input'}/>
                                        </FormGroup>
                                    </FormGroup>
                                </FormGroup>
                            </Typography>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default connect(mapStateToProps)(withStyles(style)(AppointmentBook));