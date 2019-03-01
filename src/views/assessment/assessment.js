import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Grid, RadioGroup, FormControlLabel, Radio, Table, TableRow,
    TableCell, TableHead, TableBody, Button, InputBase, IconButton, Paper} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import _ from 'lodash';
import {withStyles} from "@material-ui/core/styles/index";
import moment from 'moment';

function mapStateToProps(state) {
    return {
        patientList: state.updatePatient.patientList,
        clinicList: state.updateUser.clinicList,
        encounterList: state.updateUser.encounterList,
        allRoomList: state.updateUser.allRoomList,
        attendanceList: state.updateAppointment.attendanceList,
    };
}
const style = {
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
        padding: '4px 0 0 0'
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '15px',
        border: '1px solid rgba(0,0,0,0.2)',
        height: 25,
        width: 400
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
class Assessment extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomId: '0',
            attendanceStatus: 'All',
            // date: moment(new Date().getTime()).format('DD MMM YYYY'),
            date: '13 Mar 2019',
            attendanceList: this.props.attendanceList,
            value: '',
        }
    }

    componentDidMount() {
        this.initData();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.attendanceList !== this.props.attendanceList) {
            this.setState({attendanceList: nextProps.attendanceList, value: ''});
        }
    }

    initData = () => {
        const params = {
            appointmentDate: moment(this.state.date, 'DD MMM YYYY').format('DD-MMM-YYYY'),
            attendanceStatus: this.state.attendanceStatus,
            roomId: parseInt(this.state.roomId, 10)
        };
        this.props.dispatch({type: 'GET_ATTENDANCELIST', params})
    };

    changeDate = (e) => {
        let value = moment(e.target.value, 'YYYY-MM-DD').format('DD MMM YYYY');
        this.setState({date: value}, () => this.initData());
    };
    changeAttendanceStatus = (e, checked) => {
        if (checked) {
            this.setState({attendanceStatus: e.target.value}, () => this.initData())
        }
    };
    changeInformation = (e, name) => {
        this.setState({[name]: e.target.value}, () => this.initData())
    };

    select = (id) => {
        console.log(id)
    };

    handleToggle = (e) => {
        let value = e.target.value.replace(' ', '');
        value = _.toUpper(value);
        let attend = _.cloneDeep(this.props.attendanceList);
        _.remove(attend, item => {
            return !((item.patientDoc).indexOf(value) > -1 || (item.patientName.replace(' ', '')).indexOf(value) > -1)
        });
        this.setState({value: e.target.value, attendanceList: attend})
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={'detail_warp'}>
                <Grid container>
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
                                            <TableCell padding={'dense'}>{item.appointmentDate}</TableCell>
                                            <TableCell padding={'dense'}>{item.attendanceTime}</TableCell>
                                            <TableCell padding={'dense'}>{item.encounterTypeName}</TableCell>
                                            <TableCell padding={'dense'}>{item.roomName}</TableCell>
                                            <TableCell padding={'dense'}>{item.attendanceStatus}</TableCell>
                                            <TableCell padding={'dense'}>
                                                <Button variant={'outlined'} color={'primary'} size={'small'} onClick={() => this.select(item.appointmentId)}> Select </Button>
                                            </TableCell>
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
export default connect(mapStateToProps)(withStyles(style)(Assessment));