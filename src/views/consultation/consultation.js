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
  Paper,
  Typography
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
    clinic: state.updateUser.clinic,
    clinicList: state.updateUser.clinicList,
    allRoomList: state.updateUser.allRoomList,
    // select patient
    patientById: state.updatePatient.patientById,
    // attendanceList
    attendanceList: state.updateAppointment.attendanceList,
    // get encounterId
    encounter: state.updateConsultation.encounter,
    // get clinicNote information
    medicalRecordList: state.updateConsultation.medicalRecordList,
    templateList: state.updateConsultation.templateList,
    chronicProblemList: state.updateConsultation.chronicProblemList,
    clinicNote: state.updateConsultation.clinicNote,
    attendingProblemList: state.updateConsultation.attendingProblemList,

    prescriptionLatest: state.updatePrescription.prescriptionLatest
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
  },
  tabs: {
    float: 'left'
  },
  next: {
    float: 'right',
    marginTop: 6
  }
};
class Consulatation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // select items
      roomId: '0',
      attendanceStatus: 'All',
      date: moment(new Date().getTime()).format('DD MMM YYYY'),
      // attendanceList show
      attendanceList: this.props.attendanceList,
      value: '',
      // pagination
      rowsPerPage: 10,
      page: 0,
      // select patinet
      ifSelected: false,
      patinetIndex: 0,
      appointmentSelect: {}, // SELECT which attendanceList

      // select detail
      tabValue: 0,
      // clinicNote page
      isNoteFirst: true,
      isNoteUpdate: false,
      newAttendingDiagnosisList: [],
      newChronicDiagnosisList: [],
      newClinicalNote: '',
      // prescription page
      isPrescriptionFirst: true,
      isPrescriptionUpdate: false,
      newPrescriptionDrugList: []
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
  // change status
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
  /* table pagination 分页 */
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  // select patient
  select = (item, index) => {
    const patientId = item.patientId;
    const params = { patientId };
    this.props.dispatch({ type: 'GET_PATINET_BY_ID', params });
    this.setState({ ifSelected: true, tabValue: 0, appointmentSelect: item, patientIndex: index });
  };
  closePatient = () => {
    this.setState({ patient: {}, ifSelected: false, appointmentSelect: {}, isPrescriptionFirst: true, isNoteFirst: true });
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

  // tab change
  changeTabValue = (event, value) => {
    this.setState({ tabValue: value });
  };

  changePrescription = (newPrescriptionDrugList, isUpdate) => {
    let prescriptionDrugList = [];
    if(newPrescriptionDrugList) {
      prescriptionDrugList = newPrescriptionDrugList;
    }
    this.setState({newPrescriptionDrugList: prescriptionDrugList, isPrescriptionUpdate: isUpdate});
  }
  changeNote = (newAttendingDiagnosisList, newChronicDiagnosisList, newClinicalNote, isNoteUpdate) => {
    this.setState({
      newAttendingDiagnosisList, newChronicDiagnosisList, newClinicalNote, isNoteUpdate
    });
  }
  /* nextPatient */
  nextPatient = () => {
    // save
    const encounterId = this.props.encounter.encounterId;
    const patientId = this.state.appointmentSelect.patientId;
    let newAttendingDiagnosisList = [];
    _.forEach(this.state.newAttendingDiagnosisList, item => {
      newAttendingDiagnosisList.push({
        diagnosisId: item.diagnosisId,
        encounterId,
        patientId
      });
    });
    let newChronicDiagnosisList = [];
    _.forEach(this.state.newChronicDiagnosisList, item => {
      newChronicDiagnosisList.push({
        status: item.status,
        diagnosisId: item.diagnosisId,
        encounterId,
        patientId
      });
    });
    let newClinicalNote = {
      encounterId,
      noteContent: this.state.newClinicalNote,
      patientId,
      recordType: 'Dr Note'
    };
    let newPrescriptionDrugList = this.state.newPrescriptionDrugList;
    let oldAttendingDiagnosisList = null;
    let oldChronicDiagnosisList = null;
    let oldClinicalNote = null;
    if(this.state.isNoteUpdate) {
      oldAttendingDiagnosisList = this.props.attendingProblemList;
      oldChronicDiagnosisList = this.props.chronicProblemList;
      oldClinicalNote = this.props.clinicNote;
    }
    let oldPrescription = {
      clinicId: this.props.clinic.clinicId,
      clinicName: this.props.clinic.clinicName,
      encounterId,
      patientId
    };
    let oldPrescriptionDrugList = null;
    if(this.state.isPrescriptionUpdate) {
      oldPrescription = this.props.prescriptionLatest.prescription;
      oldPrescriptionDrugList = this.props.prescriptionLatest.prescriptionDrugBoList;
    }
    const params = {
      newAttendingDiagnosisList,
      newChronicDiagnosisList,
      newClinicalNote,
      newPrescriptionDrugList,
      oldAttendingDiagnosisList,
      oldChronicDiagnosisList,
      oldClinicalNote,
      oldPrescription,
      oldPrescriptionDrugList
    };
    console.log(params);
    this.props.dispatch({type: 'NEXT_PATIENT', params});
    this.getnextPatient();
  }
  getnextPatient = () => {
    // next patient
    let attend = [];
    _.forEach(this.props.attendanceList, item => {
      item.attendanceStatus === 'Attend' && attend.push(item);
    });
    let index = _.cloneDeep(this.state.patientIndex);
    if(index === attend.length-1) {
      index = 0;
    } else {
      index = index + 1;
    }
    this.setState({isNoteFirst: true, isPrescriptionFirst: true});
    this.select(this.props.attendanceList[index], index);
  }
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
            <Typography component="div">
              <Tabs
                  value={this.state.tabValue}
                  onChange={this.changeTabValue}
                  indicatorColor={'primary'}
                  textColor={'primary'}
                  className={classes.tabs}
              >
                <Tab label="Note/Diagnosis" />
                <Tab label="Prescription" />
              </Tabs>
              <Button variant="outlined" color="primary" size="small" onClick={() => this.nextPatient()} className={classes.next}>Next Patient</Button>
            </Typography>
            {this.state.tabValue === 0 && (
              <Note
                  close={this.closePatient}
                  appointmentSelect={this.state.appointmentSelect}
                  changeNote={this.changeNote}
                  first={this.state.isNoteFirst}
                  attendingProblemList={this.state.newAttendingDiagnosisList}
                  chronicProblemList={this.state.newChronicDiagnosisList}
                  clinicNotes={this.state.newClinicalNote}
                  firstEnter={() => this.setState({isNoteFirst: false})}
                  isUpdate={this.state.isNoteUpdate}
                  changePrescription={this.changePrescription}
              />
            )}
            {this.state.tabValue === 1 && (
              <Prescription
                  changePrescription={this.changePrescription}
                  close={this.closePatient}
                  appointmentSelect={this.state.appointmentSelect}
                  first={this.state.isPrescriptionFirst}
                  medicineList={this.state.newPrescriptionDrugList}
                  firstEnter={() => this.setState({isPrescriptionFirst: false})}
                  isUpdate={this.state.isPrescriptionUpdate}
              />
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
                                : item.patientSex === 'male'
                                ? '#CFECFA'
                                : 'rgba(255,155,55, 0.4)'
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
                                onClick={() => this.select(item, index)}
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
