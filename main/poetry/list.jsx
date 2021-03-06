import React, { Component } from 'react';

import { message,Input,Button,Modal,Tooltip,Popconfirm,Icon } from '../commoncomponent/common.jsx';

import ZmitiUploadDialog from '../components/zmiti-upload-dialog.jsx';

import {Link} from 'react-router';

import './static/css/list.css';

import MainUI from '../components/Main.jsx';

import $ from 'jquery';

import {ZmitiValidateUser} from '../public/validate-user.jsx';

class ZmitiPoetryListApp extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			mainHeight:document.documentElement.clientHeight - 50,
			isEntry:1,
			currentState:0,
			visible:false,
			showTitle:false,//是否显示输入标题对话框
			poetryList:[
				  
			],//聊天作品列表
			data:{
				type:'SHI',
				worksname:'',
				theme:'default',

			}
		}; 
	}

	randomString(len) {
	　　var len = len || 8;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	　　var maxPos = $chars.length;
	　　var pwd = '';
	　　for (var i = 0; i < len; i++) {
	　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	　　}
	　　return pwd;
	}
	render() {
		var component = <div className='poetry-list-main-ui'>
			{this.state.currentState === -1 && <section className='poetry-list-C'>
				<ul className='poetry-list'>
					<li  title='创建作品' onClick={this.entryCreateWork.bind(this)}>
						<img src='./static/images/create.png'/>
					</li>
					{this.state.poetryList.map((item,i)=>{
						return <li key={i}>
							<section  className='poetry-qrcode'><img src={item.qrcodeUrl}/></section>
							<div className='poetry-item-shareimg' style={{background:'url('+(item.workico|| './static/images/default-chat.jpg')+') no-repeat center / cover'}}></div>
							<div className='poetry-item-name'>{item.worksname}</div>
							<Tooltip placement="top" title={'当前作品浏览量： '+item.totalview}>
								<div className='poetry-item-view'><Link to={'/statistics/poetry/'+item.worksid}><Icon type="dot-chart" /></Link></div>
							</Tooltip>
							<div className='poetry-item-operator'>
											{/*<div><a href={item.viewpath} target='_blank'>预览</a></div>
																						</div>*/}
											<div><Link to={'/poetryedit/'+item.worksid}>编辑</Link></div>
											<Popconfirm placement="top" title={'确定要删除吗？'} onConfirm={this.deletePoetry.bind(this,item.worksid,i)}>
												<div>删除</div>
											</Popconfirm>
										</div>
						</li>
					})}
				</ul>
			</section>}
			{this.state.currentState === 0 && <section className='poetry-create-C' style={{height:this.state.mainHeight}}>
				<aside>
					<img  draggable='false' className='poetry-iphone' src='./static/images/poetry-phone.png'/>
				</aside>
				<aside>
					<div className='poetry-text' ref='poetry-text'>
						<img ref='poetry-text-img'  draggable='false' src='./static/images/poetry-text.png'/>
					</div>
					<div onClick={this.showChooseType.bind(this)} className='poetry-creat-btn' style={{background:'url(./static/images/poetry-btn-bg.png) no-repeat center center / contain'}}>
						创建
					</div>
					<div onClick={()=>{this.setState({currentState:-1})}} className='poetry-sea-list'>查看历史创建</div>
				</aside>
				 <Modal title="" visible={this.state.visible}
				  width={800}
				  onCancel={()=>{this.setState({visible:false})}}
				  footer=<div><Button type='primary' size="large" onClick={this.entryInputTitle.bind(this)}>下一步</Button></div>
		        >
		          <div className='poetry-type-C'>
			         <section className='poetry-type-list'>
			         	<aside onClick={this.modifyType.bind(this,'SHI')}>
			         		<section style={{background:'url(./static/images/'+(this.state.data.type === "SHI"?'poetry-bg1.png':'poetry-bg.png')+') no-repeat center / contain'}}>
			         			<span className={this.state.data.type === "SHI"?'active':''}>诗</span>
			         		</section>
			         		<section><img src='./static/images/poetry-hand.png'/></section>
			         		<section>系统会随机给您一首诗</section>
			         	</aside>
			         	<aside  onClick={this.modifyType.bind(this,'CI')}>
			         		<section style={{background:'url(./static/images/'+(this.state.data.type === "CI"?'poetry-bg1.png':'poetry-bg.png')+')  no-repeat center / contain'}}>
			         			<span className={this.state.data.type === "CI"?'active':''}>词</span>
			         		</section>
			         		<section><img src='./static/images/poetry-hand.png'/></section>
			         		<section>系统会随机给您一首词</section>
			         	</aside>
			         	<aside onClick={this.modifyType.bind(this,'TONGYAO')}>
			         		<section style={{background:'url(./static/images/'+(this.state.data.type === "TONGYAO"?'poetry-bg1.png':'poetry-bg.png')+')  no-repeat center / contain'}}>
			         			<span className={this.state.data.type === "TONGYAO"?'active':''}>童谣</span>
			         		</section>
			         		<section><img src='./static/images/poetry-hand.png'/></section>
			         		<section>系统会随机给您一首童谣</section>
			         	</aside>
			         </section>
			         <section className='poetry-line'></section>
			         <section  className='poetry-type-list'>
			         	<aside style={{opacity:0}}><img draggable='false' src='./static/images/poetry-poetry.png'/></aside>
			         	<aside  onClick={this.modifyType.bind(this,'CUSTOM')}>
			         		<section className='poetry-custom' style={{background:'url(./static/images/'+(this.state.data.type === "CUSTOM"?'poetry-bg1.png':'poetry-bg.png')+')  no-repeat center / contain'}}>
			         			<span className={this.state.data.type === "CUSTOM"?'active':''}>自定义</span>
			         		</section>
			         		<section><img src='./static/images/poetry-hand.png'/></section>
			         		<section>我要自己作一首</section>
			         	</aside>
			         	<aside  style={{opacity:0}}><img draggable='false' src='./static/images/poetry-ci.png'/></aside>
			         </section>
			      </div>
		        </Modal>

		        <Modal title="" visible={this.state.showTitle}
				  width={400}
				  onCancel={()=>{this.setState({showTitle:false})}}
				  footer={''}
		        >
		         <div className='poetry-title-input'>
		         	<input value={this.state.data.worksname} onChange={e=>{this.state.data.worksname = e.target.value;this.forceUpdate()}} type='text' placeholder= '请输入标题'/>
		         	<img src='./static/images/peotry-title-bg.png'/>
		         	<div className='poetry-title-btn'><Button onClick={this.createWork.bind(this)} type='primary' size="large">下一步</Button></div>
		         </div>
		        </Modal>
		        
			</section>}
		</div>
		return (
			<MainUI component={component}></MainUI>
		);
	}

	entryCreateWork(){
		this.setState({currentState:0},()=>{
			this.flyParticleToImage({
				 container: this.refs['poetry-text'],
	            img: this.refs['poetry-text-img'],
	            complate: function () {

	            }
			});
		})
	}

	entryInputTitle(){

		this.setState({
			visible:false,
			showTitle:true
		})
	}

	showChooseType(){
		this.setState({
			visible:true
		})
	}


	modifyType(type){

		if(type === "CI" || type === "TONGYAO" || type === "CUSTOM"){
			message.warning('敬请期待');
			return false;
		}

		this.state.data.type = type;
		this.forceUpdate();
	}

	deletePoetry(worksid,i){
		var s = this;
		$.ajax({
			type:window.ajaxType || 'get',
			url:window.baseUrl+'works/del_works/',
			data:{
				userid:s.userid,
				getusersigid:s.getusersigid,
				worksid:worksid
			},success(data){
				if(data.getret === 0){
					message.success(data.getmsg);
					s.state.poetryList.splice(i,1);
					s.forceUpdate();
				}
				else{
					message.error(data.getmsg);
				}
			}
		})
	}

	flyParticleToImage(option) {
          option = option || {}

             var iWidth = option.container.offsetWidth,
            	iHeight = option.container.offsetHeight;
            option.container.innerHTML = "";
           
            var canvas = document.createElement("canvas");
            canvas.style.transition = "1s opacity";
            canvas.style.position = "absolute";
            canvas.width = iWidth;
            canvas.height = iHeight;
            option.container.appendChild(canvas);
            var stage = new createjs.Stage(canvas);
            var container = new createjs.Container();

            var outCanvas = createShape(canvas);
            var outContext = outCanvas.getContext("2d");
            var dots = getImageData(outCanvas, outContext);

            var ball = [];

            for (var i = 0; i < dots.length; i++) {
                var shape = new createjs.Shape();
                var x = Math.random() * canvas.width * 2,
                    y = Math.random() * canvas.height * 2;
                var circle = shape.graphics.beginFill('rgba('+dots[i].r+','+dots[i].g+','+dots[i].b+','+dots[i].a+')').drawRect(x, y, 2,2);
                shape.posX = x;
                shape.posY = y;
                container.addChild(shape);
                ball.push(shape);
            }
            container.x = 10;


            stage.addChild(container);

            stage.update();


            function getImageData(outCanvas, outContext) {
                var imgData = outContext.getImageData(0, 0, outCanvas.width, outCanvas.height);


                var dots = [],
                    x = 0,
                    y = 0,
                    gap = 4;

                for (var x = 0; x < imgData.width; x += gap) {
                    for (var y = 0; y < imgData.height; y += gap) {
                        var i = (x + y * outCanvas.width) * 4;

                        if (imgData.data[i + 3] > 128) {

                            dots.push({
                                x: x,
                                y: y,
                                r:imgData.data[i],
                                g:imgData.data[i + 1],
                                b:imgData.data[i + 2],
                                a:imgData.data[i + 3]
                            });
                        }
                    }
                }
                return dots;
            }

            function createShape() {
                var outCanvas = document.createElement("canvas");

                outCanvas.width = iWidth;
                outCanvas.height = iHeight;
                var context = outCanvas.getContext("2d");
                var outStage = new createjs.Stage(outCanvas);

                context.drawImage(option.img, 0, 0, iWidth, iHeight);

                outCanvas.style.position = "absolute";
                outCanvas.style.opacity = 0;
                outCanvas.style.transition = "opacity 2s";

                option.container.appendChild(outCanvas);

                return outCanvas;
            }


            for (var i = 0; i < ball.length; i++) {
                createjs.Tween.get(ball[i], { override: true }).wait(Math.random() * 800).to({ x: dots[i].x - ball[i].posX, y: dots[i].y - ball[i].posY, alpha: 1 }, 500, createjs.Ease.cubicInOut);
            }
            setTimeout(function () {
                outCanvas.style.opacity = 1;
                canvas.style.opacity = 0;
                option.complate && option.complate();
                createjs.Ticker.off("tick", stage);
            }, 1500);
            createjs.Ticker.setFPS(60);
            createjs.Ticker.addEventListener("tick", stage);

    }

	save(worksid,viewpath,title){
		var s = this;
		s.state.data.viewpath = viewpath;
		$.ajax({
			url:window.baseUrl+'/works/update_works/',
			type:'post',
			data:{
				worksid:worksid,
				userid:s.userid,
				getusersigid:s.getusersigid,
				datajson:JSON.stringify(s.state.data),
				worksname:title,
				dirname:'poetry',
				workstag:'',
				workico:''
			},
			success(data){
				message[data.getret === 0?'success':'error'](data.getmsg);
				if(data.getret === 1300){//用户登录超时
					window.location.href = window.loginUrl;
				}
			}
		})
	}

	createWork(){

		if(this.state.data.worksname.length <= 0){
			message.error('作品名称不能为空');
			return;
		}

		var s = this;

		var type = 0;
		
		switch(s.usertypesign) {
			case window.Role.COMPANYUSER://公司员工
			case window.Role.COMPANYADMINUSER://公司管理员。
				type = 1;//对应的是公司的作品。
				break;
		}

		$.ajax({
			url:window.baseUrl+'/works/create_works/',
			type:'post',
			data:{
				userid:s.userid,
				getusersigid:s.getusersigid,
				productid:s.productid,
				dirname:'poetry',
				worksname:s.state.data.worksname,
				workstate:1,
				worktypesign:type,
				datajson:JSON.stringify(this.state.data)
			},
			success(data){

				message[data.getret === 0?'success':'error'](data.getmsg);
				if(data.getret === 0 ){
					window.location.hash= '/poetryedit/'+data.worksid;
				}
				
			}
		});
	}

	componentWillMount() {
		
		let {resizeMainHeight,validateUser,loginOut,zmitiAjax} = this.props;

		resizeMainHeight(this);	

		this.zmitiAjax = zmitiAjax;



		let {userid,getusersigid,usertypesign} = validateUser(()=>{loginOut(undefined,undefined,false);},this);
		this.userid = userid;
		this.getusersigid = getusersigid;
		this.usertypesign = usertypesign;
	}

	componentDidMount() {

		var s = this;

		window.globalMenus.map((item,i)=>{
			
			 if(item.linkTo === '/poetry/'){
			 	this.productid = item.productid;//获取当前产品的id;
			 }
		});

		$.ajax({
			url:window.baseUrl + 'works/get_worksinfo/',
			type:window.ajaxType || 'get',
			data:{
				type:1000,
				productid:s.productid,
				userid:s.userid,
				getusersigid:s.getusersigid
			}
		}).then((data)=>{
			if(data.getret === 0){
				s.state.poetryList = data.getworksInfo;
				s.forceUpdate();
			}
		});
		setTimeout(()=>{
			this.flyParticleToImage({
				 container: this.refs['poetry-text'],
	            img: this.refs['poetry-text-img'],
	            complate: function () {

	            }
			});
		},500)

	}
 
}

export default ZmitiValidateUser(ZmitiPoetryListApp);
