import { combineReducers } from 'redux';
// import * as type from '../actions/ActionsType';

const initState = {
    ifLogin: true,
    clinicList: [],
    user: {} // 登录人的基本信息
};
const updateUser = (state = initState, action = {}) => {
    switch (action.type) {
        case 'UPDATE_LOGIN_USER':
            return {...state, user: action.data, ifLogin: false};
        case 'UPDATE_CLINICLIST':
            return {...state, clinicList: action.data};
        default:
            return state;
    }
};
const rootReducer = combineReducers({
    config: (state = {}) => state,
    updateUser
});

export default rootReducer;
