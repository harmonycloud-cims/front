import React, { Component } from 'react';
import { Grid, Table, TableRow, Typography, TableCell, TableHead, TableBody, Button, 
    FormGroup, FormControl, InputBase} from '@material-ui/core';
import { Close, ArrowLeft, ArrowRight } from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';

const style = {
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
        height: 200,
        backgroundColor: '#fff',
        border: '1px solid rgba(0,0,0,0.5)',
        marginBottom: 20,
        overflowY: 'auto'
    },
    table_head: {
        height: 30
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
    transfer: {
        padding: '10px 0 8px 15px'
    },
    transfer_box: {
        border: '1px solid rgba(0,0,0,0.2)',
        height: 108
    },
    diagnosis_search: {
        paddingLeft: 8,
        borderBottom: '1px solid rgba(0,0,0,0.2)',
        width: 'calc(100% - 8px)'
    },
    diagnosis_item: {
        paddingLeft: 8,
        borderBottom: '1px solid rgba(0,0,0,0.2)',
        width: 'calc(100% - 8px)'
    },
    diagnosis_close: {
        float: 'right'
    },
    transfer_part2: {
        paddingTop: 50,
        textAlign: 'center'
    },
    clinical_note: {
        paddingLeft: 10
    },
    clinical_note_box: {
        border: '1px solid rgba(0,0,0,0.2)',
        height: 220,
        width: 'calc(100% - 40px)',
        padding: 15,
        marginLeft: 10
    }
};

class Note extends Component {
    render() {
        const { classes } = this.props;
        return(
            <Grid container>
                <Grid item xs={3} className={classes.left_warp}>
                    <Typography component="div" className={classes.title}>Medical Record</Typography>
                    <Typography component="div" className={classes.table}>
                        <Table>
                            <TableHead>
                                <TableRow className={classes.table_head}>
                                    <TableCell style={{paddingLeft: '15px'}} padding={'none'} className={classes.table_header}>Date</TableCell>
                                    <TableCell padding={'dense'} className={classes.table_header}>Record Type</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.props.medicalRecordList.map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell style={{paddingLeft: '15px'}} padding={'none'}>{item.createDate}</TableCell>
                                            <TableCell padding={'dense'}>{item.type}</TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </Typography>
                    <Typography component="div" className={classes.title}>Record Detail</Typography>
                    <Typography component="div" className={classes.table} style={{padding: 15, height: 220, color: '#4052B2'}}>
                        {this.props.record.noteContent}1245634567
                    </Typography>
                    <Button className={classes.button} variant="outlined" color="primary" size="small"> Copy </Button>
                </Grid>
                <Grid item xs={9}>
                    <FormGroup row className={classes.alert}>
                        <FormControl className={classes.alert_left}>Alert</FormControl>
                        <FormControl className={classes.alert_right}>
                            <Typography component="div">Allergy - aspirin, Peanut(non-drug)</Typography>
                            <Typography component="div">ADR - ...</Typography>
                            <Typography component="div">Alert - G6PD Deficiency</Typography>
                        </FormControl>
                    </FormGroup>
                    <Typography component="div" className={classes.right_warp}>
                        <Typography component="div" className={classes.title}>Problem</Typography>
                        <Grid container className={classes.transfer} spacing={24}>
                            <Grid item xs={5}>
                                <Typography>Attending Problem(s)</Typography>
                                <Typography component="div" className={classes.transfer_box}>
                                    <InputBase placeholder="Input keyword to search" className={classes.diagnosis_search}/>
                                    <Typography component="div" className={classes.diagnosis_item}>Diabetes Mellitus
                                        <Close fontSize="small" className={classes.diagnosis_close}/>
                                    </Typography>
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography component="div"  className={classes.transfer_part2}>
                                    <Typography component="div"><ArrowRight/></Typography>
                                    <Typography component="div"><ArrowLeft/></Typography>
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography>Chronic Problem(s)</Typography>
                                <Typography component="div" className={classes.transfer_box}>
                                    <Typography component="div" className={classes.diagnosis_item}>Diabetes Mellitus
                                        <Close fontSize="small" className={classes.diagnosis_close}/>
                                    </Typography>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={24}>
                            <Grid item xs={8}>
                                <Typography component="div" className={classes.title}>Clinical Note</Typography>
                                <Typography component="textarea" className={classes.clinical_note_box}>23r234234234234</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography component="div" className={classes.title}>Template</Typography>
                                <Typography component="div" className={classes.clinical_note_box}>23r234234234234</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={24}>
                            <Grid item xs={11} className={classes.button_save_clear}>
                                <Button style={{marginTop: 8}} className={classes.button} variant="outlined" color="primary" size="small"> Clear </Button>
                                <Button style={{marginTop: 8, marginRight: 10}} className={classes.button} variant="outlined" color="primary" size="small"> Save </Button>
                            </Grid>
                        </Grid>
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}
export default withStyles(style)(Note);