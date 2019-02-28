import React, { Component } from 'react';
import { FormGroup, Typography, Grid } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const style = {
    root: {
        backgroundColor: '#CFECFA',
        height: 60,
        padding: '10px 20px',
        width: 'calc(100% - 40px)'
    },
    item: {
        marginRight: 20
    },
    icon_right: {
        float: 'right',
        paddingTop: 10
    }
};
class Patient extends Component {

    render() {
        const { classes } = this.props;
        return (
            <Grid container className={classes.root} >
                <Grid item xs={9}>
                    <Typography component={'div'}>
                        {this.props.patient.englishSurname}, {this.props.patient.englishGivenName} {this.props.patient.chineseName !== '' ? (this.props.patient.chineseName): null}
                    </Typography>
                    <FormGroup row>
                        <Typography className={classes.item}>{this.props.patient.documentType}: {this.props.patient.documentNumber}</Typography>
                        <Typography className={classes.item}>DOB: {this.props.patient.dateOfBirth}</Typography>
                        {/*<Typography className={classes.item}>Age: {this.props.patient.age}Y</Typography>*/}
                    </FormGroup>
                </Grid>
                <Grid item xs={3}>
                    <Close onClick={this.props.close} className={classes.icon_right}/>
                </Grid>
            </Grid>
        );
    }
}
export default withStyles(style)(Patient);