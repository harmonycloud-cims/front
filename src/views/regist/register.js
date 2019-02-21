import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Search, Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Paper, InputBase, Tabs, Tab, Radio } from '@material-ui/core';
import styles from './register.module.scss';

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
    radio: {
        paddingLeft: 10,
        paddingRight: 0
    },
    form_input: {
        marginLeft: 10,
        width: '80%',
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
    },
    close_icon: {
        padding: 0,
        float: 'right',
        marginRight: 10
    }
};
function mapStateToProps(state) {
    return {
        user: state.updateUser.user,
        clinicList: state.updateUser.clinicList
    };
}
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ifLogin: true,
            patient: {},
            tabValue: 0
        };
    }
    changeLoginInformation = (e, name) => {
        let { patient } = this.state;
        patient[name] = e.target.value;
        this.setState({patient});
    };
    changeRadio = (e, checked, name) => {
        if (checked){
            let { patient } = this.state;
            patient[name] = e.target.value;
            this.setState({patient});
        }
    };
    changeTabValue = (event, value) => {
        this.setState({ tabValue: value});
    };
    closeAddress = () => {
        console.log('123');
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={'nephele_main_body'}>
                <div className={'nephele_content_body'}>
                    <Paper className={classes.root} elevation={1}>
                        <InputBase className={classes.input} placeholder="Search by ID/ Name/ Phone" />
                        <IconButton className={classes.iconButton} aria-label="Search" color={'primary'}>
                            <Search />
                        </IconButton>
                    </Paper>
                    <div className={styles.form2}>
                        <div>Document Type<span style={{color: 'red'}}>*</span></div>
                        <select className={styles.select_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}>
                            <option value={1}>123</option>
                            <option value={2}>234</option>
                        </select>
                    </div>
                    <div className={styles.form2}>
                        <div>Document Number<span style={{color: 'red'}}>*</span></div>
                        <InputBase className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                    </div>
                    <div className={styles.form2}>
                        <div>Surname<span style={{color: 'red'}}>*</span></div>
                        <InputBase className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                    </div>
                    <div className={styles.form2}>
                        <div>Given Name<span style={{color: 'red'}}>*</span></div>
                        <InputBase className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                    </div>
                    <div className={styles.form2}>
                        <div>中文姓名</div>
                        <InputBase className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                    </div>
                    <div className={styles.form2}>
                        <div>Date of Birth<span style={{color: 'red'}}>*</span></div>
                        <InputBase type={'date'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                    </div>
                    <div className={styles.form2}>
                        <div>Sex</div>
                        <div>
                            <Radio className={classes.radio} checked={this.state.patient.sex === 'male'} value={'male'} color="default" onChange={(...arg) => this.changeRadio(...arg, 'sex')}/>Male
                            <Radio className={classes.radio} checked={this.state.patient.sex === 'female'} value={'female'} color="default" onChange={(...arg) => this.changeRadio(...arg, 'sex')}/>Female
                            <Radio className={classes.radio} checked={this.state.patient.sex === 'unknown'} value={'unknown'} color="default" onChange={(...arg) => this.changeRadio(...arg, 'sex')}/>Unknown
                        </div>
                    </div>
                </div>
                <Tabs value={this.state.tabValue} onChange={this.changeTabValue} indicatorColor="primary" textColor="primary">
                    <Tab label="Contact Information"/>
                    <Tab label="Contact Person" />
                </Tabs>
                <div className={'nephele_content_body'}>
                    {this.state.tabValue === 0 && <Typography component={'div'}>
                        <div className={styles.form3}>
                            <div>Mobile Phone(SMS)</div>
                            <div>
                                <select className={styles.phone_select_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}>
                                    <option value={1}>852</option>
                                    <option value={2}>234</option>
                                </select>
                                <InputBase className={classes.phone_form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                            </div>
                        </div>
                        <div className={styles.form3}>
                            <div>Home Phone</div>
                            <div>
                                <select className={styles.phone_select_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}>
                                    <option value={1}>852</option>
                                    <option value={2}>234</option>
                                </select>
                                <InputBase className={classes.phone_form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                            </div>
                        </div>
                        <div className={styles.form3}>
                            <div>Email</div>
                            <InputBase type={'email'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                        </div>
                        <div className={styles.form_body}>
                            <div className={styles.form_title}>
                                Address
                                <IconButton className={classes.close_icon} aria-label="close" fontSize="small" onClick={this.closeAddress}>
                                    <Close/>
                                </IconButton>
                            </div>
                            <div className={styles.form_content}>
                                <div className={styles.form3}>
                                    <div>Room/Flat</div>
                                    <InputBase type={'email'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                                </div>
                                <div className={styles.form3}>
                                    <div>Floor</div>
                                    <InputBase type={'email'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                                </div>
                                <div className={styles.form3}>
                                    <div>Block</div>
                                    <InputBase type={'email'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                                </div>
                                <div className={styles.form1}>
                                    <div>Building</div>
                                    <InputBase type={'email'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                                </div>
                                <div className={styles.form3}>
                                    <div>Street No.</div>
                                    <InputBase type={'email'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                                </div>
                                <div className={styles.form20}>
                                    <div>Estate/Village</div>
                                    <InputBase type={'email'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                                </div>
                                <div className={styles.form46}>
                                    <div>Street/Road</div>
                                    <select className={styles.select_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}>
                                        <option value={1}>123</option>
                                        <option value={2}>234</option>
                                    </select>
                                </div>
                                <div className={styles.form15}>
                                    <div>Region</div>
                                    <select className={styles.select_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}>
                                        <option value={1}>123</option>
                                        <option value={2}>234</option>
                                    </select>
                                </div>
                                <div className={styles.form38}>
                                    <div>District</div>
                                    <InputBase type={'email'} className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                                </div>
                            </div>
                        </div>
                    </Typography>}
                    {this.state.tabValue === 1 && <Typography>
                        <div className={styles.form2}>
                            <div>Date of Birth<span style={{color: 'red'}}>*</span></div>
                            <InputBase className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                        </div>
                        <div className={styles.form2}>
                            <div>Date of Birth<span style={{color: 'red'}}>*</span></div>
                            <InputBase className={classes.form_input} value={this.state.patient.dtype} onChange={(...arg) => this.changeLoginInformation(...arg, 'dtype')}/>
                        </div>
                    </Typography>}
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(style)(Register)));
