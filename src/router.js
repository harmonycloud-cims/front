import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Bundle from './bundle';

import Login from './views/login/login';
import IndexWarp from './views/index';
import Print from './views/appointment/print';

// import Welcome from './views/welcome';
// import Register from './views/regist/register';
// import Appointment from './views/appointment/appointment';
// import Attendance from './views/attendance/attendance';
// import Consultation from './views/consultation/consultation';
// import Drug from './views/drug/drug';
// import Assessment from './views/assessment/assessment';
// import Investigation from './views/investigation/investigation';
// import Result from './views/result/result';

const Welcome = props => (
  <Bundle load={() => import('./views/welcome')}>
    {Welcome => <Welcome {...props} />}
  </Bundle>
);
const Register = props => (
  <Bundle load={() => import('./views/regist/register')}>
    {Register => <Register {...props} />}
  </Bundle>
);
const Appointment = props => (
  <Bundle load={() => import('./views/appointment/appointment')}>
    {Appointment => <Appointment {...props} />}
  </Bundle>
);
const Attendance = props => (
  <Bundle load={() => import('./views/attendance/attendance')}>
    {Attendance => <Attendance {...props} />}
  </Bundle>
);
const Consultation = props => (
  <Bundle load={() => import('./views/consultation/consultation')}>
    {Consultation => <Consultation {...props} />}
  </Bundle>
);
const Drug = props => (
  <Bundle load={() => import('./views/drug/drug')}>
    {Drug => <Drug {...props} />}
  </Bundle>
);
const Assessment = props => (
  <Bundle load={() => import('./views/assessment/assessment')}>
    {Assessment => <Assessment {...props} />}
  </Bundle>
);
const Investigation = props => (
  <Bundle load={() => import('./views/investigation/investigation')}>
    {Investigation => <Investigation {...props} />}
  </Bundle>
);
const Result = props => (
  <Bundle load={() => import('./views/result/result')}>
    {Result => <Result {...props} />}
  </Bundle>
);
const routes = (
  <Switch>
    <Route path="/login" component={Login} />
    <Redirect exact from="/" to="/login" />
    <Route path="/print" component={Print} />
    <Route
        path="/index"
        render={() => (
        <IndexWarp>
          <Switch>
            <Redirect exact from="/index" to="/index/welcome" />
            <Route path="/index/welcome" component={Welcome} />
            <Route path="/index/register" component={Register} />
            <Route path="/index/appointment" component={Appointment} />
            <Route path="/index/attendance" component={Attendance} />
            <Route path="/index/consultation" component={Consultation} />
            <Route path="/index/drug" component={Drug} />
            <Route path="/index/assessment" component={Assessment} />
            <Route path="/index/investigation" component={Investigation} />
            <Route path="/index/result" component={Result} />
          </Switch>
        </IndexWarp>
      )}
    />
  </Switch>
);

export default routes;
