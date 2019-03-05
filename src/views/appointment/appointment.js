import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography, Table, DialogTitle,
    TableRow, TableCell, TableHead, TableBody, Button, InputBase, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SearchInput from '../compontent/input/searchInput';
import Calendar from './calendar';
import _ from 'lodash';
import { ChevronRight, ChevronLeft, Warning } from '@material-ui/icons';
import Patient from '../compontent/patient';
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
        selectCalendar: state.updateAppointment.selectCalendar,
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
        border: '2px solid #B8BCB9'
        /*height: 'calc(100vh - 150px)',
        minHeight: 200*/
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
    table_header: {
        fontSize: 14,
        fontWeight: 600,
        color: 'rgba(0, 0, 0, 0.7)',
        padding: '0, 0, 0, 10'
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
    },
    cover: {
        top: 283,
        position: 'absolute',
        backgroundColor: '#fff',
        width: 100,
        fontSize: 14,
        left: '74%',
        height: 20,
        padding: '4px 0 0 0'
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
            date: moment().add(1, 'days').format('DD MMM YYYY'),
            time: '09:00'
        };
    }
    componentDidMount() {
        this.initData(this.props);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if ((nextProps.selectCalendar !== this.props.selectCalendar) && nextProps.selectCalendar) {
            this.setState({showRoomList: nextProps.roomList}, () => this.initData(nextProps));
        }
        if (nextProps.roomList !== this.props.roomList) {
            this.setState({showRoomList: nextProps.roomList, room: nextProps.roomList[0]});
        }
    }

    /* 日历模块 */
    initData = (props) => {
        let roomIdList = [];
        _.forEach(this.state.showRoomList, item => {
            if (item.checked) roomIdList.push(item.roomId);
        });
        let { dateList, numberWeek } = caluDate(this.state.monthYear);
        let params = {
            clinicId: props.clinic.clinicId,
            encounterTypeId: props.encounterType.encounterTypeId,
            monthYear: moment(this.state.monthYear, 'MMM YYYY').format('MMM-YYYY'),
            roomId: roomIdList
        };
        //dateList每个月非周末的日期, numberWeek为dateList[0]是星期中的第几天(1为周一,5为周五)
        this.props.dispatch({type: 'GET_CALENDAR', params, dateList, numberWeek});
    };
    //切换月份
    changeMoth = (name) => {
        let { monthYear } = this.state;
        if (name === 'subtract') {
            monthYear = moment(monthYear, 'MMM YYYY').subtract(1, 'months').format('MMM YYYY');
        } else {
            monthYear = moment(monthYear, 'MMM YYYY').add(1, 'months').format('MMM YYYY');
        }
        this.setState({ monthYear }, () => this.initData(this.props));
    };
    // 切换encounterType
    changeEncounterType = (e) => {
        let encounterType = _.find(this.props.encounterTypeList, item => item.encounterTypeId === parseInt(e.target.value, 10));
        this.props.dispatch({ type: 'CHANGE_ENCOUNTERTYPE', encounterType, clinicId: this.props.clinic.clinicId, encounterTypeId: e.target.value });
    };
    // 切换clinic
    changeClinic = (e) =>{
        let clinic = _.find(this.props.clinicList, item => item.clinicId === parseInt(e.target.value, 10));
        this.props.dispatch({ type: 'CHANGE_CLINIC', clinicId: e.target.value, clinic});
    };
    // 选中或取消room
    checkChange = (e, checked, item, id) => {
        let showRoomList = _.cloneDeep(this.state.showRoomList);
        _.find(showRoomList, eve => eve.roomId === id).checked = checked;
        this.setState({ showRoomList }, () => this.initData(this.props));
    };

    /* 预约模块 */
    changeRoom = (e) => {
        let room = _.find(this.state.showRoomList, item => item.roomId === parseInt(e.target.value));
        this.setState({room});
    };
    changeDateTime = (e, name) => {
        if (name === 'date') {
            let value = moment(e.target.value, 'YYYY-MM-DD').format('DD MMM YYYY');
            this.setState({ date: value });
        } else {
            this.setState({[name]: e.target.value});
        }
    };

    /* 搜索patient */
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
            encounterTypeId: this.props.encounterType.encounterTypeId,
            roomId: this.state.room.roomId,
            clinicId: this.state.clinic.clinicId,
            appointmentDate: moment(this.state.date, 'DD MMM YYYY').format('DD-MMM-YYYY')
        };
        this.props.dispatch({type: 'BOOK_COMPARE', params});
    };
    bookAppointment = () => {
        let date = `${moment(this.state.date, 'DD MMM YYYY').format('DD-MMM-YYYY')} ${this.state.time}`;
        const params = {
            clinicId: this.props.clinic.clinicId,
            clinicName: this.props.clinic.clinicName,
            date: date,
            encounterTypeId: this.props.encounterType.encounterTypeId,
            encounterTypeName: this.props.encounterType.encounterType,
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
                                            <TableCell style={{paddingLeft: '15px'}} padding={'none'} className={classes.table_header}>Date</TableCell>
                                            <TableCell padding={'none'} className={classes.table_header}>Clinic</TableCell>
                                            <TableCell padding={'none'} className={classes.table_header}>Encounter Type</TableCell>
                                            <TableCell padding={'none'} className={classes.table_header}>Room</TableCell>
                                            <TableCell padding={'none'} className={classes.table_header}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.props.bookHistoryList.map((item, index) =>
                                                <TableRow key={index}>
                                                    <TableCell style={{paddingLeft: '15px'}} padding={'none'}>{item.appointmentDate}</TableCell>
                                                    <TableCell padding={'none'}>{item.clinicName}</TableCell>
                                                    <TableCell padding={'none'}>{item.encounterTypeName}</TableCell>
                                                    <TableCell padding={'none'}>{item.roomName}</TableCell>
                                                    <TableCell padding={'none'}>{item.attendanceStatus}</TableCell>
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
                                            <select className={'select_input_full'} value={this.props.clinic.clinicId} onChange={(...arg) => this.changeClinic(...arg)}>
                                                {
                                                    this.props.clinicList.map(item => <option key={item.clinicId} value={item.clinicId}>{item.clinicName}</option>)
                                                }
                                            </select>
                                        </FormGroup>
                                        <Grid container className={classes.border3}>
                                            <Grid item xs={3}>
                                                <Typography component={'div'}>Encounter Type</Typography>
                                                <select className={'select_input'} value={this.props.encounterType.encounterTypeId} onChange={(...arg) => this.changeEncounterType(...arg)}>
                                                    {
                                                        this.props.encounterTypeList.map(item => <option key={item.encounterTypeId} value={item.encounterTypeId}>{item.encounterType}</option>)
                                                    }
                                                </select>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography component={'div'}>Room</Typography>
                                                <select className={'select_input'} value={this.state.room.roomId} onChange={(...arg) => this.changeRoom(...arg)}>
                                                    {
                                                        this.state.showRoomList.map(item => <option key={item.roomId} value={item.roomId}>{item.roomName}</option>)
                                                    }
                                                </select>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography component={'div'}>Date/Time</Typography>
                                                <InputBase style={{width: 130}} type={'date'} className={'phone_select_input'} value={moment(this.state.date, 'DD MMM YYYY').format('YYYY-MM-DD')} onChange={(...arg) => this.changeDateTime(...arg, 'date')}/>
                                                <InputBase value={this.state.date} className={classes.cover}/>
                                                <InputBase style={{width: 120}} type={'time'} className={'phone_select_input'} value={this.state.time} onChange={(...arg) => this.changeDateTime(...arg, 'time')}/>
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
                                    <select className={'select_input'} value={this.props.clinic.clinicId} onChange={(...arg) => this.changeClinic(...arg, 'clinic')}>
                                        {
                                            this.props.clinicList.map(item => <option key={item.clinicId} value={item.clinicId}>{item.clinicName}</option>)
                                        }
                                    </select>
                                </div>
                                <div className={'f_mt10'}>
                                    <div>Encounter Type</div>
                                    <select className={'select_input'} value={this.props.encounterType.encounterTypeId} onChange={(...arg) => this.changeEncounterType(...arg)}>
                                        {
                                            this.props.encounterTypeList.map(item => <option key={item.encounterTypeId} value={item.encounterTypeId}>{item.encounterType}</option>)
                                        }
                                    </select>
                                </div>
                                <div className={'f_mt10'}>
                                     <div>Room</div>
                                    {
                                        this.state.showRoomList.map((item, index) =>
                                            <FormControlLabel className={classes.controller} key={index} label={item.roomName} control={<Checkbox label={item.roomName} value={item.roomName} checked={item.checked} color={'primary'} onChange={(...arg) => this.checkChange(...arg, item, item.roomId)}/>}/>)
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={9} className={classes.main}>
                                <Grid container>
                                    <Grid item xs={9}>
                                        <FormGroup row>
                                            <ChevronLeft onClick={() => this.changeMoth('subtract')}/>
                                            <ChevronRight onClick={() => this.changeMoth('add')}/>
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
                                            _.find(this.state.showRoomList, eve => item.roomId === eve.roomId).checked ?
                                            <Grid key={index} item xs={6}>
                                                <Typography component={'div'} className={classes.room_title}>
                                                {_.find(this.state.showRoomList, eve => item.roomId === eve.roomId).roomName}
                                            </Typography>
                                            <Calendar calendarList={item.appointmentCalendar}/>
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
                            {this.props.clinic.clinicName}
                        </Typography>
                        <Typography component={'div'} className={classes.dialog_text}>
                            {this.props.encounterType.encounterType} - {this.state.room.roomName}
                        </Typography>
                        <Typography component={'div'} className={classes.dialog_text}>
                            Date: {this.state.date} {this.state.time}
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