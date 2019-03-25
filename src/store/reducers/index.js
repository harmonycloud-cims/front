import { combineReducers } from 'redux';
import { allMenuList } from '../../services/staticData';
import _ from 'lodash';
import { patientBasic, basicPrint } from '../../services/staticData';

global.token = '';
export const initState = {
  ifLogin: false,
  clinicList: [],
  clinic: {},
  encounterTypeList: [],
  encounterType: {},
  roomList: [], //根据clinicId,encounterTypeId查询的roomList
  allRoomList: [], //只根据clinicId查询的roomList
  user: {}, // 登录人的基本信息
  menuList: [],
  activeMenu: 'Welcome'
};
const updateUser = (state = initState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_LOGIN_USER':
      _.forEach(action.data.data.user.accessRightList, item => {
        _.forEach(allMenuList, eve => {
          if (item.accessRightName === eve.accessRightName) {
            item.icon = eve.icon;
            item.url = eve.url;
            item.name = eve.name;
          }
        });
      });
      action.data.data.user.accessRightList.unshift(allMenuList[0]);
      return {
        ...state,
        user: action.data.data.user,
        menuList: action.data.data.user.accessRightList,
        ifLogin: true
      };
    case 'UPDATE_CLINICLIST':
      return { ...state, clinicList: action.clinicList };
    case 'UPDATE_CLINIC':
      return { ...state, clinic: action.clinic };
    case 'UPDATE_ENCOUNTERTYPELIST':
      return { ...state, encounterTypeList: action.encounterTypeList };
    case 'UPDATE_ENCOUNTERTYPE':
      return { ...state, encounterType: action.encounterType };
    case 'UPDATE_ROOM': {
      let roomList = action.roomList;
      _.forEach(roomList, item => (item.checked = true));
      return { ...state, roomList };
    }
    case 'UPDATE_ALL_ROOM':
      return { ...state, allRoomList: action.allRoomList };
    case 'UPDATE_MENU':
      return { ...state, activeMenu: action.activeMenu };
    case 'CLEAR_INFORMATION':
      window.sessionStorage.setItem('token', null);
      return {
        ...state,
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
    // case 'UPDATE_LOGIN_USER':
    //   return { ...state, loginMessage: '', loginMessageShow: false };
    case 'LOGIN_ERROR':
      return { ...state, loginMessage: action.error, loginMessageShow: true };
    default:
      return state;
  }
};
const patientState = {
  patientList: [],
  patientLoading: false,
  patientErrorMessage: '',
  patientById: {}
};
const updatePatient = (state = patientState, action = {}) => {
  switch (action.type) {
    case 'PATIENTLIST':
      return { ...state, patientList: action.data };
    case 'PATIENT_BY_ID':
      return { ...state, patientById: action.patientById };
    case 'PATIENT_LOADING':
      return { ...state, patientErrorMessage: action.data, patientLoading: true };
    case 'PATIENT_LOADING_ERROR':
      return { ...state, patientErrorMessage: action.data };
    case 'PATIENT_LOADING_ERROR_CLOSE':
      return { ...state, patientLoading: false };
    default:
      return state;
  }
};
const appointmentState = {
  calendarList: [],
  bookHistoryList: [],
  bookCompareResult: true,
  bookCompareResultError: '',
  bookAppointmentDialog: false,
  selectCalendar: false,
  attendanceList: [],
  attendLoading: false
};
const updateAppointment = (state = appointmentState, action = {}) => {
  switch (action.type) {
    case 'CALENDARLIST': {
      let dateList = action.dateList;
      let numberWeek = action.numberWeek;
      let calendarList = [];
      let rooms = _.keys(action.data);
      _.forEach(rooms, item => {
        calendarList.push({
          roomId: parseInt(item, 10),
          appointmentQuotaquotabo: action.data[item]
        });
      });
      _.forEach(calendarList, item => {
        item.appointmentCalendar = [];
        _.forEach(dateList, eve => {
          let appointmentQuo = {
            day: eve,
            holiday: false,
            quota: 0,
            appointmentDate: '',
            noData: true
          };
          _.forEach(item.appointmentQuotaquotabo, quo => {
            if (eve === parseInt(quo.appointmentDate.split('-')[2], 10)) {
              appointmentQuo.holiday = quo.holiday;
              appointmentQuo.quota = quo.quota;
              appointmentQuo.appointmentDate = quo.appointmentDate;
              appointmentQuo.noData = false;
            }
          });
          item.appointmentCalendar.push(appointmentQuo);
        });
      });
      if (numberWeek !== 1) {
        for (let i = 1; i < numberWeek; i++) {
          _.forEach(calendarList, item => {
            item.appointmentCalendar.unshift({});
          });
        }
      }
      return { ...state, calendarList };
    }
    case 'BOOK_HISTORY': {
      let bookHistoryList = action.data;
      bookHistoryList.sort(function(a, b) {
        if (a.appointmentDate > b.appointmentDate) {
          return -1;
        } else if (a.appointmentDate < b.appointmentDate) {
          return 1;
        }
        return 0;
      });
      // bookHistoryList.sort((a, b) => {
      //   return b.appointmentDate - a.appointmentDate;
      // });
      return { ...state, bookHistoryList };
    }
    case 'BOOK_COMPARE_RESULT':
      return {
        ...state,
        bookCompareResult: action.data,
        bookAppointmentDialog: true
      };
    case 'BOOK_COMPARE_RESULT_ERROR':
      return {
        ...state,
        bookCompareResult: action.data,
        bookAppointmentDialog: true,
        bookCompareResultError: action.error
      };
    case 'BOOK_COMPARE_RESULT_CLOSE':
      return { ...state, bookAppointmentDialog: false };
    case 'SELECT_CALENDAR':
      return { ...state, selectCalendar: action.data };
    case 'OPEN_ATTENDING_DIALOG':
      return { ...state, attendLoading: true };
    case 'CLOSE_ATTENDING_DIALOG':
      return { ...state, attendLoading: false };
    case 'UPDATE_ATTENDANCELIST': {
      let notAttend = action.attendanceList;
      let attend = _.remove(notAttend, item => {
        return item.attendanceStatus === 'Attend';
      });
      notAttend.sort(function(a, b) {
        if (a.appointmentDate > b.appointmentDate) {
          return 1;
        } else if (a.appointmentDate < b.appointmentDate) {
          return -1;
        }
        return 0;
      });
      attend.sort(function(a, b) {
        if (a.attendanceTime > b.attendanceTime) {
          return 1;
        } else if (a.attendanceTime < b.attendanceTime) {
          return -1;
        }
        return 0;
      });
      let attendanceList = attend.concat(notAttend);
      return { ...state, attendanceList };
    }
    default:
      return state;
  }
};
const bookPrintState = {
  print: _.cloneDeep(basicPrint),
  patient: _.cloneDeep(patientBasic),
  bookPrint: false
};

const updateBookPrint = (state = bookPrintState, action = {}) => {
  switch (action.type) {
    case 'BOOK_PRINT':
      return { ...state, print: action.params, patient: action.patient, bookPrint: false };
    case 'OPEN_BOOK_PRINT':
      return { ...state, bookPrint: true };
    case 'CLOSE_BOOK_PRINT':
      return { ...state, bookPrint: false };
    default:
      return state;
  }
};
const consultationState = {
  medicalRecordList: [],
  templateList: [],
  chronicProblemList: [],
  diagnosisProblemList: [],
  encounter: {},
  clinicNote: null,
  attendingProblemList: [],
  closeDialog: false,
  consulationErrorMessage: '',
  openSearchProgress: false,
  saveName: 'note' //note, prescription, nextPatient
};
const updateConsultation = (state = consultationState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_MEDICAL_RECORD': {
      let medicalRecordList = action.medicalRecordList;
      medicalRecordList.sort(function(a, b) {
        if (a.createDate > b.createDate) {
          return -1;
        } else if (a.createDate < b.createDate) {
          return 1;
        }
        return 0;
      });
      return { ...state, medicalRecordList };
    }
    case 'UPDATE_TEMPLATELIST':
      return { ...state, templateList: action.templateList };
    case 'UPDATE_CHRONICPROBLEMLIST':
      return { ...state, chronicProblemList: action.chronicProblemList };
    case 'OPEN_SEARCH':
      return { ...state, openSearchProgress: true };
    case 'CLOSE_SEARCH':
      return { ...state, openSearchProgress: false };
    case 'UPDATE_DIAGNOSIS_PROBLEM':
      return { ...state, diagnosisProblemList: action.diagnosisProblemList };
    case 'UPDATE_ENCOUNTERID':
      return { ...state, encounter: action.encounter };
    case 'UPDATE_CLINIC_NOTE':
      return { ...state, clinicNote: action.clinicNote };
    case 'UPDATE_ATTENDING_PROBLEM':
      return { ...state, attendingProblemList: action.attendingProblemList };
    case 'OPEN_CONSULTATION_LOADING':
      return { ...state, consulationErrorMessage: '', closeDialog: action.data, saveName: action.saveName };
    case 'CONSULTATION_LOADING_SUCCESS':
      return { ...state, consulationErrorMessage: 'Save successful' };
    case 'CLOSE_CONSULTATION_LOADING':
      return { ...state, closeDialog: false };
    case 'CONSULTATION_LOADING_ERROR':
      return { ...state, consulationErrorMessage: action.data };
    default:
      return state;
  }
};
const prescriptionState = {
  errorMessageStatus: false,
  errorMessage: '',
  departmentFavouriteList: [],
  drugHistoryList: [],
  searchDrugList: [],
  prescriptionLatest: {}
};
const updatePrescription = (state = prescriptionState, action = {}) => {
  switch (action.type) {
    case 'OPEN_ERROR_MESSAGE':
      return { ...state, errorMessageStatus: true, errorMessage: action.error };
    case 'CLOSE_ERROR_MESSAGE':
      return { ...state, errorMessageStatus: false, errorMessage: '' };
    case 'UPDATE_DRUG_LIST':
      return { ...state, searchDrugList: action.searchDrugList };
    case 'UPDATE_DRUG_HISTORY':{
      let drugHistoryList = action.drugHistoryList ? action.drugHistoryList : [];
      drugHistoryList.length > 0 && _.forEach(drugHistoryList, item => {
        item.prescriptionDrugBoList && item.prescriptionDrugBoList.length > 0 && _.forEach(item.prescriptionDrugBoList, eve => {
          eve.checked = false;
        });
      });
      return { ...state, drugHistoryList };
    }
    case 'UPDATE_PRESCRIPTION':{
      return { ...state, prescriptionLatest: action.data };
    }
    case 'UPDATE_DEPARTMENTAL_FAVOURITE': {
      let departmentFavouriteList = action.departmentFavouriteList;
      if(departmentFavouriteList.length > 0) {
        _.forEach(departmentFavouriteList, item => {
          item.isCollapse = false;
          _.forEach(item.drugFavouriteGroupDrugDtoList, eve => {
            eve.checked = false;
          });
        });
      }
      return { ...state, departmentFavouriteList };
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  config: (state = {}) => state,
  updateUser,
  updateLogin,
  updatePatient,
  updateAppointment,
  updateBookPrint,
  updateConsultation,
  updatePrescription
});

export default rootReducer;
