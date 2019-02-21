import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommonHeader from './components/header/Header';

function mapStateToProps(state) {
    return { user: state.updateUser };
}
class IndexWarp extends Component {
    render() {
        return (
            <div className="nephele-main">
                <CommonHeader/>
                <div className="nephele-main-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps)(IndexWarp);