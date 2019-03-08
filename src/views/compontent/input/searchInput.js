import React, { Component } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Popper,
  MenuItem,
  Typography,
  Divider,
  Menu,
  MenuList
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

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
  }
};
class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: '',
      whichOpen: true
    };
  }
  search = () => {
    this.props.change(_.toUpper(this.state.value));
    this.setState({ open: true });
  };
  handleToggle = e => {
    this.changeValue(e.target.value);
  };
  changeValue = value => {
    if (value) {
      this.setState({ open: true });
    } else {
      this.setState({ open: false });
    }
    this.props.change(_.toUpper(value));
    this.setState({ value: value });
  };
  handleClose = item => {
    this.props.selectPatient(item);
    this.setState({ open: false });
  };
  handleEnterKey = e => {
    if (e.keyCode === 13) {
      this.search();
    }
    // if (e.keyCode === 40) {
    //   this.setState({ whichOpen: false });
    // }
  };
  cancel = e => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      this.flag = false;
      this.setState({ whichOpen: true, open: false });
    } else if (
      !(
        e.keyCode === 37 ||
        e.keyCode === 38 ||
        e.keyCode === 39 ||
        e.keyCode === 40
      )
    ) {
      this.setState({ whichOpen: true });
      this.changeValue(this.state.value + String.fromCharCode(e.keyCode));
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
        {/*  this.state.whichOpen ? */}
        <Popper open={this.state.open} anchorEl={this.anchorel}>
          <Paper className={classes.paper}>
            {this.props.patientList.map((item, index) => (
              <MenuItem
                  key={index}
                  onClick={() => this.handleClose(item)}
                  className={classes.menu_list}
              >
                <Typography component={'div'} className={classes.mr15}>
                  {item.patient.englishSurname}, {item.patient.englishGivenName}
                </Typography>
                <Typography component={'div'}>
                  {item.patient.mobilePhoneAreaCode}-{item.patient.mobilePhone}
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
        {/*  :
                    <Menu open={this.state.open} anchorEl={this.anchorel} className={classes.menu}>
                        {
                            this.props.patientList.map((item, index) =>
                                <MenuItem key={index} onClick={() => this.handleClose(item)} className={classes.menu_list} onKeyUp={this.cancel}>
                                    <Typography component={'div'} className={classes.mr15}>{item.patient.englishSurname}, {item.patient.englishGivenName}</Typography>
                                    <Typography component={'div'} >{item.patient.mobilePhoneAreaCode}-{item.patient.mobilePhone}</Typography>
                                </MenuItem>)
                        }
                        <Divider/>
                        <MenuItem onClick={() => this.handleClose({})} className={classes.menu_list} onKeyUp={this.cancel}>Not Found</MenuItem>
                    </Menu>
                }  */}
      </Paper>
    );
  }
}
export default withStyles(style)(SearchInput);
