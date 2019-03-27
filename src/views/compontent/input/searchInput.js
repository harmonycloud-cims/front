import React, { Component } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Popper,
  MenuItem,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
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
  paper: {
    maxHeight: 200,
    position: 'absolute',
    transform: 'translate3d(-180px, 3px, 0px)'
  },
  menu: {
    maxHeight: 150,
    overflowY: 'auto'
  },
  menu_list: {
    paddingTop: 0,
    fontSize: 14
  },
  menu_list_select: {
    paddingTop: 0,
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  mr15: {
    marginRight: 15
  }
};
class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: '',
      count: -1
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.patientList !== this.props.patientList) {
      this.setState({ count: -1 });
    }
  }
  // enter search
  search = () => {
    this.props.change(_.toUpper(this.state.value));
    this.setState({ open: true });
  };
  // change search value
  handleToggle = e => {
    this.changeValue(e.target.value);
  };
  changeValue = value => {
    if (value && value !== '') {
      this.setState({ open: true });
      this.props.change(_.toUpper(value));
    } else {
      this.setState({ open: false });
    }
    this.setState({ value: value });
  };
  // whichone choose
  handleClose = item => {
    this.props.selectPatient(item);
    this.setState({ open: false, value: '' });
  };
  // keyboard event
  keyDown = e => {
    if(this.state.open){
      let temp = _.cloneDeep(this.state.count);
      let len = this.props.patientList.length; //patient count
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
        if (temp === -2) {
          this.handleClose({});
          temp = -1;
        } else if (temp === -1) {
          temp = -1;
        } else {
          this.handleClose(this.props.patientList[temp]);
          temp = -1;
        }
      }
      if(temp > 3) {
        document.getElementById('myInput').scrollTop = (temp-3)*35;
      } else if (temp > 0 && temp <= 3){
        document.getElementById('myInput').scrollTop = 0;
      }
      this.setState({ count: temp });
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root} elevation={1}>
        <InputBase
            className={classes.input}
            inputRef={node => {
            this.anchorel = node;
          }}
            onChange={this.handleToggle}
            placeholder="Search by ID/ Name/ Phone"
            value={this.state.value}
            onKeyDown={this.keyDown}
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
            <Typography ref="myInput" id="myInput" className={classes.menu}>
              {this.props.patientList.map((item, index) => (
                <MenuItem
                    key={index}
                    onClick={() => this.handleClose(item)}
                    className={
                    this.state.count === index
                      ? classes.menu_list_select
                      : classes.menu_list
                  }
                >
                  <Typography component={'span'} className={classes.mr15}>
                    {item.patient.englishSurname},{' '}
                    {item.patient.englishGivenName}
                  </Typography>
                  <Typography component={'span'} className={classes.mr15}>
                    {item.patient.mobilePhoneAreaCode}-
                    {item.patient.mobilePhone}
                  </Typography>
                  <Typography component={'span'}>
                    No. {item.patient.documentNumber}
                  </Typography>
                </MenuItem>
              ))}
            </Typography>
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
    );
  }
}
export default connect(mapStateToProps)(withStyles(style)(SearchInput));
