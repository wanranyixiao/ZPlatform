import './static/css/setting.css';
import React from 'react';
import {message,Select,Modal,Form,Icon,Input,Button, Row, Col,Table,moment,Checkbox,Radio} from '../commoncomponent/common.jsx';

import $ from 'jquery';

import {ZmitiValidateUser} from '../public/validate-user.jsx';

import ZmitiWenmingAsideBarApp from './header.jsx';


import MainUI from '../components/Main.jsx';


import IScroll from 'iscroll';

 class ZmitiWenmingSettingApp extends React.Component{
    constructor(args){
        super(...args);

        this.state = {
           mainHeight:document.documentElement.clientHeight-50,
           appid:window.WENMING.XCXAPPID,
        }
    }

    componentWillMount() {

        let {resizeMainHeight,popNotice,validateUser,loginOut,validateUserRole,isSuperAdmin,isNormalAdmin,getUserDetail,listen,send} = this.props;
        var {userid, getusersigid, companyid,username,isover,usertypesign}=validateUser(()=>{
                loginOut('登录失效，请重新登录',window.loginUrl,false);
            },this);

        var visit = false;
        window.WENMING.VISITUSERS.forEach((item,i)=>{
            if(item === username){
                visit = true;
                return;
            }
        });
        if(!visit){
            loginOut('您没有访问的权限',window.mainUrl,true);//不是hash跳转。location.href跳转
        }
        this.loginOut = loginOut;
        this.listen = listen;
        this.send = send;
        this.popNotice = popNotice;
        this.isSuperAdmin = isSuperAdmin;
        this.isNormalAdmin = isNormalAdmin;
        this.validateUserRole = validateUserRole;
        this.getUserDetail = getUserDetail;
        this.resizeMainHeight = resizeMainHeight;
    }
    componentDidMount(){
       this.resizeMainHeight(this);
       let  {validateUser,loginOut,resizeMainHeight} = this.props;
        var iNow = 0 ;
        validateUser(()=>{
            loginOut();
        },this);


        resizeMainHeight(this);
       
    }

    render(){


        var title = '身边文明事';
        const columns = [{
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        }, {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a href="#">Action 一 {record.name}</a>
              <span className="ant-divider" />
              <a href="#">Delete</a>
              <span className="ant-divider" />
              <a href="#" className="ant-dropdown-link">
                More actions <Icon type="down" />
              </a>
            </span>
          ),
        }];
        var props = {
            title,
            selectedIndex:4,
            mainRight:<div className='wenming-setting-main-ui' style={{height:this.state.mainHeight}}>
                        
                        <div className="wenming-setting-header">
                            <Row>
                                <Col span={16} className="wenming-setting-header-inner">通用设置-身边文明事
                                    
                                </Col>
                                <Col span={8} className='wenming-setting-button-right'>
                                    
                                </Col>
                            </Row>
                            <div className="clearfix"></div>                 
                        </div>
                        <div className="wenming-setting-line"></div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>名称</th>
                                        <th></th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>数据审核</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
        }
        var mainComponent = <div>
            <ZmitiWenmingAsideBarApp {...props}></ZmitiWenmingAsideBarApp>
            
        </div>;
        return (
            <MainUI component={mainComponent}></MainUI>
        );
        
        
    }

    



   

  
}

export default ZmitiValidateUser(ZmitiWenmingSettingApp);
