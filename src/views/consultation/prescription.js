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
  Radio
} from '@material-ui/core';
import {
  Search,
  RadioButtonUnchecked,
  RadioButtonChecked,
  Add
  // Remove
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

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
    width: 400,
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
    padding: 10,
    overflowY: 'auto'
  },
  left_warp_favourite_icon: {
    width: '0.8em',
    height: '0.8em'
  },
  left_warp_favourite_ingredient: {
    paddingLeft: 20
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
  }
};
const data = [
  {
    drugFavouriteGroupId: 1,
    groupName: 'Decease 1',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 1,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: '  8 week(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 2,
    groupName: 'Decease 2',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 2,
        drugId: 2,
        ingredient: 'chloramphenicol',
        tradeName: 'chloramphenicol (Martindale)',
        regimenLine: ' as directed  '
      }
    ]
  },
  {
    drugFavouriteGroupId: 3,
    groupName: 'Decease 3',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 3,
        drugId: 3,
        ingredient: 'Bacillus Calmette Guerin (live attenuated) vaccine',
        tradeName: 'BCG Vaccine SSI',
        regimenLine: ' as directed 4 week(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 4,
    groupName: 'Decease 4',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 5,
        drugId: 5,
        ingredient: 'diflucortolone valerate + isoconazole nitrate',
        tradeName: 'Travocort',
        regimenLine: ' at night  '
      }
    ]
  },
  {
    drugFavouriteGroupId: 5,
    groupName: 'Decease 5',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 4,
        drugId: 4,
        ingredient: 'ampicillin (as sodium)',
        tradeName: 'ampicillin (as sodium) (Shijiazhuang)',
        regimenLine: ' as directed 6 week(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 6,
    groupName: 'Decease 6',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 6,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' at night 1 week(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 7,
    groupName: 'Decease 7',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 7,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' at night 2 week(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 8,
    groupName: 'Decease 8',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 8,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' at night 3 day(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 9,
    groupName: 'Decease 9',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 9,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' at night 4 day(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 10,
    groupName: 'Decease 10',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 10,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' at night 5 day(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 11,
    groupName: 'Decease 11',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 11,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' at night 7 day(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 12,
    groupName: 'Decease 12',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 12,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' at once  '
      }
    ]
  },
  {
    drugFavouriteGroupId: 13,
    groupName: 'Decease 13',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 13,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' at once 1 dose(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 14,
    groupName: 'Decease 14',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 14,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' daily  '
      }
    ]
  },
  {
    drugFavouriteGroupId: 15,
    groupName: 'Decease 15',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 15,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' daily 1 week(s)'
      }
    ]
  },
  {
    drugFavouriteGroupId: 16,
    groupName: 'Decease 16',
    drugFavouriteGroupDrugDtoList: [
      {
        drugFavGrpDrugId: 16,
        drugId: 1,
        ingredient: 'paracetamol',
        tradeName: 'Dhamol',
        regimenLine: ' daily 14 day(s)'
      }
    ]
  }
];
class Prescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      open: false,
      value: '',
      grade: 'adult'
    };
  }
  // componentDidMount() {
  //   this.initData();
  // }
  // initData = () => {
  //   const params = {
  //     clinicId: this.props.clinic.clinicId
  //   };
  //   this.props.dispatch({ type: 'GET_DEPARTMENTAL_FAVOURITE', params });
  // };
  copy = () => {
    console.log('copy');
  };
  save = () => {
    this.setState({ openDiag: true });
  };
  clear = () => {
    this.setState({ isUpdate: false });
    this.props.close();
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
              <Typography component="div">ADR - ...</Typography>
              <Typography component="div">Alert - G6PD Deficiency</Typography>
            </FormControl>
          </FormGroup>
        </Grid>
        <Grid item xs={3} className={classes.left_warp}>
          <Typography component="div" className={classes.table}>
            <Tabs
                value={this.state.tabValue}
                onChange={(event, value) => this.setState({ tabValue: value })}
                indicatorColor={'primary'}
                textColor={'primary'}
            >
              <Tab label="Departmental Favourite" style={{ width: 80 }} />
              <Tab label="Drug Histiry" style={{ width: 80 }} />
            </Tabs>
            {this.state.tabValue === 0 && (
              <Typography component="div" className={classes.left_warp_tab}>
                {/* {this.props.departmentFavouriteList.length > 0
                  ? this.props.departmentFavouriteList.map((item, index) => ( */}
                {data.length > 0
                  ? data.map((item, index) => (
                      <Typography component="div" key={index}>
                        <FormGroup row>
                          <Add
                              color="primary"
                              size="small"
                              className={classes.left_warp_favourite_icon}
                          />
                          <Typography>{item.groupName}</Typography>
                        </FormGroup>
                        {item.drugFavouriteGroupDrugDtoList.map(eve => (
                          <Typography
                              key={eve.drugId}
                              component="div"
                              className={classes.left_warp_favourite_ingredient}
                          >
                            {eve.tradeName}
                          </Typography>
                        ))}
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
        <Grid item xs={9}>
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
            />
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
