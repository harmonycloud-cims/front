import React, { Component } from 'react';
import { InputBase } from '@material-ui/core';
import * as styles from '../../regist/register.module.scss';
import { withStyles } from '@material-ui/core/styles';

const style = {
  form_input: {
    marginLeft: 10,
    width: '80%',
    border: '1px solid rgba(0,0,0,0.42)',
    paddingLeft: 8,
    borderRadius: 2,
    fontSize: 14
  }
};
class FormInput extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={styles[this.props.style]}>
        <div>
          {this.props.label}
          {this.props.isRequire ? (
            <span style={{ color: 'red' }}>*</span>
          ) : null}
        </div>
        <InputBase
            type={this.props.type}
            required={this.props.isRequire}
            className={classes.form_input}
            value={this.props.value}
            onChange={(...arg) => this.props.change(...arg, this.props.name)}
        />
      </div>
    );
  }
}
export default withStyles(style)(FormInput);
