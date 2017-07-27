import './static/css/report.css';
import React from 'react';

import {message,Select,Modal,Form,Icon,Input,Button, Row, Col,Table,moment,Checkbox,Radio} from '../commoncomponent/common.jsx';

import $ from 'jquery';

import {ZmitiValidateUser} from '../public/validate-user.jsx';

import ZmitiWenmingAsideBarApp from './header.jsx';


import MainUI from '../components/Main.jsx';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map';

import '../static/echarts/china';

import IScroll from 'iscroll';

 class ZmitiWenmingReportApp extends React.Component{
    constructor(args){
        super(...args);

        this.state = {
           mainHeight:document.documentElement.clientHeight-50,
           appid:'wx32e63224f58f2cb5',
           dataSource:[],
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
        var s = this;
       this.resizeMainHeight(this);
       let  {validateUser,loginOut,resizeMainHeight} = this.props;
        var iNow = 0 ;
        validateUser(()=>{
            loginOut();
        },this);


        resizeMainHeight(this);
        s.bindNewdata();
    }

    render(){


        var title = '身边文明事';
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title'

        },{
            title: '图片',
            dataIndex: 'imageslist',
            key: 'imageslist',
            width:130,
            render:(value,recoder,index)=>{
               if(recoder.imageUrl!=''){
                return <img className='wenming-report-thumbnail' src={recoder.imageUrl}/>
               } 
            }

        },{
            title: '更新时间',
            dataIndex: 'pagetime',
            key: 'pagetime',
            render:(text,recoder,index)=>{
                var d=new Date(text);
                return text;//this.formatDate(d);
            }

        },  {
            title: '操作',
            dataIndex: '',
            key: '',
            width:150,
            render:(text,recoder,index)=>(
                <div className='wenming-report-actbtn'>
                    <Button onClick={this.editData.bind(this,recoder.articlid)}> 编辑</Button>
                    <Button onClick={this.delData.bind(this,recoder.articlid)}> 删除</Button> 
                </div>               
            )

        }]

        var props = {
            title,
            selectedIndex:2,
            mainRight:<div className='wenming-report-main-ui' style={{height:this.state.mainHeight}}>
                        <div className="wenming-report-header">
                            <Row>
                                <Col span={16} className="wenming-report-header-inner">文明播报-身边文明事
                                    
                                </Col>
                                <Col span={8} className='wenming-report-button-right'>
                                    <Button type='primary' onClick={this.goadd.bind(this)}>添加</Button>
                                </Col>
                            </Row>                   
                        </div>
                        <div className="wenming-report-line"></div>
                        <div className='hr15'></div>
                        <Table bordered={true} dataSource={this.state.dataSource} columns={columns} />  
            </div>
        }
        var mainComponent = <div>
            <ZmitiWenmingAsideBarApp {...props}></ZmitiWenmingAsideBarApp>
            
        </div>;
        return (
            <MainUI component={mainComponent}></MainUI>
        );
        
        
    }
    formatDate(now){ 
        var year=now.getYear(); 
        var month=now.getMonth()+1; 
        var date=now.getDate(); 
        var hour=now.getHours(); 
        var minute=now.getMinutes(); 
        var second=now.getSeconds(); 
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
    }
    goadd(){
        window.location='#/wenmingreportadd'
    }

    bindNewdata(){
        var s = this;
        $.ajax({
            type:'POST',
            url:window.baseUrl + 'weixinxcx/get_wmbb/',
            data:{
                userid:s.userid,
                getusersigid:s.getusersigid,
                appid:'wx32e63224f58f2cb5',
                pagenum:10,
            },
            success(data){
                    
                    s.state.dataSource=data.result;
                    console.log(data.result,'data.result');
                    s.forceUpdate();
                
            }
        });
    }
    //编辑
    editData(articlid){
        var s = this;
    }
    //删除
    delData(articlid){
        var s = this;
        /*$.ajax({
            url:window.baseUrl+'',
            type:'POST',
            data:{
                userid:s.userid,
                getusersigid:s.getusersigid,
                articlid:articlid,
            },
            success(data){
                if(data.getret === 0){
                    message.success('删除成功！');
                    setTimeout(()=>{
                        s.bindNewdata();
                    },2000)
                }
                else if(data.getret === -3){
                    message.error('您没有访问的权限,2秒后跳转到首页');
                    setTimeout(()=>{
                        location.href='/';
                    },2000)
                }
                else{
                    message.error(data.getmsg);
                }
            }
        })*/
    }

  
}

export default ZmitiValidateUser(ZmitiWenmingReportApp);