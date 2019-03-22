import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommonHeader from './compontent/header/header';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Error, Close } from '@material-ui/icons';

function mapStateToProps(state) {
  return {
    errorMessageStatus: state.updatePrescription.errorMessageStatus,
    errorMessage: state.updatePrescription.errorMessage
  };
}
class IndexWarp extends Component {

  handleClose = () => {
    this.props.dispatch({type: 'CLOSE_ERROR_MESSAGE'});
  }

  render() {
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
            style={{backgroundColor: '#fff', maxWidth: 200, minWidth: 50, color: 'orange'}}
            message={
              <span>
                <Error style={{verticalAlign: 'middle', marginRight: 5}}/>
                {this.props.errorMessage}
                <Close style={{verticalAlign: 'middle', marginLeft: 5}} onClick={this.handleClose}/>
              </span>
            }
        />
        </Snackbar>
      </div>
    );
  }
}
export default connect(mapStateToProps)(IndexWarp);
