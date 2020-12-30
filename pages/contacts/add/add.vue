<template>
	<div class="add-container">
		<view class="username-input">
            <view class="uni-icon uni-icon-search"></view>
            <input class="input" type="text" focus 
                confirm-type="search"
                @input="clearInput"
                @confirm="search"
                :value="username" 
                maxlength="11" 
                placeholder="输入用户名"/>
            <view class="uni-icon uni-icon-clear" v-if="showClearIcon" @click="clear"></view>
        </view>
        
        <view class="result" v-if="searchResult">
            <text class="result-title">搜索结果</text>
            <view class="result-info">
                <image class="avatar" :src="searchResult.avatar" mode="aspectFill"></image>
                <view class="info-body">
                    <text class="username">{{searchResult.username}}</text>
                    <text class="introduction">{{searchResult.introduction}}</text>
                </view>
                <button class="add-btn" type="default" @click="add(searchResult.id)">添加</button>
            </view>
        </view>
        
        <view class="trips" v-if="!searchResult && hasSearch">找不到该用户</view>
	</div>
</template>

<script>
    import {searchFriend,addFriend } from '../../../api/contacts.js'
    
	export default {
		name:'add',
		data() {
			return {
				username:null,
                searchResult:null,
                hasSearch:false, // 搜索状态
                showClearIcon: false
			}
		},
        methods:{
            clear() {
              this.username = ''  
              this.showClearIcon = false
              this.searchResult = null
              this.hasSearch = false
            },
            // 监听输入
            clearInput(event) {
            	let value = event.target.value;
                this.username = value
            	if (value.length > 0) {
            		this.showClearIcon = true;
            	} else {
            		this.showClearIcon = false;
                    this.searchResult = null
                    this.hasSearch = false
            	}
            },
            // 搜索
            async search(e) {
                const value = e.detail.value
                if(value) {
                    try{
                        const res = await searchFriend(value)
                        if(res.data) {
                           const {id,name,avatar,introduction} = res.data
                           const result = {
                               id,
                               avatar,
                               username:name,
                               introduction
                           }
                           this.searchResult = result 
                        }
                        this.hasSearch = true // 修改搜索状态
                    }catch(e){
                        uni.showToast({
                            title:'搜索出错，请检查！',
                            icon:'none'
                        })
                    }
                }
            },
            // 添加好友
            async add(id) {
                if(!id) {
                    return
                }
                
                const res = await addFriend(id)
                if(res.msg) {
                    let msg = res.msg === 'success'?'添加成功':res.msg
                    uni.showToast({
                        title:msg
                    })
                }
            }
        }
	}
</script>

<style scoped>
    /* 输入 start */
    .username-input{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 30rpx;
        padding: 30rpx;
        box-sizing: border-box;
        background: #fff;
    }
    .username-input .input{
        margin-left: 20rpx;
        flex: 1;
    }
    /* 输入 end */
    
    /* 搜索结果 start */
    .result{
        display: flex;
        flex-direction: column;
    }
    .result .result-title{
        padding: 20rpx;
        color: rgb(150,150,150);
    }
    .result .result-info{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 30rpx;
        box-sizing: border-box;
        background: #fff;
    }
    .result-info .avatar{
        width: 130rpx;
        height: 130rpx;
    }
    .result-info .info-body{
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-left: 30rpx;
    }
    .result-info .info-body .username{
        font-size: 36rpx;
    }
    .result-info .info-body .introduction{
        max-width: 90%;
        margin-top: 10rpx;
        font-size: 28rpx;
        color: rgb(103,103,103);
    }
    .result-info .add-btn{
        font-size: 36rpx;
        line-height: 2;
    }
    /* 搜索结果 end */
    .trips{
        margin-top: 30rpx;
        text-align: center;
        color: rgb(103,103,103);
    }
</style>
