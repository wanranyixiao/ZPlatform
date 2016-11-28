import React from 'react';
import './scss/zmiti-stage.css';
import PubSub from '../js/pubsub';
import ShapeGenerater from '../shapes.jsx';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import  ZmitiUploadDialog from '../../../components/zmiti-upload-dialog.jsx';

export default class ZmitiStage extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            imgList: [],
            width: 1000,
            height: 500,
            scale:1 //当前舞台的缩放比例
        };
    }

    drag(bmp){
        let s=  this;
        var disX, disY;

        bmp.on("mousedown", function (e) {
            if (s.isDrag) { //用户按下空格键，则不能拖拽图片。
                return;
            }
            
            e.preventDefault()
            
            var L  = document.querySelector('.fly-right-aside').offsetLeft;
            disX = e.stageX - bmp.x +  s.canvas.offsetLeft - s.canvas.width/2 + L;
            disY = e.stageY - bmp.y + s.canvas.offsetTop- s.canvas.height/2 + 50;
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", function () {
                document.removeEventListener("mousemove", moveHandler);
            });
        });

        function moveHandler(e) {
            
            bmp.x = e.x - disX;
            bmp.y = e.y - disY;
            s.stage.update();
        }

    }

    render() {
        let s = this;
        const props = {
            S:this,
            baseUrl: s.props.baseUrl,
            getusersigid: s.props.getusersigid,
            userid: s.props.userid,
            onFinish(imgData){


                s.state.imgList.push(imgData.src);
                s.forceUpdate();

                let img = new Image();
                imgData.target.text.text = '        loading...';

                img.crossOrigin = "anonymous";
                
                img.onload = function () {

                    let bmp = new createjs.Bitmap(this);
                    bmp.x =  imgData.target.x;
                    bmp.y =  imgData.target.y;
                    imgData.target.text.alpha = 0;

                    s.stage.addChild(bmp);

                    bmp.mask = imgData.target.rect;

                    s.stage.update();
                    s.drag(bmp);
                };
                console.log(imgData.src);
                img.src = imgData.src;//'http://api.zmiti.com/zmiti_ele/user/xuchang/material/20161127/9898db3eb0c472ac10d1eb39523622b2.jpg';
                        //;
            }
        };
        var stageStyle = {
       /*     transform:'scale('+this.state.scale+')',
            WebkitTransform:'scale('+this.state.scale+')'*/
        }
        return (
            <article className="z-puzzle-stage">
                <div className="z-puzzle-canvas-C">
                    <canvas ref="z-puzzle-canvas" style={stageStyle} width={this.state.width} height={this.state.height}></canvas>
                    <ZmitiUploadDialog id="puzzle" {...props}></ZmitiUploadDialog>
                </div>
                <ul className='z-puzzle-operator'>
                    <li><span><Icon type='scan'></Icon></span></li>
                    <li><span><Icon type='plus-circle-o'></Icon></span></li>
                    <li><span><Icon type='minus-circle-o'></Icon></span></li>
                </ul>
            </article>
        )
    }

    componentDidMount() {
        var size = obserable.trigger({type:'getPicmMargin'});
        this.renderCanvas('renderRectLeftRight',null,size);

        PubSub.subscribe('renderCanvas', (e, data)=> {
            this.renderCanvas(data.method,null,data.marginSize);
        });
        var s = this;
        window.obserable.on("renderCanvas",(method)=>{
          
            s.renderCanvas(method);
        });

        window.obserable.on('setCanvasWidth',(width)=>{
            s.setState({
                width: width
            })
        })

        PubSub.subscribe('setCanvasWidth', (e, width)=> {
            this.setState({
                width: width
            })
        });

        window.obserable.on('setCanvasHeight',(height)=>{

            s.setState({
                height: height
            })
        })

       PubSub.subscribe('setCanvasHeight', (e, height)=> {
            this.setState({
                height: height
            })
        });

        this.isDrag = false;
        document.addEventListener('keydown', e=> {
            if (e.keyCode === 32) {
                this.isDrag = true;
                this.canvas.style.cursor = 'pointer';
            }
            ;
        });

        document.addEventListener('keyup', e=> {
            if (e.keyCode === 32) {
                this.isDrag = false;
                this.canvas.style.cursor = 'default';
            }
        });

        this.canvas.onmousedown = e=> {
            if (this.isDrag) {
                let disX = e.pageX - this.canvas.offsetLeft,
                    disY = e.pageY - this.canvas.offsetTop;

                document.onmousemove = ev => {
                    this.canvas.style.left = ev.pageX - disX + 'px';
                    this.canvas.style.top = ev.pageY - disY + 'px';
                }
                document.onmouseup = ev=> {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }

    }
    /**
     * 重新渲染canvas画布
     * @param  {String} method     [description]
     * @param  {[type]} target     [description]
     * @param  {Number} marginSize [description]
     * @return {[type]}            [description]
     */
    renderCanvas(method = 'renderRectLeftRight',target= null,marginSize=0) {

        this.canvas = this.canvas || this.refs['z-puzzle-canvas'];

        if (!this.canvas) return;

        let {width,height} = this.state;
        console.log(this.state)
       
        !this.stage && (this.stage = new createjs.Stage(this.canvas));
        this.stage.removeAllChildren();

        let colors = ['#ff99c1', '#ffdb71','#b6d172','#aaddff','#78c9ba'];

        let stage = this.stage,
            s = this;

        ShapeGenerater[method]({stage, colors, width, height,marginSize}, function () {
            let arr = Array.from(arguments);

            if(s.state.imgList.length){
                if(s.state.imgList.length >= arr.length){
                    arr.forEach((img,i)=> {
                        let image = new Image();
                        //image.crossOrigin = "Anonymous";
                        arr[i].text.alpha =1;//显示loading
                        stage.update();
                        image.onload = function(){
                            let bmp = new createjs.Bitmap(this);

                            bmp.x =arr[i].x || 0;
                            bmp.y =arr[i].y || 0;

                            stage.addChild(bmp);
                            bmp.mask = arr[i].rect;
                            arr[i].text.alpha =0;//隐藏loading.
                            s.drag(bmp);
                            stage.update();
                        }
                        image.src = s.state.imgList[i];

                    });
                }
                else{
                    s.state.imgList.forEach((img,i)=> {
                        let image = new Image();
                        arr[i].text.alpha =1;//显示loading
                        stage.update();
                        image.crossOrigin = "Anonymous";
                        image.onload = function(){
                            let bmp = new createjs.Bitmap(this);
                            bmp.x =bmp.y =0;
                            stage.addChild(bmp);
                            bmp.mask = arr[i].rect;
                            arr[i].text.alpha =0;//隐藏loading.
                            s.drag(bmp);
                            stage.update();
                        }
                        image.src = img;

                    });
                }

            }

        },target);

    }


}