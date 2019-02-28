import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography, Table, DialogTitle,
    TableRow, TableCell, TableHead, TableBody, Button, InputBase, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SearchInput from '../compontent/input/searchInput';
import Calendar from './calendar';
import _ from 'lodash';
import { ChevronRight, ChevronLeft, Warning } from '@material-ui/icons';
import Patient from './patient';
import moment from 'moment';
import { caluDate } from '../../services/utils';

function mapStateToProps(state) {
    return {
        patientList: state.updatePatient.patientList,
        clinicList: state.updateUser.clinicList,
        clinic: state.updateUser.clinic,
        encounterTypeList: state.updateUser.encounterTypeList,
        encounterType: state.updateUser.encounterType,
        roomList: state.updateUser.roomList,
        calendarList: state.updateAppointment.calendarList,
        bookHistoryList: state.updateAppointment.bookHistoryList,
        bookCompareResult: state.updateAppointment.bookCompareResult,
        bookAppointmentDialog: state.updateAppointment.bookAppointmentDialog
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
class Appointment extends Component {
    constructor(props){
        super(props);
        this.state = {
            calendar: 'month',
            month: 0,
            clinic: this.props.clinic,
            encounterType: this.props.encounterType,
            showRoomList: this.props.roomList,
            room: this.props.roomList[0],
            isSelected: false,
            patient: {},
            monthYear: moment().format('MMM YYYY'),
            date: moment().format('DD MMM YYYY'),
            time: '09:00'
        };
    }
    componentDidMount() {
        this.initData();
    }
    componentWillReceiveProps(nextProps) {

    }
    initData = () => {
        let roomIdList = [];
        _.forEach(this.state.showRoomList, item => {
            if (item.checked) roomIdList.push(item.roomId);
        });
        let { dateList, numberWeek } = caluDate(this.state.monthYear);
        let params = {
            clinicId: this.state.clinic.clinicId,
            encounterTypeId: this.state.encounterType.encounterTypeId,
            monthYear: moment(this.state.monthYear, 'MMM YYYY').format('MMM-YYYY'),
            roomId: roomIdList
        };
        //dateList每个月非周末的日期, numberWeek为dateList[0]是星期中的第几天(1为周一,5为周五)
        this.props.dispatch({type: 'GET_CALENDAR', params, dateList, numberWeek});
    };
    changeMoth = (e) => {
        this.setState({month: e}, () => this.initData());
    };
    changeInformation = (e) => {
        let encounterType = _.find(this.props.encounterList, item => item.encounterTypeId === parseInt(e.target.value));
        this.setState({encounterType}, () => {
            if (!this.state.isSelected) this.initData();
        });
    };
    changeClinic = (e, name) =>{
        let clinic = _.find(this.props.clinicList, item => item.clinicId === e.target.value);
        let clinicRoomList = _.takeWhile(this.props.roomList, item => item.clinicId === parseInt(e.target.value));
        _.forEach(clinicRoomList, item => item.checked = true);
        this.setState({[name]: clinic, clinicRoomList, room: clinicRoomList[0] }, () => {
            if (!this.state.isSelected) this.initData();
        });
    };
    checkChange = (e, checked, item, id) => {
        let clinicRoomList = _.cloneDeep(this.state.clinicRoomList);
        _.find(clinicRoomList, eve => eve.roomId === id).checked = checked;
        this.setState({ clinicRoomList });
    };
    changeRoom = (e) => {
        let room = _.find(this.state.clinicRoomList, item => item.roomId === parseInt(e.target.value));
        this.setState({room});
    };
    changeDateTime = (e, name) => {
        this.setState({[name]: e.target.value});
    };
    search = (value) => {
        const params = { searchData: value };
        this.props.dispatch({type: 'SEARCH_PATIENT', params});
    };
    selectPatient = (item) => {
        if (JSON.stringify(item) !== '{}'){
            let params = { patientId: item.patient.patientId };
            this.setState({patient: item.patient, isSelected: true});
            this.props.dispatch({type: 'GET_BOOK_HISTORY', params});
        }
    };
    closePatient = () => {
        this.setState({patient: {}, isSelected: false});
    };
    bookCompare = () => {
        const params = {
            patientId: this.state.patient.patientId,
            encounterTypeId: this.state.encounterType.encounterTypeId,
            roomId: this.state.room.roomId
        };
        this.props.dispatch({type: 'BOOK_COMPARE', params});
    };
    bookAppointment = () => {
        const params = {
            clinicId: this.state.clinic.clinicId,
            clinicName: this.state.clinic.clinicName,
            date: this.state.time,
            encounterTypeId: this.state.encounterType.encounterTypeId,
            encounterTypeName: this.state.encounterType.encounterType,
            patientDoc: this.state.patient.documentNumber,
            patientId: this.state.patient.patientId,
            patientName: `${this.state.patient.englishSurname}, ${this.state.patient.englishGivenName}`,
            roomId: this.state.room.roomId,
            roomName: this.state.room.roomName
        };
        this.props.dispatch({type: 'BOOK_APPOINTMENT', params});
        this.setState({isSelected: false, patient: {}});
    };
    closeDialog = () => {
        this.props.dispatch({type: 'BOOK_COMPARE_CLOSE'});
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={'detail_warp'}>
                {
                    this.state.isSelected ? <Patient patient={this.state.patient} close={this.closePatient}/> :
                        <SearchInput change={this.search} patientList={this.props.patientList} selectPatient={this.selectPatient}/>
                }
                {
                    this.state.isSelected ?
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography component={'div'} className={classes.border1}>
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
                                            this.props.bookHistoryList.map((item, index) =>
                                                <TableRow key={index} className={classes.table_row}>
                                                    <TableCell>{item.appointmentDate}</TableCell>
                                                    <TableCell>{item.clinicName}</TableCell>
                                                    <TableCell>{item.encounterTypeName}</TableCell>
                                                    <TableCell>{item.roomName}</TableCell>
                                                    <TableCell>{item.attendanceStatus}</TableCell>
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
                                    <FormGroup component={'div'} className={classes.right_body}>
                                        <Typography component={'div'}>
                                            <Button color={'primary'} variant={'outlined'} onClick={this.bookCompare} className={classes.button_right}>Book</Button>
                                        </Typography>
                                        <FormGroup>
                                            <Typography component={'div'}>Clinic</Typography>
                                            <select className={'select_input_full'} value={this.state.clinic.clinicId} onChange={(...arg) => this.changeClinic(...arg, 'clinic')}>
                                                {
                                                    this.props.clinicList.map(item => <option key={item.clinicId} value={item.clinicId}>{item.clinicName}</option>)
                                                }
                                            </select>
                                        </FormGroup>
                                        <Grid container className={classes.border3}>
                                            <Grid item xs={3}>
                                                <Typography component={'div'}>Encounter Type</Typography>
                                                <select className={'select_input'} value={this.state.encounterType.encounterTypeId} onChange={(...arg) => this.changeInformation(...arg, 'encounterType')}>
                                                    {
                                                        this.props.encounterTypeList.map(item => <option key={item.encounterTypeId} value={item.encounterTypeId}>{item.encounterType}</option>)
                                                    }
                                                </select>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography component={'div'}>Room</Typography>
                                                <select style={{width: 120}} className={'select_input'} value={this.state.room.roomId} onChange={(...arg) => this.changeRoom(...arg, 'room')}>
                                                    {
                                                        this.state.roomList.map(item => <option key={item.roomId} value={item.roomId}>{item.roomName}</option>)
                                                    }
                                                </select>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography component={'div'}>Date/Time</Typography>
                                                <InputBase style={{width: 140}} type={'date'} className={'phone_select_input'} value={this.state.date} onChange={(...arg) => this.changeDateTime(...arg, 'date')}/>
                                                <InputBase style={{width: 100}} type={'time'} className={'phone_select_input'} value={this.state.time} onChange={(...arg) => this.changeDateTime(...arg, 'time')}/>
                                            </Grid>
                                        </Grid>
                                    </FormGroup>
                                </Typography>
                            </Typography>
                        </Grid>
                    </Grid> :
                        <Grid container className={classes.border}>
                            <Grid item xs={3}>
                                <div className={'f_mt10'}>
                                    <div>Calendar View</div>
                                    <RadioGroup value={'month'}>
                                        <FormControlLabel className={classes.controller} value="day" control={<Radio size={'small'} color={'primary'}/>} label="Day" />
                                        <FormControlLabel className={classes.controller} value="week" control={<Radio size={'small'} color={'primary'}/>} label="Week" />
                                        <FormControlLabel className={classes.controller} value="month" control={<Radio size={'small'} color={'primary'}/>} label="Month" />
                                    </RadioGroup>
                                </div>
                                <div className={'f_mt10'}>
                                    <div>Clinic</div>
                                    <select className={'select_input'} value={this.state.clinic.clinicId} onChange={(...arg) => this.changeClinic(...arg, 'clinic')}>
                                        {
                                            this.props.clinicList.map(item => <option key={item.clinicId} value={item.clinicId}>{item.clinicName}</option>)
                                        }
                                    </select>
                                </div>
                                <div className={'f_mt10'}>
                                    <div>Encounter Type</div>
                                   {/* <select className={'select_input'} value={this.state.encounterType.encounterTypeId} onChange={(...arg) => this.changeInformation(...arg, 'encounterType')}>
                                        {
                                            this.props.encounterTypeList.map(item => <option key={item.encounterTypeId} value={item.encounterTypeId}>{item.encounterType}</option>)
                                        }
                                    </select>*/}
                                </div>
                                <div className={'f_mt10'}>
                                    {/* <div>Room</div>
                                    {
                                        this.state.clinicRoomList.map((item, index) =>
                                            <FormControlLabel className={classes.controller} key={index} label={item.roomName}
                                                              control={<Checkbox label={item.roomName} value={item.roomName} checked={item.checked} color={'primary'} onChange={(...arg) => this.checkChange(...arg, item, item.roomId)}/>}
                                            />)
                                    } */}
                                </div>
                            </Grid>
                            <Grid item xs={9} className={classes.main}>
                                <Grid container>
                                    <Grid item xs={9}>
                                        <FormGroup row>
                                            <ChevronLeft onClick={() => this.changeMoth(0)}/>
                                            <ChevronRight onClick={() => this.changeMoth(1)}/>
                                            <div>{this.state.monthYear}</div>
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <div className={'f_fr'}>Available Quota</div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={16}>
                                    {
                                        this.props.calendarList.map((item,index) =>
                                            _.find(this.state.clinicRoomList, eve => item.roomId === eve.roomId).checked ?
                                            <Grid key={index} item xs={6}>
                                                <Typography component={'div'} className={classes.room_title}>
                                                {_.find(this.state.clinicRoomList, eve => item.roomId === eve.roomId).roomName}
                                            </Typography>
                                            <Calendar calendarList={item.appointmentQuotaquotabo}/>
                                            </Grid> : null
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                }
                <Dialog open={this.props.bookAppointmentDialog}>
                    {
                        !this.props.bookCompareResult ? <DialogTitle className={classes.dialog_title}>
                            <Warning className={classes.dialog_button}/>
                            Duplicate booking found for this client, please check!
                        </DialogTitle> : null
                    }
                    <DialogContent>
                        <Typography component={'div'} className={classes.dialog_text}>
                            {this.state.patient.englishSurname}, {this.state.patient.englishGivenName} ({this.state.patient.chineseName})
                        </Typography>
                        <Typography component={'div'} className={classes.dialog_text}>
                            {this.state.patient.documentNumber}
                        </Typography>
                        <Typography component={'div'} className={classes.dialog_text}>
                            {this.state.clinic.clinicName}
                        </Typography>
                        <Typography component={'div'} className={classes.dialog_text}>
                            {this.state.encounterType.encounterType} - {this.state.room.roomName}
                        </Typography>
                        <Typography component={'div'} className={classes.dialog_text}>
                            Date: {this.state.dateSend} {this.state.timeSend}
                        </Typography>
                    </DialogContent>
                    {
                        !this.props.bookCompareResult ?
                            <DialogActions>
                                <Button variant={'outlined'} fontSize="small" onClick={this.closeDialog} color="primary">OK</Button>
                            </DialogActions> :
                            <DialogActions>
                                <Button variant={'outlined'} fontSize="small" onClick={this.bookAppointment} color="primary">Confirm</Button>
                                <Button variant={'outlined'} fontSize="small" onClick={this.closeDialog} color="primary">Cancel</Button>
                            </DialogActions>
                    }
                </Dialog>
            </div>
        );
    }
}
export default connect(mapStateToProps)(withStyles(style)(Appointment));