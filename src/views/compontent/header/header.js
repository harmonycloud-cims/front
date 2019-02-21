import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
        user: state.updateUser.user,
    };
}

class CommonHeader extends Component {
    render() {
        return (
            <header className="com-header">
                
            </header>
        );
    }
}

export default withRouter(connect(mapStateToProps)(CommonHeader));