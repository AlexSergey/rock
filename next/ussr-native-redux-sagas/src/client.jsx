import React from 'react';
import { hydrate, render } from 'react-dom';
import axios from 'axios';
import App from './App';
import { ClientStyles, loadableReady } from '@rock/ussr/client';
import { Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import createStore from './store';

const renderer = !!process.env.FRONT_ONLY ? render : hydrate;
const loadable = !!process.env.FRONT_ONLY ? (fn) => fn() : loadableReady;

loadable(() => {
    const instance = axios.create({
        url: 'http://localhost:6000',
        timeout: 1000
    });

    let store = createStore({
        reduxState: window.REDUX_DATA,
        rest: instance
    });

    return renderer(
        <ClientStyles>
            <Provider store={store}>
                <Router history={createBrowserHistory()}>
                    <App />
                </Router>
            </Provider>
        </ClientStyles>,
        document.getElementById('root')
    );
});
