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
import Assessment from './views/assessment/assessment';
import Investigation from './views/investigation/investigation';
import Result from './views/result/result';

const routes = (
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/consultation" component={Consultation}/>
        <Redirect exact from="/" to="/login"/>
        <Route path="/index" render={() => (
            <IndexWarp>
                <Switch>
                    <Redirect exact from="/index" to="/index/welcome"/>
                    <Route path="/index/welcome" component={Welcome}/>
                    <Route path="/index/register" component={Register}/>
                    <Route path="/index/appointment" component={Appointment}/>
                    <Route path="/index/attendance" component={Attendance}/>
                    <Route path="/index/consultation" component={Consultation}/>
                    <Route path="/index/drug" component={Drug}/>
                    <Route path="/index/assessment" component={Assessment}/>
                    <Route path="/index/investigation" component={Investigation}/>
                    <Route path="/index/result" component={Result}/>
                </Switch>
            </IndexWarp>
        )} />
    </Switch>
);

export default routes;
