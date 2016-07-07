import React from 'react';
import ReactDOM from 'react-dom';
import './static/css/index.min.css';
import MainUI from './components/Main.jsx';
ReactDOM.render(<MainUI isAdmin={false}></MainUI>, document.getElementById('fly-main'));