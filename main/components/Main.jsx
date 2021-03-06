import React from 'react';

import { Link } from 'react-router';

import {Icon,Menu,Input,Badge,message,Modal,Col,Row} from '../commoncomponent/common.jsx';
const SubMenu = Menu.SubMenu;
import {ZmitiValidateUser} from '../public/validate-user.jsx';
import $ from 'jquery';

import ZmitiHeader from './pub-header.jsx';


class MainUI extends React.Component {
    constructor(args) {
        super(...args);

        this.menuClickHandler=this.menuClickHandler.bind(this);
        this.state = {
            visible:false,
            defaultClass: "fly-left-aside",
            isOpen: true,
            current: '3',
            currentAcc:'iLinten@qq.com', 
            isCompany : true, //是否是企业用户。默认为false.
            rightWidth:0,
            getusersigid:'',
            userid:'',
            usertypesign:-1,
            isover:-1,
            baseUrl:'http://api.zmiti.com/v2/',
            companyId:'',
            routers:[],
            removeCompany:false,
            defaultOpenKeys:'sub1'
            
        }
    }

    menuClickHandler(e){
       /* e.preventDefault();
          this.setState({
            frameSrc:e.target.href
        });*/
    };

    handleClick(e) {

        /*this.setState({
            current: e.key,
            frameSrc:e.key
        });*/

    }

    toggleMenu() {

        if (this.state.defaultClass === "fly-left-aside") {
            window.mainLeftSize = 60;
            this.setState({defaultClass: "fly-left-aside unfold", isOpen: false,rightWidth:document.documentElement.clientWidth - window.mainLeftSize});

        } else {
            this.setState({defaultClass: "fly-left-aside"});
            window.mainLeftSize = 180;
            setTimeout(()=> {
              this.setState({
                isOpen: true,
                rightWidth:document.documentElement.clientWidth - window.mainLeftSize
              });
          }, 200);

        }
    }

    render() { 
        let companyMenu = [];

        var params = this.state.userid+'/'+this.state.getusersigid;

        var hash = window.location.hash;
        var defaultOpenKeys = 'sub1';
        if(hash.indexOf('wxuserinfo')>-1|| hash.indexOf('userdepartment')>-1||hash.indexOf('project')>-1||hash.indexOf('viewuserinfor')>-1){
            defaultOpenKeys = 'sub2';
        }else if(hash.indexOf('viewpersonal')>-1 || hash.indexOf('renewal')>-1){
            defaultOpenKeys = 'sub3';
        }else if(hash.indexOf('custom')>-1 || hash.indexOf('mycustom')>-1|| hash.indexOf('tripseason')>-1){
            defaultOpenKeys = 'sub4';
        }
        

        if(this.state.isCompany && this.usertypesign === window.Role.COMPANYADMINUSER){//this.usertypesign === 5的时候,才是公司管理员.
            this.userMenuConfig = [//用户中心下的菜单
                {
                    "linkTo":"/viewuserinfor/",
                    "key":"viewuserinfor",
                    "title":"企业信息",
                    "isIcon":true,
                    "type":"team",
                },
                {
                    "linkTo":"/userdepartment/",
                    "key":"userdepartment",
                    "title":"部门和员工",
                    "isIcon":true,
                    "type":"team",
                    "isShow":true
                },
                {
                   "linkTo":"/wxuserinfo/",
                    "key":"wxuserinfo",
                    "title":"用户信息",
                    "isIcon":true,
                    "type":"team",
                    "isShow":true     
                }
                // {
                //     "linkTo":"/project/",
                //     "key":"project",
                //     "title":"项目管理",
                //     "isIcon":true,
                //     "type":"picture",
                //     "isShow":true
                // }
            ];



            companyMenu = [1].map((it,i)=>{
                return  <SubMenu className={'zmiti-company-menu '+ (this.state.removeCompany?'hide':'')}  key="sub2" title={<span><Icon type="user" style={{marginRight:'22px'}} /><span>企业中心</span></span>}>
                            {this.userMenuConfig.map(item=>{
                                return <Menu.Item key={item.key} ><Icon  type={item.type} style={{marginRight:'32px'}}/><Link to={item.linkTo}>{item.title}</Link></Menu.Item> 
                            })}
                        </SubMenu>;
            });
        }

        this.singleUserMenuConfig = [//个人中心下的菜单列表
            {
                "linkTo":"/viewpersonal/",
                "key":"viewpersonal",
                "title":"基本资料",
                "isIcon":true,
                "type":"user",
                "isShow":true
            },
             {
                "linkTo":"/renewal/",
                "key":"renewal",
                "title":"续费管理",
                "isIcon":true,
                "type":"user",
                "isShow":true
            }
        ]

         this.customMenuConfig = [//订制服务 的菜单列表
            {
                "linkTo":"/custom/",
                "key":"custom",
                "title":"订制作品",
                "isIcon":true,
                "type":"edit"
            },
            {
                "linkTo":"/myorder/",
                "key":"myorder",
                "title":"我要订制",
                "isIcon":true,
                "type":"user"
            }
        ]

        var configMenus =window.globalMenus;

        
        window.MENUCONFIG.map((item,i)=>{
            configMenus.forEach((menu,k)=>{
                if(item.key === menu.key){
                    var exists = false;            
                    item.VISITUSERS.forEach((vis,h)=>{
                        if(vis === this.username){
                            exists = true;
                        }
                    });
                    if(!exists){
                        configMenus.splice(k,1);
                    }
                }
            })
        });

        var headerProps = {
            usertypesign:this.state.usertypesign,
            currentAcc:this.state.username,
            userid:this.userid,
            getusersigid:this.getusersigid
        }
        return (
            <section className={"main " + (this.props.className || '')}>
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
                                  defaultOpenKeys={[defaultOpenKeys]}
                                  selectedKeys={[this.state.current]}
                                  mode="inline">
                                <SubMenu key="sub1"
                                         title={<span><Icon onClick={()=>{this.setState({visible:true})}} type="setting" style={{marginRight:'22px'}} /><span>产品与服务</span></span>}>
                                     {configMenus.map(item=>{
                                        if(item.iconType === 'true'){
                                            return <Menu.Item key={item.key} ><Icon  type={item.type} style={{marginRight:'32px'}}/><Link to={item.linkTo}>{item.title}</Link></Menu.Item> 
                                        }else{
                                            return <Menu.Item key={item.key} ><img src={'http://www.zmiti.com/'+item.type} style={{marginRight:32}}/><Link to={item.linkTo}>{item.title}</Link></Menu.Item> 
                                        }
                                     })}
                                </SubMenu>
                                {companyMenu}
                                <SubMenu key="sub3"
                                         title={<span><Icon type="setting" style={{marginRight:'22px'}} /><span>个人中心</span></span>}>
                                    {this.singleUserMenuConfig.map(item=>{
                                        return <Menu.Item key={item.key} ><Icon type={item.type} style={{marginRight:'32px'}}/><Link to={item.linkTo}>{item.title}</Link></Menu.Item> 
                                    })}
                                </SubMenu>
                                 <SubMenu key="sub4"
                                         title={<span><Icon type="setting" style={{marginRight:'22px'}} /><span>订制服务</span></span>}>
                                    {this.customMenuConfig.map(item=>{
                                        return <Menu.Item key={item.key} ><Icon type={item.type} style={{marginRight:'32px'}}/><Link to={item.linkTo}>{item.title}</Link></Menu.Item> 
                                    })}
                                </SubMenu>
                            </Menu>
                            <div className="fly-menu-bottom">
                                系统日志
                            </div>
                        </div>
                    </section>
                    <section className="fly-right-aside" style={{width:this.state.rightWidth}}>
                         {this.props.component}
                    </section>
                </article>


                <Modal className='fly-nav-custom-modal' title="个人左侧导航订制" visible={this.state.visible}
                  onOk={()=>{}} onCancel={()=>{this.setState({visible:false})}}
                  width={800}>
                    <Row>
                        <Col span={6}>
                            <section className='fly-nav-left-C'>
                                <div className='fly-nav-title-bar'>已选中的左侧导航</div>
                                <div className='fly-nav-content-C'>
                                    aaa
                                </div>
                            </section>
                        </Col>
                        <Col span={18}>2</Col>
                    </Row>
                </Modal>
            </section>
        )
    }
    
    componentWillMount(){

      let  {validateUser,loginOut,resizeLeftMenu,resizeMainHeight} = this.props;
       
      var {userid,getusersigid,companyid,isover,usertypesign,username,usermobile,useremail}=validateUser(()=>{
          loginOut();
      });

      resizeLeftMenu(this);
      resizeMainHeight(this);

       this.userid = userid;
       this.getusersigid = getusersigid;
       this.companyid = companyid;
       this.isover = isover;
       this.usertypesign = usertypesign;
       this.username = username;
       this.usermobile = usermobile;
       this.useremail = useremail;
    }

    logout(){//退出登录
    	var s=  this;

    	 
    		$.ajax({
                type:window.ajaxType || 'get',
    			url:window.baseUrl+'user/user_loginout/',
    			data:{
    				userid:s.userid,
    				getusersigid:s.getusersigid
    			},
    			success(data){
    				if(data.getret === 0){
    					document.cookie = null;
    					message.success(data.getmsg);
    					window.location.href= window.loginUrl;
    				}
    			}
    		})
    }

    componentDidMount() {



      

        var hash = window.location.hash;
        var current = '';
        var configMenus =window.globalMenus;
        

        if(this.userMenuConfig){
            configMenus = configMenus.concat(this.userMenuConfig);
        }
        configMenus = configMenus.concat(this.singleUserMenuConfig);
        configMenus = configMenus.concat(this.customMenuConfig);
        
        configMenus.forEach(item=>{
            if(hash.split('/')[1] === item.key || hash.split('/')[1].indexOf(item.key)>-1 || item.key.indexOf(hash.split('/')[1])>-1){
                current = item.key;
            }
           
        });


        this.setState({
            isCompany:this.companyid,
            companyId:this.companyid,
            userid:this.userid,
            current:current,
            usertypesign:this.usertypesign,
            isover:this.isover, 
            getusersigid:this.getusersigid,
            rightWidth:document.documentElement.clientWidth - 180,
            currentAcc:this.usermobile || this.useremail,
            username:this.username
        });

    }
}

export  default ZmitiValidateUser(MainUI);