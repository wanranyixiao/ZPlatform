import React, { Component } from 'react';

import { message , Icon , Menu , Input , Badge } from '../../commoncomponent/common.jsx';

import '../../static/css/index.css';
import { Link } from 'react-router';

import ZmitiHeader from '../../components/pub-header.jsx';

import {ZmitiValidateUser} from '../../public/validate-user.jsx';
const SubMenu = Menu.SubMenu;


class MainUI extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	 defaultClass: "fly-left-aside",
      isOpen: true,
      current: '3',
      currentAcc:'iLinten@qq.com',
      rightWidth:0,
      userid:'',
      getusersigid:''

	  };
    
	}

  menuClickHandler(e){
     /* e.preventDefault();
        this.setState({
          frameSrc:e.target.href
      });
*/
  };

  handleClick(e) {

   
  
      // this.context.router.replace('/company');

      //window.location.hash =  'company';
  }

  toggleMenu() {

      if (this.state.defaultClass === "fly-left-aside") {
          window.mainLeftSize = 60;
          this.setState({defaultClass: "fly-left-aside unfold", isOpen: false,rightWidth:document.documentElement.clientWidth - window.mainLeftSize});
      } else {
          this.setState({defaultClass: "fly-left-aside"});
          window.mainLeftSize = 180;
          setTimeout(()=> {
              this.setState({isOpen: true,rightWidth:document.documentElement.clientWidth - window.mainLeftSize});
          }, 200);
      }
  }
	render() {

    let params = '';//this.state.userid+'/'+this.state.getusersigid;

    this.userManagerMenuConfig = [
       {
          "linkTo":"/user/个人账户管理",
          "key":"user",
          "title":"个人账户管理",
          "isIcon":true,
          "type":"user",
          "isShow":true
      }, {
          "linkTo":"/company/公司账户管理",
          "key":"company",
          "title":"公司账户管理",
          "isIcon":true,
          "type":"customerservice",
          "isShow":true
      }
    ];

    this.productServiceMenuConfig = [
      {
          "linkTo":"/product/",
          "key":"product",
          "title":"新增产品",
          "isIcon":true,
          "type":"edit",
          "isShow":true
      },
      {
          "linkTo":"/listorder/工单管理",
          "key":"workorder",
          "title":"工单管理",
          "isIcon":true,
          "type":"edit",
          "isShow":true
      },
      {
          "linkTo":"/datum/",
          "key":"datum",
          "title":"资料管理",
          "isIcon":true,
          "type":"edit",
          "isShow":true
      }
    ]
    if(this.usertypesign===4){//超级管理员
      this.userManagerMenuConfig.push( {
          "linkTo":"/system/系统账户管理",
          "key":"system",
          "title":"系统账户管理",
          "isIcon":true,
          "type":"edit",
          "isShow":true
      })
    }



    var hash = window.location.hash;
    var openKey = 'sub5';
    this.productServiceMenuConfig.forEach((item,i)=>{
        if(hash.indexOf(item.key)>-1){
            openKey = 'sub6';
        }    
    });
    var headerProps = {
            usertypesign:this.usertypesign,
            currentAcc:this.state.currentAcc,
            userid:this.userid,
            type:'admin',
            getusersigid:this.getusersigid,
            logo:'../static/images/logo.png'
        }

		return (
			 <section className="main">
          <ZmitiHeader {...headerProps}></ZmitiHeader>
            <article className="fly-content">
                <section className={this.state.defaultClass}>
                    <div className="fly-toggle-menu" onClick={this.toggleMenu.bind(this)}>
                        <Icon type="menu-fold" style={{display:this.state.isOpen?'inline-block':'none'}}/>
                        <Icon type="menu-unfold" style={{display:this.state.isOpen?'none':'inline-block'}}/>
                    </div>
                    <div className="fly-menu-c">
                        <Menu
                              style={{ width: 182 }}
                              defaultOpenKeys={[openKey]}
                              selectedKeys={[this.state.current]}
                              mode="inline">
                            <SubMenu key="sub5"
                            title={<span><Icon type="setting" style={{marginRight:'22px'}} /><span>用户管理</span></span>}>
                                 {this.userManagerMenuConfig.map(item=>{
                                    return <Menu.Item key={item.key} ><Icon  type={item.type} style={{marginRight:'32px'}}/><Link to={item.linkTo}>{item.title}</Link></Menu.Item> 
                                 })}
                            </SubMenu>
                             <SubMenu key="sub6"
                            title={<span><Icon type="setting" style={{marginRight:'22px'}} /><span>操作管理</span></span>}>
                                 {this.productServiceMenuConfig.map(item=>{
                                    return <Menu.Item key={item.key} ><Icon  type={item.type} style={{marginRight:'32px'}}/><Link to={item.linkTo}>{item.title}</Link></Menu.Item> 
                                 })}
                            </SubMenu>
                        </Menu>
                    </div>
                </section>
                <section className="fly-right-aside" style={{width:this.state.rightWidth}}>
                      {this.props.component}
                </section>
            </article>
        </section>
		);
	}
  componentWillMount() {
      
       let {resizeMainHeight,validateUser,loginOut,resizeLeftMenu} = this.props;
        resizeMainHeight(this,'setAdminHeight');
        resizeLeftMenu(this,'setAdminMenu');
      var {userid, getusersigid, companyid,username,isover,usertypesign}=validateUser(()=>{
        
          loginOut(undefined,undefined,false);
      });
      this.userid = userid;
      this.getusersigid = getusersigid;
      this.companyid = companyid;
      this.isover = isover;
      this.usertypesign = usertypesign;
      this.loginOut = loginOut;
   
    if(this.usertypesign !== window.Role.NORMALADMINUSER &&  this.usertypesign !== window.Role.SUPERADMINUSER){

      loginOut('您没有访问的权限',window.mainUrl,false);//不是hash跳转。location.href跳转
    }

  }
	componentDidMount() {
    
		var hash = window.location.hash;
    var configs = this.userManagerMenuConfig.concat(this.productServiceMenuConfig);
    var current =  '';
    configs.forEach(item=>{
      if(hash.indexOf('#'+item.linkTo)>-1){
        current = item.key;
      }
    });
    this.setState({
        current: current,
        rightWidth:document.documentElement.clientWidth - 180,
        userid:this.userid,
        isover:this.isover,
        getusersigid:this.getusersigid
    });
   
		
	}
}
export default ZmitiValidateUser(MainUI);