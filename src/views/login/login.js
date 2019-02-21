import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Input } from '@material-ui/core';
import loginPic from '../../images/login.png';
import styles from './login.module.scss';
import { withStyles } from '@material-ui/core/styles';

function mapStateToProps(state) {
    return {
        ifLogin: state.updateUser.ifLogin,
        user: state.updateUser.user,
        clinicList: state.updateUser.clinicList
    };
}
const style = {
    input: {
        paddingLeft: 10
    },
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ifLogin: true,
            clinicid: 0,
            loginname: '',
            password: ''
        };
    }

    componentDidMount() {
        this.props.dispatch({type:'GET_CLINICLIST'});
    }

    doLogin = () => {
        const params = {
            clinicid: this.state.clinicid,
            loginname: this.state.loginname,
            password: this.state.password
        };
        this.props.dispatch({type:'DO_LOGIN', params});
    };

    changeLoginInformation = (e, name) => {
        this.setState({[name]: e.target.value});
    };
    render() {
        const { classes } = this.props;
        return (
            <div>
                {
                    this.props.ifLogin ? <div className={styles.login}>
                        <div className={styles.login_contain}>
                            <img src={loginPic} alt={''}/>
                            <div className={styles.login_information}>
                                <div className={'f_mt15'}>Clinic:</div>
                                    <select value={this.state.clinicid} onChange={(...arg) => this.changeLoginInformation(...arg, 'clinicid')} className={styles.select_boder}>
                                        {
                                            this.props.clinicList.map(item => <option key={item.clinicId} value={item.clinicId}>{item.clinicName}</option>)
                                        }
                                    </select>
                                <div className={'f_mt15'}>Login ID:</div>
                                <Input className={classes.input} value={this.state.loginname} onChange={(...arg) => this.changeLoginInformation(...arg, 'loginname')}/>
                                <div className={'f_mt15'}>Password:</div>
                                <Input className={classes.input} type={'password'} value={this.state.password} onChange={(...arg) => this.changeLoginInformation(...arg, 'password')}/>
                                <div className={styles.float_margint}>
                                    <div className={styles.forget_password}>Forget your password</div>
                                    <Button style={{width: '120px'}} variant={'outlined'} size={'small'} color={'primary'} onClick={this.doLogin}>Sign in</Button>
                                </div>
                            </div>
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
                    </div> : <Redirect to={'/register'}/>
                }
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(style)(Login)));
