import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommonHeader from './compontent/header/header';

function mapStateToProps(state) {
    return { user: state.updateUser };
}
class IndexWarp extends Component {
    render() {
        return (
            <div className={'main_body'}>
                <CommonHeader/>
                {this.props.children}
            </div>
        );
    }
}
export default connect(mapStateToProps)(IndexWarp);