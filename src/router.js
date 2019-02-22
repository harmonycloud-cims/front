import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Login from './views/login/login';
import IndexWarp from './views/index';
import Welcome from './views/welcome';
import Register from './views/regist/register';
import Appointment from './views/appointment/appointment';
import Attendance from './views/attendance/attendance';
import Consultation from './views/consultation/consultation';
import Drug from './views/drug/drug';

const routes = (
    <Switch>
        <Route path="/login" component={Login}/>
        <Redirect exact from="/" to="/login"/>
        <Route path="/index" render={(props) => (
            <IndexWarp>
                <Switch>
                    <Redirect exact from="/index" to="/index/welcome"/>
                    <Route path="/index/welcome" component={Welcome}/>
                    <Route path="/index/register" component={Register}/>
                    <Route path="/index/appointment" component={Appointment}/>
                    <Route path="/index/attendance" component={Attendance}/>
                    <Route path="/index/consultation" component={Consultation}/>
                    <Route path="/index/drug" component={Drug}/>
                </Switch>
            </IndexWarp>
        )} />
    </Switch>
);

export default routes;
