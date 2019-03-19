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
  Typography,
  Dialog,
  DialogActions,
  DialogContent
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Patient from '../compontent/patient';
import Note from './note';
import Prescription from './prescription';
import { InlineDatePicker } from 'material-ui-pickers';
import timg from '../../images/timg.gif';

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
    // get prescription information
    departmentFavouriteList: state.updatePrescription.departmentFavouriteList,
    drugHistoryList: state.updatePrescription.drugHistoryList,
    prescriptionLatest: state.updatePrescription.prescriptionLatest,
    // dialog
    closeDialog: state.updateConsultation.closeDialog,
    saveName: state.updateConsultation.saveName,
    consulationErrorMessage: state.updateConsultation.consulationErrorMessage
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
      patientIndex: 0,
      appointmentSelect: {}, // SELECT which attendanceList

      // select detail
      tabValue: 0,
      // clinicNote page
      isNoteUpdate: false,
      newAttendingDiagnosisList: [],
      newChronicDiagnosisList: [],
      newClinicalNote: '',
      // prescription page
      isPrescriptionUpdate: false,
      newPrescriptionDrugList: [],

      openDiag: false
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
    // chronicProblem
    if (nextProps.chronicProblemList !== this.props.chronicProblemList) {
      let newChronicDiagnosisList = _.cloneDeep(nextProps.chronicProblemList);
      this.setState({newChronicDiagnosisList});
    }
    // encounter
    if (nextProps.encounter !== this.props.encounter) {
      if (nextProps.encounter && JSON.stringify(nextProps.encounter) !== '{}') {
        let params = { encounterId: nextProps.encounter.encounterId };
        this.props.dispatch({ type: 'GET_CLINIC_NOTE', params });
        this.props.dispatch({ type: 'GET_ATTENDING_PROBLEM', params });
        this.props.dispatch({ type: 'GET_PRESCRIPTION', params });
      }
    }
    // clinicalNotes
    if (nextProps.clinicNote !== this.props.clinicNote) {
      let newClinicalNote = '';
      let isNoteUpdate = false;
      if (nextProps.clinicNote) {
        if(nextProps.clinicNote.noteContent) {
          newClinicalNote = _.cloneDeep(nextProps.clinicNote.noteContent);
        }
        isNoteUpdate = true;
      }
      this.setState({newClinicalNote, isNoteUpdate});
    }
    // attendingProblem
    if (nextProps.attendingProblemList !== this.props.attendingProblemList) {
      let newAttendingDiagnosisList = _.cloneDeep(nextProps.attendingProblemList);
      this.setState({newAttendingDiagnosisList});
    }
    // prescription
    if (nextProps.prescriptionLatest !== this.props.prescriptionLatest) {
      let isPrescriptionUpdate = false;
      let newPrescriptionDrugList = [];
      if(nextProps.prescriptionLatest && JSON.stringify(nextProps.prescriptionLatest) !== '{}') {
        isPrescriptionUpdate = true;
        if(nextProps.prescriptionLatest.prescriptionDrugBoList) {
          newPrescriptionDrugList = nextProps.prescriptionLatest.prescriptionDrugBoList;
        }
      }
      this.setState({isPrescriptionUpdate, newPrescriptionDrugList});
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
    this.params = { patientId };
    this.params1 = { clinicId: item.clinicId };
    this.params2 = { appointmentId: item.appointmentId };
    // patient
    this.props.dispatch({ type: 'GET_PATINET_BY_ID', params: this.params });
    // clinicNote page
    this.props.dispatch({ type: 'GET_MEDICAL_RECORD', params: this.params });
    this.props.dispatch({ type: 'GET_TEMPLATE', params: this.params1 });
    this.props.dispatch({ type: 'GET_CHRONICPROBLEM', params: this.params });
    this.props.dispatch({ type: 'GET_ENCOUNTERID', params: this.params2 });
    // prescription page
    this.props.dispatch({ type: 'GET_DEPARTMENTAL_FAVOURITE', params: this.params1 });
    this.props.dispatch({ type: 'GET_DRUG_HISTORY', params: this.params });
    this.setState({ ifSelected: true, tabValue: 0, appointmentSelect: item, patientIndex: index });
  };
  getClinicNote = () => {
    this.params3 = { encounterId: this.props.encounter.encounterId };
    // clinicNote page
    this.props.dispatch({ type: 'GET_MEDICAL_RECORD', params: this.params });
    this.props.dispatch({ type: 'GET_CHRONICPROBLEM', params: this.params });
    this.props.dispatch({ type: 'GET_CLINIC_NOTE', params: this.params3 });
    this.props.dispatch({ type: 'GET_ATTENDING_PROBLEM', params: this.params3 });
  }
  getPrescription = () => {
    this.params3 = { encounterId: this.props.encounter.encounterId };
    // prescription page
    this.props.dispatch({ type: 'GET_DRUG_HISTORY', params: this.params });
    this.props.dispatch({ type: 'GET_PRESCRIPTION', params: this.params3 });
  }
  closePatient = () => {
    this.setState({ifSelected: false, appointmentSelect: {}, patientIndex: 0});
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

  changePrescription = (newPrescriptionDrugList) => {
    let prescriptionDrugList = [];
    if(newPrescriptionDrugList) {
      prescriptionDrugList = newPrescriptionDrugList;
    }
    this.setState({newPrescriptionDrugList: prescriptionDrugList});
  }
  changeNote = (newAttendingDiagnosisList, newChronicDiagnosisList, newClinicalNote) => {
    this.setState({
      newAttendingDiagnosisList, newChronicDiagnosisList, newClinicalNote
    });
  }

  save = (name) => {
    const encounterId = this.props.encounter.encounterId;
    const patientId = this.state.appointmentSelect.patientId;
    if(name === 'note') {
      const attendingDiagnosisList = [];
      const chronicDiagnosisList = [];
      const clinicalNote = {
        encounterId,
        noteContent: this.state.newClinicalNote,
        patientId,
        recordType: 'Dr Note'
      };
      if (this.state.isNoteUpdate) {
        _.forEach(this.state.newAttendingDiagnosisList, item => {
          let attendingProblem = {
            diagnosisId: item.diagnosisId,
            encounterId,
            patientId
          };
          _.forEach(this.props.attendingProblemList, eve => {
            if(item.diagnosisId === eve.diagnosisId){
              attendingProblem.id = eve.attendingDiagnosisId;
            }
          });
          attendingDiagnosisList.push(attendingProblem);
        });
        _.forEach(this.state.newChronicDiagnosisList, item => {
          let chronicProblem = {
            status: item.status,
            diagnosisId: item.diagnosisId,
            encounterId,
            patientId
          };
          _.forEach(this.props.chronicProblemList, eve => {
            if(item.diagnosisId === eve.diagnosisId){
              chronicProblem.id = eve.chronicDiagnosisId;
            }
          });
          chronicDiagnosisList.push(chronicProblem);
        });
        const params = {
          newAttendingDiagnosisList: attendingDiagnosisList,
          newChronicDiagnosisList: chronicDiagnosisList,
          newClinicalNote: clinicalNote,
          oldAttendingDiagnosisList: this.props.attendingProblemList,
          oldChronicDiagnosisList: this.props.chronicProblemList,
          oldClinicalNote: this.props.clinicNote
        };
        this.props.dispatch({ type: 'UPDATE_CONSULTATION', params: params });
        this.setState({ openDiag: true });
      } else {
        _.forEach(this.state.newAttendingDiagnosisList, item => {
          attendingDiagnosisList.push({
            diagnosisId: item.diagnosisId,
            encounterId,
            patientId
          });
        });
        _.forEach(this.state.newChronicDiagnosisList, item => {
          chronicDiagnosisList.push({
            status: item.status,
            diagnosisId: item.diagnosisId,
            encounterId,
            patientId
          });
        });
        const params = {
          attendingDiagnosisList,
          chronicDiagnosisList,
          clinicalNote
        };
        this.props.dispatch({ type: 'SAVE_CONSULTATION', params });
        this.setState({ openDiag: true, isNoteUpdate: true });
      }
    } else if(name === 'prescription') {
      const prescription = {
        clinicId: this.props.clinic.clinicId,
        clinicName: this.props.clinic.clinicName,
        encounterId,
        patientId
      };
      const prescriptionDrugList = this.state.newPrescriptionDrugList;
      if (this.state.isPrescriptionUpdate) {
        const params = {
          oldPrescription: this.props.prescriptionLatest.prescription,
          newPrescriptionDrugList: prescriptionDrugList,
          oldPrescriptionDrugList: this.props.prescriptionLatest.prescriptionDrugBoList
        };
        this.props.dispatch({type: 'UPDATE_ORDER', params});
      } else {
        const params = {
          prescription,
          prescriptionDrugList
        };
        this.props.dispatch({ type: 'SAVE_ORDER', params });
      }
      this.setState({ openDiag: true, isPrescriptionUpdate: true });
    }
  }
  cancel = () => {
    this.setState({isNoteUpdate: false, isPrescriptionUpdate: false});
    this.closePatient();
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
    this.setState({openDiag: true});
    this.props.dispatch({type: 'NEXT_PATIENT', params});
  }
  getNextPatient = () => {
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
    this.select(this.props.attendanceList[index], index);
  }
  closeDialog = () => {
    this.setState({ openDiag: false });
    this.props.dispatch({ type: 'CLOSE_CONSULTATION_LOADING' });
    if(this.props.saveName === 'note') {
      this.getClinicNote();
    } else if(this.props.saveName === 'prescription') {
      this.getPrescription();
    } else {
      this.getNextPatient();
    }
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
                  appointmentSelect={this.state.appointmentSelect}    // 123456789012345678912345678
                  changeNote={this.changeNote}

                  medicalRecordList={this.props.medicalRecordList}
                  templateList={this.props.templateList}
                  attendingProblemList={this.state.newAttendingDiagnosisList}
                  chronicProblemList={this.state.newChronicDiagnosisList}
                  clinicalNotes={this.state.newClinicalNote}

                  save={this.save}
                  cancel={this.cancel}
              />
            )}
            {this.state.tabValue === 1 && (
              <Prescription
                  changePrescription={this.changePrescription}
                  appointmentSelect={this.state.appointmentSelect}// 123456789012345678912345678

                  departmentFavouriteList={this.props.departmentFavouriteList}
                  drugHistoryList={this.props.drugHistoryList}
                  medicineList={this.state.newPrescriptionDrugList}
                  isUpdate={this.state.isPrescriptionUpdate}

                  save={this.save}
                  cancel={this.cancel}
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
        <Dialog open={this.state.openDiag && this.props.closeDialog}>
          {this.props.consulationErrorMessage === '' ? (
            <img src={timg} alt={''} />
          ) : (
            <DialogContent>{this.props.consulationErrorMessage}</DialogContent>
          )}
          {this.props.consulationErrorMessage !== '' ? (
            <DialogActions>
              <Button onClick={this.closeDialog} color="primary">
                OK
              </Button>
            </DialogActions>
          ) : null}
        </Dialog>
      </div>
    );
  }
}
export default connect(mapStateToProps)(withStyles(style)(Consulatation));
