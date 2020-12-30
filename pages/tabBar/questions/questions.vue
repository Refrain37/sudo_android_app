<template>
	<div class="questions-container">
		<view class="classify" :class="item.class" 
        v-for="(item,index) in list" 
        :key="index" 
        @click="navigato(item.type)">
            <text class="title">{{item.title}}</text>
            <text class="sub">{{item.subTitle}}</text>
        </view>
	</div>
</template>

<script>
    import { checkStatus } from '../../../utils/index.js'
    
	export default {
		name:'questiosn',
		data() {
			return {
				list:[
                    {
                        title:'每日答题',
                        subTitle:'太阳每天都是新的',
                        class:'today',
                        type:'today'
                    },
                    {
                        title:'每周答题',
                        subTitle:'周而复始，如期而至',
                        class:'week',
                        type:'weekly'
                    },
                    {
                        title:'专项答题',
                        subTitle:'术业有专攻，道义有精论',
                        class:'special',
                        type:'special'
                    }
                ]
			}
		},
        methods:{
           navigato(type) {
               if(!checkStatus('../me/me')) {
                 return
               }else {
                   if(type === 'today') {
                       uni.navigateTo({
                           url:'../../questions/questionDetail/questionDetail?type=daily'
                       })
                   }else{
                        uni.navigateTo({
                            url:`../../questions/questionList/questionList?type=${type}`
                        })
                   }
               }
           }
        },
        onNavigationBarButtonTap(obj) {
            if(obj) {
                if(!checkStatus()) {
                   return
                }
                
                uni.navigateTo({
                    url:'../../questions/answerRecords/answerRecords'
                })
            }
        }
	}
</script>

<style scoped>
    page{
        min-height: 100%;
        width: 100%;
        display: flex;
    }
    
    .questions-container{
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 50rpx 0;
        box-sizing: border-box;
    }
    .questions-container .classify{
        width: 70%;
        height: 300rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 0px solid transparent;
        border-radius: 7px;
        background-color: #fff;
        color: #fff;
        overflow: hidden;
    }
    .questions-container .classify::after{
        content: '';
        position: absolute;
        height: 300rpx;
        width: 70%;
        border-radius: 7px;
        background-color: rgba(0,0,0,.3);
    }
    .questions-container .classify text{
        z-index: 10;
    }
    
    .questions-container .classify text{
        z-index: 10;
    }
    .questions-container .classify .title{
        font-size: 40rpx;
    }
    .questions-container .classify .sub{
        margin-top: 10rpx;
        color: rgb(240,240,240);
        font-size: 30rpx;
    }
    .questions-container .today{
        background-image: url(../../../static/imgs/question_bg1.jpg);
        background-size: cover;
    }
    .questions-container .week {
        background-image: url(../../../static/imgs/question_bg2.jpg);
    }
    .questions-container .special {
        background-image: url(../../../static/imgs/question_bg3.jpg);
    }
    
</style>
