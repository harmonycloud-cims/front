import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Typography,
  Button,
  FormGroup,
  FormControl,
  Tab,
  Paper,
  InputBase,
  MenuItem,
  Popper,
  Divider,
  CircularProgress,
  IconButton,
  Tabs,
  Radio,
  Checkbox
} from '@material-ui/core';
import {
  Search,
  RadioButtonUnchecked,
  RadioButtonChecked,
  Add,
  Remove,
  RemoveCircle
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import moment from 'moment';

function mapStateToProps(state) {
  return {
    searchDrugList: state.updatePrescription.searchDrugList,
    openSearchProgress: state.updateConsultation.openSearchProgress
  };
}
const style = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '15px',
    border: '1px solid rgba(0,0,0,0.42)',
    height: 25,
    width: 380,
    margin: '5px 10px 0 10px'
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14
  },
  iconButton: {
    padding: 10
  },
  left_warp: {
    padding: 20,
    backgroundColor: 'lightgray',
    height: 'calc(100vh - 270px)',
    minHeight: 530
  },
  left_warp_tab: {
    padding: '10px 10px 0 10px',
    overflowY: 'auto'
  },
  left_warp_favourite_icon: {
    width: '0.8em',
    height: '0.8em'
  },
  left_warp_favourite_ingredient: {
    color: '#3f51b5',
    paddingLeft: 15
  },
  department_favourite_item: {
    marginBottom: 5
  },
  department_favourite_group: {
    cursor: 'pointer'
  },
  department_favourite_check: {
    display: 'inline',
    padding: '0 5px 0 0',
    color: 'rgba(0, 0, 0, 0.42)'
  },
  department_favourite_item_detail: {
    width: 'calc(100% - 40px)',
    wordBreak: 'break-all',
    fontSize: 13
  },
  right_warp: {
    padding: 20
  },
  right_warp_search: {
    marginBottom: 20
  },
  search_title: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: 10,
    color: 'rgba(0, 0, 0, 0.6)'
  },
  paper: {
    maxHeight: 240,
    transform: 'translate3d(18px, 0px, 0px)',
    width: 380
  },
  menu_all_list: {
    maxHeight: 200,
    overflowY: 'auto'
  },
  menu_list_select: {
    paddingTop: 0,
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: 40
  },
  menu_list: {
    paddingTop: 0,
    fontSize: 14,
    height: 40
  },
  mr15: {
    marginRight: 15,
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  title: {
    fontSize: 16,
    fontWeight: 600
  },
  table: {
    height: 'calc(100vh - 375px)',
    minHeight: 430,
    backgroundColor: '#fff',
    border: '1px solid rgba(0,0,0,0.5)',
    marginBottom: 20,
    overflowY: 'auto'
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
  prescription_table: {
    border: '1px solid rgba(0,0,0,0.42)',
    height: 'calc(100vh - 457px)',
    minHeight: 347,
    marginBottom: 20,
    overflowY: 'auto'
  },
  medicine_item: {
    padding: '10px 20px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    color: '#3f51b5'
  },
  medicine_icon: {
    width: 15,
    height: 15,
    verticalAlign: 'middle',
    padding: '2px 5px 0 0'
  },
  drug_history_tab: {
    overflowY: 'auto'
  },
  drug_history_item: {
    padding: 10,
    borderBottom: '1px solid rgba(0,0,0,0.42)'
  },
  drug_history_time: {
    padding: '0 0 5px 10px'
  },
  drug_history_record: {
    paddingLeft: 5
  }
};
class Prescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // change tabs
      tabValue: 0,

      // search drug
      open: false,
      searchValue: '',
      count: -1,
      grade: 'adult',

      showDepartmentFavouriteList: _.cloneDeep(this.props.departmentFavouriteList),
      showDrugHistoryList: _.cloneDeep(this.props.drugHistoryList),
      medicineList: _.cloneDeep(this.props.medicineList)
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.departmentFavouriteList !== this.props.departmentFavouriteList) {
      this.setState({showDepartmentFavouriteList: nextProps.departmentFavouriteList});
    }
    if (nextProps.drugHistoryList !== this.props.drugHistoryList) {
      this.setState({showDrugHistoryList: nextProps.drugHistoryList});
    }
    if (nextProps.medicineList !== this.props.medicineList) {
      this.setState({medicineList: nextProps.medicineList});
    }
  }
  // show all the group && checked
  collapseIngredient = id => {
    let departmentFavouriteList = _.cloneDeep(this.state.showDepartmentFavouriteList);
    let departmentFavourite = _.find(departmentFavouriteList, item => {
      return item.drugFavouriteGroupId === id;
    });
    departmentFavourite.isCollapse = !departmentFavourite.isCollapse;
    _.forEach(departmentFavourite.drugFavouriteGroupDrugDtoList, item => {
      item.checked = !item.checked;
    });
    this.setState({ showDepartmentFavouriteList: departmentFavouriteList });
  };
  // 'drag and drop' add medicine
  drag = (e, id) => {
    e.dataTransfer.setData('drugFavouriteGroupId', id);
  };
  // drop necessary condition
  allowDrag = e => {
    e.preventDefault();
  };
  drop = e => {
    e.preventDefault();
    let departmentFavouriteList = _.cloneDeep(
      this.state.showDepartmentFavouriteList
    );
    let oldMedicineList = _.cloneDeep(this.state.medicineList);
    let id = e.dataTransfer.getData('drugFavouriteGroupId');
    let departmentFavourite = _.find(departmentFavouriteList, item => {
      return item.drugFavouriteGroupId === parseInt(id, 10);
    });
    departmentFavourite.isCollapse = true;
    _.forEach(departmentFavourite.drugFavouriteGroupDrugDtoList, item => {
      item.checked = true;
    });
    let medicineList = oldMedicineList.concat(
      departmentFavourite.drugFavouriteGroupDrugDtoList
    );
    this.setState({
      showDepartmentFavouriteList: departmentFavouriteList,
      medicineList
    });
    this.props.changePrescription(medicineList);
  };

  // click ‘copy’ to add medicine
  clickCheckbox = (index, ind) => {
    if(this.state.tabValue === 0) {
      let departmentFavouriteList = _.cloneDeep(
        this.state.showDepartmentFavouriteList
      );
      departmentFavouriteList[index].drugFavouriteGroupDrugDtoList[ind].checked = !departmentFavouriteList[index].drugFavouriteGroupDrugDtoList[ind].checked;
      this.setState({ showDepartmentFavouriteList: departmentFavouriteList });
    } else {
      let drugHistoryList = _.cloneDeep(this.state.showDrugHistoryList);
      drugHistoryList[index].prescriptionDrugBoList[ind].checked = !drugHistoryList[index].prescriptionDrugBoList[ind].checked;
      this.setState({showDrugHistoryList: drugHistoryList});
    }
  };
  copy = () => {
    if (this.state.tabValue === 0) {
      let departmentFavouriteList = _.cloneDeep(
        this.state.showDepartmentFavouriteList
      );
      let oldMedicineList = _.cloneDeep(this.state.medicineList);
      let checkedList = [];
      departmentFavouriteList.length > 0 &&
        _.forEach(departmentFavouriteList, item => {
          _.forEach(item.drugFavouriteGroupDrugDtoList, eve => {
            eve.checked && checkedList.push(eve);
          });
        });
      let medicineList = oldMedicineList.concat(checkedList);
      this.setState({ medicineList });
      this.props.changePrescription(medicineList);
    } else {
      let drugHistoryList = _.cloneDeep(
        this.state.showDrugHistoryList
      );
      let oldMedicineList = _.cloneDeep(this.state.medicineList);
      let checkedList = [];
      drugHistoryList.length > 0 &&
        _.forEach(drugHistoryList, item => {
          _.forEach(item.prescriptionDrugBoList, eve => {
            eve.checked && checkedList.push(eve);
          });
        });
      let medicineList = oldMedicineList.concat(checkedList);
      this.setState({ medicineList });
      this.props.changePrescription(medicineList);
    }
  };
  removeMedicine = index => {
    let oldMedicineList = _.cloneDeep(this.state.medicineList);
    oldMedicineList.splice(index, 1);
    this.setState({ medicineList: oldMedicineList });
    this.props.changePrescription(oldMedicineList);
  };

  /* search */
  searchDrugList = () => {
    if (this.state.searchValue !== '') {
      const params = {
        keyword: this.state.searchValue
      };
      this.props.dispatch({ type: 'SEARCH_DIAGNOSIS_PROBLEMS', params });
      this.setState({ open: true });
    }
  };
  changeSearchValue = e => {
    this.setState({ searchValue: e.target.value, count: -1 });
    if (e.target.value !== '') {
      const params = {
        keyword: e.target.value
      };
      this.props.dispatch({ type: 'SEARCH_DRUG_LIST', params });
      this.setState({ open: true });
    } else {
      this.setState({ open: false });
    }
  };
  keyDown = e => {
    if (this.state.open) {
      let temp = _.cloneDeep(this.state.count);
      let len = this.props.searchDrugList.length; //patient count
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
        if (this.state.count === -1) {
          this.searchDrugList();
        } else {
          if (temp === -2) {
            this.handleClose({});
            temp = -1;
          } else if (temp === -1) {
            temp = -1;
          } else {
            this.handleClose(this.props.searchDrugList[temp]);
            temp = -1;
          }
        }
      }
      if (temp > 3) {
        document.getElementById('myInput').scrollTop = (temp - 3) * 51;
      } else if (temp > 0 && temp <= 3) {
        document.getElementById('myInput').scrollTop = 0;
      }
      this.setState({ count: temp });
    } else {
      if (e.keyCode === 13) {
        this.searchDrugList();
      }
    }
  };
  handleClose = item => {
    let oldMedicineList = _.cloneDeep(this.state.medicineList);
    if (JSON.stringify(item) !== '{}') {
      oldMedicineList.push(item);
    }
    this.setState({
      open: false,
      medicineList: oldMedicineList,
      searchValue: ''
    });
    this.props.changePrescription(oldMedicineList);
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <FormGroup row className={classes.alert}>
            <FormControl className={classes.alert_left}>Alert</FormControl>
            <FormControl className={classes.alert_right}>
              <Typography component="div">
                Allergy - aspirin, Peanut(non-drug)
              </Typography>
              <Typography component="div">ADR -  Nil</Typography>
              <Typography component="div">Alert - G6PD Deficiency</Typography>
            </FormControl>
          </FormGroup>
        </Grid>
        <Grid item xs={4} lg={3} className={classes.left_warp}>
          <Typography component="div" className={classes.table}>
            <Tabs
                value={this.state.tabValue}
                onChange={(event, value) => this.setState({ tabValue: value })}
                indicatorColor={'primary'}
                textColor={'primary'}
                style={{ borderBottom: '1px solid rgba(0,0,0,0.42)' }}
            >
              <Tab
                  label="Departmental Favourite"
                  style={{ minWidth: 140, width: 140 }}
              />
              <Tab label="Drug History" style={{ minWidth: 140, width: 140 }} />
            </Tabs>
            {this.state.tabValue === 0 && (
              <Typography component="div" className={classes.left_warp_tab}>
                {this.state.showDepartmentFavouriteList.length > 0
                  ? this.state.showDepartmentFavouriteList.map((item, index) => (
                      <Typography
                          component="div"
                          key={index}
                          className={classes.department_favourite_item}
                          draggable="true"
                          onDragStart={(...arg) =>
                          this.drag(...arg, item.drugFavouriteGroupId)
                        }
                      >
                        <FormGroup
                            row
                            className={classes.department_favourite_group}
                            onClick={() =>
                            this.collapseIngredient(item.drugFavouriteGroupId)
                          }
                        >
                          {item.isCollapse ? (
                            <Remove
                                color="primary"
                                size="small"
                                className={classes.left_warp_favourite_icon}
                            />
                          ) : (
                            <Add
                                color="primary"
                                size="small"
                                className={classes.left_warp_favourite_icon}
                            />
                          )}
                          <Typography
                              style={{
                              color: item.isCollapse ? '#3f51b5' : 'black'
                            }}
                          >
                            {item.groupName}
                          </Typography>
                        </FormGroup>
                        {item.isCollapse
                          ? item.drugFavouriteGroupDrugDtoList.map((eve, ind) => (
                              <FormGroup
                                  key={ind}
                                  row
                                  className={
                                  classes.left_warp_favourite_ingredient
                                }
                              >
                                <Checkbox
                                    className={classes.department_favourite_check}
                                    checked={eve.checked || false}
                                    color="default"
                                    value={`${eve.drugId}${eve.tradeName}`}
                                    onClick={() =>
                                    this.clickCheckbox(index, ind)
                                  }
                                />
                                <Typography
                                    component="div"
                                    color="primary"
                                    className={
                                    classes.department_favourite_item_detail
                                  }
                                >
                                  {eve.tradeName}({eve.ingredient}) inj -<br />
                                  {eve.regimenLine}
                                </Typography>
                              </FormGroup>
                            ))
                          : null}
                      </Typography>
                    ))
                  : null}
              </Typography>
            )}
            {this.state.tabValue === 1 && (
              <Typography component="div" className={classes.drug_history_tab}>
                {this.state.showDrugHistoryList.length > 0 &&
                  this.state.showDrugHistoryList.map((item, index) => (
                    <Typography
                        key={index}
                        component="div"
                        className={classes.drug_history_item}
                    >
                      <Typography
                          conponent="div"
                          className={classes.drug_history_time}
                      >
                        {moment(item.prescription.createDate).format('DD MMM YYYY')} {item.prescription.clinicName}
                      </Typography>
                      {
                        item.prescriptionDrugBoList && item.prescriptionDrugBoList.length > 0 && item.prescriptionDrugBoList.map((eve, ind) =>
                        <FormGroup key={ind} row className={classes.drug_history_record}>
                        <Checkbox
                            className={classes.department_favourite_check}
                            checked={eve.checked || false}
                            color="default"
                            value={`${eve.drugId}${eve.tradeName}`}
                            onClick={() => this.clickCheckbox(index, ind)
                          }
                        />
                        <Typography
                            component="div"
                            color="primary"
                            className={classes.department_favourite_item_detail}
                        >
                          {eve.tradeName}({eve.ingredient}) inj -<br />
                          {eve.regimenLine}
                        </Typography>
                      </FormGroup>
                    )
                      }
                      </Typography>
                  ))}
              </Typography>
            )}
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
          <Typography component="div" className={classes.right_warp}>
            <FormGroup row className={classes.right_warp_search}>
              <Typography className={classes.search_title}>
                Drug Name/Set
              </Typography>
              <Paper className={classes.root} elevation={1}>
                <InputBase
                    className={classes.input}
                    inputRef={node => {
                    this.anchorel = node;
                  }}
                    onChange={this.changeSearchValue}
                    placeholder="Search by drug name/set"
                    value={this.state.searchValue}
                    onKeyDown={this.keyDown}
                />
                <IconButton
                    onClick={this.searchDrugList}
                    className={classes.iconButton}
                    aria-label="Search"
                    color={'primary'}
                >
                  {this.props.openSearchProgress ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Search />
                  )}
                </IconButton>
                <Popper open={this.state.open} anchorEl={this.anchorel}>
                  <Paper className={classes.paper}>
                    <Typography
                        component="div"
                        className={classes.menu_all_list}
                        ref="myInput"
                        id="myInput"
                    >
                      {this.props.searchDrugList.map((item, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => this.handleClose(item)}
                            title={`${item.tradeName}${item.ingredient} \n ${
                            item.regimenLine
                          }`}
                            className={
                            this.state.count === index
                              ? classes.menu_list_select
                              : classes.menu_list
                          }
                        >
                          <Typography
                              component={'div'}
                              className={classes.mr15}
                          >
                            {item.tradeName} ({item.ingredient}) inj -<br />
                            {item.regimenLine}
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
              <FormGroup>
                <FormGroup row>
                  <Radio
                      style={{ padding: 0 }}
                      checked={this.state.grade === 'adult'}
                      onChange={() => this.setState({ grade: 'adult' })}
                      color="default"
                      icon={<RadioButtonUnchecked fontSize="small" />}
                      checkedIcon={<RadioButtonChecked fontSize="small" />}
                      label="asd"
                  />
                  <Typography>Adult</Typography>
                </FormGroup>
                <FormGroup row>
                  <Radio
                      style={{ padding: 0 }}
                      checked={this.state.grade === 'paediatric'}
                      onChange={() => this.setState({ grade: 'paediatric' })}
                      color="default"
                      icon={<RadioButtonUnchecked fontSize="small" />}
                      checkedIcon={<RadioButtonChecked fontSize="small" />}
                  />
                  <Typography>Paediatric</Typography>
                </FormGroup>
              </FormGroup>
            </FormGroup>
            <Typography component="div" className={classes.title}>
              Prescription
            </Typography>
            <Typography
                component="div"
                className={classes.prescription_table}
                onDragOver={this.allowDrag}
                onDrop={(...arg) => this.drop(...arg)}
            >
              {this.state.medicineList.map((item, index) => (
                <FormGroup key={index} row className={classes.medicine_item}>
                  <RemoveCircle
                      className={classes.medicine_icon}
                      onClick={() => this.removeMedicine(index)}
                  />
                  <Typography
                      component="div"
                      color="primary"
                      className={classes.department_favourite_item_detail}
                  >
                    <FormGroup row>
                      <Typography component="span" style={{ fontWeight: 600 }}>
                        {item.tradeName}{' '}
                      </Typography>
                      <Typography
                          component="span"
                          style={{ color: 'rgba(0,0,0,0.6)' }}
                      >
                        ({item.ingredient}) inj -
                      </Typography>
                    </FormGroup>
                    <Typography
                        component="div"
                        style={{ color: 'rgba(0,0,0,0.6)' }}
                    >
                      {item.regimenLine}
                    </Typography>
                  </Typography>
                </FormGroup>
              ))}
            </Typography>
            <Button
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
                style={{ marginRight: 10 }}
                className={classes.button}
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => this.props.save('prescription')}
            >
              {' '}
              Save{' '}
            </Button>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
export default connect(mapStateToProps)(withStyles(style)(Prescription));
