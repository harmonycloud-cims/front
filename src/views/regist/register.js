import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Close, Remove, Add } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Typography, InputBase, Tabs, Tab, Radio, RadioGroup,
    FormControlLabel, Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import styles from './register.module.scss';
import FormInput from '../compontent/input/formInput';
import SearchInput from '../compontent/input/searchInput';
import Contact from './contact';
import _ from 'lodash';
import timg from '../../images/timg.gif';
import { doumentTypeList, contactBasic, patientBasic, countryCodeList, districtList } from '../../services/staticData';
import moment from 'moment';

const style = {
    grid: {
      marginTop: 10
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
    },
    add_icon: {
        verticalAlign: 'bottom'
    },
    cover: {
        top: 30,
        position: 'absolute',
        backgroundColor: '#fff',
        width: 150,
        fontSize: 14,
        left: 18,
        height: 20,
        padding: '4px 0 0 0'
    }
};
function mapStateToProps(state) {
    return {
        patientList: state.updatePatient.patientList,
        patientLoading: state.updatePatient.patientLoading,
        patientErrorMessage: state.updatePatient.patientErrorMessage
    };
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patient: _.cloneDeep(patientBasic),
            tabValue: 0,
            showAddress: false, //if show address
            contactPersonList: [],
            isUpdate: false, // regist or update
            loading: true
        };
    }
    changeInformation = (e, name) => {
        let { patient } = this.state;
        if (name === 'englishSurname' || name === 'englishGivenName' || name === 'documentNumber') {
            patient[name] =  _.toUpper(e.target.value);
        } else if (name === 'dateOfBirth') {
            patient[name] = moment(e.target.value, 'YYYY-MM-DD').format('DD MMM YYYY');
        } else {
            patient[name] = e.target.value;
        }
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
        this.setState({showAddress: !this.state.showAddress});
    };
    addContact = () => {
        let contactPersonList = _.cloneDeep(this.state.contactPersonList);
        let contact = _.cloneDeep(contactBasic);
        contact.displayOrder = contactPersonList.length;
        if (this.state.isUpdate) contact.patientId = this.state.patient.patientId;
        contactPersonList.push(contact);
        this.setState({contactPersonList});
    };
    changeContact = (index, value, name) =>{
        let contactPersonList = _.cloneDeep(this.state.contactPersonList);
        contactPersonList[index][name] = value;
        this.setState({contactPersonList});
    };
    doRegister = (e) => {
        e.preventDefault();
        let { patient, contactPersonList } = this.state;
        // 后台格式(YYYY-MM-DD), 前台格式(DD MMM YYYY)
        patient.dateOfBirth = moment(patient.dateOfBirth, 'DD MMM YYYY').format('YYYY-MM-DD');
        patient.search = `${patient.documentNumber},${patient.homePhone},${patient.mobilePhone},${patient.englishSurname},${patient.englishGivenName},${patient.englishSurname},${patient.chineseName}`;
        let params = {
            contactPersonList: contactPersonList,
            patient: patient
        };
        if (this.state.isUpdate) {
            this.props.dispatch({type: 'UPDATE_PATIENT', params});
        } else {
            this.props.dispatch({type: 'REGISTER_PATIENT', params});
        }
        this.setState({loading: true, patient: _.cloneDeep(patientBasic), contactPersonList: [], isUpdate: false});
    };
    doCancel = () => {
        this.setState({patient: _.cloneDeep(patientBasic), contactPersonList: [], isUpdate: false});
    };
    search = (value) => {
        if (value) {
            // 去除空格,大写搜索
            value = value.replace(' ', '');
            const params = { searchData: value };
            this.props.dispatch({type: 'SEARCH_PATIENT', params});
        }
    };
    selectPatient = (item) => {
        if (JSON.stringify(item) === '{}'){
            item.patient = _.cloneDeep(patientBasic);
            item.contactPersonList = [];
        } else {
            _.forEach(item.patient, (value, key) => {
                if (!item.patient[key]) {
                    item.patient[key] = '';
                }
            });
            item.patient.dateOfBirth = moment(item.patient.dateOfBirth, 'YYYY-MM-DD').format('DD MMM YYYY');
            if (item.contactPersonList.length > 0) {
                _.forEach(item.contactPersonList, eve => {
                    _.forEach(eve, (value, key) => {
                        if (!eve[key]) {
                            eve[key] = '';
                        }
                    });
                });
            }
            this.setState({patient: item.patient, isUpdate: true, contactPersonList: item.contactPersonList});
        }
    };
    closeDialog = () => {
        this.setState({loading: false}, () => this.props.dispatch({type: 'CLOSE_PATIENT_LOADING'}));
    };

    render() {
        const { classes } = this.props;
        const basicInputs = [{
            label: 'Document Number',
            isRequire: true,
            name: 'documentNumber',
            style: 'form50'
        }, {
            label: 'Surname',
            isRequire: true,
            name: 'englishSurname',
            style: 'form50'
        }, {
            label: 'Given Name',
            isRequire: true,
            name: 'englishGivenName',
            style: 'form50'
        }, {
            label: '中文名字',
            isRequire: false,
            name: 'chineseName',
            style: 'form50'
        }];
        const addressInputs = [{
            label: 'Room/Flat',
            isRequire: false,
            name: 'room',
            style: 'form33'
        }, {
            label: 'Floor',
            isRequire: false,
            name: 'floor',
            style: 'form33'
        }, {
            label: 'Block',
            isRequire: false,
            name: 'block',
            style: 'form34'
        }, {
            label: 'Building',
            isRequire: false,
            name: 'building',
            style: 'form116'
        }, {
            label: 'Estate/Village',
            isRequire: false,
            name: 'estate',
            style: 'form66'
        }, {
            label: 'Street',
            isRequire: false,
            name: 'street',
            style: 'form34'
        }];
        return (
                <div className={'detail_warp'}>
                    <div className={'nephele_content_body'}>
                        <SearchInput change={this.search} patientList={this.props.patientList} selectPatient={this.selectPatient}/>
                        <form>
                            <div className={styles.form50}>
                                <div>Document Type<span style={{color: 'red'}}>*</span></div>
                                <select className={'select_input'} value={this.state.patient.documentType} onChange={(...arg) => this.changeInformation(...arg, 'documentType')}>
                                    {
                                        doumentTypeList.map((item, index) => <option key={index} value={item}>{item}</option>)
                                    }
                                </select>
                            </div>
                            {
                                basicInputs.map(item => {
                                    return (<FormInput type={item.type} key={item.name} style={item.style} isRequire={item.isRequire} name={item.name} label={item.label} value={this.state.patient[item.name]} change={this.changeInformation}/>);
                                })
                            }
                            <div className={styles.form50}>
                                <div>Date of Birth<span style={{color: 'red'}}>*</span></div>
                                <InputBase type={'date'} className={classes.form_input} value={moment(this.state.patient.dateOfBirth, 'DD MMM YYYY').format('YYYY-MM-DD')} onChange={(...arg) => this.changeInformation(...arg, 'dateOfBirth')}/>
                                <InputBase value={this.state.patient.dateOfBirth} className={classes.cover}/>
                            </div>
                            <div className={styles.form50}>
                                <div>Sex</div>
                                <RadioGroup value={this.state.patient.sex} onChange={(...arg) => this.changeRadio(...arg, 'sex')} row>
                                    <FormControlLabel value="male" control={<Radio color={'primary'}/>} label="Male" />
                                    <FormControlLabel value="female" control={<Radio color={'primary'}/>} label="Female" />
                                    <FormControlLabel value="unknown" control={<Radio color={'primary'}/>} label="Unknown" />
                                </RadioGroup>
                            </div>
                            <Tabs value={this.state.tabValue} onChange={this.changeTabValue} indicatorColor={'primary'} textColor={'primary'}>
                                <Tab label="Contact Information"/>
                                <Tab label="Contact Person" />
                            </Tabs>
                            <div className={'nephele_content_body'}>
                                {this.state.tabValue === 0 && <Typography component={'div'}>
                                    <div className={styles.form33}>
                                        <div>Mobile Phone(SMS)</div>
                                        <div>
                                            <select className={'phone_select_input'} value={this.state.patient.mobilePhoneAreaCode} onChange={(...arg) => this.changeInformation(...arg, 'mobilePhoneAreaCode')}>
                                                {
                                                    countryCodeList.map((item, index) => <option key={index} value={item}>{item}</option>)
                                                }
                                            </select>
                                            <InputBase type={'number'} className={classes.phone_form_input} value={this.state.patient.mobilePhone} onChange={(...arg) => this.changeInformation(...arg, 'mobilePhone')}/>
                                        </div>
                                    </div>
                                    <div className={styles.form33}>
                                        <div>Home Phone</div>
                                        <div>
                                            <select className={'phone_select_input'} value={this.state.patient.homePhoneAreaCode} onChange={(...arg) => this.changeInformation(...arg, 'homePhoneAreaCode')}>
                                                {
                                                    countryCodeList.map((item, index) => <option key={index} value={item}>{item}</option>)
                                                }
                                            </select>
                                            <InputBase type={'number'} className={classes.phone_form_input} value={this.state.patient.homePhone} onChange={(...arg) => this.changeInformation(...arg, 'homePhone')}/>
                                        </div>
                                    </div>
                                    {/*<FormInput style={'form33'} name={'email'} label={'Email'} type={'email'} value={this.state.patient.email} change={this.changeInformation}/>*/}
                                    <div className={styles.form_body}>
                                        <div className={styles.form_title}>
                                            Address
                                            {
                                                this.state.showAddress ?
                                                    <Remove className={classes.close_icon} color={'primary'} fontSize="small" onClick={this.closeAddress}>
                                                        <Close/>
                                                    </Remove> :
                                                    <Add className={classes.close_icon} color={'primary'} fontSize="small" onClick={this.closeAddress}>
                                                        <Close/>
                                                    </Add>
                                            }
                                        </div>
                                        {
                                            this.state.showAddress ?
                                                <div className={styles.form_content}>
                                                    {
                                                        addressInputs.map(item => {
                                                            return (<FormInput type={item.type} key={item.name} style={item.style} isRequire={item.isRequire} name={item.name} label={item.label} value={this.state.patient[item.name]} change={this.changeInformation}/>);
                                                        })
                                                    }
                                                    <div className={styles.form15}>
                                                        <div>Region</div>
                                                        <select className={'select_input'} value={this.state.patient.region} onChange={(...arg) => this.changeInformation(...arg, 'region')}>
                                                            <option value={'HK'}>HK</option>
                                                        </select>
                                                    </div>
                                                    <div className={styles.form38}>
                                                        <div>District</div>
                                                        <select className={'select_input'} value={this.state.patient.district} onChange={(...arg) => this.changeInformation(...arg, 'district')}>
                                                            {
                                                                districtList.map((item, index) => <option key={index} value={item}>{item}</option>)
                                                            }
                                                        </select>
                                                    </div>
                                                </div>: null
                                        }
                                    </div>
                                </Typography>}
                                {this.state.tabValue === 1 && <Typography component={'div'}>
                                    {
                                        this.state.contactPersonList.length > 0 ? this.state.contactPersonList.map((item, index) =>
                                            <Contact key={index} index={index} contact={item} style={style} change={this.changeContact}/>) : null
                                    }
                                    <div title={'add contact person'} className={'f_mt10'} onClick={this.addContact}>
                                        <Add className={classes.add_icon} color={'primary'} /><span>Add more contact person</span>
                                    </div>
                                </Typography>}
                            </div>
                            <div className={'f_fr'}>
                                <Button type={'submit'} style={{width: '80px', marginRight: '10px'}} variant={'outlined'} size={'small'} color={'primary'} onClick={this.doRegister}>Save</Button>
                                <Button style={{width: '80px'}} variant={'outlined'} size={'small'} color={'primary'} onClick={this.doCancel}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                    <Dialog open={this.state.loading && this.props.patientLoading}>
                        {
                            this.props.patientErrorMessage === '' ?
                                <img src={timg} alt={''}/> : <DialogContent>{this.props.patientErrorMessage}</DialogContent>
                        }
                        {
                            this.props.patientErrorMessage !== '' ? <DialogActions>
                                <Button onClick={this.closeDialog} color="primary">
                                    OK
                                </Button>
                            </DialogActions> : null
                        }
                    </Dialog>
                </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(style)(Register)));
