import React, { Component } from 'react';
import {Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const style = {};
class Print extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Typography component="div" className={classes.print}>
        <Typography component="div" className={classes.print_title}>
          123
        </Typography>
        <Typography component="div" className={classes.print_information}>
            <table>
              <tbody>
                  <tr>
                      <td></td>
                  </tr>
              </tbody>
            </table>
        </Typography>
      </Typography>
    );
  }
}
export default withStyles(style)(Print);
