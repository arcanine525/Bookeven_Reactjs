import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "@fortawesome/fontawesome-free/css/all.min.css";

import "mdbreact/dist/css/mdb.css";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'jquery/dist/jquery.min.js'

import 'antd/dist/antd.css';

import App from './App';

import * as utils from './utils/Utils'

import { createStore } from 'redux'
import myReducer from './reducers/index'
import { Provider } from 'react-redux'

import './styles/index.scss'

const store = createStore(
    myReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

global.$utils = utils
Component.prototype.$utils = global.$utils

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);