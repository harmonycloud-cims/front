import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CommonHeader from './compontent/header/header';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { Error, Close } from '@material-ui/icons';

function mapStateToProps(state) {
  return {
    ifLogin: state.updateUser.ifLogin,
    errorMessageStatus: state.updatePrescription.errorMessageStatus,
    errorMessage: state.updatePrescription.errorMessage
  };
}
class IndexWarp extends Component {
  handleClose = () => {
    this.props.dispatch({ type: 'CLOSE_ERROR_MESSAGE' });
  };

  render() {
    if (!this.props.ifLogin) {
      return <Redirect to={'/'} />;
    }
    return (
      <div className={'main_body'}>
        <CommonHeader />
        <div className={'nephele_main_body'}>{this.props.children}</div>
        <Snackbar
            anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
            open={this.props.errorMessageStatus}
            autoHideDuration={6000}
            onClose={this.handleClose}
        >
          <SnackbarContent
              style={{
              backgroundColor: '#fff',
              maxWidth: 250,
              minWidth: 50,
              color: 'orange'
            }}
              message={
              <span>
                <Error style={{ verticalAlign: 'middle', marginRight: 5 }} />
                {this.props.errorMessage}
              </span>
            }
              action={[
              <IconButton key="action" onClick={this.handleClose}>
                <Close />
              </IconButton>
            ]}
          />
        </Snackbar>
      </div>
    );
  }
}
export default connect(mapStateToProps)(IndexWarp);
