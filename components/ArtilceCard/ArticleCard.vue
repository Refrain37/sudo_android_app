<template>
	<div class="article-card-container" @tap="navigato">
		<view class="info-body">
            <text class="title">{{title}}</text>
            <view class="bottom">
                <view class="time">
                    <icon type="#676767" class="iconfont icon-time icon"></icon>
                    <text>{{timeFormated}}</text>
                </view>
                <view class="comment-count">
                    <icon type="#676767" class="iconfont icon-comment icon"></icon>
                    <text>{{commentCount}}</text>
                </view>
            </view>
        </view>
        <image class="info-cover" v-if="cover!==''" :src="cover" mode="aspectFill"></image>
	</div>
</template>

<script>
    import { parseTime } from '../../utils/index.js'
    
	export default {
		name:'article-card',
        props:{
           id:Number,
           title:String,
           cover:String,
           time:String,
           commentCount:Number
        },
        methods:{
            // 跳转详情页
            navigato() {
                uni.navigateTo({
                    url:`../../articles/articleDetail/articleDetail?id=${this.id}`
                })
            }
        },
        computed:{
            timeFormated() {
                return parseTime(this.time,'{m}/{d} {h}:{i}')
            }
        }
	}
</script>

<style scoped>
    .article-card-container{
        width: 100%;
        display: flex;
        flex-direction: row;
        padding: 20rpx 30rpx;
        box-sizing: border-box;
        border-bottom: .1px solid #E5E5E5;
    }
    .info-body{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
        padding:0 10rpx 10rpx;
    }
    .info-body .title{
        font-size: 30rpx;
        height: 80rpx;
    }
    .info-body .bottom{
        margin-top: 40rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        color:  rgb(163,163,163);
    }
    .info-body .bottom .icon{
        font-size: 22rpx;
        width: 32rpx;
        height: 32rpx;
        display: inline-block;
        text-align: center;
    }
     .info-body .bottom text {
         margin-left: 5rpx;
         line-height: 32rpx;
         font-size: 22rpx;
     }
     .info-body .bottom .comment-count{
         margin-left: 10rpx;
     }
    .info-cover {
        width: 160rpx;
        height: 160rpx;
    }
</style>
