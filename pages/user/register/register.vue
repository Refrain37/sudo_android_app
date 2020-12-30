<template>
	<div class="register-container">
		<h1>SIGN IN</h1>
		<view class="form">
		    <input class="uni-input" type="text" v-model="username" placeholder="请输入用户名" />
		    <input class="uni-input" type="text" v-model="password" password="true" placeholder="请输入登录密码" />
            <input class="uni-input" type="text" v-model="password_confirm" password="true" placeholder="确认登录密码" />
		    <button type="default" @click="signIn">确认注册</button>
		</view>
		<text class="tips" @click="navigato">已有账号？点击登录</text>
	</div>
</template>

<script>
    import {register} from '../../../api/user.js'
    
	export default {
		name:'register',
		data() {
			return {
				username:null,
                password:null,
                password_confirm:null
			}
		},
        methods:{
            // check
            check() {
                if(this.password !== this.password_confirm) {
                    uni.showToast({
                        title:'两次密码不同，请重新输入',
                        icon:'none'
                    })
                    return false
                }
                return true
            },
            // sign in
            async signIn() {
                if(this.check()) {
                  try{
                       let res = await register(this.username,this.password)
                       if(res) {
                           uni.showToast({
                               title:'注册成功!',
                               icon:'none'
                           })
                           this.navigato()
                       }
                  }catch(e){
                      uni.showToast({
                          title:'注册失败，请检查!',
                          icon:'none'
                      })
                  }
                }
            },
            navigato() {
                uni.redirectTo({
                    url:'../login/login'
                })
            }
        }
	}
</script>

<style scoped>
    .register-container {
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
    .register-container::after{
        content: '';
        position: absolute;
        width: 100%;
        height: 100vh;
        background: rgba(0,0,0,.5);
    }
    .register-container h1{
        text-align: center;
        z-index: 10;
    }
    .register-container .form{
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
    .register-container .form button{
        margin-top: 60rpx;
        border: 0px solid transparent;
        border-radius: 30px;
    }
    .register-container .tips{
        position: absolute;
        bottom: 100rpx;
        z-index: 10;
    }
</style>
