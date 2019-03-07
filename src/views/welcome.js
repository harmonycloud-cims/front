import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return { user: state.updateUser.user };
}
class Welcome extends Component {
  render() {
    return (
      <div className={'nephele_main_body'}>
        <h1>Welcome {this.props.user.loginName}</h1>
      </div>
    );
  }
}
export default connect(mapStateToProps)(Welcome);
