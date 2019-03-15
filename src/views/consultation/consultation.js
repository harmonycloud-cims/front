import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableRow,
  Tabs,
  Tab,
  TableCell,
  TableHead,
  TableBody,
  TableFooter,
  TablePagination,
  Button,
  InputBase,
  IconButton,
  Paper
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Patient from '../compontent/patient';
import Note from './note';
import Prescription from './prescription';
import { InlineDatePicker } from 'material-ui-pickers';

function mapStateToProps(state) {
  return {
    patientList: state.updatePatient.patientList,
    patientById: state.updatePatient.patientById,
    clinicList: state.updateUser.clinicList,
    allRoomList: state.updateUser.allRoomList,
    attendanceList: state.updateAppointment.attendanceList,
    medicalRecordList: state.updateConsultation.medicalRecordList,
    templateList: state.updateConsultation.templateList,
    chronicProblemList: state.updateConsultation.chronicProblemList
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
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14
  },
  iconButton: {
    padding: 10
  },
  table_pagination: {
    position: 'absolute',
    right: 0
  }
};
// const data = [
//     {
//       "clinicalNoteTemplateId": 1,
//       "templateName": "Fever",
//       "templateContent": "c/o fever, running nose and sore throat for 3 days, \nNo rash, no travel history\nSL given, FU prn",
//       "clinicId": 1
//     },
//     {
//       "clinicalNoteTemplateId": 2,
//       "templateName": "URTI",
//       "templateContent": "c/o coughing and yellowish sputum, running nose and fever for 3 days,\nSL given, FU prn",
//       "clinicId": 1
//     },
//     {
//       "clinicalNoteTemplateId": 3,
//       "templateName": "GE",
//       "templateContent": "c/o diarrhea after buffet 2 days ago,\rAdvise increased fluid intake",
//       "clinicId": 1
//     }
// ];
class Consulatation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '0',
      attendanceStatus: 'All',
      date: moment(new Date().getTime()).format('DD MMM YYYY'),
      // date: '13 Mar 2019',
      attendanceList: this.props.attendanceList,
      value: '',
      ifSelected: false,
      tabValue: 0,
      appointmentSelect: {},
      rowsPerPage: 10,
      page: 0
    };
  }

  componentDidMount() {
    this.initData();
    let timer = setInterval(() => {
      this.initData();
    }, 60000);
    this.setState({ timer });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // select页面attendaceList变换
    if (nextProps.attendanceList !== this.props.attendanceList) {
      this.setState({ attendanceList: nextProps.attendanceList, value: '' });
    }
  }
  componentWillUnmount() {
    if (this.state.timer !== null) {
      clearInterval(this.state.timer);
    }
  }

  initData = () => {
    const params = {
      appointmentDate: moment(this.state.date, 'DD MMM YYYY').format(
        'YYYY-MM-DD'
      ),
      attendanceStatus: this.state.attendanceStatus,
      roomId: parseInt(this.state.roomId, 10)
    };
    this.props.dispatch({ type: 'GET_ATTENDANCELIST', params });
  };

  /* select页面 */
  changeDate = e => {
    this.setState({ date: moment(e._d).format('DD MMM YYYY') }, () =>
      this.initData()
    );
  };
  changeAttendanceStatus = (e, checked) => {
    if (checked) {
      this.setState({ attendanceStatus: e.target.value }, () =>
        this.initData()
      );
    }
  };
  // change room
  changeInformation = (e, name) => {
    this.setState({ [name]: e.target.value }, () => this.initData());
  };
  // select patient
  select = item => {
    this.setState({ ifSelected: true, tabValue: 0, appointmentSelect: item });
  };
  closePatient = () => {
    this.setState({ patient: {}, ifSelected: false, appointmentSelect: {} });
    this.initData();
  };
  // 快捷搜索
  handleToggle = e => {
    let value = e.target.value.replace(' ', '');
    value = _.toUpper(value);
    let attend = _.cloneDeep(this.props.attendanceList);
    _.remove(attend, item => {
      return !(
        item.patientDoc.indexOf(value) > -1 ||
        item.patientName.replace(' ', '').indexOf(value) > -1
      );
    });
    this.setState({ value: e.target.value, attendanceList: attend });
  };

  /* consultation */
  // tab change
  changeTabValue = (event, value) => {
    this.setState({ tabValue: value });
  };

  /* table pagination */
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={'detail_warp'}>
        {this.state.ifSelected ? (
          <div>
            <Patient
                patient={this.props.patientById}
                close={this.closePatient}
            />
            <Tabs
                value={this.state.tabValue}
                onChange={this.changeTabValue}
                indicatorColor={'primary'}
                textColor={'primary'}
            >
              <Tab label="Note/Diagnosis" />
              <Tab label="Prescription" />
            </Tabs>
            {this.state.tabValue === 0 && (
              <Note
                  appointmentSelect={this.state.appointmentSelect}
                  close={this.closePatient}
              />
            )}
            {this.state.tabValue === 1 && (
              <Prescription close={this.closePatient} />
            )}
          </div>
        ) : (
          <Grid container>
            <Grid item xs={3}>
              <div className={'f_mt10'}>
                <div>Date</div>
                <InlineDatePicker
                    className={'select_input'}
                    style={{ marginLeft: 10 }}
                    mask={value =>
                    value
                      ? [
                          /\d/,
                          /\d/,
                          ' ',
                          /[A-Z]/,
                          /[a-z]/,
                          /[a-z]/,
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/
                        ]
                      : []
                  }
                    disableOpenOnEnter
                    format={'DD MMM YYYY'}
                    placeholder={'DD MMM YYYY'}
                    variant={'outlined'}
                    keyboard
                    invalidDateMessage={'輸入的日期無效'}
                    value={moment(this.state.date, 'DD MMM YYYY')}
                    onChange={this.changeDate}
                />
              </div>
              <div className={'f_mt10'}>
                <div>Attend Status</div>
                <RadioGroup
                    value={this.state.attendanceStatus}
                    onChange={(...arg) => this.changeAttendanceStatus(...arg)}
                >
                  <FormControlLabel
                      className={classes.controller}
                      value="All"
                      control={<Radio size={'small'} color={'primary'} />}
                      label="All"
                  />
                  <FormControlLabel
                      className={classes.controller}
                      value="Attend"
                      control={<Radio size={'small'} color={'primary'} />}
                      label="Attend"
                  />
                  <FormControlLabel
                      className={classes.controller}
                      value="Not Attend"
                      control={<Radio size={'small'} color={'primary'} />}
                      label="Not Attend"
                  />
                </RadioGroup>
              </div>
              <div className={'f_mt10'}>
                <div>Room</div>
                <select
                    className={'select_input'}
                    value={this.state.roomId}
                    onChange={(...arg) =>
                    this.changeInformation(...arg, 'roomId')
                  }
                >
                  <option value={'0'}> All </option>
                  {this.props.allRoomList.map(item => (
                    <option key={item.roomId} value={item.roomId}>
                      {item.roomName}
                    </option>
                  ))}
                </select>
              </div>
            </Grid>
            <Grid item xs={9}>
              <Paper className={classes.root} elevation={1}>
                <InputBase
                    className={classes.input}
                    onChange={this.handleToggle}
                    placeholder="Search by ID/ Name"
                    value={this.state.value}
                    onKeyUp={this.handleEnterKey}
                />
                <IconButton
                    onClick={this.search}
                    className={classes.iconButton}
                    aria-label="Search"
                    color={'primary'}
                >
                  <Search />
                </IconButton>
              </Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                        style={{ paddingLeft: '15px' }}
                        padding={'none'}
                        className={classes.table_header}
                    >
                      HKIC / Doc. No
                    </TableCell>
                    <TableCell
                        padding={'dense'}
                        className={classes.table_header}
                    >
                      English Name
                    </TableCell>
                    <TableCell
                        padding={'dense'}
                        className={classes.table_header}
                    >
                      Appointment Time
                    </TableCell>
                    <TableCell
                        padding={'dense'}
                        className={classes.table_header}
                    >
                      Arrival Time
                    </TableCell>
                    <TableCell
                        padding={'dense'}
                        className={classes.table_header}
                    >
                      Encounter
                    </TableCell>
                    <TableCell
                        padding={'dense'}
                        className={classes.table_header}
                    >
                      Room
                    </TableCell>
                    <TableCell
                        padding={'dense'}
                        className={classes.table_header}
                    >
                      Attend Status
                    </TableCell>
                    <TableCell
                        padding={'dense'}
                        className={classes.table_header}
                    >
                      {' '}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.attendanceList
                    .slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.rowsPerPage * (this.state.page + 1)
                    )
                    .map((item, index) => (
                      <TableRow
                          key={index}
                          style={{
                          backgroundColor:
                            item.patientSex === 'female'
                              ? 'rgba(255,0,0,0.2)'
                              : '#CFECFA'
                        }}
                      >
                        <TableCell
                            style={{ paddingLeft: '15px' }}
                            padding={'none'}
                        >
                          {item.patientDoc}
                        </TableCell>
                        <TableCell padding={'dense'}>
                          {item.patientName}
                        </TableCell>
                        <TableCell padding={'dense'}>
                          {moment(item.appointmentDate).format(
                            'DD MMM YYYY HH:mm'
                          )}
                        </TableCell>
                        <TableCell padding={'dense'}>
                          {item.attendanceTime
                            ? moment(item.attendanceTime).format(
                                'DD MMM YYYY HH:mm'
                              )
                            : null}
                        </TableCell>
                        <TableCell padding={'dense'}>
                          {item.encounterTypeName}
                        </TableCell>
                        <TableCell padding={'dense'}>{item.roomName}</TableCell>
                        <TableCell padding={'dense'}>
                          {item.attendanceStatus}
                        </TableCell>
                        <TableCell padding={'dense'}>
                          {item.attendanceStatus === 'Attend' ? (
                            <Button
                                variant={'outlined'}
                                color={'primary'}
                                size={'small'}
                                onClick={() => this.select(item)}
                            >
                              {' '}
                              Select{' '}
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                        className={classes.table_pagination}
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={3}
                        count={this.state.attendanceList.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}
export default connect(mapStateToProps)(withStyles(style)(Consulatation));
