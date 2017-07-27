import './static/css/add.css';
import React from 'react';
import {message,Select,Modal,Form,Icon,Input,Button, Row, Col,Table,moment,Checkbox,Radio} from '../commoncomponent/common.jsx';

import $ from 'jquery';

import {ZmitiValidateUser} from '../public/validate-user.jsx';

import ZmitiWenmingAsideBarApp from './header.jsx';


import MainUI from '../components/Main.jsx';
import ZmitiUploadDialog from '../components/zmiti-upload-dialog.jsx';

import IScroll from 'iscroll';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TextArea = Input;
 class ZmitiWenmingReportaddApp extends React.Component{
    constructor(args){
        super(...args);

        this.state = {
           mainHeight:document.documentElement.clientHeight-50,
           showCredentialsDiolog:false,
           classid:'A7CZ1YE3',
           appid:window.WENMING.XCXAPPID,
           content:'',
           title:'',
           wxopenid:'oX4P90P4kCl3_5JLOYJyOx1bxISg',//oX4P90P4kCl3_5JLOYJyOx1bxISg//oSDVUs-aeHSvmJl9uk1Yq7iTeOyk
           imageslist:'',
           source:'',
           type:3,
           ishost:0,
           voidurl:'',
           longitude:'',
           latitude:'',
        }
          this.handleChange = (info) => {
            let fileList = info.fileList;

            // 1. Limit the number of uploaded files
            //    Only to show two recent uploaded files, and old ones will be replaced by the new
            fileList = fileList.slice(-2);

            // 2. read from response and show file link
            fileList = fileList.map((file) => {
              if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
              }
              return file;
            });

            // 3. filter successfully uploaded files according to response from server
            fileList = fileList.filter((file) => {
              if (file.response) {
                return file.response.status === 'success';
              }
              return true;
            });

            this.setState({ fileList });
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
        var {userid, getusersigid, companyid,username,isover,usertypesign,capacitied,capacity,endDate}=validateUser(()=>{
          loginOut();
       },this);


        resizeMainHeight(this);
       
    }

    render(){
        var s =this;
        const { disabled } = s.state;
        const userProps ={
            documentbaseUrl: window.baseUrl,
            getusersigid: s.getusersigid,
            userid: s.userid,
            onFinish(imgData){
                s.state.userData.credentials.push({src:imgData.src});
                s.forceUpdate();
            }
        }
        const uploadColumns=[{
            title: '上传名称',
            dataIndex: 'filename',
            key: 'filename',
        },{
            title: '文件大小',
            dataIndex: 'datainfosize',
            key: 'datainfosize',
       },{
            title: '文件路径',
            dataIndex: 'datainfourl',
            key: 'datainfourl',
            className:'hidden',
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render:(text,recoder,index)=>(
                <span className="workorder-del"><a href="javascript:void(0);" onClick={this.delUploadfile.bind(this,recoder,index)}> 删除</a></span>
            )
        }];
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
          },
        };
        const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 14,
              offset: 6,
            },
          },
        };

        var title = '身边文明事';

        var props = {
            userid:s.userid,
            getusersigid: s.getusersigid,
            onFinish(imgData){
                s.state.imageslist = imgData.src;
                s.forceUpdate();
            },
            title,
            selectedIndex:100,
            mainRight:<div className='wenming-add-main-ui' style={{height:this.state.mainHeight}}>
                        <div className="wenming-add-header">
                            <Row>
                                <Col span={16} className="wenming-add-header-inner">添加-文明播报
                                    
                                </Col>
                                <Col span={8} className='wenming-add-button-right'>
                                <Button type='primary' onClick={this.goback.bind(this)}>返回</Button>
                                </Col>
                            </Row>  
                            <div className='clearfix'></div>                    
                        </div>
                        <div className="wenming-add-line"></div>
                        <div className='wenming-add-form'>
                             <Form>
                                <FormItem
                                {...formItemLayout}
                                label="标题"
                                hasFeedback
                                >                        
                                  
                                  <Input placeholder="标题" 
                                    value={this.state.title}
                                    onChange={(e)=>{this.state.title=e.target.value;this.forceUpdate();}}
                                  />                      
                                </FormItem>



                                <FormItem
                                {...formItemLayout}
                                label="内容"
                                hasFeedback
                                >                        
                                  
                                  <textArea rows='5' placeholder="内容" 
                                    value={this.state.content}
                                    onChange={(e)=>{this.state.content=e.target.value;this.forceUpdate();}}
                                  />                    
                                </FormItem>
                                

                                <FormItem
                                {...formItemLayout}
                                label="图片"
                                hasFeedback
                                >                        
                                  
                                    <Button onClick={this.changePortrait.bind(this)}>选择图片</Button>                 
                                    <img src={this.state.imageslist}/>
                                </FormItem>
                                <FormItem
                                {...formItemLayout}
                                label="来源"
                                hasFeedback
                                >                        
                                  
                                  <Input placeholder="来源" 
                                    value={this.state.source}
                                    onChange={(e)=>{this.state.source=e.target.value;this.forceUpdate();}}
                                  />                      
                                </FormItem>
                                <FormItem
                                {...formItemLayout}
                                label="推荐"
                                hasFeedback
                                >                        
                                  
                                  
                                    <RadioGroup onChange={(e)=>{this.state.ishost=e.target.value;this.forceUpdate();}} value={this.state.ishost}>
                                        <Radio value={0}>普通</Radio>
                                        <Radio value={1}>推荐</Radio>
                                    </RadioGroup>
                                                      
                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                  <Button type="primary" onClick={this.addProduct.bind(this)}>提交</Button>
                                </FormItem>
                            </Form>

                        </div>
                    </div>
                    
        }
        var mainComponent = <div>
            {!this.state.showCredentialsDiolog && <ZmitiUploadDialog id="personAcc" {...props}></ZmitiUploadDialog>}
        
            <ZmitiWenmingAsideBarApp {...props}></ZmitiWenmingAsideBarApp>
            
        </div>;
        return (
            <MainUI component={mainComponent}></MainUI>
        );
        
        
    }
    goback(){
        window.location='#/wenmingreport';
    }
    //更换图片
    changePortrait(){

        var obserable=window.obserable;
        this.setState({
          showCredentialsDiolog:false
        },()=>{
          obserable.trigger({
              type:'showModal',
              data:{type:0,id:'personAcc'}
          })  
        })
        
    }
    addProduct(){//添加
        var s = this;
        var userid = this.props.params.userid?this.props.params.userid:this.userid;
        //判断是否有附件
        var attachment="";
        /*if(s.state.imageslist.length>0) {
            attachment=s.state.imageslist[0].datainfourl;
            for(var i=1;i<s.state.imageslist.length;i++){
                    attachment=attachment + "," +s.state.imageslist[i].datainfourl;
            }
        }*/
        var params = {
            userid:s.userid,
            getusersigid:s.getusersigid,
            classid:s.state.classid,
            appid:s.state.appid,
            content:s.state.content,    
            title:s.state.title,
            wxopenid:s.state.wxopenid,
            imageslist:s.state.imageslist,
            source:s.state.source,
            type:s.state.type,
            ishost:s.state.ishost,
            voidurl:s.state.voidurl,
            longitude:s.state.longitude,
            latitude:s.state.latitude,
        }
        $.ajax({
            type:'POST',
            url:window.baseUrl + 'weixinxcx/append_article/',
            data:params,
            success(data){
                    message[data.getret === 0 ? 'success':'error'](data.getmsg);
                    s.setState({
                        classid:s.state.classid,
                        appid:window.WENMING.XCXAPPID,
                        content:'',
                        title:'',
                        wxopenid:'oSDVUs-aeHSvmJl9uk1Yq7iTeOyk',//
                        imageslist:[],
                        source:'',
                        type:3,
                        ishost:0,
                        voidurl:'',
                        longitude:'',
                        latitude:'',
                    })
                
            }
        });
    }
  
}

export default ZmitiValidateUser(ZmitiWenmingReportaddApp);