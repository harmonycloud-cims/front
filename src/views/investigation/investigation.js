import React, { Component } from 'react';
import {connect} from 'react-redux';

function mapStateToProps(state) {
    return { user: state.updateUser };
}
class Investigation extends Component {
    render() {
        return (
            <div className={'nephele_main_body'}>
                <h1>This is investigation</h1>
            </div>
        );
    }
}
export default connect(mapStateToProps)(Investigation);