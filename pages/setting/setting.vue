<template>
	<div class="setting-container">
        <view class="personal-info">
            <view class="header"><text>个人信息</text><text class="change-btn" @click="change">修改</text></view>
            <view class="avatar item"><text class="title">头像</text><image class="img" :src="avatar" mode="aspectFill" @click="preview"></image></view>
            <view class="username item"><text class="title">用户名</text><text class="content">{{username}}</text></view>
            <view class="introduction item"><text class="title">个人介绍</text><text class="content">{{introduction}}</text></view>
        </view>
        <view class="about">
            <view class="header"><text>关于</text></view>
            <view class="us item" @click="navigato"><text class="title">关于Sudo</text><text class="nav-btn">></text></view>
            <view class="version item"><text class="title">版本</text>1.0.0</view>
        </view>
        <button class="logout-btn" type="default" @click="logOut">退出登录</button>
	</div>
</template>

<script>
    import { getUserInfo,removeToken,removeUserInfo} from '../../utils/auth.js'
    
	export default {
		name:'setting',
		data() {
			return {
                avatar:null,
				username:null,
                introduction:null
			}
		},
        methods:{
            getInfo() {
              let {name,avatar,introduction} = getUserInfo()
              this.avatar = avatar
              this.username = name
              this.introduction = introduction  
            },
            // 修改个人信息
            change() {
                uni.navigateTo({
                   url: '../user/changeUserInfo/changeUserInfo'
                })
            },
            navigato() {
              uni.navigateTo({
                  url:'../about/about',
                  animationType:'zoom-fade-out'
              })  
            },
            // 预览头像
            preview() {
                uni.previewImage({
                    urls:this.avatar.split(',')
                })
            },
            // 退出登录
            logOut() {
                removeToken()
                removeUserInfo()
                uni.switchTab({
                    url:'../tabBar/me/me'
                })
            }
        },
        onLoad() {
            this.getInfo()
        },
        onShow() {
            this.getInfo()
        }
    }
</script>

<style scoped>
    .setting-container{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    /* 个人信息 start */
    .setting-container .personal-info{
        width: 100%;
        font-size: 30rpx;
    }
    .personal-info .header {
        padding: 15rpx 40rpx 15rpx 30rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .personal-info .header .change-btn {
        padding: 5rpx 20rpx;
        border: .1px solid black;
        border-radius: 7px;
    }
    .personal-info .item{
        background-color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx;
        border-bottom: .1px solid rgb(149, 149, 149);
    }
    .personal-info .item:last-child{
        border-bottom: 0;
    }
    .personal-info .avatar .img{
        width: 160rpx;
        height: 160rpx;
    }
    .personal-info .item .content {
        max-width: 66%;
    }
    /* 个人信息 end */
    
    /* 关于 start */
    .setting-container .about{
        width: 100%;
        font-size: 30rpx;
    }
    .about .header {
        padding: 15rpx 30rpx;
    }
    .about .item{
        background-color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx;
        border-bottom: .1px solid rgb(149, 149, 149);
    }
    .about .item:last-child{
        border-bottom: 0;
    }
    .about .us .nav-btn{
        font-size: 40rpx;
    }
    /* 关于 end */
    .logout-btn{
        margin-top: 30rpx;
        width: 100%;
        border-radius: 0;
        border: 0;
        background-color: #fff;
    }
    .logout-btn::after{
        border: 0;
        border-radius: 0;
    }
</style>
