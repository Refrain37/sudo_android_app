<template>
	<div class="login-container">
        <h1>LOGIN IN</h1>
		<view class="form">
            <input class="uni-input" type="text" v-model="username" placeholder="请输入用户名" />
            <input class="uni-input" type="text" v-model="password" password="true" placeholder="请输入密码" />
            <button type="default" @click="Login">确认登录</button>
        </view>
        <text class="tips" @click="navigato">还没有账号？点击注册</text>
	</div>
</template>

<script>
    import { login,getUserInfo } from '../../../api/user.js'
    import { setToken,setUserInfo} from '../../../utils/auth.js'

	export default {
		name:'login',
		data() {
			return {
				username:null,
                password:null
			}
		},
        methods:{
            // navigato registerPage
            navigato() {
                uni.redirectTo({
                    url:'../register/register'
                })
            },
            async Login() {
               if(!this.username || !this.password) {
                   uni.showToast({
                       title:'账号或密码为空，请检查',
                       icon:'none'
                   })
                   return
               }
               try{
                   const res = await login(this.username,this.password)
                   const token = res.data.token.token // token
                   const userInfo = res.data.user // userInfo
                   setToken(token)
                   setUserInfo(userInfo)
                   this.username = null
                   this.password = null
                   uni.navigateBack()
               }catch(e){
                   console.log(e);
                   uni.showToast({
                       title:'登录失败，请检查!',
                       icon:'none'
                   })
               }
            }
        }
	}
</script>

<style scoped>
    .login-container {
        min-height: 100vh; 
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: url(../../../static/imgs/me_bg1.jpg);
        background-size: 100% 100%;
        color: white;
    }
    .login-container::after{
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.5);
    }
    .login-container h1{
        text-align: center;
        z-index: 10;
    }
    .login-container .form{
        margin-top: 20rpx;
        z-index: 10;
    }
    uni-input.uni-input{
        width: 500rpx;
        margin-top: 30rpx;
        padding: 20rpx 40rpx;
        border: 0px solid transparent;
        border-radius: 8px;
        background: rgba(255,255,255,.7);
    }
    .login-container .form button{
        margin-top: 60rpx;
        border: 0px solid transparent;
        border-radius: 30px;
    }
    .login-container .tips{
        position: absolute;
        bottom: 100rpx;
        z-index: 10;
    }
</style>
