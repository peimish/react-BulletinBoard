import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import request from 'superagent'
import { Button } from 'react-bootstrap';
import BBSApp from './component/BBSApp.js';

// --------------------------------------------------------
// 掲示板アプリのClient側
// --------------------------------------------------------
// DOMにメインコンポーネントを書き込む
ReactDOM.render(<BBSApp />, document.getElementById('root'))
