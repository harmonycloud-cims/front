import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Input } from '@material-ui/core';
import loginPic from '../../images/login.png';
import styles from './login.module.scss';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

function mapStateToProps(state) {
    return {
        ifLogin: state.updateUser.ifLogin,
        user: state.updateUser.user,
        clinicList: state.updateUser.clinicList,
        clinic: state.updateUser.clinic,
        loginMessageShow: state.updateLogin.loginMessageShow,
        loginMessage: state.updateLogin.loginMessage
    };
}
const style = {
    input: {
        paddingLeft: 10
    }
};
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ifLogin: true,
            clinicId: this.props.clinic.clinicId,
            loginname: '',
            password: ''
        };
    }
    componentDidMount() {
        document.addEventListener('keypress',this.handleEnterKey);
        /*if (this.props.clinicList.length < 1) */this.props.dispatch({type:'GET_CLINICLIST'});
    }
    doLogin = (e) => {
        e.preventDefault();
        const params = {
            clinicId: this.state.clinicId,
            loginname: this.state.loginname,
            password: this.state.password
        };
        this.props.dispatch({type:'DO_LOGIN', params});
    };
    changeLoginInformation = (e, name) => {
        if (name === 'clinicId') {
            let clinic = _.find(this.props.clinicList, item => item.clinicId === parseInt(e.target.value, 10));
            this.props.dispatch({type:'LOGIN_CHANGE_CLINIC', clinicId: e.target.value, clinic});
        }
        this.setState({[name]: e.target.value});
    };
    handleEnterKey = (e) => {
        if(e.keyCode === 13){ //主要区别就是这里，可以直接获取到keyCode的值
            this.doLogin(e);
        }
    };
    render() {
        const { classes } = this.props;
        if (this.props.ifLogin) {
            return <Redirect to={'/index'}/>
        }
        return (
            <div className={styles.login}>
                        <div className={styles.login_contain}>
                            <img src={loginPic} alt={''}/>
                            <form className={styles.login_information} onSubmit={(e) => this.doLogin(e)}>
                                <div className={'f_mt15'}>Clinic:</div>
                                    <select value={this.state.clinicId} onChange={(...arg) => this.changeLoginInformation(...arg, 'clinicId')} className={styles.select_boder}>
                                        {
                                            this.props.clinicList.map(item => <option key={item.clinicId} value={item.clinicId}>{item.clinicName}</option>)
                                        }
                                    </select>
                                <div className={'f_mt15'}>Login ID:</div>
                                <Input required className={classes.input} value={this.state.loginname} onChange={(...arg) => this.changeLoginInformation(...arg, 'loginname')} onKeyUp={(e) => this.handleEnterKey(e)}/>
                                <div className={'f_mt15'}>Password:</div>
                                <Input required className={classes.input} type={'password'} value={this.state.password} onChange={(...arg) => this.changeLoginInformation(...arg, 'password')} onKeyUp={(e) => this.handleEnterKey(e)}/>
                                {
                                    this.props.loginMessageShow ?
                                        <div style={{color: 'red', fontSize: '14px'}}>{this.props.loginMessage}</div> : null
                                }
                                <div className={styles.float_margint}>
                                    <div className={styles.forget_password}>Forget your password</div>
                                    <Button type={'submit'} style={{width: '120px'}} variant={'outlined'} size={'small'} color={'primary'}>Sign in</Button>
                                </div>
                            </form>
                            <div className={'f_mt15'}>Important Note</div>
                            <div className={styles.login_notes}>
                                <div>1. All patient information is strictly confidential</div>
                                <div>2. Staff may only use the CIMS for authorised purpose</div>
                                <div>3. All access to CIMS is logged</div>
                                <div>4. Please logoff immediately after use</div>
                                <div>5. Please ensure you have verified the content before you sign the computer printouts</div>
                                <div>6. Please change your password on a regular basis</div>
                            </div>
                        </div>
                    </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(style)(Login)));
