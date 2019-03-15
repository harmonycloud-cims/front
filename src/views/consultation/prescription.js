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

function mapStateToProps(state) {
  return {
    clinic: state.updateUser.clinic,
    searchDrugList: state.updatePrescription.searchDrugList,
    departmentFavouriteList: state.updatePrescription.departmentFavouriteList
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
    color: 'rgba(0, 0, 0, 0.2)'
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
    border: '1px solid rgba(0,0,0,0.2)',
    height: 'calc(100vh - 457px)',
    minHeight: 347,
    marginBottom: 20,
    overflowY: 'auto'
  },
  medicine_item: {
    padding: '10px 20px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    color: '#3f51b5'
  },
  medicine_icon: {
    width: 15,
    height: 15,
    verticalAlign: 'middle',
    padding: '2px 5px 0 0'
  }
};
class Prescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      open: false,
      value: '',
      grade: 'adult',
      showDepartmentFavouriteList: this.props.departmentFavouriteList,
      medicineList: []
    };
  }
  componentDidMount() {
    this.initData();
    this.searchDrugList();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.departmentFavouriteList !== this.props.departmentFavouriteList
    ) {
      this.setState({
        showDepartmentFavouriteList: nextProps.departmentFavouriteList
      });
    }
  }
  initData = () => {
    const params = {
      clinicId: this.props.clinic.clinicId
    };
    this.props.dispatch({ type: 'GET_DEPARTMENTAL_FAVOURITE', params });
  };
  searchDrugList = () => {
    const params = {
      keyword: 'chloramphenicol'
    };
    this.props.dispatch({ type: 'SEARCH_DRUG_LIST', params });
  };
  // show all the group && checked
  collapseIngredient = id => {
    let departmentFavouriteList = _.cloneDeep(
      this.state.showDepartmentFavouriteList
    );
    let departmentFavourite = _.find(departmentFavouriteList, item => {
      return item.drugFavouriteGroupId === id;
    });
    departmentFavourite.isCollapse = !departmentFavourite.isCollapse;
    _.forEach(departmentFavourite.drugFavouriteGroupDrugDtoList, item => {
      item.checked = !item.checked;
    });
    this.setState({ showDepartmentFavouriteList: departmentFavouriteList });
  };

  save = () => {
    this.setState({ openDiag: true });
  };
  clear = () => {
    this.setState({ isUpdate: false });
    this.props.close();
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
    let medicineList = oldMedicineList.concat(departmentFavourite.drugFavouriteGroupDrugDtoList);
    this.setState({
      showDepartmentFavouriteList: departmentFavouriteList,
      medicineList
    });
  };
  // click ‘copy’ to add medicine
  clickCheckbox = (groupId, drugId) => {
    let departmentFavouriteList = _.cloneDeep(
      this.state.showDepartmentFavouriteList
    );
    let departmentFavourite = _.find(departmentFavouriteList, item => {
      return item.drugFavouriteGroupId === groupId;
    });
    if (departmentFavourite.drugFavouriteGroupDrugDtoList) {
      let drug = _.find(
        departmentFavourite.drugFavouriteGroupDrugDtoList,
        item => {
          return item.drugId === drugId;
        }
      );
      if (drug) {
        drug.checked = !drug.checked;
      }
    }
    this.setState({ showDepartmentFavouriteList: departmentFavouriteList });
  };
  copy = () => {
    let departmentFavouriteList = _.cloneDeep(
      this.state.showDepartmentFavouriteList
    );
    let oldMedicineList = _.cloneDeep(this.state.medicineList);
    let checkedList = [];
    departmentFavouriteList.length > 0 && _.forEach(departmentFavouriteList, item => {
      _.forEach(item.drugFavouriteGroupDrugDtoList, eve => {
        eve.checked && checkedList.push(eve);
      });
    });
    let medicineList = oldMedicineList.concat(checkedList);
    this.setState({medicineList});
  };
  removeMedicine = (index) => {
    let oldMedicineList = _.cloneDeep(this.state.medicineList);
    oldMedicineList.splice(index, 1);
    this.setState({medicineList: oldMedicineList});
  }
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
              <Typography component="div">ADR - ...</Typography>
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
            >
              <Tab
                  label="Departmental Favourite"
                  style={{ minWidth: 140, width: 140 }}
              />
              <Tab label="Drug Histiry" style={{ minWidth: 140, width: 140 }} />
            </Tabs>
            {this.state.tabValue === 0 && (
              <Typography component="div" className={classes.left_warp_tab}>
                {this.state.showDepartmentFavouriteList.length > 0
                  ? this.state.showDepartmentFavouriteList.map(item => (
                      <Typography
                          component="div"
                          key={item.drugFavouriteGroupId}
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
                          ? item.drugFavouriteGroupDrugDtoList.map(eve => (
                              <FormGroup
                                  key={eve.drugId}
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
                                    this.clickCheckbox(
                                      item.drugFavouriteGroupId,
                                      eve.drugId
                                    )
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
              <Typography component="div" className={classes.left_warp_tab}>
                world
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
                    onChange={this.handleToggle}
                    placeholder="Search by ID/ Name/ Phone"
                    value={this.state.value}
                    onKeyUp={this.handleEnterKey}
                />
                <IconButton
                    onClick={this.search}
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
                    >
                      {this.props.searchDrugList.map((item, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => this.handleClose(item)}
                            className={classes.menu_list}
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
                    <MenuItem
                        onClick={() => this.handleClose({})}
                        className={classes.menu_list}
                    >
                      Not Found
                    </MenuItem>
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
              {this.state.medicineList.map((item,index) => (
                <FormGroup
                    key={index}
                    row
                    className={classes.medicine_item}
                >
                  <RemoveCircle className={classes.medicine_icon} onClick={() => this.removeMedicine(index)}/>
                  <Typography
                      component="div"
                      color="primary"
                      className={classes.department_favourite_item_detail}
                  >
                  <FormGroup row>
                    <Typography component="span" style={{fontWeight: 600}}>{item.tradeName} </Typography>
                    <Typography component="span" style={{color: 'rgba(0,0,0,0.6)'}}>({item.ingredient}) inj -</Typography>
                  </FormGroup>
                  <Typography component="div" style={{color: 'rgba(0,0,0,0.6)'}}>{item.regimenLine}</Typography>
                  </Typography>
                </FormGroup>
              ))}
            </Typography>
            <Button
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
                style={{ marginRight: 10 }}
                className={classes.button}
                variant="outlined"
                color="primary"
                size="small"
                onClick={this.save}
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
