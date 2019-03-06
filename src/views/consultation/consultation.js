import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Grid, RadioGroup, FormControlLabel, Radio, Table, TableRow, Tabs, Tab,
    TableCell, TableHead, TableBody, Button, InputBase, IconButton, Paper} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import _ from 'lodash';
import {withStyles} from '@material-ui/core/styles';
import moment from 'moment';
import Patient from '../compontent/patient';
import Note from './note';
function mapStateToProps(state) {
    return {
        patientList: state.updatePatient.patientList,
        patientById: state.updatePatient.patientById,
        clinicList: state.updateUser.clinicList,
        allRoomList: state.updateUser.allRoomList,
        attendanceList: state.updateAppointment.attendanceList,
        medicalRecordList: state.updateConsultation.medicalRecordList
    };
}
const style = {
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '15px',
        border: '1px solid rgba(0,0,0,0.2)',
        height: 25,
        width: 400
    },
    controller: {
        marginLeft: 8,
        height: 28
    },
    table_header: {
        fontSize: 14,
        fontWeight: 600,
        color: 'rgba(0, 0, 0, 0.7)',
        padding: '0, 0, 0, 10'
    },
    cover: {
        top: 54,
        position: 'absolute',
        backgroundColor: '#fff',
        width: 100,
        fontSize: 14,
        left: 38,
        height: 20,
        padding: '2px 0 0 0'
    },
    input: {
        marginLeft: 8,
        flex: 1,
        fontSize: 14
    },
    iconButton: {
        padding: 10
    }
};
class Consulatation extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomId: '0',
            attendanceStatus: 'All',
            date: moment(new Date().getTime()).format('DD MMM YYYY'),
            // date: '13 Mar 2019',
            attendanceList: this.props.attendanceList,
            value: '',
            ifSelected: true,
            tabValue: 0,
            record: {}
        };
    }

    componentDidMount() {
        if(this.props.medicalRecordList.length > 0){
            this.setState({record: this.props.medicalRecordList[0]});
        }
        this.initData();
        let timer = setInterval(() => {
            this.initData();
        }, 60000);
        this.setState({timer});
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.attendanceList !== this.props.attendanceList) {
            this.setState({attendanceList: nextProps.attendanceList, value: ''});
        }
        if (nextProps.medicalRecordList !== this.props.medicalRecordList) {
            if(nextProps.medicalRecordList.length > 0) {
                this.setState({record: nextProps.medicalRecordList[0]});
            } else {
                this.setState({record: {}});
            }
        }
    }
    componentWillUnmount() {
        if(this.state.timer !== null){
            clearInterval(this.state.timer);
        }
    }

    initData = () => {
        const params = {
            appointmentDate: moment(this.state.date, 'DD MMM YYYY').format('YYYY-MM-DD'),
            attendanceStatus: this.state.attendanceStatus,
            roomId: parseInt(this.state.roomId, 10)
        };
        this.props.dispatch({type: 'GET_ATTENDANCELIST', params});
    };

    /* select页面 */
    // 选择页面
    changeDate = (e) => {
        let value = moment(e.target.value, 'YYYY-MM-DD').format('DD MMM YYYY');
        this.setState({date: value}, () => this.initData());
    };
    changeAttendanceStatus = (e, checked) => {
        if (checked) {
            this.setState({attendanceStatus: e.target.value}, () => this.initData());
        }
    };
    changeInformation = (e, name) => {
        this.setState({[name]: e.target.value}, () => this.initData());
    };
    // select patient
    select = (item) => {
        const params = {patientId: item.patientId};
        this.props.dispatch({type: 'GET_PATINET_BY_ID', params});
        this.setState({ ifSelected: true });
    };
    // 快捷搜索
    handleToggle = (e) => {
        let value = e.target.value.replace(' ', '');
        value = _.toUpper(value);
        let attend = _.cloneDeep(this.props.attendanceList);
        _.remove(attend, item => {
            return !((item.patientDoc).indexOf(value) > -1 || (item.patientName.replace(' ', '')).indexOf(value) > -1);
        });
        this.setState({value: e.target.value, attendanceList: attend});
    };

    /* consultation */
    // tab change
    changeTabValue = (event, value) => {
        this.setState({ tabValue: value});
    };
    closePatient = () => {
        this.setState({patient: {}, ifSelected: false});
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={'detail_warp'}>
            {
                this.state.ifSelected ? <div>
                    <Patient patient={this.props.patientById} close={this.closePatient}/>
                    <Tabs value={this.state.tabValue} onChange={this.changeTabValue} indicatorColor={'primary'} textColor={'primary'}>
                        <Tab label="Note/Diagnosis"/>
                        <Tab label="Prescription"/>
                    </Tabs>
                    {this.state.tabValue === 0 && <Note medicalRecordList={this.props.medicalRecordList} record={this.state.record}/>}
                </div> : <Grid container>
                    <Grid item xs={3}>
                        <div className={'f_mt10'}>
                            <div>Date</div>
                            <InputBase type={'date'} className={'select_input'} value={moment(this.state.date, 'DD MMM YYYY').format('YYYY-MM-DD')} onChange={(...arg) => this.changeDate(...arg)}/>
                            <InputBase value={this.state.date} className={classes.cover}/>
                        </div>
                        <div className={'f_mt10'}>
                            <div>Attend Status</div>
                            <RadioGroup value={this.state.attendanceStatus} onChange={(...arg) => this.changeAttendanceStatus(...arg)}>
                                <FormControlLabel className={classes.controller} value="All" control={<Radio size={'small'} color={'primary'}/>} label="All" />
                                <FormControlLabel className={classes.controller} value="Attend" control={<Radio size={'small'} color={'primary'}/>} label="Attend" />
                                <FormControlLabel className={classes.controller} value="Not Attend" control={<Radio size={'small'} color={'primary'}/>} label="Not Attend" />
                            </RadioGroup>
                        </div>
                        <div className={'f_mt10'}>
                            <div>Room</div>
                            <select className={'select_input'} value={this.state.roomId} onChange={(...arg) => this.changeInformation(...arg, 'roomId')}>
                                <option value={'0'}> All </option>
                                {
                                    this.props.allRoomList.map(item => <option key={item.roomId} value={item.roomId}>{item.roomName}</option>)
                                }
                            </select>
                        </div>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={classes.root} elevation={1}>
                            <InputBase className={classes.input} onChange={this.handleToggle} placeholder="Search by ID/ Name" value={this.state.value} onKeyUp={this.handleEnterKey}/>
                            <IconButton onClick={this.search} className={classes.iconButton} aria-label="Search" color={'primary'}>
                                <Search />
                            </IconButton>
                        </Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{paddingLeft: '15px'}} padding={'none'} className={classes.table_header}>HKIC / Doc. No</TableCell>
                                    <TableCell padding={'dense'} className={classes.table_header}>English Name</TableCell>
                                    <TableCell padding={'dense'} className={classes.table_header}>Appointment Time</TableCell>
                                    <TableCell padding={'dense'} className={classes.table_header}>Arrival Time</TableCell>
                                    <TableCell padding={'dense'} className={classes.table_header}>Encounter</TableCell>
                                    <TableCell padding={'dense'} className={classes.table_header}>Room</TableCell>
                                    <TableCell padding={'dense'} className={classes.table_header}>Attend Status</TableCell>
                                    <TableCell padding={'dense'} className={classes.table_header}> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.attendanceList.map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell style={{paddingLeft: '15px'}} padding={'none'}>{item.patientDoc}</TableCell>
                                            <TableCell padding={'dense'}>{item.patientName}</TableCell>
                                            <TableCell padding={'dense'}>{moment(item.appointmentDate).format('DD MMM YYYY HH:mm')}</TableCell>
                                            <TableCell padding={'dense'}>{item.attendanceTime}</TableCell>
                                            <TableCell padding={'dense'}>{item.encounterTypeName}</TableCell>
                                            <TableCell padding={'dense'}>{item.roomName}</TableCell>
                                            <TableCell padding={'dense'}>{item.attendanceStatus}</TableCell>
                                            <TableCell padding={'dense'}>
                                                <Button variant={'outlined'} color={'primary'} size={'small'} onClick={() => this.select(item)}> Select </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            }
            </div>
        );
    }
}
export default connect(mapStateToProps)(withStyles(style)(Consulatation));