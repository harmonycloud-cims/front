import { combineReducers } from 'redux';
import { allMenuList } from '../../services/staticData';
import _ from 'lodash';

global.token = '';
export const initState = {
    token: null,
    ifLogin: false,
    clinicList: [],
    clinic: {},
    encounterTypeList: [],
    encounterType: {},
    roomList: [],       //根据clinicId,encounterTypeId查询的roomList
    allRoomList: [],  //只根据clinicId查询的roomList
    user: {}, // 登录人的基本信息
    menuList: [],
    activeMenu: 'Welcome'
};
const updateUser = (state = initState, action = {}) => {
    switch (action.type) {
        case 'UPDATE_LOGIN_USER':
            _.forEach( action.data.data.user.accessRights, item => {
               _.forEach(allMenuList, eve => {
                   if (item.accessRightName === eve.accessRightName) {
                       item.icon = eve.icon;
                       item.url = eve.url;
                       item.name = eve.name;
                   }
               });
            });
            action.data.data.user.accessRights.unshift(allMenuList[0]);
            window.sessionStorage.setItem('token', action.data.data.token);
            return {...state, user: action.data.data.user, menuList: action.data.data.user.accessRights, ifLogin: true, token: action.data.data.token};
        case 'UPDATE_CLINICLIST':
            return {...state, clinicList: action.clinicList};
        case 'UPDATE_CLINIC':
            return {...state, clinic: action.clinic};
        case 'UPDATE_ENCOUNTERTYPELIST':
            return {...state, encounterTypeList: action.encounterTypeList};
        case 'UPDATE_ENCOUNTERTYPE':
            return {...state, encounterType: action.encounterType};
        case 'UPDATE_ROOM':
            let roomList = action.roomList;
            _.forEach(roomList, (item, index) => item.checked = true );
            return {...state, roomList};
        case 'UPDATE_ALL_ROOM':
            return {...state, allRoomList: action.allRoomList,};
        case 'UPDATE_MENU':
            return {...state, activeMenu: action.activeMenu};
        case 'CLEAR_INFORMATION':
            window.sessionStorage.setItem('token', null);
            return {...state,
                token: null,
                ifLogin: false,
                user: {}, // 登录人的基本信息
                menuList: [],
                activeMenu: 'Welcome'
            };
        default:
            return state;
    }
};

const loginState = {
    loginMessageShow: false,
    loginMessage: ''
};
const updateLogin = (state = loginState, action = {}) => {
    switch (action.type) {
        case 'UPDATE_LOGIN_USER':
            return {...state, loginMessage: '', loginMessageShow: false};
        case 'LOGIN_ERROR':
            return {...state, loginMessage: action.error, loginMessageShow: true};
        default:
            return state;
    }
};
const patientState = {
    patientList: [],
    patientLoading: false,
    patientErrorMessage: ''
};
const updatePatient = (state = patientState, action = {}) => {
    switch (action.type) {
        case 'PATIENTLIST':
            return {...state, patientList: action.data};
        case 'PATIENT_LOADING':
            return {...state, patientLoading: action.data};
        case 'PATIENT_LOADING_ERROR':
            return {...state, patientErrorMessage: action.data};
        case 'PATIENT_LOADING_ERROR_CLOSE':
            return {...state, patientLoading: false, patientErrorMessage: ''};
        default:
            return state;
    }
};
const appointmentState = {
    calendarList: [],
    bookHistoryList: [],
    bookCompareResult: true,
    bookAppointmentDialog: false,
    selectCalendar: false,
    attendanceList: [],
};
const updateAppointment = (state = appointmentState, action = {}) => {
    switch (action.type) {
        case 'CALENDARLIST':
            let dateList = action.dateList;
            let numberWeek = action.numberWeek;
            let calendarList = action.data;
            _.forEach(calendarList, item => {
                item.appointmentCalendar = [];
                _.forEach(dateList, eve => {
                    let appointmentQuo = {
                        day: eve,
                        holiday: false,
                        quota: 0,
                        appointmentDate: '',
                        noData: true,
                    };
                    _.forEach(item.appointmentQuotaquotabo, quo => {
                        if (eve === parseInt(quo.appointmentDate.split('-')[0], 10)) {
                            appointmentQuo.holiday = quo.holiday;
                            appointmentQuo.quota = quo.quota;
                            appointmentQuo.appointmentDate = quo.appointmentDate;
                            appointmentQuo.noData = false;
                        }
                    }) ;
                    item.appointmentCalendar.push(appointmentQuo);
                })
            });
            if (numberWeek !== 1) {
                for (let i = 1; i < numberWeek; i++) {
                    _.forEach(calendarList, item => {
                        item.appointmentCalendar.unshift({});
                    });
                }
            }
            return {...state, calendarList: action.data};
        case 'BOOK_HISTORY':
            return {...state, bookHistoryList: action.data};
        case 'BOOK_COMPARE_RESULT':
            return {...state, bookCompareResult: action.data, bookAppointmentDialog: true};
        case 'BOOK_COMPARE_RESULT_CLOSE':
            return {...state, bookAppointmentDialog: false};
        case 'SELECT_CALENDAR':
            return {...state, selectCalendar: action.data};
        case 'GET_ATTENDANCELIST':
            return {...state, attendanceList: action.data};
        default:
            return state;
    }
};
const rootReducer = combineReducers({
    config: (state = {}) => state,
    updateUser,
    updateLogin,
    updatePatient,
    updateAppointment
});

export default rootReducer;
