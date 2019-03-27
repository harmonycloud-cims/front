import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return { user: state.updateUser.user };
}
class Welcome extends Component {
  componentDidMount() {
    this.initData();
  }
  initData = () => {
    let socket;
    if(typeof(WebSocket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket');
    }else{
        console.log('您的浏览器支持WebSocket');
        let socketUrl=`ws://10.10.103.61:33010/appointment/attendWebsocket/${this.props.user.userId}`;
        console.log(socketUrl);
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = () => {
            console.log('websocket已打开');
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        // //获得消息事件
        // socket.onmessage = function(msg) {
        //     console.log(msg.data);
        //     //发现消息进入    开始处理前端触发逻辑
        // };
        // //关闭事件
        // socket.onclose = function() {
        //     console.log('websocket已关闭');
        // };
        // //发生了错误事件
        // socket.onerror = function() {
        //     console.log('websocket发生了错误');
        // };
    }
  }
  render() {
    return (
      <div className={'nephele_main_body'}>
        <h1>Welcome {this.props.user.loginName}</h1>
      </div>
    );
  }
}
export default connect(mapStateToProps)(Welcome);
