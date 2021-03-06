import React from 'react';
import './zmiti-richimg.css';
import { Icon,message,Modal,Tag} from '../../../commoncomponent/common.jsx';

const confirm = Modal.confirm;
import $ from 'jquery';
import {Link} from 'react-router';



export default class ZmitiRichImg extends React.Component {
    constructor(args) {
        super(...args);
        this.operatorRichImg = this.operatorRichImg.bind(this);
    }

    showConfirm(e){
        let s =this;
        confirm({
            title: '您是否确认要删除该富图片?',
            content: '删除之后将无法恢复',
            onOk() {
                $.ajax({
                    url: s.props.baseUrl + s.props.deleteRichImgUrl,
                    type: "POST",
                    data: {
                        worksid: s.props.worksid,
                        getusersigid: s.props.getusersigid
                    },
                    success(data){
                        if (data.getret === 0) {

                            //s.props.deleteRichImg(s.props.index);
                            message.success('删除成功');
                            $(e.target).parents('.zmiti-richimg-C').remove();
                        }
                    },
                    error(){

                    }
                })
            },
            onCancel() {},
        });
    }

    operatorRichImg(e) {
        e.preventDefault();//阻止a标签默认跳转行为
        e.persist();
        let s = this;
        if (e.target.nodeName === "LI") {
            let index = $(e.target).index();
            switch (index) {
                case 0://预览
                    break;
                case 1://删除
                    s.showConfirm(e);
                    break;
                case 2://分享
                    break;
            }
        }

        return false;
    }

    render() {

        let richimg = {
            projectId: this.props.worksid,
            imgSrc: this.props.imgurl,
            jsonSrc: this.props.datajsonpath,
            userid:this.props.userid,
            getusersigid:this.props.getusersigid
        }




        let p = richimg.userid+'/'+richimg.getusersigid+'/'+richimg.projectId+'/'+richimg.imgSrc+'/'+ richimg.jsonSrc;

        return (
            <div className="zmiti-richimg-C">
                <Link to={'/richimg#/'+ p} >
                    <img src={this.props.worksico} alt="" draggable="false"/>
                    <div className="zmiti-name">{this.props.worksname || '新建作品'}</div>
                    <div className="zmiti-label">
                        {this.props.workstag.split(',').map((tag,i)=>{
                           return <Tag color="red" key={i}>{tag}</Tag>
                        })}
                    </div>
                    <div className="zmiti-athor-C">
                        <aside>作者：<span>{this.props.username}</span></aside>
                        <aside>
                            <Icon type="setting"></Icon>
                            <ul onClick={this.operatorRichImg}>
                                <li><Icon type="eye"></Icon>预览</li>
                                <li><Icon type="delete"></Icon>删除</li>
                                <li><Icon type="share-alt"></Icon>分享</li>
                            </ul>
                        </aside>
                    </div>
                </Link>
            </div>
        )
    }
}