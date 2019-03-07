import React, { Component } from 'react';
import { InputBase, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { countryCodeList, relationshipList } from '../../services/staticData';

const style = {
  close: {
    ':hover': {
      custer: 'pointer'
    }
  },
  form: {
    border: '1px solid rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 2,
    marginBottom: 5
  },
  grid: {
    marginTop: 1
  },
  form_input: {
    marginLeft: 10,
    width: '80%',
    minWidth: 200,
    border: '1px solid rgba(0,0,0,0.2)',
    paddingLeft: 8,
    borderRadius: 2,
    fontSize: 14
  },
  phone_form_input: {
    marginLeft: 10,
    minWidth: 200,
    width: 'calc(80% - 120px)',
    border: '1px solid rgba(0,0,0,0.2)',
    paddingLeft: 8,
    borderRadius: 2,
    fontSize: 14
  }
};

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: this.props.contact
    };
  }
  changeInformation = (e, name) => {
    let { contact } = this.state;
    let value = e.target.value;
    if (name === 'englishName') value = _.toUpper(value);
    contact[name] = value;
    this.props.change(this.props.index, value, name);
    this.setState({ contact });
  };
  render() {
    const { classes } = this.props;
    return (
      <Typography component={'div'} className={classes.form}>
        <Grid container spacing={24} className={classes.grid}>
          <Grid item xs={6}>
            <div>Relationship</div>
            <select
                className={'select_input'}
                value={this.state.contact.relationship}
                onChange={(...arg) =>
                this.changeInformation(...arg, 'relationship')
              }
            >
              {relationshipList.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.grid}>
          <Grid item xs={6}>
            <div>English Name</div>
            <InputBase
                className={classes.form_input}
                value={this.state.contact.englishName}
                onChange={(...arg) =>
                this.changeInformation(...arg, 'englishName')
              }
            />
          </Grid>
          <Grid item xs={6}>
            <div>中文名字</div>
            <InputBase
                className={classes.form_input}
                value={this.state.contact.chineseName}
                onChange={(...arg) =>
                this.changeInformation(...arg, 'chineseName')
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.grid}>
          <Grid item xs={4}>
            <div>Mobile Phone(SMS)</div>
            <div>
              <select
                  className={'phone_select_input'}
                  value={this.state.contact.mobilePhoneAreaCode}
                  onChange={(...arg) =>
                  this.changeInformation(...arg, 'mobilePhoneAreaCode')
                }
              >
                {countryCodeList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <InputBase
                  type={'number'}
                  className={classes.phone_form_input}
                  value={this.state.contact.mobilePhone}
                  onChange={(...arg) =>
                  this.changeInformation(...arg, 'mobilePhone')
                }
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>Other Phone</div>
            <div>
              <select
                  className={'phone_select_input'}
                  value={this.state.contact.otherPhoneAreaCode}
                  onChange={(...arg) =>
                  this.changeInformation(...arg, 'otherPhoneAreaCode')
                }
              >
                {countryCodeList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <InputBase
                  type={'number'}
                  className={classes.phone_form_input}
                  value={this.state.contact.otherPhone}
                  onChange={(...arg) =>
                  this.changeInformation(...arg, 'otherPhone')
                }
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>Email</div>
            <InputBase
                className={classes.form_input}
                value={this.state.contact.email}
                onChange={(...arg) => this.changeInformation(...arg, 'email')}
            />
          </Grid>
        </Grid>
      </Typography>
    );
  }
}
export default withStyles(style)(Contact);
