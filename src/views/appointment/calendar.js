import React, { Component } from 'react';
import { FormGroup, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const dd = [];
for (let i = 0; i < 24; i++) {
  let s = {
    isHoliday: i % 6 === 0,
    isReset: i % 10 === 0,
    value: i
  };
  dd.push(s);
}

const style = {
  border: {
    border: '0.5px solid rgba(0,0,0,0.2)'
  },
  table_cell: {
    width: 'calc(20% - 1px);',
    border: '0.5px solid rgba(0,0,0,0.2)',
    height: 30,
    paddingTop: 8,
    textAlign: 'center'
  },
  table_body_cell: {
    width: 'calc(20% - 1px);',
    border: '0.5px solid rgba(0,0,0,0.2)',
    height: 80
  },
  table_body_cell_title: {
    width: 'calc(100% - 11px);',
    height: 20,
    backgroundColor: '#CFECFA',
    paddingLeft: 10,
    marginLeft: 0.5
  },
  table_body_cell_body: {
    height: 40,
    textAlign: 'center',
    paddingTop: 20,
    color: '#4052B2'
  },
  table_body_cell_body_holiday: {
    backgroundColor: '#FEDEED',
    width: 'calc(100% - 1px)',
    height: 39,
    marginLeft: 0.5,
    paddingTop: 20,
    textAlign: 'center'
  },
  table_body_cell_body_nodata: {
    backgroundColor: '#fff',
    width: 'calc(100% - 1px)',
    height: 39,
    marginLeft: 0.5,
    paddingTop: 20,
    textAlign: 'center'
  },
  table_body_cell_body_full: {
    backgroundColor: '#B8BCB9',
    width: 'calc(100% - 1px)',
    height: 39,
    marginLeft: 0.5,
    paddingTop: 20,
    textAlign: 'center'
  }
};
class Calendar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Typography component={'div'} className={classes.border}>
        <FormGroup row>
          <Typography component={'div'} className={classes.table_cell}>
            Mon
          </Typography>
          <Typography component={'div'} className={classes.table_cell}>
            Tue
          </Typography>
          <Typography component={'div'} className={classes.table_cell}>
            Wed
          </Typography>
          <Typography component={'div'} className={classes.table_cell}>
            Thur
          </Typography>
          <Typography component={'div'} className={classes.table_cell}>
            Fri
          </Typography>
        </FormGroup>
        <FormGroup row>
          {this.props.calendarList.map((item, index) => (
            <FormGroup key={index} className={classes.table_body_cell}>
              {JSON.stringify(item) === '{}' ? (
                <Typography className={classes.table_body_cell_body} />
              ) : (
                <div>
                  <Typography className={classes.table_body_cell_title}>
                    {item.day}
                  </Typography>
                  {item.noData ? (
                    <Typography className={classes.table_body_cell_body_nodata}>
                      No data
                    </Typography>
                  ) : item.holiday ? (
                    <Typography
                        className={classes.table_body_cell_body_holiday}
                    >
                      Holiday
                    </Typography>
                  ) : item.quota === 0 ? (
                    <Typography className={classes.table_body_cell_body_full} />
                  ) : (
                    <Typography className={classes.table_body_cell_body}>
                      {item.quota}
                    </Typography>
                  )}
                </div>
              )}
            </FormGroup>
          ))}
        </FormGroup>
      </Typography>
    );
  }
}
export default withStyles(style)(Calendar);
