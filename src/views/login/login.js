import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select, Button, Input, MenuItem  } from '@material-ui/core';
import loginPic from '../../images/login.png';
import styles from './login.module.scss';

function mapStateToProps(state) {
    return {
        user: state.updateUser.user,
        clinicList: state.updateUser.clinicList
    };
}
/* const mapStateToDispatch = (dispatch) => {
    return bindActionCreators({
        dispatch: dispatch
    });
}; */
const mapStateToDispatch=(dispatch)=>{
    return {
        getClinicList:()=>{
            console.log('sdf');
            dispatch({type:'GET_CLINIC'});
        },
        doLogin:(params)=> {
            console.log('sdfasdas', params);
            dispatch({type:'DO_LOGIN', params});
        }
    };
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ifLogin: true,
            clinic: 2,
            loginId: '',
            password: ''
        };
    }
    UNSAFE_componentWillMount() {
        this.props.getClinicList();
        console.log('UNSAFE_componentWillMount', 'user',this.props.user, this.props.clinicList);
        // this.props.dispatch({type: 'GET_CLINIC'});
    }

    componentDidMount() {
        this.props.getClinicList();
        console.log('componentDidMount', 'user',this.props.user, this.props.clinicList);
        // this.props.dispatch({type: 'GET_CLINIC'});
    }

    doLogin = () => {
        const params = {
            clinic: this.state.clinic,
            loginId: this.state.loginId,
            password: this.state.password
        };
        // this.props.dispatch({type:'GET_CLINIC'})
        this.props.doLogin(params);
    }

    changeLoginInformation = (e, name) => {
        this.setState({[name]: e.target.value});
    }
    render() {
        return (
            <div>
                {
                    this.state.ifLogin ? <div className={styles.login}>
                        <div className={styles.login_contain}>
                            <img src={loginPic} alt={''}/>
                            <div className={styles.login_information}>
                                <div className={'f_mt15'}>Clinic:</div>
                                    <Select value={this.state.clinic} onChange={(...arg) => this.changeLoginInformation(...arg, 'clinic')}>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                <div className={'f_mt15'}>Login ID:</div>
                                <Input value={this.state.loginId} onChange={(...arg) => this.changeLoginInformation(...arg, 'loginId')}/>
                                <div className={'f_mt15'}>Password:</div>
                                <Input type={'password'} value={this.state.password} onChange={(...arg) => this.changeLoginInformation(...arg, 'password')}/>
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
                    </div> : null
                }
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapStateToDispatch)(Login));
