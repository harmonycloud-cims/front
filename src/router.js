import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// import Bundle from './bundle';

import Login from './views/login/login';
import Register from './views/regist/register';

const routes = (
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/regist" component={Register}/>
        <Redirect exact from="/" to="/login"/>
        {/* <Route path="/index" render={(props) => (
            <IndexWarp>
                <Switch>
                    <Redirect exact from="/index" to="/index/applist"></Redirect>
                    <Route path="/index/applist" component={AppIndex} />
                </Switch>
            </IndexWarp>
        )} /> */}
    </Switch>
);

export default routes;
