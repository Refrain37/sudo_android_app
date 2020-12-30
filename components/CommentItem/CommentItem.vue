<template>
	<div class="comment-item-container">
        <image class="avatar" :src="userAvatar" mode="aspectFill"></image>
		<view class="main">
            <text class="username">{{username}}</text>
            <text class="content">{{content}}</text>
            <text class="time">{{time}}</text>
        </view>
	</div>
</template>

<script>
    import { parseTime } from '../../utils/index.js'
    const format = '{m}/{d} {h}:{i}'
    
	export default {
		name:'comment-item',
        props:{
          content:String,
          create_at:Number,
          username:String,
          userAvatar:String
          
        },
        computed:{
            time() {
                return parseTime(this.create_at,format)
            }
        }
	}
</script>

<style scoped lang="scss">
    .comment-item-container{
        padding: 20rpx;
        padding-left: 10rpx;
        display: flex;
        flex-direction: row;
        .avatar{
            height: 70rpx;
            width: 70rpx;
            border-radius: 50%;
        }
        .main{
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-left: 20rpx;
            .username{
                font-size: 30rpx;
            }
            .content{
                margin-top: 10rpx;
                min-height: 50rpx;
                font-size: 30rpx;
            }
            .time{
                margin-top: 20rpx;
                font-size: 24rpx;
            }
        }
    }
</style>
