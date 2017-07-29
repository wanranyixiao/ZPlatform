import './static/css/setting.css';
import React from 'react';
import {Switch,message,Select,Modal,Form,Icon,Input,Button, Row, Col,Table,moment,Checkbox,Radio} from '../commoncomponent/common.jsx';

import $ from 'jquery';

import {ZmitiValidateUser} from '../public/validate-user.jsx';

import ZmitiWenmingAsideBarApp from './header.jsx';


import MainUI from '../components/Main.jsx';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import IScroll from 'iscroll';

 class ZmitiWenmingSettingApp extends React.Component{
    constructor(args){
        super(...args);

        this.state = {
           mainHeight:document.documentElement.clientHeight-50,
           appid:window.WENMING.XCXAPPID,
           modpostDialogVisible:false,
           datacheck:true,//数据审核
           messagecheck:true,//评论审核
           classlist:[],
           classname:'',
           classename:'',
           parentclassid:'',
           gettype:'',
        }
        this.currentId = -1;
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
        this.bindtreedata();
       
    }

    render(){


        var title = '身边文明事';
        const formItemLayout = {
           labelCol: {span: 6},
           wrapperCol: {span: 14},
        };
        const radioStyle = {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
        };
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
                                        <td>
                                            <div>
                                            <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.datacheck.bind(this)} defaultChecked={this.state.datacheck} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>评论审核</td>
                                        <td></td>
                                        <td>
                                            <div>
                                            <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.messagecheck.bind(this)} defaultChecked={this.state.messagecheck} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>栏目设置</td>
                                        <td></td>
                                        <td>
                                            <div className='wenming-setting-classlist'>                                                
                                                <ul>
                                                    {this.state.classlist.map((item,i)=>{
                                                        return <li>
                                                                <div className='wenming-setting-classname'>{item.classname}</div>
                                                                <div className='wenming-setting-classact'>
                                                                    <Button icon="edit" />
                                                                    <Button icon="close" onClick={this.deletetype.bind(this,item.classid)} />
                                                                </div>
                                                            </li>
                                                    })}                                                   
                                                </ul>
                                                <div className='wenming-setting-classact'>
                                                    <Button onClick={this.postform.bind(this)}><Icon type="folder-add" />增加</Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Modal title="栏目设置" visible={this.state.modpostDialogVisible}
                            onOk={this.addtype.bind(this)}
                            onCancel={()=>{this.setState({modpostDialogVisible:false})}}
                        >
                            <Form>
                              <FormItem
                                {...formItemLayout}
                                label="名称"
                                hasFeedback
                              >                        
                                  
                                  <Input placeholder="栏目名称" 
                                    value={this.state.classname}
                                    onChange={(e)=>{this.state.classname=e.target.value;this.forceUpdate();}}
                                  />                      
                              </FormItem>
                              <FormItem
                                {...formItemLayout}
                                label="英文名称"
                                hasFeedback
                              >                        
                                  
                                  <Input placeholder="栏目英文名称" 
                                    value={this.state.classename}
                                    onChange={(e)=>{this.state.classename=e.target.value;this.forceUpdate();}}
                                  />                      
                              </FormItem>
                              <FormItem
                                {...formItemLayout}
                                label="展示方式"
                                hasFeedback
                              >                        
                                  
                                <RadioGroup onChange={(e)=>{this.state.gettype=e.target.value;this.forceUpdate();}} value={this.state.gettype}>
                                    <Radio  style={radioStyle} value={0}>只首页调用</Radio>
                                    <Radio  style={radioStyle} value={1}>子页调用</Radio>
                                    <Radio  style={radioStyle} value={2}>首页与子页都可调用</Radio>
                                </RadioGroup>                     
                              </FormItem>
                            </Form>
                      </Modal>
                    </div>
                    
                    
        }
        var mainComponent = <div>
            <ZmitiWenmingAsideBarApp {...props}></ZmitiWenmingAsideBarApp>
            
        </div>;
        return (
            <MainUI component={mainComponent}></MainUI>
        );
        
        
    }
    //数据审核
    datacheck(checked){
        
        console.log(checked,'datacheck');
    }
    //评论审核
    messagecheck(checked){
        
        console.log(checked,'messagecheck');
    }
    //栏目
    bindtreedata(){
        var s = this;
        $.ajax({
            url:window.baseUrl+'weixinxcx/search_articleclass',
            type:'POST',
            data:{
                userid:s.userid,
                getusersigid:s.getusersigid,
                appid:s.state.appid,
            },
            success(data){
                if(data.getret === 0){
                    console.log(data.list,'mytree');
                    s.state.classlist=data.list;                    
                    s.forceUpdate();
                }
            }
        }) 
    }
    //添加栏目
    addtype(){
        var s = this;
        $.ajax({
            url:window.baseUrl+'weixinxcx/add_articleclass/',
            type:'POST',
            data:{
                userid:s.userid,
                getusersigid:s.getusersigid,
                appid:s.state.appid,
                classname:s.state.classname,
                classename:s.state.classename,
                gettype:s.state.gettype,
            },
            success(data){
                message[data.getret === 0 ? 'success':'error'](data.getmsg);
                //console.log(data,'add-mytree');
                s.setState({
                    modpostDialogVisible:false,
                })
                s.bindtreedata();                
                s.forceUpdate();                
            }
        }) 
    }
    //删除栏目
    deletetype(classid){
        var s = this;
        $.ajax({
            url:window.baseUrl+'weixinxcx/del_articleclass/',
            type:'POST',
            data:{
                userid:s.userid,
                getusersigid:s.getusersigid,
                appid:s.state.appid,
                classid:classid,
            },
            success(data){
                message[data.getret === 0 ? 'success':'error'](data.getmsg);
                s.bindtreedata();                
                s.forceUpdate();          
            }
        }) 
    }
    postform(){
        var s=this;
        this.currentId=-1;
        this.setState({
            modpostDialogVisible:true,
        })
        s.forceUpdate();
    }

    



   

  
}

export default ZmitiValidateUser(ZmitiWenmingSettingApp);
