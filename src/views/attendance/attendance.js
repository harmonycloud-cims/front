import React, { Component } from 'react';
import {connect} from "react-redux";

function mapStateToProps(state) {
    return { user: state.updateUser };
}
class Attendance extends Component {
    render() {
        return (
            <div className={'nephele_main_body'}>
                <h1>This is attendance</h1>
            </div>
        );
    }
}
export default connect(mapStateToProps)(Attendance);