import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
// import * as type from '../actions/ActionsType';

const initState = {
    clinicList: [],
    user: {}
};
const updateUser = handleActions({
    'UPDATE_LOGIN_USER'(state, action) {
        return { ...state, user: action.payload};
    },
    'UPDATE_CLINICLIST'(state, action) {
        return { ...state, clinicList: action.payload};
    }
}, initState);

const rootReducer = combineReducers({
    config: (state = {}) => state,
    updateUser
});

export default rootReducer;
