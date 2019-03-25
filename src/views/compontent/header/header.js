import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  PersonAdd,
  DateRange,
  LocalHospital,
  EventAvailable,
  Adb,
  ArrowForwardIos,
  Home,
  Person,
  Edit,
  EventNote
} from '@material-ui/icons';
import moment from 'moment';
import { allMenuList } from '../../../services/staticData';
import _ from 'lodash';

const components = {
  welcome: Home,
  register: PersonAdd,
  appointment: DateRange,
  attendance: LocalHospital,
  consultation: EventAvailable,
  drug: Adb,
  assessment: Person,
  investigation: Edit,
  result: EventNote
};

function mapStateToProps(state) {
  return {
    user: state.updateUser.user,
    menuList: state.updateUser.menuList,
    activeMenu: state.updateUser.activeMenu,
    reLogin: state.updateUser.reLogin
  };
}

class CommonHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      time: moment(new Date().getTime()).format('DD-MMM-YYYY, HH:mm')
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'REFRESH_TOKEN' });
    let timer = setInterval(() => {
      this.props.dispatch({ type: 'REFRESH_TOKEN' });
    }, 7 * 60000);
    this.setState({ timer });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('123321', nextProps.location.pathname, this.props.location.pathname);
    if (nextProps.location.pathname !== this.props.location.pathname) {
      if (
        nextProps.location.pathname === '/' ||
        nextProps.location.pathname === '/login'
      ) {
        // console.log('shijianguola');
        this.props.dispatch({ type: 'LOGOUT' });
        this.props.history.push('/login');
      } else if(nextProps.location.pathname === '/index'){
        this.props.history.push('/index/welcome');
      }else {
        this.urlChangeReduxUpdate(nextProps.location.pathname);
      }
    }
  }
  componentWillUnmount() {
    if (this.state.timer !== null) {
      clearInterval(this.state.timer);
    }
  }
  changeMenu = item => {
    this.props.dispatch({
      type: 'CHANGE_MENU',
      activeMenu: item.accessRightName
    });
    // this.props.history.push(item.url);
  };
  urlChangeReduxUpdate = url => {
    let menu = _.find(allMenuList, item => {
      return item.url === url;
    });
    this.props.dispatch({
      type: 'CHANGE_MENU',
      activeMenu: menu.accessRightName
    });
  };
  logout = () => {
    this.props.dispatch({ type: 'LOGOUT' });
    // this.props.history.push('/login');
  };
  render() {
    return (
      <div className="com_header">
        <div className="com_header_menu_list">
          {this.props.menuList.map((item, index) => {
            let Icon = components[item.icon];
            return (
              <Link
                  to={item.url}
                  key={index}
                  className="menu_item"
                  onClick={() => this.changeMenu(item)}
              >
                <Icon fontSize="default" color="action" className="menu_icon" />
                <span
                    className={
                    this.props.activeMenu === item.accessRightName
                      ? 'menu_font_selected'
                      : 'menu_font'
                  }
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="com_header_right_warp">
          <div
              onClick={() => this.logout()}
              className="com_header_right_warp_item"
              title={'Logout'}
          >
            <span className="menu_font" style={{ color: '#3f51b5' }}>
              Logout
            </span>
            <ArrowForwardIos
                fontSize="default"
                color="action"
                className="menu_icon"
            />
          </div>
          <div className="com_header_right_warp_item">
            <div className="com_header_right_warp_name">
              {this.props.user.loginName}
            </div>
            <div className="com_header_right_warp_time">
              Login Time: {this.state.time}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(CommonHeader));
