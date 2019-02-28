import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Grid, RadioGroup, FormControlLabel, Radio, FormGroup, Typography, Table,
    TableRow, TableCell, TableHead, TableBody, Button, InputBase, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import {withStyles} from "@material-ui/core/styles/index";
import SearchInput from '../compontent/input/searchInput';
import moment from 'moment';

function mapStateToProps(state) {
    return {
        patientList: state.updatePatient.patientList,
        clinicList: state.updateUser.clinicList,
        encounterList: state.updateUser.encounterList,
        roomList: state.updateUser.roomList,
        attendList: [],
    };
}
const style = {
    controller: {
        marginLeft: 8,
        height: 28
    },
    main: {
        borderLeft: '1px solid rgba(0,0,0,0.2)',
        padding: 8
    },
    border: {
        marginTop: 20,
        borderTop: '1px solid rgba(0,0,0,0.2)'
    },
    room_title: {
        border: '0.5px solid rgba(0,0,0,0.2)',
        borderBottom: 0,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        marginTop: 10,
        fontSize: 18,
        fontWeight: 500,
        width: 'calc(20% - 1px)',
        textAlign: 'center'
    },
    border1: {
        border: '2px solid #B8BCB9',
        height: 'calc(100vh - 150px)',
        minHeight: 200
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
        marginTop: 20,
        paddingRight: 40
    },
    right_body: {
        padding: 20
    },
    button_right: {
        float: 'right'
    },
    border3: {
        border: '1px solid rgba(0,0,0,0.2)',
        marginTop: 10,
        paddingBottom: 10
    },
    dialog_title: {
        borderBottom: '1px solid rgba(0,0,0,0.2)'
    },
    dialog_button: {
        verticalAlign: 'bottom',
        color: 'orange'
    },
    dialog_text: {
        fontSize: 20,
        fontWeight: 500,
        textAlign: 'center'
    }
};
class Attendance extends Component {
    constructor(props){
        super(props);
        this.state = {
            room: this.props.roomList[0],
            attendStatus: 'all',
            date: moment(new Date().getTime()).format('YYYY-MM-DD'),
        }
    }
    search = (value) => {
        const params = { searchData: value };
        this.props.dispatch({type: 'SEARCH_PATIENT', params});
    };
    selectPatient = (item) => {
        let params = { patientId: item.patient.patientId };
        this.setState({patient: item.patient, isSelected: true});
        this.props.dispatch({type: 'GET_BOOK_HISTORY', params});
    };
    render() {
        const { classes } = this.props;
        return (
            <div className={'detail_warp'}>
                <Grid container>
                    <Grid item xs={3}>
                        <div className={'f_mt10'}>
                            <div>Date</div>
                            <InputBase type={'date'} className={'select_input'} value={this.state.date} onChange={(...arg) => this.changeInformation(...arg, 'date')}/>
                        </div>
                        <div className={'f_mt10'}>
                            <div>Attend Status</div>
                            <RadioGroup value={this.state.attendStatus} onChange={(...arg) => this.changeInformation(...arg, 'attendStatus')}>
                                <FormControlLabel className={classes.controller} value="all" control={<Radio size={'small'} color={'primary'}/>} label="All" />
                                <FormControlLabel className={classes.controller} value="true" control={<Radio size={'small'} color={'primary'}/>} label="Attended" />
                                <FormControlLabel className={classes.controller} value="false" control={<Radio size={'small'} color={'primary'}/>} label="Not attend" />
                            </RadioGroup>
                        </div>
                        <div className={'f_mt10'}>
                            <div>Room</div>
                            <select className={'select_input'} value={this.state.room.roomId} onChange={(...arg) => this.changeInformation(...arg, 'room')}>
                                {
                                    this.props.roomList.map(item => <option key={item.roomId} value={item.roomId}>{item.roomName}</option>)
                                }
                            </select>
                        </div>
                    </Grid>
                    <Grid item xs={9}>
                        <SearchInput change={this.search} patientList={this.props.patientList} selectPatient={this.selectPatient}/>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>HKIC / Doc. No</TableCell>
                                    <TableCell >English Name</TableCell>
                                    <TableCell >Appointment Time</TableCell>
                                    <TableCell >Arrival Time</TableCell>
                                    <TableCell >Encounter</TableCell>
                                    <TableCell >Room</TableCell>
                                    <TableCell >Attend Status</TableCell>
                                    <TableCell > </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.props.attendList.map((item, index) =>
                                        <TableRow key={index} className={classes.table_row}>
                                            <TableCell>{item.documentNumber}</TableCell>
                                            <TableCell>{item.englishName}</TableCell>
                                            <TableCell>{item.appointmetnTime}</TableCell>
                                            <TableCell>{item.arrivalTime}</TableCell>
                                            <TableCell>{item.encounterType}</TableCell>
                                            <TableCell>{item.roomName}</TableCell>
                                            <TableCell>{item.attendStatus}</TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default connect(mapStateToProps)(withStyles(style)(Attendance));