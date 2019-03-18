import React, { Component } from 'react';
import {Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ha from '../../images/ha.jpg';
import JsBarcode from 'jsbarcode';
import moment from 'moment';
import { documentMap } from '../../services/staticData';

const style = {
  print: {
    margin: 20,
    border: '1px solid',
    width: 800
  },
  print_title: {
    padding: 10,
    height: 100,
    borderBottom: '1px solid'
  },
  print_title_image: {
    width: 150,
    height: 100,
    float: 'left'
  },
  print_title_right: {
    height: 100,
    width: 500,
    float: 'left',
    textAlign: 'center'
  },
  print_title_tel: {
    width: 100,
    float: 'left',
    height: 20,
    paddingTop: 80
  },
  print_information: {
    height: 340
  },
  print_information_left: {
    paddingLeft: 40,
    width: 600,
    height: 340,
    float: 'left'
  },
  print_information_right:{
    height: 340,
    float: 'left'
  },
  table_float_right: {
    float: 'right'
  },
  table_padding20: {
    paddingLeft: 20
  },
  table_margin_top: {
    marginTop: 30
  },
  print_information_right_barcode: {
    margin: '95px 0 10px 0',
    textAlign: 'center'
  },
  print_information_right_only: {
    width: 159,
    borderLeft: '1px solid',
    borderTop: '1px solid',
    height: 160,
    textAlign: 'center'
  },
  print_information_right_only_title: {
    borderBottom: '1px solid'
  }
};
const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
class Print extends Component {
  componentDidMount() {
    JsBarcode(this.barcode, this.props.print.patientId, {
      displayValue: false,
      width: 1,
      height: 30,
      margin: 0
    });
  }
  render() {
    const { classes, print, patient } = this.props;
    return (
      <Typography component="div" className={classes.print} >
        <Typography component="div" className={classes.print_title}>
          <Typography component="div" className={classes.print_title_image}>
            <img src={ha} alt={''} style={{width: 80}} />
          </Typography>
          <Typography component="div" className={classes.print_title_right}>
            <Typography className={classes.print_title_right_content}>公務員診所</Typography>
            <Typography className={classes.print_title_right_content}>Families Clinic</Typography>
            <Typography className={classes.print_title_right_content}>覆診預約便條 - Appointment Slip</Typography>
            <Typography className={classes.print_title_right_content} style={{fontWeight: 500}}>九龍公務員診所紅磡庇利街42號九龍城健康中心6樓</Typography>
            <Typography className={classes.print_title_right_content}>6/F, Kowloon City Health Center 42 Bailey Street, Hung Hom</Typography>
          </Typography>
          <Typography component="div" className={classes.print_title_tel}>Tel: 23882102</Typography>
        </Typography>
        <Typography component="div" className={classes.print_information}>
          <Typography component="div" className={classes.print_information_left}>
            <table>
              <tbody>
                  <tr>
                      <td>
                        <Typography style={{paddingLeft: 10}} component="div" className={classes.table_float_right}>:</Typography>
                        <Typography component="div" className={classes.table_float_right}>
                          <Typography component="div" className={classes.table_float_right}>日期</Typography>
                          <Typography component="div">[Date]</Typography>
                        </Typography>
                      </td>
                      <td className={classes.table_padding20}>{moment(print.appointmentDate).format('YYYY')}</td>
                      <td className={classes.table_padding20}>年<br/>[Year]</td>
                      <td className={classes.table_padding20}>{moment(print.appointmentDate).format('MM')}</td>
                      <td className={classes.table_padding20}>月<br/>[Month]</td>
                      <td className={classes.table_padding20}>{moment(print.appointmentDate).format('DD')}</td>
                      <td className={classes.table_padding20}>日<br/>[Day]</td>
                      <td className={classes.table_padding20}>({week[moment(print.appointmentDate).format('d')]})<br/>({moment(print.appointmentDate).format('dddd')})</td>
                  </tr>
                  <tr>
                      <td className={classes.table_tr_params}>
                        <Typography style={{paddingLeft: 10}} component="div" className={classes.table_float_right}>:</Typography>
                        <Typography component="div" className={classes.table_float_right}>
                          <Typography component="div" className={classes.table_float_right}>登記時間</Typography>
                          <Typography component="div">[Registration]</Typography>
                        </Typography>
                      </td>
                      <td className={classes.table_padding20}>{moment(print.appointmentDate).format('A') === 'AM' ? '上午' : '下午'}<br/>({moment(print.appointmentDate).format('A')})</td>
                      <td className={classes.table_padding20}>{moment(print.appointmentDate).format('HH')}</td>
                      <td className={classes.table_padding20}>時<br/>[Hour]</td>
                      <td className={classes.table_padding20}>{moment(print.appointmentDate).format('mm')}</td>
                      <td className={classes.table_padding20}>分<br/>[Minute]</td>
                  </tr>
                  <tr>
                    <td className={classes.table_tr_params}>
                        <Typography style={{paddingLeft: 10}} component="div" className={classes.table_float_right}>:</Typography>
                        <Typography component="div" className={classes.table_float_right}>
                          <Typography component="div" className={classes.table_float_right}>姓名</Typography>
                          <Typography component="div">[Name]</Typography>
                        </Typography>
                      </td>
                    <td colSpan={3} className={classes.table_padding20}>{patient.chineseName}<br/>{patient.englishSurname}, {patient.englishGivenName}</td>
                  </tr>
                  <tr>
                    <td className={classes.table_tr_params}>
                      <Typography style={{paddingLeft: 10}} component="div" className={classes.table_float_right}>:</Typography>
                        <Typography component="div" className={classes.table_float_right}>
                          <Typography component="div" className={classes.table_float_right}>性别</Typography>
                          <Typography component="div">[Sex]</Typography>
                      </Typography>
                    </td>
                    <td colSpan={3} className={classes.table_padding20}>{patient.sex === 'male' ? '男' : (patient.sex === 'female' ? '女' : '未知')}<br/>({patient.sex})</td>
                    <td className={classes.table_padding20}>
                      <Typography style={{paddingLeft: 10}} component="div" className={classes.table_float_right}>:</Typography>
                      <Typography component="div" className={classes.table_float_right}>
                        <Typography component="div" className={classes.table_float_right}>年齡</Typography>
                        <Typography component="div">[Age]</Typography>
                      </Typography>
                    </td>
                    <td className={classes.table_padding20}>{moment().diff(patient.dateOfBirth,'years')}Y</td>
                  </tr>
                  <tr>
                    <td className={classes.table_tr_params}>
                      <Typography style={{paddingLeft: 10}} component="div" className={classes.table_float_right}>:</Typography>
                      <Typography component="div" className={classes.table_float_right}>
                        <Typography component="div" className={classes.table_float_right}>證件類型</Typography>
                        <Typography component="div">[Type of Doc]</Typography>
                      </Typography>
                    </td>
                    <td colSpan={3} className={classes.table_padding20}>{documentMap[patient.documentType]}<br/>({patient.documentType})</td>
                  </tr>
                  <tr>
                    <td className={classes.table_tr_params}>
                    <Typography style={{paddingLeft: 10}} component="div" className={classes.table_float_right}>:</Typography>
                      <Typography component="div" className={classes.table_float_right}>
                        <Typography component="div" className={classes.table_float_right}>證件號碼</Typography>
                        <Typography component="div">[Doc No]</Typography>
                      </Typography>
                    </td>
                    <td colSpan={3} className={classes.table_padding20}>{patient.documentNumber}</td>
                  </tr>
                  <tr>
                    <td className={classes.table_tr_params}>
                    <Typography style={{paddingLeft: 10}} component="div" className={classes.table_float_right}>:</Typography>
                      <Typography component="div" className={classes.table_float_right}>
                        <Typography component="div" className={classes.table_float_right}>門診號碼：</Typography>
                      </Typography>
                    </td>
                  </tr>
              </tbody>
            </table>
            <Typography className={classes.table_margin_top}>Remark:</Typography>
          </Typography>
          <Typography component="div" className={classes.print_information_right}>
            <Typography component="div" className={classes.table_padding20}>{print.encounterTypeName} - <br/>{print.roomName}</Typography>
            <Typography component="div" className={classes.print_information_right_barcode}><svg ref={(ref) => {this.barcode = ref;}}/></Typography>
            <Typography component="div" className={classes.print_information_right_only}>
              <Typography component="div" className={classes.print_information_right_only_title}>
                內部專用<br/> For internal only
              </Typography>
              <Typography component="div" className={classes.print_information_right_only_content} />
            </Typography>
          </Typography>
        </Typography>
      </Typography>
    );
  }
}
export default withStyles(style)(Print);
