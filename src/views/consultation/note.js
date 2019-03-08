import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Table,
  TableRow,
  Typography,
  TableCell,
  TableHead,
  TableBody,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputBase,
  Popper,
  Paper,
  MenuItem,
  Divider,
  Dialog,
  DialogActions,
  DialogContent
} from '@material-ui/core';
import { Close, ArrowLeft, ArrowRight, Remove } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import moment from 'moment';
import timg from '../../images/timg.gif';

function mapStateToProps(state) {
  return {
    medicalRecordList: state.updateConsultation.medicalRecordList,
    templateList: state.updateConsultation.templateList,
    chronicProblemList: state.updateConsultation.chronicProblemList,
    diagnosisProblemList: state.updateConsultation.diagnosisProblemList,
    encounter: state.updateConsultation.encounter,
    clinicNote: state.updateConsultation.clinicNote,
    attendingProblemList: state.updateConsultation.attendingProblemList,
    closeDialog: state.updateConsultation.closeDialog,
    consulationErrorMessage: state.updateConsultation.consulationErrorMessage
  };
}
const style = {
  table_header: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(0, 0, 0, 0.7)',
    padding: '0, 0, 0, 10'
  },
  left_warp: {
    padding: 20,
    backgroundColor: 'lightgray'
  },
  right_warp: {
    paddingLeft: 15,
    paddingTop: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 600
  },
  table: {
    height: 200,
    backgroundColor: '#fff',
    border: '1px solid rgba(0,0,0,0.5)',
    marginBottom: 20,
    overflowY: 'auto'
  },
  table_row: {
    height: 31,
    cursor: 'pointer'
  },
  table_row_selected: {
    height: 31,
    cursor: 'pointer',
    backgroundColor: 'lightgoldenrodyellow'
  },
  table_head: {
    height: 30
  },
  button: {
    float: 'right',
    backgroundColor: '#fff'
  },
  alert: {
    border: '1px solid red'
  },
  alert_left: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 18,
    fontWeight: 600,
    height: 45,
    paddingTop: 25,
    textAlign: 'center',
    width: 80
  },
  alert_right: {
    paddingTop: 5,
    paddingLeft: 20,
    paddingBottom: 5
  },
  transfer: {
    padding: '10px 0 8px 15px'
  },
  transfer_box: {
    border: '1px solid rgba(0,0,0,0.2)',
    height: 108
  },
  diagnosis_search: {
    paddingLeft: 8,
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    width: 'calc(100% - 8px)'
  },
  diagnosis_close: {
    float: 'right',
    height: 25
  },
  transfer_part2: {
    paddingTop: 50,
    textAlign: 'center'
  },
  clinical_note: {
    paddingLeft: 10
  },
  clinical_note_box: {
    border: '1px solid rgba(0,0,0,0.2)',
    height: 220,
    width: 'calc(100% - 40px)',
    padding: 15,
    marginLeft: 10,
    overflowY: 'auto'
  },
  template_icon: {
    float: 'left'
  },
  template_button_group: {
    paddingLeft: 18
  },
  template_button: {
    height: 31
  },
  paper: {
    maxHeight: 200,
    overflowY: 'auto',
    position: 'absolute',
    transform: 'translate3d(-180px, 3px, 0px)'
  },
  menu_list: {
    paddingTop: 0,
    fontSize: 14
  },
  mr15: {
    marginRight: 15
  },
  menu: {
    top: 38,
    padding: 0
  },
  can_transfer: {
    color: 'black'
  },
  not_transfer: {
    color: 'lightgray'
  },
  diagnosis_problem_list: {
    maxHeight: 75,
    overflowY: 'auto'
  },
  select_diagnosis_problem: {
    backgroundColor: 'lightgray',
    cursor: 'pointer',
    paddingLeft: 8,
    height: 25,
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    width: 'calc(100% - 8px)'
  },
  diagnosis_problem: {
    cursor: 'pointer',
    paddingLeft: 8,
    height: 25,
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    width: 'calc(100% - 8px)'
  },
  diagnosis_problem_name: {
    height: 25,
    float: 'left',
    width: 'calc(100% - 110px)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
};

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicalRecordList: this.props.medicalRecordList,
      medicalRecord: {},
      templateList: this.props.templateList,
      clinicalNotesOrigin: '',
      clinicalNotes: '',
      chronicProblemListOrigin: [],
      chronicProblemList: [],
      attendingProblemListOrigin: [],
      attendingProblemList: [],
      searchValue: '',
      open: false,
      selectDiagnosis: {},
      ifTransfer: 0, //0表示attending Problem 和chronicProblem不能互相copy，1.attending->chronic, 2.chronic->attending
      isUpdate: false,
      openDiag: false
    };
  }
  componentDidMount() {
    console.log(12312);
    if (this.props.medicalRecordList.length > 0) {
      this.setState({ medicalRecord: this.props.medicalRecordList[0] });
    }
    let templateList = _.cloneDeep(this.props.templateList);
    if (templateList.length > 0) {
      _.forEach(templateList, item => {
        item.checked = false;
      });
      this.setState({ templateList });
    }
    console.log(this.props.clinicNote);
    if(this.props.clinicNote) {
      let clinicalNotes = '';
      if(this.props.clinicNote.noteContent){
        clinicalNotes = _.cloneDeep(this.props.clinicNote.noteContent);
      }
      this.setState({
        clinicalNotes,
        clinicalNotesOrigin: clinicalNotes,
        isUpdate: true
      });
    }
    if(this.props.attendingProblemList){
      let attendingProblemList = _.cloneDeep(this.props.attendingProblemList);
      this.setState({
        attendingProblemList,
        attendingProblemListOrigin: attendingProblemList
      });
    }
    // if(JSON.stringify(this.props.encounter) !== '{}'){
    //   let params = { encounterId: this.props.encounter.encounterId};
    //   this.props.dispatch({type: 'GET_CLINIC_NOTE', params});
    //   this.props.dispatch({type: 'GET_ATTENDING_PROBLEM', params});
    // }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(987697);
    // medicalRecordList记录
    if (nextProps.medicalRecordList !== this.props.medicalRecordList) {
      let medicalRecord = {};
      if(nextProps.medicalRecordList.length > 0){
        medicalRecord = nextProps.medicalRecordList[0];
      }
      this.setState({
        medicalRecord: medicalRecord,
        medicalRecordList: nextProps.medicalRecordList
      });
    }
    // template
    if (nextProps.templateList !== this.props.templateList) {
      let templateList = _.cloneDeep(nextProps.templateList);
      if (templateList.length > 0) {
        _.forEach(templateList, item => {
          item.checked = false;
        });
      }
      this.setState({ templateList });
    }
    // chronicProblem
    if (nextProps.chronicProblemList !== this.props.chronicProblemList) {
      let chronicProblemList = _.cloneDeep(nextProps.chronicProblemList);
      this.setState({
        chronicProblemList,
        chronicProblemListOrigin: chronicProblemList
      });
    }
    // encounter
    if (nextProps.encounter !== this.props.encounter) {
      if(nextProps.encounter && JSON.stringify(nextProps.encounter) !== '{}'){
        let params = { encounterId: nextProps.encounter.encounterId};
        this.props.dispatch({type: 'GET_CLINIC_NOTE', params});
        this.props.dispatch({type: 'GET_ATTENDING_PROBLEM', params});
      }
    }
    // clinicalNotes
    if (nextProps.clinicNote !== this.props.clinicNote) {
      console.log(nextProps.clinicNote, 'next');
      let clinicalNotes = '';
      let isUpdate = false;
      if(nextProps.clinicNote && nextProps.clinicNote.noteContent){
        clinicalNotes = _.cloneDeep(nextProps.clinicNote.noteContent);
        isUpdate = true;
      }
      this.setState({
        clinicalNotes,
        clinicalNotesOrigin: clinicalNotes,
        isUpdate
      });
    }
    // attendingProblem
    if (nextProps.attendingProblemList !== this.props.attendingProblemList) {
      let attendingProblemList = _.cloneDeep(nextProps.attendingProblemList);
      this.setState({
        attendingProblemList,
        attendingProblemListOrigin: attendingProblemList
      });
    }
  }
  changeCheck = (e, checked, item) => {
    let templateList = _.cloneDeep(this.state.templateList);
    let clinicalNotes = '';
    let template = _.find(templateList, eve => {
      return eve.clinicalNoteTemplateId === item.clinicalNoteTemplateId;
    });
    template.checked = checked;
    _.forEach(templateList, item => {
      if (item.checked) {
        clinicalNotes += item.templateContent + '\n';
      }
    });
    this.setState({ templateList, clinicalNotes });
  };
  changeMedicalRecord = medicalRecord => {
    this.setState({ medicalRecord });
  };
  editClinicalNotes = e => {
    this.setState({ clinicalNotes: e.target.value });
  };
  save = () => {
    const patientId = this.props.patientId;
    const encounterId = this.props.encounter.encounterId;
    // const attendingDiagnosisList = _.cloneDeep(this.state.attendingProblemList);
    // const chronicDiagnosisList = _.cloneDeep(this.state.chronicProblemList);
    // _.forEach(attendingDiagnosisList, item => {
    //   item.encounterId = encounterId;
    //   item.patientId = patientId;
    // });
    // _.forEach(chronicDiagnosisList, item => {
    //   item.encounterId = encounterId;
    //   item.patientId = patientId;
    // });
    const attendingDiagnosisList = [];
    const chronicDiagnosisList = [];
    _.forEach(this.state.attendingProblemList, item => {
      attendingDiagnosisList.push({
        diagnosisId: item.diagnosisId,
        encounterId,
        patientId
      });
    });
    _.forEach(this.state.chronicProblemList, item => {
      chronicDiagnosisList.push({
        status: item.status,
        diagnosisId: item.diagnosisId,
        encounterId,
        patientId
      });
    });
    const clinicalNote = {
      encounterId,
      noteContent: this.state.clinicalNotes,
      patientId,
      recordType: 'Dr Note'
    };
    const params = {
      attendingDiagnosisList,
      chronicDiagnosisList,
      clinicalNote
    };
    const params1 = {
      newAttendingDiagnosisList: attendingDiagnosisList,
      newChronicDiagnosisList:chronicDiagnosisList,
      newClinicalNote: clinicalNote,
      oldAttendingDiagnosisList: this.props.attendingProblemList,
      oldChronicDiagnosisList: this.props.chronicProblemList,
      oldClinicalNote: this.props.clinicNote
    };
    console.log(this.state.isUpdate, params1);
    if(this.state.isUpdate) {
      // this.props.dispatch({type: 'UPDATE_CONSULTATION', params: params1});
    } else {
      this.props.dispatch({type: 'SAVE_CONSULTATION', params});
      this.setState({openDiag: true});
    }
    // console.log(this.state.clinicalNotes);
    // console.log(this.props.encounter, this.props.patientId, JSON.stringify(this.state.clinicalNotes), this.state.attendingProblemList, this.state.chronicProblemList);
  };
  clear = () => {
    this.setState({isUpdate: false});
    this.props.close();
    // let clinicalNotes = _.cloneDeep(this.state.clinicalNotesOrigin);
    // let attendingProblemList = _.cloneDeep(this.state.attendingProblemListOrigin);
    // let chronicProblemList = _.cloneDeep(this.state.chronicProblemListOrigin);
    // let templateList = _.cloneDeep(this.state.templateList);
    // _.forEach(templateList, item => {
    //   item.checked = false;
    // });
    // this.setState({templateList, clinicalNotes, attendingProblemList, chronicProblemList, searchValue: ''});
  };
  copy = () => {
    let notes = this.state.medicalRecord.noteContent;
    let clinicalNotes = _.cloneDeep(this.state.clinicalNotes);
    clinicalNotes = clinicalNotes + notes;
    this.setState({ clinicalNotes });
  };
  /* Problems */
  changeSearchValue = e => {
    this.setState({ searchValue: e.target.value });
    if (e.target.value !== '') {
      const params = {
        keyword: e.target.value
      };
      this.props.dispatch({ type: 'SEARCH_DIAGNOSIS_PROBLEMS', params });
      this.setState({ open: true });
    }
  };
  handleClose = item => {
    let attendingProblemList = _.cloneDeep(this.state.attendingProblemList);
    if (JSON.stringify(item) !== '{}') {
      if (
        !_.find(
          attendingProblemList,
          eve => eve.diagnosisId === item.diagnosisId
        )
      ) {
        attendingProblemList.push(item);
      }
    }
    this.setState({ open: false, attendingProblemList });
  };
  // index 0表示在attendingProblems里， 1表示在chronic Problems
  clickDiagnosis = (selectDiagnosis, index) => {
    let ifTransfer = 0;
    if (index === 0) {
      let chronicProblemList = _.cloneDeep(this.state.chronicProblemList);
      if (
        _.find(chronicProblemList, item => {
          return item.diagnosisId === selectDiagnosis.diagnosisId;
        })
      ) {
        ifTransfer = 0;
      } else {
        ifTransfer = 1;
      }
    } else {
      let attendingProblemList = _.cloneDeep(this.state.attendingProblemList);
      if (
        _.find(attendingProblemList, item => {
          return item.diagnosisId === selectDiagnosis.diagnosisId;
        })
      ) {
        ifTransfer = 0;
      } else {
        ifTransfer = 2;
      }
    }
    this.setState({ selectDiagnosis, ifTransfer });
  };
  removeDiagnosis = (diagnosis, index) => {
    if (index === 0) {
      let attendingProblemList = _.cloneDeep(this.state.attendingProblemList);
      _.remove(attendingProblemList, item => {
        return item.diagnosisId === diagnosis.diagnosisId;
      });
      this.setState({ attendingProblemList });
    } else {
      let chronicProblemList = _.cloneDeep(this.state.chronicProblemList);
      _.remove(chronicProblemList, item => {
        return item.diagnosisId === diagnosis.diagnosisId;
      });
      this.setState({ chronicProblemList });
    }
  };
  transfer = index => {
    let selectDiagnosis = _.cloneDeep(this.state.selectDiagnosis);
    let attendingProblemList = _.cloneDeep(this.state.attendingProblemList);
    let chronicProblemList = _.cloneDeep(this.state.chronicProblemList);
    if (index === 0) {
      chronicProblemList.push({
        diagnosisId: selectDiagnosis.diagnosisId,
        diagnosisDescription: selectDiagnosis.diagnosisDescription,
        status: 'Active'
      });
    } else {
      attendingProblemList.push({
        diagnosisId: selectDiagnosis.diagnosisId,
        diagnosisDescription: selectDiagnosis.diagnosisDescription
      });
    }
    this.setState({
      ifTransfer: 0,
      selectDiagnosis: {},
      attendingProblemList,
      chronicProblemList
    });
  };
  handleEnterKey = e => {
    if (e.keyCode === 13) {
      if (this.state.searchValue !== '') {
        const params = {
          keyword: this.state.searchValue
        };
        this.props.dispatch({ type: 'SEARCH_DIAGNOSIS_PROBLEMS', params });
        this.setState({ open: true });
      }
    }
  };
  changeChronicPromblemStatus = (e, chronicProblem) => {
    let chronicProblemList = _.cloneDeep(this.state.chronicProblemList);
    let problem = _.find(chronicProblemList, item => {return item.diagnosisId === chronicProblem.diagnosisId;});
    problem.status = e.target.value;
    this.setState({chronicProblemList});
  }
  closeDialog = () => {
    this.props.dispatch({type: 'CLOSE_CONSULTATION_ERROR'});
    this.setState({isUpdate: false, openDiag: false});
    this.props.close();
  }
  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={3} className={classes.left_warp}>
          <Typography component="div" className={classes.title}>
            Medical Record
          </Typography>
          <Typography component="div" className={classes.table}>
            <Table>
              <TableHead>
                <TableRow className={classes.table_head}>
                  <TableCell
                      style={{ paddingLeft: '15px' }}
                      padding={'none'}
                      className={classes.table_header}
                  >
                    Date
                  </TableCell>
                  <TableCell padding={'dense'} className={classes.table_header}>
                    Record Type
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.medicalRecordList.map((item, index) => (
                  <TableRow
                      key={index}
                      onClick={() => this.changeMedicalRecord(item)}
                      className={
                      item.clinicalNoteId ===
                      this.state.medicalRecord.clinicalNoteId
                        ? classes.table_row_selected
                        : classes.table_row
                    }
                  >
                    <TableCell style={{ paddingLeft: '15px' }} padding={'none'}>
                      {moment(item.createDate).format('DD MMM YYYY HH:mm')}
                    </TableCell>
                    <TableCell padding={'dense'}>{item.recordType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Typography>
          <Typography component="div" className={classes.title}>
            Record Detail
          </Typography>
          <Typography
              component="div"
              className={classes.table}
              style={{ padding: 15, height: 220, color: '#4052B2' }}
          >
            {this.state.medicalRecord.noteContent}
          </Typography>
          <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              size="small"
              onClick={this.copy}
          >
            {' '}
            Copy{' '}
          </Button>
        </Grid>
        <Grid item xs={9}>
          <FormGroup row className={classes.alert}>
            <FormControl className={classes.alert_left}>Alert</FormControl>
            <FormControl className={classes.alert_right}>
              <Typography component="div">
                Allergy - aspirin, Peanut(non-drug)
              </Typography>
              <Typography component="div">ADR - ...</Typography>
              <Typography component="div">Alert - G6PD Deficiency</Typography>
            </FormControl>
          </FormGroup>
          <Typography component="div" className={classes.right_warp}>
            <Typography component="div" className={classes.title}>
              Problem
            </Typography>
            <Grid container className={classes.transfer} spacing={24}>
              <Grid item xs={5}>
                <Typography>Attending Problem(s)</Typography>
                <Typography component="div" className={classes.transfer_box}>
                  <InputBase
                      value={this.state.searchValue}
                      onChange={this.changeSearchValue}
                      placeholder="Input keyword to search"
                      className={classes.diagnosis_search}
                      inputRef={node => {
                      this.anchorel = node;
                    }}
                      onKeyUp={this.handleEnterKey}
                    // onBlur={() => this.handleClose({})}
                  />
                  <Popper open={this.state.open} anchorEl={this.anchorel}>
                    <Paper className={classes.paper}>
                      {this.props.diagnosisProblemList.map((item, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => this.handleClose(item)}
                            className={classes.menu_list}
                        >
                          <Typography
                              component={'div'}
                              className={classes.mr15}
                          >
                            {item.diagnosisDescription}
                          </Typography>
                        </MenuItem>
                      ))}
                      <Divider />
                      <MenuItem
                          onClick={() => this.handleClose({})}
                          className={classes.menu_list}
                      >
                        Not Found
                      </MenuItem>
                    </Paper>
                  </Popper>
                  <FormGroup row className={classes.diagnosis_problem_list}>
                    {this.state.attendingProblemList.map((item, index) => (
                      <Typography
                          className={
                          this.state.selectDiagnosis.diagnosisId ===
                          item.diagnosisId
                            ? classes.select_diagnosis_problem
                            : classes.diagnosis_problem
                        }
                          key={index}
                          component="div"
                      >
                        <Typography
                            className={classes.diagnosis_problem_name}
                            onClick={() => this.clickDiagnosis(item, 0)}
                        >
                          {item.diagnosisDescription}
                        </Typography>
                        <Close
                            fontSize="small"
                            className={classes.diagnosis_close}
                            onClick={() => this.removeDiagnosis(item, 0)}
                        />
                      </Typography>
                    ))}
                  </FormGroup>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography component="div" className={classes.transfer_part2}>
                  <Typography component="div">
                    <ArrowRight
                        className={
                        this.state.ifTransfer === 1
                          ? classes.can_transfer
                          : classes.not_transfer
                      }
                        onClick={
                        this.state.ifTransfer === 1
                          ? () => this.transfer(0)
                          : null
                      }
                    />
                  </Typography>
                  <Typography component="div">
                    <ArrowLeft
                        className={
                        this.state.ifTransfer === 2
                          ? classes.can_transfer
                          : classes.not_transfer
                      }
                        onClick={
                        this.state.ifTransfer === 2
                          ? () => this.transfer(1)
                          : null
                      }
                    />
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography>Chronic Problem(s)</Typography>
                <Typography component="div" className={classes.transfer_box}>
                <FormGroup row className={classes.diagnosis_problem_list} style={{maxHeight: 105}}>
                  {this.state.chronicProblemList.map((item, index) => (
                    <Typography
                        className={
                        this.state.selectDiagnosis.diagnosisId ===
                        item.diagnosisId
                          ? classes.select_diagnosis_problem
                          : classes.diagnosis_problem
                      }
                        key={index}
                        component="div"
                    >
                      <Typography
                          className={classes.diagnosis_problem_name}
                          onClick={() => this.clickDiagnosis(item, 1)}
                      >
                        {item.diagnosisDescription}
                      </Typography>
                      <select value={item.status} onChange={(...arg) => this.changeChronicPromblemStatus(...arg, item)}>
                        <option value="Active">Active</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <Close
                          fontSize="small"
                          className={classes.diagnosis_close}
                          onClick={() => this.removeDiagnosis(item, 1)}
                      />
                    </Typography>
                  ))}
                  </FormGroup>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={24}>
              <Grid item xs={8}>
                <Typography component="div" className={classes.title}>
                  Clinical Note
                </Typography>
                <Typography
                    component="textarea"
                    className={classes.clinical_note_box}
                    value={this.state.clinicalNotes}
                    onChange={this.editClinicalNotes}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography component="div" className={classes.title}>
                  Template
                </Typography>
                <Typography
                    component="div"
                    className={classes.clinical_note_box}
                >
                  <Typography component="div" color="primary">
                    <Remove
                        color="primary"
                        fontSize="small"
                        className={classes.template_icon}
                    />
                    By Diseases
                  </Typography>
                  <FormGroup className={classes.template_button_group}>
                    {this.state.templateList.map((item, index) => (
                      <FormControlLabel
                          className={classes.template_button}
                          key={index}
                          label={item.templateName}
                          control={
                          <Checkbox
                              label={item.templateName}
                              value={item.templateName}
                              checked={item.checked || false}
                              color={'primary'}
                              onChange={(...arg) =>
                              this.changeCheck(...arg, item)
                            }
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={24}>
              <Grid item xs={11} className={classes.button_save_clear}>
                <Button
                    style={{ marginTop: 8 }}
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={this.clear}
                >
                  {' '}
                  Cancel{' '}
                </Button>
                <Button
                    style={{ marginTop: 8, marginRight: 10 }}
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={this.save}
                >
                  {' '}
                  Save{' '}
                </Button>
              </Grid>
            </Grid>
          </Typography>
        </Grid>
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
      </Grid>
    );
  }
}
export default connect(mapStateToProps)(withStyles(style)(Note));
