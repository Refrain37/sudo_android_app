<template>
	<div class="chat-container">
		<scroll-view id="chatView" class="chat-view" :scroll-top="scrollTop" scroll-y="true" scroll-with-animation>
            <view id="message" class="message" v-for="(msg,index) in chattingRecord" :class="msg.source">
                <image class="avatar" :src="msg.source === 'friend'? friendInfo.avatar: myInfo.avatar" mode="aspectFill"></image>
                <text class="content">{{msg.msg}}</text>
            </view>
            <view id='bottom' style='height:1px;width:100%'></view>
		</scroll-view>
        <view class="input-warp">
            <input class="input" type="text" v-model="message" />
            <button class="send-btn" type="default" @click="send">发送</button>
        </view>
	</div>
</template>

<script>
    import config from '../../../config.js'
    import { showError } from '../../../utils/index.js'
    import {getUserInfo} from '../../../utils/auth.js'
    
    // wscode
    const SEND_CODE = 11
    const CONNECT_FAILED_CODE = -1
    const CONNECT_SUCCEED_CODE = 3
    
	export default {
		name:'chat',
		data() {
			return {
                // 我的信息
                myInfo:{
                    id:null,
                    username:null,
                    avatar:'',
                },
                // 好友信息
                friendInfo:{
                    id:null,
                    name:null,
                    avatar:null
                },
                scrollTop:0,
                oldbottom :0,
                message:'', // 输入的信息
                chattingRecord:[] ,// 聊天记录
                // ws
                connected:false,
                connecting:false,
                hasLogin:false
			}
		},
        methods:{
          init(e) {
              // 设置好友信息
              let {id,name,avatar} = e
              this.friendInfo = {
                  id,
                  name,
                  avatar
              }
              // 设置个人信息
              let info = getUserInfo()
              this.myInfo = {
                  id:info.id,
                  username:info.name,
                  avatar:info.avatar
              }
              this.setNavigatorTitle(name) // 设置标题
              this.open() // 打开websocekt
          },
          // 设置标题  
          setNavigatorTitle(title) {
              uni.setNavigationBarTitle({
                  title:title
              })
          },
          // 格式化发送信息
          formatMsg(message) {
              let msg = {
                  "source_id":Number(this.myInfo.id),
                  "des_id":Number(this.friendInfo.id),
                  "message":String(message),
                  "type": SEND_CODE
              }
              return JSON.stringify(msg)
          },
          // 发送信息
          send() {
              if(!this.hasLogin) {
                   showError()
                   return
              }
              if(this.message === '') {
                  return
              }
              
              let msg = this.formatMsg(this.message)
              this.sendMsg(msg,() => {
                  this.chattingRecord.push({
                      msg:this.message,
                      source:'my'
                  })
              })
              this.message = '' // clear
          },
          // 滚动到底部
          scrollToBottom() {
              uni.createSelectorQuery().select("#bottom").boundingClientRect(res => {
                  let newbottom = res.bottom
                  if(Number(newbottom) > Number(this.oldbottom)){
                          this.scrollTop = newbottom
                  }
                  this.oldbottom = newbottom
              }).exec();
          },
          scrollInit() {
              uni.createSelectorQuery().select("#bottom").boundingClientRect((res)=>{
                  this.oldbottom = res.bottom  // 记录滚动元素的 bottom 值
              }).exec();
          },
          // websocket
          open() {
              if(this.connected || this.connecting) {
                  return false
              }
              this.connecting = true
              
              uni.connectSocket({
                  url:config.wsURL,
                  success() {
                      console.log('connet success')
                  },
                  fail() {
                      console.log('connet err')
                  }
              })
              uni.onSocketOpen((res) => {
              	this.connecting = false
              	this.connected = true
                this.login() // login
              })
              
              uni.onSocketError((err) => {
              	this.connecting = false
              	this.connected = false
              	console.log('connect error', err);
              })
              
              uni.onSocketMessage((res) => {
                  let data = JSON.parse(res.data)
                  console.log(data)
                  switch (data.type){
                      case CONNECT_FAILED_CODE:
                          showError()
                          break;
                      case CONNECT_SUCCEED_CODE:
                          this.hasLogin = true
                          break;
                      default:
                        this.receive(data)
                          break;
                  }
              })
              
              uni.onSocketClose((res) => {
              	this.connected = false
              	this.startRecive = false
              })
          },
          login() {
             const loginMsg = JSON.stringify({
                 "id":Number(this.myInfo.id),
                 "name":String(this.myInfo.username)
             })
             this.sendMsg(loginMsg)
          },
          receive(data) {
             let {source_id,des_id,message} = data
             if(source_id === Number(this.friendInfo.id) && des_id === this.myInfo.id) {
                this.chattingRecord.push({
                    msg:message,
                    source:'friend'
                })
             }
          },
          sendMsg(msg,cbk) {
              if(!this.connected || this.connecting) {
                 return 
              }
              uni.sendSocketMessage({
              	data:msg,
              	success(res) {
                    cbk && cbk()
              	},
              	fail(err) {
                    showError()
              	}
              })
          },
          close() {
            this.connected = false
            this.connecting = false
            uni.closeSocket()
          }
        },
        onLoad(e) {
             this.init(e)
        },
        onUnload() {
          this.close()  
        },
        mounted(){
            this.scrollInit()
        },
        updated(){
            this.scrollToBottom()
        }
	}
</script>

<style scoped>
    .chat-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 30rpx;
    }
    .chat-view{
        height:calc(100vh - 130rpx);
    }
    .chat-view .message{
        width: 90%;
        display: flex;
        box-sizing: border-box;
        margin: 30rpx auto;
    }
    .chat-view .message:first-child{
        margin-top: 60rpx;
    }
    .friend {
        flex-direction: row;
    }
    .my {
        flex-direction: row-reverse;
    }
    .chat-view .message .avatar{
        height: 80rpx;
        width: 80rpx;
        min-height: 80rpx;
        min-width: 80rpx;
        border: 0px solid transparent;
        border-radius: 50%;
    }
    .chat-view .message .content {
        max-width: calc(80% - 80rpx);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 30rpx;
        padding: 20rpx;
        border: 0px solid transparent;
        border-radius: 5px;
        background-color: #fff;
    }
    /* 输入框 start*/
    .chat-container .input-warp{
        width: 100%;
        height: 100rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding:10rpx 40rpx;
        box-sizing: border-box;
    }
    .chat-container .input{
        height: 100%;
        flex: 1;
        padding:10rpx 20rpx;
        box-sizing: border-box;
        border: 0px solid transparent;
        border-radius: 7px;
        background-color: #fff;
    }
    .chat-container .send-btn{
        margin-left: 20rpx;
        padding: 10rpx 30rpx;
        border: 0px solid transparent;
        border-radius: 7px;
        font-size: 30rpx;
        line-height: 60rpx;
    }
    .chat-container .send-btn::after{
        border: 0px solid transparent;
        border-radius: 7px;
    }
    /* 输入框 end */
</style>
