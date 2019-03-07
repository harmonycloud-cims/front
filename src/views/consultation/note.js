import React, { Component } from 'react';
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
  InputBase
} from '@material-ui/core';
import { Close, ArrowLeft, ArrowRight, Remove } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import moment from 'moment';

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
  diagnosis_item: {
    paddingLeft: 8,
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    width: 'calc(100% - 8px)'
  },
  diagnosis_close: {
    float: 'right'
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
  }
};

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicalRecordList: this.props.medicalRecordList,
      medicalRecord: {},
      templateList: this.props.templateList,
      selectTemplate: [],
      clinicalNotes: ''
    };
  }
  componentDidMount() {
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
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // medicalRecordList记录
    if (nextProps.medicalRecordList !== this.props.medicalRecordList) {
      this.setState(
        {
          medicalRecord: nextProps.medicalRecordList[0],
          medicalRecordList: nextProps.medicalRecordList
        }
      );
    }
    // template
    if (nextProps.templateList !== this.props.templateList) {
      let templateList = _.cloneDeep(nextProps.templateList);
      if (templateList.length > 0) {
        _.forEach(templateList, item => {
          item.checked = false;
        });
      }
      this.setState({ templateList }, ()=>console.log(this.state.templateList));
    }
  }
  changeCheck = (e, checked, item) => {
    console.log(checked);
    let templateList = _.cloneDeep(this.state.templateList);
    let clinicalNotes = _.cloneDeep(this.state.clinicalNotes);
    let template = _.find(templateList, eve => {
      return eve.clinicalNoteTemplateId === item.clinicalNoteTemplateId;
    });
    if (checked) {
      if (clinicalNotes === '') {
        clinicalNotes = clinicalNotes + item.templateContent;
      } else {
        clinicalNotes = clinicalNotes + '\n' + item.templateContent;
      }
    } else {
      JSON.stringify(clinicalNotes).replace(item.templateContent, '');
    }
    template.checked = checked;
    this.setState({ templateList, clinicalNotes }, ()=> console.log(this.state.templateList));
  };
  changeMedicalRecord = medicalRecord => {
    this.setState({ medicalRecord });
  };
  editClinicalNotes = e => {
    this.setState({ clinicalNotes: e.target.value });
  };
  save = () => {
    // console.log(this.state.clinicalNotes);
    console.log(JSON.stringify(this.state.clinicalNotes));
  };
  clear = () => {
    let templateList = _.cloneDeep(this.props.templateList);
    _.forEach(templateList, item => {
      item.checked = false;
    });
    this.setState({ templateList, clinicalNotes: '' }, () => console.log(this.state.templateList));
  };
  copy = () => {
    let notes = this.state.medicalRecord.noteContent;
    let clinicalNotes = _.cloneDeep(this.state.clinicalNotes);
    if (clinicalNotes === '') {
      clinicalNotes = clinicalNotes + notes;
    } else {
      clinicalNotes = clinicalNotes + '\n' + notes;
    }
    this.setState({ clinicalNotes });
  };

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
                      placeholder="Input keyword to search"
                      className={classes.diagnosis_search}
                  />
                  <Typography
                      component="div"
                      className={classes.diagnosis_item}
                  >
                    Diabetes Mellitus
                    <Close
                        fontSize="small"
                        className={classes.diagnosis_close}
                    />
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography component="div" className={classes.transfer_part2}>
                  <Typography component="div">
                    <ArrowRight />
                  </Typography>
                  <Typography component="div">
                    <ArrowLeft />
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography>Chronic Problem(s)</Typography>
                <Typography component="div" className={classes.transfer_box}>
                  <Typography
                      component="div"
                      className={classes.diagnosis_item}
                  >
                    Diabetes Mellitus
                    <Close
                        fontSize="small"
                        className={classes.diagnosis_close}
                    />
                  </Typography>
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
                              defaultChecked={item.checked}
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
                  Clear{' '}
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
      </Grid>
    );
  }
}
export default withStyles(style)(Note);
