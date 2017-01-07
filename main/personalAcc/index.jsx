import React  from 'react';
import ReactDOM from 'react-dom';
import './static/css/index.css';
import $ from 'jquery';


import {Modal,Input,Tabs,Select,Button,Form,message,Tag} from '../commoncomponent/common.jsx';

const FormItem = Form.Item;
const CheckableTag = Tag.CheckableTag;

import ZmitiUploadDialog from '../components/zmiti-upload-dialog.jsx';

import ZmitiProgress from '../components/Progress.jsx';
import ZmitiScan from '../components/scan.jsx';
import './static/css/component.min.css';
import ZmitiCard from '../components/cardgroup.jsx';
import MainUI from '../components/Main.jsx';
import {ZmitiValidateUser} from '../public/validate-user.jsx';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
class ZmitiPersonalAccApp extends React.Component{
    constructor(args){
        super(...args);
        this.state =
        {
            mainHeight:document.documentElement.clientHeight-50,
            showCredentialsDiolog:false,
            isExpire:false,//是否过期
            isFullSpace:false,//使用空间是否已满
            oldPwd:'',
            newPwd:'',
            surePwd:'',
            userData:{
                portrait:'./personalAcc/static/images/user.jpg',//用户头像
                username:'',//用户名
                useremail:'',
                usermobile:'',
                departmentname:'麟腾传媒文化有限公司',
                departmentid:'',
                companyid:'',
                companyname:'',
                customername:'',//用户真实姓名
                usersex:'',//用户性别
                useremergencycontacter:'',//紧急联系人
                useremergencycontactmobile:'',//紧急联系人电话/
                credentials:[

                ],//用户证件照片
              
                expiredate:'2016-12-13',//过期时间/
                currentVal:50,//进度条当前值,用户试用期总时间
                maxVal:100,//进度最大值,已使用的时间 (两个数据无关紧要,我最终要根据两个数据算出比例.)
            },
            modifyUserPwdDialogVisible:false,
        }
    }

    componentWillMount() {
       let {validateUser, loginOut,resizeMainHeight,getUserDetail,validateUserRole,isSuperAdmin,isNormalAdmin} = this.props;
       var {userid, getusersigid, companyid,username,isover,usertypesign,capacitied,capacity,endDate}=validateUser(()=>{
          loginOut();
       },this);

       this.getUserDetail = getUserDetail;
       this.validateUserRole=  validateUserRole;
       this.loginOut = loginOut;
       this.isSuperAdmin = isSuperAdmin;
       this.isNormalAdmin = isNormalAdmin;
       resizeMainHeight(this);
    }

    componentDidMount(){

      this.setState({
        userName:this.username
      });

      var s = this;

      this.validateUserRole(this,obj=>{
          if(!s.isSuperAdmin(this) && !s.isNormalAdmin(this)){//不是管理员，也不是超级管理员
                s.setState({
                  isExpire:obj.isExpire,
                  isFullSpace:obj.isFullSpace,
                  msg:obj.msg
                });
            }
      })


      window.obserable.on('modifyUesrCredentials',()=>{
        this.modifyUesrCredentials();
      });

      window.obserable.on('removeCredentials',(data)=>{
          this.state.userData.credentials.splice(data,1);
          this.forceUpdate();
      });


      var userid = this.props.params.userid?this.props.params.userid:this.userid;
      this.validateUserRole(this,()=>{
         this.setState({
          isExpire:this.isExpire,
          isFullSpace:this.isFullSpace
         })
      });
      this.getUserDetail({
        $:$,
        userid:s.userid,
        getusersigid:s.getusersigid,
        setuserid : userid,
        sussess:(data)=>{
          if(data.getret === 0){

            /*
            
       userData:{
                portrait:'./personalAcc/static/images/user.jpg',//用户头像
            },
             */
            var da = data.getuserinfo;

            console.log(data)

            s.state.userData={
                portrait:da.portrait||'./personalAcc/static/images/user.jpg',
                username:da.username,//用户名
                useremail:da.useremail,
                usermobile:da.usermobile,
                departmentname:da.departmentname,
                departmentid:da.departmentid,
                companyid:da.companyid,
                companyname:da.companyname,
                customername:da.customername,//用户真实姓名
                usersex:da.usersex,//用户性别
                useremergencycontacter:da.useremergencycontacter,//紧急联系人
                useremergencycontactmobile:da.useremergencycontactmobile,//紧急联系人电话/
                credentials:da.credentials,//用户证件照片
                expiredate:s.endDate,//过期时间/
                currentVal:parseFloat(s.capacitied),//进度条当前值,用户试用期总时间
                maxVal:s.capacity,//进度最大值,已使用的时间 (两个数据无关紧要,我最终要根据两个数据算出比例.)
            };

            
            s.forceUpdate();
          }
          else{
            message.error(data.getmsg);
          }
        }
      });
    }

    changeDate(){

    }

    save(){
       /* this.refs['save-btn'].classList.add('active');
        setTimeout(()=>{
            this.refs['save-btn'].classList.remove('active');
        },150)*/
        var s = this;
        var credentialsStr = '';
        s.state.userData.credentials.map((data,i) =>{
            credentialsStr+= data.src+ (i>= s.state.userData.credentials.length-1 ? '':',');  
        });


        var params = {
          userid : s.userid,
          setuserid:s.userid,
          getusersigid:s.getusersigid,
          usermobile: s.state.userData.usermobile,
          useremail: s.state.userData.useremail,
          userrealname: s.state.userData.customername,
          dateofbirth: s.state.userData.dateofbirth,
          datesign: s.state.userData.datesign || '阳历',
          emergencycontact: s.state.userData.useremergencycontacter,
          contactmobile: s.state.userData.useremergencycontactmobile,
          usericon: s.state.userData.portrait,
          credentials:credentialsStr,
          comment:'' //备注
        }

        console.log(params);
        $.ajax({
          url:window.baseUrl + 'user/edit_user/',
          data:params,
          success(data){
            console.log(data);
            if(data.getret === 0 ){
              message.success(data.getmsg);
            }
            else{
              message.error(data.getmsg);
            }
          }
        })

    }

    render(){

        var s =this;

        const props = {
            baseUrl: window.baseUrl,
            getusersigid: s.getusersigid,
            userid: s.userid,
            onFinish(imgData){
                s.state.userData.portrait = imgData.src;
                s.forceUpdate();
            }
        };

        const userProps ={
            documentbaseUrl: window.baseUrl,
            getusersigid: s.getusersigid,
            userid: s.userid,
            onFinish(imgData){
                s.state.userData.credentials.push({src:imgData.src});
                s.forceUpdate();
            }
        }

        let zmitiProgressProps = {
            label:'',
            unit:1,
            isShowInfo:false
        }

         const formItemLayout = {
           labelCol: {span: 6},
           wrapperCol: {span: 14},
         };



        let component =  <div style={{height:this.state.mainHeight,overflow:'auto'}}>
               <div className="acc-header">
                   <article>
                       <div className="acc-user">
                           <div className="acc-portrait">
                               <img draggable="false" src={this.state.userData.portrait} alt=""/>
                               <div>
                                   <Button className="little-br" onClick={this.changePortrait.bind(this)}  type="primary">更换头像</Button>
                               </div>
                           </div>
                           <div className="acc-info">
                               <section className="acc-user-name">
                                   <div>
                                       <span>@{this.username}</span>
                                   </div>
                                   <div>
                                       <Tag style={{lineHeight:'20px'}} color="#f50">{this.isover === 1 ?"试用账号":"正式账号"}</Tag>
                                       <Tag onClick={()=>{this.setState({modifyUserPwdDialogVisible:true})}} style={{background:'#108ee9',color:'#fff',lineHeight:'20px'}} color="#108ee9">重置密码</Tag>
                                   </div>
                               </section>
                               {this.state.isExpire && <section>{this.state.msg},<br/>请<span style={{color:'green',fontSize:'16px'}}>续费</span>或<span style={{color:'red',fontSize:'16px'}}>申请延长试用</span></section> }
                               {this.state.userData.usermobile && <section><span>手机：</span>{this.state.userData.usermobile}</section>}
                               {this.state.userData.useremail && <section><span>邮件：</span>{this.state.userData.useremail}</section>}
                           </div>
                       </div>
                   </article>
                   {
                     this.companyid && <article>
                       <div className="acc-company">
                           <h2 className="acc-company-name">{this.state.userData.companyname}</h2>
                           <h6 className="acc-department">{this.state.userData.departmentname}</h6>
                       </div>
                   </article>
                   }
                   {!this.companyid && <article>
                       <div className="acc-consume">
                       <div className="acc-msg"><span>你的账号将于<span style={{color:'#f00'}}>{this.state.userData.expiredate}</span>日过期</span><span style={{cursor:'pointer',color:'#2db7f5'}}>点此续费</span>{(this.state.isExpire || this.state.isFullSpace )&&<span style={{cursor:'pointer',color:'#2db7f5'}}>申请延长试用</span>}<span><a href="#">消费记录</a></span></div>
                           <ZmitiProgress currentVal={this.state.userData.currentVal} maxVal={this.state.userData.maxVal} {...zmitiProgressProps}></ZmitiProgress>
                       </div>
                   </article>}
               </div>
               <div className="acc-form">
                   <div className="acc-form-left">
                       <Input.Group className="acc-input-group">
                           <Input addonBefore="姓名" defaultValue={this.state.userData.customername} onChange={()=>{}}/>
                           <Select placeholder='性别' style={{width:300}} >
                               <Option value={'0'}>男</Option>
                               <Option value={"1"}>女</Option>
                           </Select>
                       </Input.Group>
                   </div>
                   <div className="acc-form-right">
                       <Input.Group className="acc-input-group">
                           <Input addonBefore="紧急联系人" defaultValue={this.state.userData.useremergencycontacter} onChange={()=>{}}/>
                           <Input addonBefore="紧急联系人电话" defaultValue={this.state.userData.useremergencycontactmobile} onChange={()=>{}}/>
                       </Input.Group>
                   </div>
               </div>
               <ZmitiScan {...this.state.userData}></ZmitiScan>
               <div className="acc-save-btn">
                   <Button type="primary" className="little-br" ref="save-btn" size="large" onClick={this.save.bind(this)}>保存</Button>
               </div>

               <ZmitiCard {...this.state.userData}></ZmitiCard>
               <Modal title='修改密码' visible={this.state.modifyUserPwdDialogVisible}
                  onOk={this.modifyUserPwd.bind(this)}
                  onCancel={()=>{this.setState({modifyUserPwdDialogVisible:false})}}>

                <Form >
                 <FormItem
                   {...formItemLayout}
                   label={<span><span style={{color:'red',marginRight:4,}}>*</span>原始密码</span>}
                   hasFeedback={true}
                 >
                   <Input type='password' ref='old-pwd' onFocus={()=>{this.setState({showOldPwdError:false})}} defaultValue={this.state.oldPwd} placeholder='原始密码' onChange={()=>{}}/>
                   {this.state.showOldPwdError && <div className='user-error'>原始密码不能为空</div>}
                 </FormItem>

                  <FormItem
                   {...formItemLayout}
                   label={<span><span style={{color:'red',marginRight:4,}}>*</span>新密码</span>}
                   hasFeedback={true}
                 >
                     <Input type='password' ref='new-pwd' onFocus={()=>{this.setState({showNewPwdError:false})}} defaultValue={this.state.newPwd} placeholder='新密码' onChange={()=>{}}/>
                   {this.state.showNewPwdError && <div className='user-error'>新密码不能为空</div>}
                 </FormItem>

                  <FormItem
                   {...formItemLayout}
                   label={<span><span style={{color:'red',marginRight:4,}}>*</span>确认新密码</span>}
                   hasFeedback={true}
                 >
                     <Input type='password' ref='sure-pwd' onFocus={()=>{this.setState({showSurePwdError:false})}}  defaultValue={this.state.surePwd} placeholder='确认密码' onChange={()=>{}}/>
                   {this.state.showSurePwdError && <div className='user-error'>确认新密码不能为空 </div>}
                 </FormItem>
                
               </Form>    
             </Modal>
            {!this.state.showCredentialsDiolog && <ZmitiUploadDialog id="personAcc" {...props}></ZmitiUploadDialog>}
            {this.state.showCredentialsDiolog && <ZmitiUploadDialog id="userCredentials" {...userProps}></ZmitiUploadDialog>}
           </div>;
        return (
          <MainUI component={component}></MainUI>
        )
    }
    changePortrait(){//更换头像

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

    modifyUesrCredentials(){
      var obserable=window.obserable;
         this.setState({
            showCredentialsDiolog:true
        },()=>{
          obserable.trigger({
              type:'showModal',
              data:{type:0,id:'userCredentials'}
          })  
        }) 
    }


    modifyUserPwd(){//修改密码
      var  oldPwd = this.refs['old-pwd'].refs.input.value;
      var  newPwd = this.refs['new-pwd'].refs.input.value;
      var  surePwd = this.refs['sure-pwd'].refs.input.value;
    
      if(oldPwd.length<=0){
         this.setState({
            showOldPwdError:true
         });

         return 0;
      }
      if(newPwd.length<=0){
         this.setState({
            showNewPwdError:true
         })
         return 0;
      }
      if(surePwd.length<=0){
         this.setState({
            showSurePwdError:true
         })
         return 0;
      }

      if(surePwd !== newPwd){
          message.error('两次输入密码不一致');
          return;
      }

      var s = this;

      var userid = this.props.params.userid?this.props.params.userid:this.userid;
      $.ajax({
        url:window.baseUrl + 'user/edit_userpwd/',
        data:{
          setolduserpwd:oldPwd,
          setnewuserpwd:newPwd,
          setuserid:userid,
          userid:s.userid,
          getusersigid:s.getusersigid
        },
        success(data){
            console.log(data)
            message[data.getret === 0?'success':'error'](data.getmsg);
            s.setState({
              modifyUserPwdDialogVisible:false
            });
        }
      })

    }
}

export default  ZmitiValidateUser(ZmitiPersonalAccApp);
/*ReactDOM.render(<ZmitiTab></ZmitiTab>,document.getElementById('fly-main'));*/
