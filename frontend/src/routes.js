import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Submit from './pages/Submit';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/' component={Submit}/>
        </Switch>
    </BrowserRouter>
);

export default Routes;
