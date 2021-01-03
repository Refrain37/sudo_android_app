<template>
	<div class="change-userinfo-container">
		<view class="userInfo-img">
            <text class="title">头像</text>
            <view class="image-upload" >
            	<view class="image-choose-show" v-show="newAvatar === ''"  style="display: flex; justify-content: center;">
            		<view class="image-choose" @tap="chooseImg"></view>
            	</view>
            	<view class="image-show" v-if="newAvatar !== ''" style="position: relative;display: flex; justify-content: center;">
            		<image class="image-image" mode="aspectFill" :src="newAvatar" @click="previewImg"></image>
            		<view class="close-view" @click="close">x</view>
            	</view>
            </view>
        </view>
        <view class="userInfo-introduction">
            <text class="title">个人介绍</text>
            <input class="input" type="text" v-model="introduction" placeholder="请输入自我介绍" />
        </view>
        
        <button class="submit-btn" type="default" @click="submit">确认修改</button>
	</div>
</template>

<script>
    import { getUserinfo,changeUserinfo } from '../../../api/user.js'
    import { upload } from '../../../api/upload.js'
    import { setUserInfo,getUserInfo } from '../../../utils/auth.js'
    
	export default {
		name:'change-user',
		data() {
			return {
                oldAvatar:'',
				newAvatar:'',
                introduction:' ',
			}
		},
        methods:{
            // 选择照片
            chooseImg() {
                let _self = this
                uni.chooseImage({
                    count:1,
                    success(res) {
                        _self.newAvatar = res.tempFilePaths[0]
                    }
                })
            },
            // 预览
            previewImg() {
                uni.previewImage({
                    urls:this.newAvatar.split(',')
                })
            },
            // 删除图片
            close() {
                this.newAvatar = ''
            },
            // 提交
            async submit() {
                uni.showLoading({
                    title: '正在修改...'
                });
                
                let imgPath = this.oldAvatar
                // 判断是否修改头像
                if(this.newAvatar !== this.oldAvatar){
                    const res = await upload('img',this.newAvatar) 
                    imgPath = JSON.parse(res).data.avatarUrl
                }
                
                let res = await changeUserinfo(imgPath,this.introduction)
                uni.hideLoading();
                if(res.code === 200) {
                    let userInfo = res.data
                    setUserInfo(userInfo) // change userInfo
                    uni.navigateBack()
                }
            },
            getInfo() {
               let {avatar,introduction} = getUserInfo()
               this.oldAvatar = avatar
               this.newAvatar = avatar
               this.introduction = introduction
            } 
        },
        onLoad() {
            this.getInfo()
        }
	}
</script>

<style scoped>
    .change-userinfo-container{
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }
    .userInfo-img, .userInfo-introduction{
        display: flex;
        flex-direction: column;
        background-color: #FFFFFF;
    }
    .userInfo-img .title,.userInfo-introduction .title{
        padding: 15rpx;
        font-size: 30rpx;
    }
    
    /* choose img start */
    .image-upload{
        padding: 15rpx 30rpx;
        background-color: #FFFFFF;
    }
    .image-choose-show {
    	position: relative;
    	margin:10upx;
    	width: 208upx;
    	height: 208upx;
    	border: 1px  solid #808080;
    }
    .image-choose-show:before,
    .image-choose-show:after {
    	content: " ";
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	-webkit-transform: translate(-50%, -50%);
    	transform: translate(-50%, -50%);
    	background-color: #808080;
    }
    .image-choose-show:before {
    	width: 4upx;
    	height: 79upx;
    }
    .image-choose-show:after {
    	width: 79upx;
    	height: 4upx;
    }
    .image-choose-show:active {
    	border-color: #999999;
    }
    .image-choose-show:active:before,
    .image-choose-show:active:after {
    	background-color: #999999;
    }
    .image-choose {
    	position: absolute;
    	z-index: 1;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%;
    	opacity: 0;
    }
    .image-show {
    	margin: 10upx;
    	width: 210upx;
    	height: 210upx;
    }
    .image-image{
    	display: block;
    	width: 210upx;
    	height: 210upx;
    }
    .close-view{
        text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
    }
    /* choose img end */
    
    /* introduction start */
    .userInfo-introduction{
        margin-top: 20rpx;
    }
    .input{
        padding: 30rpx;
        font-size: 34rpx;
    }
    /* introduction end */
    
    /* submit-btn start */
    .submit-btn{
        margin-top: 30rpx;
        width: 100%;
        border-radius: 0;
        border: 0;
        background-color: #fff;
    }
    .submit-btn::after{
        border: 0;
        border-radius: 0;
    }
    /* submit-btn end */
</style>
