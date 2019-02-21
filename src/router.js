import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// import Bundle from './bundle';

import Login from './views/login/login';
import IndexWarp from './views/compontent/header/header';
import Register from './views/regist/register';

const routes = (
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Redirect exact from="/" to="/login"/>
        <Route path="/index" render={(props) => (
            <IndexWarp>
                <Switch>
                    <Redirect exact from="/index" to="/index/register"/>
                    <Route path="/index/register" component={Register}/>
                </Switch>
            </IndexWarp>
        )} />
    </Switch>
);

export default routes;
