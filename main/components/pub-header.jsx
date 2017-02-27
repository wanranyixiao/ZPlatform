import React, { Component } from 'react';
import {Icon,Menu,Input,Badge,message} from '../commoncomponent/common.jsx';
import $ from 'jquery';
export default class ZmitiHeader extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
						<header className="fly-header" >
                    <div className="fly-logo"><a href={window.mainUrl}><img src={this.props.logo} alt=""/></a></div>
                    <div className="fly-nav"><a href={window.mainUrl}>控制平台</a></div>
                    <div className="fly-nav"><a href="#">产品与服务</a></div>
                    {(this.props.usertypesign*1 === window.Role.SUPERADMINUSER||this.props.usertypesign*1 === window.Role.NORMALADMINUSER) && <div className="fly-nav"><a href={window.adminUrl}>系统管理</a></div>}
                    <div className="fly-nav"><a href="#">项目洽谈</a></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div className="fly-search icon">
                        <div onClick={this.logout.bind(this)}><Icon type="logout" /></div>
                    </div>
                    <div className="fly-msg icon">
                        <Badge count={2} overflowCount={9}>
                            <Icon type="mail"/>
                        </Badge>
                        </div>
                    <div className="curAcc">{this.props.currentAcc}</div>
            </header>
		);
	}
	componentWillMount() {
		 window.getCookie = function(cname){
				 var name = cname + "=";  
		    var ca = document.cookie.split(';');  
		    for(var i=0; i<ca.length; i++) {  
		        var c = ca[i];  
		        while (c.charAt(0)==' ') c = c.substring(1);  
		        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);  
		    }  
		    return "";  
			}
	}
	 logout(){//退出登录
    	var s=  this;

    	console.log({
    				userid:s.props.userid,
    				getusersigid:s.props.getusersigid
    			})
    		$.ajax({
    			url:window.baseUrl+'user/user_loginout/',
    			data:{
    				userid:s.props.userid,
    				getusersigid:s.props.getusersigid
    			},
    			success(data){
    				console.log(data);
    				s.clearCookie('login');
    				if(data.getret === 0){
    					
    					message.success(data.getmsg);
    				}
    				window.location.href= window.loginUrl;	
    			}
    		})
    }
    clearCookie (cname){
        var d = new Date();  
		    d.setTime(d.getTime() + (-1*24*60*60*1000));  
		    var expires = "expires="+d.toUTCString();  
		    document.cookie = cname + "=" + '' + "; " + expires+';path=/';  
    }
}

ZmitiHeader.defaultProps={
	logo:'./static/images/logo.png'
}