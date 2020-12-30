<template>
	<div class="me-container">
        <!-- personalCenter start -->
		<view class="personal-center-warp" v-if="isLogin">
            <view class="user-info">
                <image class="avatar" :src="userInfo.avatar" mode="aspectFill"  @click="navigato('../../user/changeUserInfo/changeUserInfo')"></image>
                <text class="username" @click="navigato('../../user/changeUserInfo/changeUserInfo')">{{userInfo.username}}</text>
            </view>
            
            <view class="functions">
                <view class="item" @click="navigato('../../contacts/contacts')">
                    <i class="iconfont icon-group"></i> 
                    <text>好友</text>
                </view>
                <view class="item" @click="navigato('../../articles/favoriteArticles/favoriteNews')">
                    <i class="iconfont icon-book"></i>
                    <text>收藏文章</text>
                </view>
            </view>
            
            <view class="line"></view>
            <view class="setting item" @click="navigato('../../setting/setting')">
                <i class="iconfont icon-setup"></i>
                <text>设置</text>
            </view>
        </view>
        <!-- personalCenter end -->
        
        <!-- login/register start -->
        <view class="login-warp" v-else>
            <view class="title">
                <h1>SUDO</h1>
                <p>the android homework</p>
            </view>
            <image class="img" src="../../../static/imgs/me_bg2.jpg" ></image>
            <view class="control-btns">
                <button class="login btn" @click="navigato('../../user/login/login','slide-in-top')">登录</button>
                <button class="register btn"@click="navigato('../../user/register/register','slide-in-top')">注册</button>
            </view>
        </view>
        <!-- login/register end -->
	</div>
</template>

<script>
    import { getToken,getUserInfo,setUserInfo } from '../../../utils/auth.js'
    import { getUserinfo } from '../../../api/user.js'
    
	export default {
		name:'me',
		data() {
			return {
				isLogin:false,
                // userInfo
                userInfo:{
                    avatar:null,
                    username:null
                }
			}
		},
        methods:{
            // 路由跳转
            navigato(path,animationType='pop-in',time=300) {
                uni.navigateTo({
                    url:path,
                    animationType:animationType,
                    animationDuration:time
                })
            },
        },
        onLoad() {
            const token = getToken()
            if(token) {
                getUserinfo(token).then(res => {
                    setUserInfo(res.data)
                })
            }
        },
        onShow() {
            const token = getToken()
            if(token) {
                let userinfo = getUserInfo()
                let {avatar,name} = userinfo
                this.userInfo = {
                    avatar,
                    username:name
                }
                this.isLogin = true
            }else{
                this.isLogin = false
            }
        }
	}
</script>

<style>
    page{
        background-color: #fff;
        min-height: 100%;
        width: 100%;
        display: flex;
    }
    .me-container{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    /* 用户信息 start */
    .personal-center-warp{
        flex: 1;
    }
    .user-info{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50%;
        background-image: url(../../../static/imgs/me_bg.jpg);
        background-size: 100%;
        background-position: center 30%;
        color: white;
    }
    .user-info::before{
        content: '';
        position: absolute;
        width: 100%;
        height: 50%;
        background: rgba(0,0,0,.2);
    }
    .user-info .avatar{
        width: 180rpx;
        height: 180rpx;
        border-radius: 50%;
        border: 2px solid white;
        z-index: 10;
    }
    .user-info .username{
        margin-top: 40rpx;
        max-width: 50%;
        font-size: 40rpx;
        z-index: 10;
    }
    /* 用户信息 end */
    
    /* 功能/设置 start */
    .functions,.setting{
        margin-top: 24rpx;
    }
    
    .line{
        flex: 0;
        margin: 10rpx auto;
        width: 90%;
        border-bottom: .1px solid rgb(103,103,103);
    }
    .item {
        height: 50rpx;
        padding: 20rpx 40rpx 30rpx;
        font-size: 30rpx;
        color: rgb(103, 103, 103);
    }
    .item::after{
        content: '>';
        color: rgb(103, 103, 103);
        position: absolute;
        font-size: 40rpx;
        right: 50rpx;
    }
    .item .iconfont{
        height: 40rpx;
        width: 40rpx;
        display: inline-block;
        text-align: center;
    }
    .item text{
        line-height: 40rpx;
        margin-left: 20rpx;
    }
    /* 功能设置 end */
    
    /* 登录/注册 start */
    .login-warp{
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: white;
    }
    .login-warp .title {
        text-align: center;
    }
    .login-warp .img{
        width: 400rpx;
        height: 600rpx;
    }
    .login-warp .control-btns {
        margin-top: 200rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .control-btns .btn{
        margin: 0 60rpx;
        padding: 0 80rpx;
    }
    /* 登录/注册 end */
    
</style>
