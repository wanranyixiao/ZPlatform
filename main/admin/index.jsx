import React from 'react';
import ReactDOM from 'react-dom';
import Icon from  'antd/lib/icon/index';
import Menu  from  'antd/lib/menu';
import Input from  'antd/lib/input';
import Badge from  'antd/lib/badge';
import 'antd/lib/icon/style/css';
import 'antd/lib/menu/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/badge/style/css';
import '../static/css/index.css';
import { Router, Route, hashHistory ,Link ,browserHistory } from 'react-router';
/*browserHistory.push('/user');
browserHistory.push('./admin/company');*/



import AdminIndex from './components/index.jsx';
import ZmitiUserApp from '../user/index.jsx';
import ZmitiCompanyApp from '../company/index.jsx';
import ZmitiSystemApp from '../system/index.jsx';

class App extends React.Component{
    constructor(args) {
      super(...args);
  }

 
	render(){
        return (
             <Router history={hashHistory} >
					    <Route path="/" component={ZmitiUserApp}/>
					    <Route path="/user/" component={ZmitiUserApp}/>
					    <Route path="/company" component={ZmitiCompanyApp}/>
					    <Route path="/system" component={ZmitiSystemApp}/>
					  </Router>
        )
	}
	navigateToPage (){
    this.context.router.push('/user');
  };
  
	componentDidMount() {
	}

}

ReactDOM.render(<App isAdmin={true}></App>, document.getElementById('fly-main'));