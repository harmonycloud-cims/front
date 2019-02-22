import { combineReducers } from 'redux';
import { allMenuList } from '../../services/staticData';
import _ from 'lodash'
// import * as type from '../actions/ActionsType';

const initState = {
    token: null,
    ifLogin: true,
    clinicList: [],
    user: {}, // 登录人的基本信息
    menuList: [],
    activeMenu: 'Welcome',
    loginMessageShow: false,
    loginMessage: '',
};
const updateUser = (state = initState, action = {}) => {
    switch (action.type) {
        case 'UPDATE_LOGIN_USER':
            const menuList =  action.data.data.user.accessRights;
            _.forEach(menuList, item => {
               _.forEach(allMenuList, eve => {
                   if (item.accessRightName === eve.accessRightName) {
                       item.icon = eve.icon;
                       item.url = eve.url;
                   }
               })
            });
            menuList.unshift(allMenuList[0]);
            return {...state, user: action.data.data.user, menuList, ifLogin: false, token: action.data.token};
        case 'UPDATE_CLINICLIST':
            return {...state, clinicList: action.data};
        case 'UPDATE_MENU':
            return {...state, activeMenu: action.activeMenu};
        case 'CLEAR_INFORMATION':
            return {...state,
                token: null,
                ifLogin: true,
                user: {}, // 登录人的基本信息
                menuList: [],
                activeMenu: 'Welcome',
            };
        default:
            return state;
    }
};

const updateLogin = (state = initState, action = {}) => {
    switch (action.type) {
        case 'UPDATE_LOGIN_USER':
            return {...state, loginMessage: '', loginMessageShow: false};
        case 'LOGIN_ERROR':
            return {...state, loginMessage: action.error, loginMessageShow: true};
        default:
            return state;
    }
};
const rootReducer = combineReducers({
    config: (state = {}) => state,
    updateUser,
    updateLogin
});

export default rootReducer;
