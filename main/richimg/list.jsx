import React from 'react';
import './static/css/list.min.css';
import ReactDOM from 'react-dom';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import 'antd/lib/tabs/style/css';
import Waterfall  from './static/js/waterfall';
import 'babel-polyfill';
import PubSub from './static/js/pubsub';
import message from 'antd/lib/message';
import 'antd/lib/message/style/css';

import ZmitiUploadDialog from '../components/zmiti-upload-dialog.jsx';

import $ from 'jquery';


import ZmitiRichImg from './static/components/zmiti-richimg.jsx';

class ZmitiHeader extends React.Component {
    constructor(args) {
        super(...args);
    }

    createProject() {
        PubSub.publish('showModal', {type:0,id:'image'});
    }

    render() {
        return (
            <div className="zmiti-header">
                <div className="form-group">
                    <Input size="large" placeholder="搜索"/>
                    <Button size="large" type="primary" icon="search">搜索</Button>
                </div>
                <div className="zmiti-create">
                    <Button type="primary" onClick={this.createProject.bind(this)}>创建作品</Button>
                </div>
            </div>
        )
    }
}

class ZmitiMainContent extends React.Component {
    constructor(args) {
        super(...args);
        this.state ={
            richimg:[],
            loading:true
        }
    }


    componentDidMount() {


        let s = this;



      /*  if( window.localStorage.getItem('richimgList')){
            let arr = window.localStorage.getItem('richimgList').split('|');
            arr.pop();
            arr = arr.map(a=>{
               return JSON.parse(a);
            });
            s.setState({
                richimg:arr
            },()=>{
                new Waterfall({
                    containerSelector: '.zmiti-tab-my-project',
                    boxSelector: '.zmiti-richimg-C'
                });
            })

        }*/



        $.ajax({
            url:s.props.baseUrl+s.props.getUserInfoUrl,
            type:"POST",
            data:{
                getusersigid:s.props.getusersigid,
                type:0
            },
            success(data){
                data.getWorksInfo && data.getWorksInfo.length>0 &&  message.success(data.getmsg);

                if(data.getret === 0){

                    /*   let infos  = '';
                    data.getWorksInfo.forEach(d=>{
                        infos += JSON.stringify(d) + '|';
                    });

                    let isNeedUpdate= false;
                    if( window.localStorage.getItem('richimgList')){
                        let arr = window.localStorage.getItem('richimgList').split('|');
                        arr.pop();

                        arr = arr.map(a=>{
                            return JSON.parse(a);
                        });

                        arr.forEach((a,i)=>{
                            if(!data.getWorksInfo[i] || a.worksid !== data.getWorksInfo[i].worksid){
                                isNeedUpdate =true;
                            }
                        })
                    }*/
                   // (isNeedUpdate || !window.localStorage.getItem('richimgList')) &&  window.localStorage.setItem('richimgList',infos);

                     s.setState({
                        richimg : data.getWorksInfo
                    },()=>{
                        new Waterfall({
                            containerSelector: '.zmiti-tab-my-project',
                            boxSelector: '.zmiti-richimg-C'
                        });

                    })
                }
            },
            error(e){
                console.log(e);
            }
        });
    }

    changeTab(e) {
        this.alreadyLaodArr = this.alreadyLaodArr || ['1'];
        let a = ['zmiti-tab-my-project',
            'zmiti-tab-department-project',
            'zmiti-tab-company-project',
            'zmiti-tab-platform-project'
        ];

        setTimeout(()=> {
            new Waterfall({
                containerSelector: '.' + a[e - 1],
                boxSelector: '.zmiti-richimg-C'
            });
        }, 0);
    }


    render() {
        /**
         * ,225,346,221,333,234,322,245,274
         * @type {Array}
         */



        let richImg = this.state.richimg.map((item, i)=> {
            return <ZmitiRichImg key={i} index={i} {...this.state.richimg[i]} {...this.props}></ZmitiRichImg>
        });
        /*
        *
        *  <TabPane tab="部门作品" key="2">
         <div className="zmiti-tab-department-project">
         {richImg}
         </div>
         </TabPane>
        * */

        return (
            <div className="zmiti-main-content">
                <div className="zmiti-tab-C">
                       <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
                           <TabPane tab="我的作品" key="1">
                               <div className="zmiti-tab-my-project">
                                   {richImg}
                               </div>
                           </TabPane>

                           <TabPane tab="公司作品" key="3">
                               <div className="zmiti-tab-company-project">
                                   {richImg}
                               </div>
                           </TabPane>
                           <TabPane tab="平台作品" key="4">
                               <div className="zmiti-tab-platform-project">
                                   {richImg}
                               </div>
                           </TabPane>
                       </Tabs>
                </div>
            </div>
        )
    }
}

ZmitiMainContent.defaultProps = {
    baseUrl: 'http://webapi.zmiti.com/v1/',
    getusersigid: "09ab77c3-c14c-4882-9120-ac426f527071",
    getUserInfoUrl:'works/get_worksinfo',
    deleteRichImgUrl:'works/del_works'
};

class MainUI extends React.Component {
    constructor(args) {
        super(...args);
    }

    render() {

        let s = this;
        const props = {
            baseUrl: 'http://webapi.zmiti.com/v1/',
            onFinish(imgData){

                $.ajax({
                    url: s.props.baseUrl + 'works/create_works',
                    type: "POST",
                    data: {
                        worksname: "",
                        worksdesc: "",
                        imgSrc: imgData.src,
                        workstag: '',
                        workico: '',
                        datajsontwo: '',
                        datajsonth: '',
                        comtent: '',
                        datajson: JSON.stringify({
                            richImgData: {
                                tags: [],
                                focusTagIndex: 0
                            }
                        }),
                        workstype: 0,//富图片。
                        getusersigid: s.props.getusersigid
                    },
                    success(da){

                        if (da.getret === 0) {
                            let richimg = {
                                projectId: da.projectId,
                                imgSrc: da.imgSrc,
                                jsonSrc: da.jsonSrc
                            }

                            window.location.href= './index.html?richimg='+ encodeURI(JSON.stringify(richimg));

                        }
                    },
                    error(){

                    }

                });
            }
        };

        return (
            <div className="zmiti-main-ui">
                <ZmitiHeader></ZmitiHeader>
                <ZmitiMainContent></ZmitiMainContent>
                <ZmitiUploadDialog  id="image" {...props}></ZmitiUploadDialog>
            </div>
        )
    }
}
MainUI.defaultProps = {
    baseUrl: 'http://webapi.zmiti.com/v1/',
    getusersigid: "09ab77c3-c14c-4882-9120-ac426f527071"
}

ReactDOM.render(<MainUI></MainUI>, document.getElementById('fly-main'));



