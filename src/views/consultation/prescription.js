import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Typography,
  Button,
  FormGroup,
  FormControl,
  Table,
  Paper,
  InputBase,
  MenuItem,
  Popper,
  Divider,
  CircularProgress,
  IconButton
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

function mapStateToProps(state) {
  return {
    searchDrugList: state.updatePrescription.searchDrugList
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
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14
  },
  iconButton: {
    padding: 10
  },
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
    height: 'calc(100vh - 345px)',
    minHeight: 200,
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
  }
};

class Prescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: ''
    };
  }
  componentDidMount() {}
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
            <Table />
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
            <Typography component="div"></Typography>
            <Typography component="div" className={classes.title}>
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
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
export default connect(mapStateToProps)(withStyles(style)(Prescription));
