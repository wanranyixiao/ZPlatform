import './static/css/index.css';
import React from 'react';
import {ZmitiValidateUser} from '../public/validate-user.jsx';
import moment from 'moment';
import {Button,message,Input,Table,Modal,Form,Icon,Radio,DatePicker } from '../commoncomponent/common.jsx';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const FormItem = Form.Item;

const RadioGroup = Radio.Group;

import ZmitiOrderList from '../components/order.jsx';

import MainUI from '../admin/components/main.jsx';

 class ZmitiProductApp extends React.Component{
    constructor(args){
        super(...args);
        this.state = {
            visible:false,
            productlist:[{
              productid:-1
            }],
            productName:'',//产品名称
            productShortName:'',
            productPrice:'0',
            productLink:'',//产品地址
            productType:0,//产品类型 0 基础产品 1付费产品
            productRemark:'',
            defaultZmitiIcon:'../public/images/lt-company-ico.png',
            defaultAntdIcon:'picture',
            expireDate:'2099-12-31',//过期时间
            currentIconType:'',//当前产品的图标,默认用智媒体的图标
            iconModalVisible:false,//图标对话框是否显示。
            currentIcon:"",//当前产品图标。默认为空的
        }
    }

    componentWillMount() {
       let {resizeMainHeight,validateUser,loginOut,listen,send} = this.props;

        resizeMainHeight(this); 
        
        let {username,userid,getusersigid} = validateUser(()=>{loginOut(undefined,undefined,false);},this);
        this.userid = userid;
        this.listen = listen;
        this.send = send;
        this.getusersigid = getusersigid;
       
    }

    componentDidMount(){
        
        this.setState({
            mainHeight:document.documentElement.clientHeight - 50
        });

        
    }

    render(){

        let  {validateUser,loginOut,resizeMainHeight} = this.props;
        var iNow = 0 ;
        validateUser(()=>{
            iNow++;
            loginOut();
        },this);
       // resizeMainHeight(this);
        
        if(iNow === 1){
            return <div></div>;    
        }

        const formItemLayout = {
           labelCol: {span: 6},
           wrapperCol: {span: 14},
         };

         const columns = [{
            title:"序号",
            dataIndex:'key',
            key:'xx'
            },{
              title: '产品名称',
              dataIndex: 'productname',
              key: 'productname',
            }, {
              title: '产品简称',
              dataIndex: 'productShortName',
              key: 'productShortName',
            }, {
              title: '产品类型',
              dataIndex: 'productType',
              key: 'productType',
            }, {
              title: '到期时间',
              dataIndex: 'expirDate',
              key: 'expirDate',
            }, {
              title: '产品费用',
              dataIndex: 'exprice',
              key: 'exprice',
            }, {
              title: '产品地址',
              dataIndex: 'linkTo',
              key: 'linkTo',
            }];


         let orderProps ={
            orderList:this.state.productlist,
            columns:[columns],
            detail:(record)=>{
              return <p>{record.productid}</p>
            }
         }
         const dateFormat = 'YYYY-MM-DD';
        let component =  <div className="product-main-ui" style={{height:this.state.mainHeight}}>
                <header className='product-header'><Button onClick={()=>{this.setState({visible:true})}} type='primary'>新增产品服务</Button></header>
                <ZmitiOrderList {...orderProps}></ZmitiOrderList>
                <Modal title='新增产品服务' visible={this.state.visible}
                  onOk={this.addProduct.bind(this)}
                  onCancel={()=>{this.setState({visible:false})}}
                  width={600}
                  >

                <Form >
                 <FormItem
                   {...formItemLayout}
                   label={<span><span style={{color:'red',marginRight:4,}}>*</span>产品名称</span>}
                   hasFeedback={true}
                 >
                   <Input ref='product-name' placeholder='要显示的菜单名' onChange={(e)=>{this.setState({productName:e.target.value})}}/>
                 </FormItem>

                  <FormItem
                   {...formItemLayout}
                   label={<span><span style={{color:'red',marginRight:4,}}>*</span>产品简称</span>}
                   hasFeedback={true}
                 >
                     <Input ref='product-sort-name' placeholder='产品简称'  onChange={(e)=>{this.setState({productShortName:e.target.value})}}/>
                 </FormItem>

                  <FormItem
                   {...formItemLayout}
                   label={<span><span style={{color:'red',marginRight:4,}}>*</span>到期时间</span>}
                   hasFeedback={true}
                 >
                     <DatePicker
                      format="YYYY-MM-DD"
                      onChange={this.changeExpireDate.bind(this)}
                      size={'default'} defaultValue={moment(this.state.expireDate,dateFormat)}/>

                 </FormItem>
                 <FormItem
                   {...formItemLayout}
                   label={<span><span style={{color:'red',marginRight:4,}}>*</span>产品类型</span>}
                   hasFeedback={true}
                 >
                    <RadioGroup onChange={e=>{this.setState({productType:e.target.value})}} value={this.state.productType}>
                        <Radio value={0}>基础产品</Radio>
                        <Radio value={1}>付费产品</Radio>
                        <Radio value={2}>默认产品(不需要申请)</Radio>
                    </RadioGroup>

                
                 </FormItem>

                 <FormItem
                   {...formItemLayout}
                   label={<span><span style={{color:'red',marginRight:4,}}>*</span>产品图标</span>}
                   hasFeedback={true}
                 >

                   {this.state.currentIcon && this.state.currentIconType === 'zmiti' && <div className='product-menu-ico'><img src={this.state.currentIcon}/></div>}
                   {this.state.currentIcon && this.state.currentIconType === 'antd' && <div className='product-menu-ico product-antd-ico'><Icon type={this.state.currentIcon} /></div>}

                    <RadioGroup onChange={this.onChangeIcon.bind(this)} value={this.state.currentIconType}>
                        <Radio value={'zmiti'}>智媒体图标</Radio>
                        <Radio value={'antd'}>组件库图标</Radio>
                    </RadioGroup>

                    <section className='product-ico-C' style={{display:this.state.iconModalVisible?'block':'none'}}>
                        <section className='product-ico-header'>
                            <div>添加产品图标</div>
                            <div onClick={()=>{this.setState({iconModalVisible:false})}}><span>&times;</span></div>
                        </section>
                        <section className='product-ico-list' >
                           {this.state.currentIconType === 'zmiti' && <div>
                                                           <ul onClick={this.changeIcon.bind(this)}>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-money-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-msg-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-usergroup-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-user-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                             <li><img draggable='false' src='../public/images/lt-company-ico.png'/></li>
                                                           </ul>
                                                       </div>}
                            {this.state.currentIconType === 'antd' && 
                               <div>
                                  <ul onClick={this.changeIcon.bind(this)}>
                                      <li><Icon type="lock"/></li>
                                      <li><Icon type="unlock"/></li>
                                      <li><Icon type="android"/></li>
                                      <li><Icon type="apple"/></li>
                                      <li><Icon type="apple-o"/></li>
                                      <li><Icon type="area-chart"/></li>
                                      <li><Icon type="pie-chart"/></li>
                                      <li><Icon type="bar-chart"/></li>
                                      <li><Icon type="dot-chart"/></li>
                                      <li><Icon type="bars"/></li>
                                      <li><Icon type="book"/></li>
                                      <li><Icon type="calendar"/></li>
                                      <li><Icon type="cloud"/></li>
                                      <li><Icon type="cloud-download"/></li>
                                      <li><Icon type="code"/></li>
                                      <li><Icon type="code-o"/></li>
                                      <li><Icon type="copy"/></li>
                                      <li><Icon type="credit-card"/></li>
                                      <li><Icon type="desktop"/></li>
                                      <li><Icon type="edit"/></li>
                                      <li><Icon type="ellipsis"/></li>
                                      <li><Icon type="file"/></li>
                                      <li><Icon type="appstore-o"/></li>
                                      <li><Icon type="picture"/></li>
                                      <li><Icon type="shopping-cart"/></li>
                                      <li><Icon type="star-o"/></li>
                                      <li><Icon type="star"/></li>
                                      <li><Icon type="hearr-o"/></li>
                                      <li><Icon type="camera"/></li>
                                      <li><Icon type="camera-o"/></li>
                                      <li><Icon type="team"/></li>
                                      <li><Icon type="solution"/></li>
                                      <li><Icon type="customer-service"/></li>
                                      <li><Icon type="switcher"/></li>
                                      <li><Icon type="rocket"/></li>
                                  </ul>
                               </div>
                            }
                        </section>
                    </section>
                 </FormItem>

                  <FormItem
                   {...formItemLayout}
                    label={<span><span style={{color:'red',marginRight:4,}}>*</span>产品费用</span>}
                   hasFeedback={true}
                 >
                     <Input ref='product-cost' addonAfter="￥/月" defaultValue={0}  onChange={(e)=>{this.setState({productPrice:e.target.value})}}/>
                 </FormItem>

                  <FormItem
                   {...formItemLayout}
                    label={<span><span style={{color:'red',marginRight:4,}}>*</span>产品地址</span>}
                   hasFeedback={true}
                 >
                     <Input ref='product-path' defaultValue={''}  onChange={(e)=>{this.setState({productLink:e.target.value})}} placeholder='产品存放的项目地址，由超级管理员填写'/>

                 </FormItem>

                  <FormItem
                   {...formItemLayout}
                    label={<span>产品说明</span>}
                   hasFeedback={true}
                 >
                     <textarea ref='product-remark' style={{width:'100%'}} defaultValue={''} onChange={(e)=>{this.setState({productRemark:e.target.value})}}  placeholder='产品说明'>
                     </textarea>
                 </FormItem>
                
               </Form>    
             </Modal>
            </div>
        return(
            <MainUI component={component}></MainUI>
        )
    }

    componentDidMount() {
      var s=  this;
      $.ajax({
        url:window.baseUrl+'product/get_product/',
        data:{
          userid:s.userid,
          getusersigid:s.getusersigid
        },
        success(data){
            if(data.getret === 0){
              s.state.productlist = data.productlist;
              s.state.productlist.forEach((item,i)=>{
                item.key = item.productid;
              })
              s.forceUpdate();
            }
            console.log(data);
        }
      })
    }

    changeExpireDate(value){
        
        this.setState({expireDate:value.format('YYYY-MM-DD')})
    }

    changeIcon(e){//选择当前产品图标。
      switch(this.state.currentIconType) {
        case 'zmiti':
           var src = e.target.src || e.target.children[0].src;
            if(!src){
              return;
            }
            this.setState({
              currentIcon:src
            });
          break;
        case 'antd':
          if(e.target.nodeName === 'I'){
            var icon = e.target.className.split(' ')[1].substring(8);
           
          }else{
            var icon = e.target.children[0].className.split(' ')[1].substring(8);
          }
          this.setState({
              currentIcon:icon
          });
         // console.log(e.target);
          break;
      }

     
    }

    addProduct(){//添加产品

     
      //this.state.currentIcon :localhost:3000/public/images/ic.png
      var src = '';
      if(this.state.currentIcon.split('//').length>1){
          src= this.state.currentIcon.split('//')[1];
      }
      else{
        src = this.state.currentIcon.split('//')[0];
      }
      src = src.split('/');
      src.shift();
      src ='/main/'+ src.join('/');
 

      var s = this;
      var params = {
        producturl:this.state.productLink,
        productname:this.state.productName,
        outline:this.state.productShortName,
        icontype:this.state.currentIconType === 'antd',
        producticon:src,
        producttype:this.state.productType,
        endtime:this.state.expireDate,
        price:this.state.productPrice,
        bookingmonthnum:1,//按月算。
        description:this.state.productRemark,
        userid:this.userid,
        getusersigid:this.getusersigid
      }
      $.ajax({
        url:window.baseUrl + '/product/add_product/',
        data:params,
        success(data){
          message[data.getret === 0 ? 'success':'error'](data.getmsg);
          s.setState({
            visible:false
          })
        }
      });
    }
    onChangeIcon(e){//切换图标
      switch(e.target.value) {
        case 'zmiti':
           this.setState({
              currentIcon:this.state.defaultZmitiIcon
            });
          break;
        case 'antd':
          this.setState({
              currentIcon:this.state.defaultAntdIcon
            });
          break;
      }
        this.setState({
            currentIconType:e.target.value,
            iconModalVisible:true
        });
    }
}

export default ZmitiValidateUser(ZmitiProductApp);
 