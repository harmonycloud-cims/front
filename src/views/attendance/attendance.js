import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableFooter,
  TablePagination,
  TableBody,
  Button,
  InputBase,
  IconButton,
  Paper,
  Dialog,
  Typography
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles/index';
import moment from 'moment';
import { InlineDatePicker } from 'material-ui-pickers';
import timg from '../../images/timg.gif';
import { socketApiUrl } from '../../services/urlApi';

function mapStateToProps(state) {
  return {
    user: state.updateUser.user,
    patientList: state.updatePatient.patientList,
    clinicList: state.updateUser.clinicList,
    encounterList: state.updateUser.encounterList,
    allRoomList: state.updateUser.allRoomList,
    attendanceList: state.updateAppointment.attendanceList,
    attendLoading: state.updateAppointment.attendLoading
  };
}
const style = {
  controller: {
    marginLeft: 8,
    height: 28
  },
  table_header: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(0, 0, 0, 0.7)',
    padding: '0, 0, 0, 10'
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '15px',
    border: '1px solid rgba(0,0,0,0.42)',
    height: 25,
    width: 400
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14
  },
  iconButton: {
    padding: 10
  },
  table_pagination: {
    position: 'absolute',
    right: 0
  }
};

let socket;
class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '0',
      attendanceStatus: 'All',
      date: moment(new Date().getTime()).format('DD MMM YYYY'),
      attendanceList: this.props.attendanceList,
      value: '',
      timer: null,
      rowsPerPage: 10,
      page: 0
    };
  }

  componentDidMount() {
    this.initData();
    this.websocketConnection();
    // let timer = setInterval(() => {
    //   this.initData();
    // }, 60000);
    // this.setState({ timer });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.attendanceList !== this.props.attendanceList) {
      this.setState({ attendanceList: nextProps.attendanceList, value: '' });
    }
  }
  componentWillUnmount() {
    //关闭websocket
    // console.log(socket.readyState, 'close will mount');
    socket && socket.close();
    // if (this.state.timer !== null) {
    //   clearInterval(this.state.timer);
    // }
  }

  websocketConnection = () => {
    if(typeof(WebSocket) === 'undefined') {
      this.props.dispatch({type: 'OPEN_ERROR_MESSAGE', error: 'Your browser does not support WebSocket.'});
    }else{
      // console.log(window.location);
      // let socketUrl=`ws://192.168.2.62:8090/websocket/attendWebsocket/${this.props.user.userId}`;
      let socketUrl=`ws://${socketApiUrl}/websocket/attendWebsocket/${this.props.user.userId}`;
      // let socketUrl=`/websocket/attendWebsocket/${this.props.user.userId}`;
      // socketUrl=socketUrl.replace('https','ws').replace('http','ws');
      socket = new WebSocket(socketUrl);
      //打开事件
      socket.onopen = () => {
        console.log('websocket已打开');
        socket.send('这是来自客户端的消息' + new Date());
      };
      //获得消息事件
      socket.onmessage = (msg) => {
          console.log(msg.data, 'onmessage');
          if(msg.data === 'Success') {
            this.initData();
          }
          //发现消息进入    开始处理前端触发逻辑
      };
      // 关闭事件
      socket.onclose = () => {
          console.log('websocket已关闭', moment().format('YYYY-MM-DD HH:mm:ss'));
      };
      //发生了错误事件
      socket.onerror = () => {
        // socket.open();
        console.log('websocket发生了错误');
      };
      // this.timer = setInterval(() => {
      //   console.log(socket.readyState, 'timing');
      // }, 6000);
    }
  }

  initData = () => {
    const params = {
      appointmentDate: moment(this.state.date, 'DD MMM YYYY').format(
        'YYYY-MM-DD'
      ),
      attendanceStatus: this.state.attendanceStatus,
      roomId: parseInt(this.state.roomId, 10)
    };
    this.props.dispatch({ type: 'GET_ATTENDANCELIST', params });
  };

  changeDate = e => {
    this.setState({ date: moment(e._d).format('DD MMM YYYY') }, () =>
      this.initData()
    );
  };
  changeAttendanceStatus = (e, checked) => {
    if (checked) {
      this.setState({ attendanceStatus: e.target.value }, () =>
        this.initData()
      );
    }
  };
  changeInformation = (e, name) => {
    this.setState({ [name]: e.target.value }, () => this.initData());
  };

  attend = id => {
    const params = { id };
    // 成功后刷新页面
    const params1 = {
      appointmentDate: moment(this.state.date, 'DD MMM YYYY').format(
        'YYYY-MM-DD'
      ),
      attendanceStatus: this.state.attendanceStatus,
      roomId: parseInt(this.state.roomId, 10)
    };
    this.props.dispatch({ type: 'ATTEND', params, params1 });
  };

  handleToggle = e => {
    let value = e.target.value.replace(' ', '');
    value = _.toUpper(value);
    let attend = _.cloneDeep(this.props.attendanceList);
    _.remove(attend, item => {
      return !(
        item.patientDoc.indexOf(value) > -1 ||
        item.patientName.replace(' ', '').indexOf(value) > -1
      );
    });
    this.setState({ value: e.target.value, attendanceList: attend });
  };

  /* table pagination */
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={'detail_warp'}>
        <Grid container>
          <Grid item xs={3}>
            <div className={'f_mt10'}>
              <div>Date</div>
              <Typography
                  component="div"
                  style={{
                    marginLeft: 10,
                    width: 'calc(80% - 2px)',
                    border: '1px solid rgba(0,0,0,0.42)',
                    paddingLeft: 8,
                    height: 31,
                    borderRadius: 2,
                    fontSize: 14
                  }}
              >
                <InlineDatePicker
                    // className={'select_input'}
                    // style={{ marginLeft: 10 }}
                    mask={value =>
                    value
                      ? [
                          /\d/,
                          /\d/,
                          ' ',
                          /[A-Z]/,
                          /[a-z]/,
                          /[a-z]/,
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/
                        ]
                      : []
                    }
                    disableOpenOnEnter
                    format={'DD MMM YYYY'}
                    placeholder={'DD MMM YYYY'}
                    // variant={'outlined'}
                    keyboard
                    children={
                      <input></input>
                    }
                    invalidDateMessage={'輸入的日期無效'}
                    value={moment(this.state.date, 'DD MMM YYYY')}
                    onChange={this.changeDate}
                />
              </Typography>
            </div>
            <div className={'f_mt10'}>
              <div>Attend Status</div>
              <RadioGroup
                  value={this.state.attendanceStatus}
                  onChange={(...arg) => this.changeAttendanceStatus(...arg)}
              >
                <FormControlLabel
                    className={classes.controller}
                    value="All"
                    control={<Radio size={'small'} color={'primary'} />}
                    label="All"
                />
                <FormControlLabel
                    className={classes.controller}
                    value="Attend"
                    control={<Radio size={'small'} color={'primary'} />}
                    label="Attend"
                />
                <FormControlLabel
                    className={classes.controller}
                    value="Not Attend"
                    control={<Radio size={'small'} color={'primary'} />}
                    label="Not Attend"
                />
              </RadioGroup>
            </div>
            <div className={'f_mt10'}>
              <div>Room</div>
              <select
                  className={'select_input'}
                  value={this.state.roomId}
                  onChange={(...arg) => this.changeInformation(...arg, 'roomId')}
              >
                <option value={'0'}> All </option>
                {this.props.allRoomList.map(item => (
                  <option key={item.roomId} value={item.roomId}>
                    {item.roomName}
                  </option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid item xs={9}>
            <Paper className={classes.root} elevation={1}>
              <InputBase
                  className={classes.input}
                  onChange={this.handleToggle}
                  placeholder="Search by ID/ Name"
                  value={this.state.value}
                  onKeyUp={this.handleEnterKey}
              />
              <IconButton
                  onClick={this.search}
                  className={classes.iconButton}
                  aria-label="Search"
                  color={'primary'}
              >
                <Search />
              </IconButton>
            </Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                      style={{ paddingLeft: '15px' }}
                      padding={'none'}
                      className={classes.table_header}
                  >
                    HKIC / Doc. No
                  </TableCell>
                  <TableCell padding={'none'} className={classes.table_header}>
                    English Name
                  </TableCell>
                  <TableCell padding={'none'} className={classes.table_header}>
                    Appointment Time
                  </TableCell>
                  <TableCell padding={'none'} className={classes.table_header}>
                    Arrival Time
                  </TableCell>
                  <TableCell padding={'none'} className={classes.table_header}>
                    Encounter
                  </TableCell>
                  <TableCell padding={'none'} className={classes.table_header}>
                    Room
                  </TableCell>
                  <TableCell padding={'none'} className={classes.table_header}>
                    Attend Status
                  </TableCell>
                  <TableCell padding={'none'} className={classes.table_header}>
                    {' '}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.attendanceList
                  .slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.rowsPerPage * (this.state.page + 1)
                  )
                  .map((item, index) => (
                    <TableRow
                        key={index}
                        style={{
                        backgroundColor:
                          item.patientSex === 'female'
                            ? 'rgba(255,0,0,0.2)'
                            : item.patientSex === 'male'
                            ? '#CFECFA'
                            : 'rgba(255,155,55, 0.4)'
                      }}
                    >
                      <TableCell
                          style={{ padding: '0 6px 0 15px' }}
                          padding={'none'}
                      >
                        {item.patientDoc}
                      </TableCell>
                      <TableCell padding={'none'} style={{padding: '0 6px'}}>
                        {item.patientName}
                      </TableCell>
                      <TableCell padding={'none'} style={{padding: '0 6px'}}>
                        {moment(item.appointmentDate).format(
                          'DD MMM YYYY HH:mm'
                        )}
                      </TableCell>
                      <TableCell padding={'none'} style={{padding: '0 6px'}}>
                        {item.attendanceTime
                          ? moment(item.attendanceTime).format(
                              'DD MMM YYYY HH:mm'
                            )
                          : null}
                      </TableCell>
                      <TableCell padding={'none'} style={{padding: '0 6px'}}>
                        {item.encounterTypeName}
                      </TableCell>
                      <TableCell padding={'none'} style={{padding: '0 6px'}}>{item.roomName}</TableCell>
                      <TableCell padding={'none'} style={{padding: '0 6px'}}>
                        {item.attendanceStatus}
                      </TableCell>
                      <TableCell padding={'none'} style={{padding: '0 6px'}}>
                        {item.attendanceStatus === 'Not Attend' ? (
                          <Button
                              color={'primary'}
                              variant={'outlined'}
                              size={'small'}
                              onClick={() => this.attend(item.appointmentId)}
                          >
                            {' '}
                            Attend{' '}
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                      className={classes.table_pagination}
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={this.state.attendanceList.length}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Grid>
        </Grid>
        <Dialog open={this.props.attendLoading}>
          <img src={timg} alt={''} />
        </Dialog>
      </div>
    );
  }
}
export default connect(mapStateToProps)(withStyles(style)(Attendance));
