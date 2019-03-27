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
  IconButton,
  CircularProgress
} from '@material-ui/core';
import { Close, ArrowLeft, ArrowRight, Remove, Search } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import moment from 'moment';
import { getSimpleText } from '../../services/utils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function mapStateToProps(state) {
  return {
    diagnosisProblemList: state.updateConsultation.diagnosisProblemList,
    openSearchProgress: state.updateConsultation.openSearchProgress
  };
}
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];
const style = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    height: 25,
    borderRadius: 0
  },
  table_header: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(0, 0, 0, 0.7)',
    padding: '0, 0, 0, 10'
  },
  left_warp: {
    padding: 20,
    backgroundColor: 'lightgray',
    height: 'calc(100vh - 200px)',
    minHeight: 600
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
    border: '1px solid rgba(0,0,0,0.42)',
    height: 108
  },
  diagnosis_search: {
    paddingLeft: 8,
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
    border: '1px solid rgba(0,0,0,0.42)',
    height: 'calc(100vh - 600px)',
    minHeight: 220,
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
    transform: 'translate3d(18px, 3px, 0px)',
    width: 380
  },
  menu_all_list: {
    maxHeight: 150,
    overflowY: 'auto'
  },
  menu_list_select: {
    paddingTop: 0,
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  menu_list: {
    paddingTop: 0,
    fontSize: 14
  },
  mr15: {
    marginRight: 15,
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
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
    borderBottom: '1px solid rgba(0,0,0,0.42)',
    width: 'calc(100% - 8px)'
  },
  diagnosis_problem: {
    cursor: 'pointer',
    paddingLeft: 8,
    height: 25,
    borderBottom: '1px solid rgba(0,0,0,0.42)',
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
      medicalRecordList: _.cloneDeep(this.props.medicalRecordList),
      medicalRecord: this.props.medicalRecordList.length && this.props.medicalRecordList.length > 0 ? this.props.medicalRecordList[0] : {},
      templateList: _.cloneDeep(this.props.templateList),
      clinicalNotes: _.cloneDeep(this.props.clinicalNotes),
      chronicProblemList: _.cloneDeep(this.props.chronicProblemList),
      attendingProblemList: _.cloneDeep(this.props.attendingProblemList),

      searchValue: '',
      open: false, // open search result
      selectDiagnosis: {}, //select to add attendancePromlemList

      ifTransfer: 0, //0表示attending Problem 和chronicProblem不能互相copy，1.attending->chronic, 2.chronic->attending
      openDiag: false,
      count: -1   //keyboard select;
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // medicalRecordList记录
    if (nextProps.medicalRecordList !== this.props.medicalRecordList) {
      let medicalRecord = {};
      if (nextProps.medicalRecordList.length > 0) {
        medicalRecord = nextProps.medicalRecordList[0];
      }
      medicalRecord.noteContent = medicalRecord.noteContent && getSimpleText(medicalRecord.noteContent);
      // document.getElementById('textRecord').innerHTML = medicalRecord.noteContent;
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
      this.setState({chronicProblemList});
    }
    // clinicalNotes
    if (nextProps.clinicalNotes !== this.props.clinicalNotes) {
      this.setState({clinicalNotes: _.cloneDeep(nextProps.clinicalNotes)});
    }
    // attendingProblem
    if (nextProps.attendingProblemList !== this.props.attendingProblemList) {
      let attendingProblemList = _.cloneDeep(nextProps.attendingProblemList);
      this.setState({attendingProblemList});
    }
  }
  changeMedicalRecord = medicalRecord => {
    medicalRecord.noteContent = medicalRecord.noteContent && getSimpleText(medicalRecord.noteContent);
    this.setState({ medicalRecord });
  };

  // change clinicalNotes
  copy = () => {
    let notes = this.state.medicalRecord.noteContent;
    let clinicalNotes = _.cloneDeep(this.state.clinicalNotes);
    clinicalNotes = clinicalNotes + notes;
    this.setState({ clinicalNotes });
    this.props.changeNote(this.state.attendingProblemList, this.state.chronicProblemList, clinicalNotes);
  };
  changeCheck = (e, checked, item) => {
    let templateList = _.cloneDeep(this.state.templateList);
    let clinicalNotes = '';
    let template = _.find(templateList, eve => {
      return eve.clinicalNoteTemplateId === item.clinicalNoteTemplateId;
    });
    template.checked = checked;
    _.forEach(templateList, item => {
      if (item.checked){
        clinicalNotes += item.templateContent + '<br/>';
      }
    });
    this.setState({ templateList, clinicalNotes });
    this.props.changeNote(this.state.attendingProblemList, this.state.chronicProblemList, clinicalNotes);
  };
  editClinicalNotes = value => {
    this.setState({ clinicalNotes: value });
    this.props.changeNote(this.state.attendingProblemList, this.state.chronicProblemList, value);
  };

  /* Problems */
  // search
  changeSearchValue = e => {
    this.setState({ searchValue: e.target.value, count: -1 });
    if (e.target.value !== '') {
      if (e.target.value.length > 3) {
        const params = {
          keyword: e.target.value
        };
        this.props.dispatch({ type: 'SEARCH_DIAGNOSIS_PROBLEMS', params });
        this.setState({ open: true });
      } else {
        this.setState({open: false});
      }
    } else {
      this.setState({open: false});
    }
  };
  searchDiagnosisProblem = () => {
    if (this.state.searchValue !== '') {
      const params = {
        keyword: this.state.searchValue
      };
      this.props.dispatch({ type: 'SEARCH_DIAGNOSIS_PROBLEMS', params });
      this.setState({ open: true });
    }
  }
  keyDown = e => {
    if(this.state.open) {
      let temp = _.cloneDeep(this.state.count);
      let len = this.props.diagnosisProblemList.length; //patient count
      if (e.keyCode === 40) {
        if (temp > -2 && temp < len - 1) {
          temp = temp + 1;
        } else if (temp === len - 1) {
          temp = -2;
        } else {
          temp = 0;
        }
      }
      if (e.keyCode === 38) {
        if (temp > 0 && temp < len) {
          temp = temp - 1;
        } else if (temp === -1) {
          temp = -2;
        } else if (temp === 0) {
          temp = -2;
        } else {
          temp = len - 1;
        }
      }
      if (e.keyCode === 13) {
        if(this.state.count === -1) {
          this.searchDiagnosisProblem();
        } else {
          if (temp === -2) {
            this.handleClose({});
            temp = -1;
          } else if (temp === -1) {
            temp = -1;
          } else {
            this.handleClose(this.props.diagnosisProblemList[temp]);
            temp = -1;
          }
        }
      }
      if(temp > 3) {
        document.getElementById('myInput').scrollTop = (temp-3)*35;
      } else if (temp > 0 && temp <= 3){
        document.getElementById('myInput').scrollTop = 0;
      }
      this.setState({ count: temp });
    } else {
      if (e.keyCode === 13) {
        this.searchDiagnosisProblem();
      }
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
    this.setState({ open: false, attendingProblemList, searchValue: '' });
    this.props.changeNote(attendingProblemList, this.state.chronicProblemList, this.state.clinicalNotes);
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
    this.props.changeNote(attendingProblemList, this.state.chronicProblemList, this.state.clinicalNotes);
    } else {
      let chronicProblemList = _.cloneDeep(this.state.chronicProblemList);
      _.remove(chronicProblemList, item => {
        return item.diagnosisId === diagnosis.diagnosisId;
      });
      this.setState({ chronicProblemList });
    this.props.changeNote(this.state.attendingProblemList, chronicProblemList, this.state.clinicalNotes);
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
    this.props.changeNote(attendingProblemList, chronicProblemList, this.state.clinicalNotes);
  };
  changeChronicPromblemStatus = (e, chronicProblem) => {
    let chronicProblemList = _.cloneDeep(this.state.chronicProblemList);
    let problem = _.find(chronicProblemList, item => {
      return item.diagnosisId === chronicProblem.diagnosisId;
    });
    problem.status = e.target.value;
    this.setState({ chronicProblemList });
    this.props.changeNote(this.state.attendingProblemList, chronicProblemList, this.state.clinicalNotes);
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={4} lg={3} className={classes.left_warp}>
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
              id="textRecord"
              component="div"
              className={classes.table}
              style={{ padding: 15, minHeight: 220, height: 'calc(100vh - 600px)', color: '#3f51b5' }}
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
        <Grid item xs={8} lg={9}>
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
                <Paper className={classes.root} elevation={1}>
                  <InputBase
                      value={this.state.searchValue}
                      onChange={this.changeSearchValue}
                      placeholder="Input keyword to search"
                      className={classes.diagnosis_search}
                      inputRef={node => {
                      this.anchorel = node;
                    }}
                      onKeyDown={this.keyDown}
                  />
                  <IconButton
                      onClick={this.searchDiagnosisProblem}
                      className={classes.iconButton}
                      aria-label="Search"
                      color={'primary'}
                  >
                    {
                      this.props.openSearchProgress ? <CircularProgress size={20}/> : <Search />
                    }
                  </IconButton>
                  <Popper open={this.state.open} anchorEl={this.anchorel}>
                    <Paper className={classes.paper}>
                      <Typography
                          component="div"
                          className={classes.menu_all_list}
                          ref="myInput"
                          id="myInput"
                      >
                        {this.props.diagnosisProblemList.map((item, index) => (
                          <MenuItem
                              key={index}
                              onClick={() => this.handleClose(item)}
                              className={this.state.count === index ? classes.menu_list_select : classes.menu_list}
                              title={item.diagnosisDescription}
                          >
                            <Typography
                                component={'div'}
                                className={classes.mr15}
                            >
                              {item.diagnosisDescription}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Typography>
                      <Divider />
                      {
                        this.props.openSearchProgress ? null :
                        <MenuItem
                            onClick={() => this.handleClose({})}
                            className={
                              this.state.count === -2
                                ? classes.menu_list_select
                                : classes.menu_list
                            }
                        >
                            Not Found
                      </MenuItem>
                      }
                    </Paper>
                  </Popper>
                  </Paper>
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
                  <FormGroup
                      row
                      className={classes.diagnosis_problem_list}
                      style={{ maxHeight: 105 }}
                  >
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
                        <select
                            value={item.status}
                            onChange={(...arg) =>
                            this.changeChronicPromblemStatus(...arg, item)
                          }
                        >
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
                <ReactQuill
                    modules={{toolbar: toolbarOptions}}
                    value={this.state.clinicalNotes}
                    onChange={this.editClinicalNotes}
                    style={{height: 'calc(100vh - 666px)', minHeight: 186}}
                />
                {/* <Typography
                    component="textarea"
                    className={classes.clinical_note_box}
                    value={this.state.clinicalNotes}
                    onChange={this.editClinicalNotes}
                /> */}
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
                    onClick={this.props.cancel}
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
                    onClick={() => this.props.save('note')}
                >
                  {' '}
                  Save{' '}
                </Button>
              </Grid>
            </Grid>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
export default connect(mapStateToProps)(withStyles(style)(Note));
