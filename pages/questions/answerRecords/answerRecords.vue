<template>
	<div class="answer-records-container">
		<view class="record-list" v-if="list.length > 0">
        
            <!-- record-card start -->
            <view class="record-card" v-for="(item,index) in list" :key="index">
                <view class="left">
                    <text class="title">{{item.title}}</text>
                    <text class="time">{{item.time}}</text>
                </view>
                <view class="right">
                    <text class="type">{{item.type | type}}</text>
                    <text class="score">{{item.score}}</text>
                </view>
            </view>
            <!-- record-card end -->
            
            <view class="load-more-text" @tap="loadmore" v-show="total > list.length">加载更多</view>
        </view>
        <view class="trips" v-else>暂无答题记录...</view>
	</div>
</template>

<script>
    import { getRecords } from '../../../api/questions.js'
    import { showError,parseTime } from '../../../utils/index.js'
    
	export default {
		name:'answer-records',
		data() {
			return {
                total:0,
                currentPage:1,
				list:[]
			}
		},
        methods:{
            format(list) {
                return list.map(item => {
                    return {
                        type:item.test_paper.type,
                        title:item.test_paper.title,
                        score:item.score,
                        time:parseTime(item.create_at,'{y}/{m}/{d}')
                    }
                })
            },
            async getList(cbk) {
               const res = await getRecords(this.currentPage)
               if(res.code === 200) {
                   this.currentPage +=1 // change page
                   this.total = res.data.total
                   let list = this.format(res.data.lists)
                   if(cbk) {
                       cbk(list)
                       return
                   }
                   this.list = [...this.list,...list]
               }
            },
            loadmore() {
                this.getList()
            }
        },
        filters:{
            type(val) {
                if(val === 'daily') {
                    return '每日答题'
                }else if(val === 'weekly') {
                    return '每周答题'
                }else {
                    return '专项答题'
                }
            }
        },
        onPullDownRefresh() {
          this.currentPage = 1  
          this.getList(list => {
              this.list = list
          })
          uni.stopPullDownRefresh()
        },
        onLoad() {
            this.getList()
        }
	}
</script>

<style scoped>
    .answer-records-container .record-list{
        width: 100%;
        padding: 50rpx 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    /* record-card start*/
    .record-list .record-card{
        width: 90%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        margin-top: 40rpx;
        padding: 40rpx;
        border: 1px solid transparent;
        border-radius: 7px;
        background-color: #fff;
    }
    .record-card .left,
    .record-card .right{
        display: flex;
        flex-direction: column;
    }
    .record-card .left{
        width:65% ;
    }
    .record-card .left .title{
        font-size: 32rpx;
    }
    .record-card .left .time{
        margin-top: 20rpx;
        font-size: 26rpx;
        color: #555;
    }
    .record-card .right{
        align-items: center;
    }
    .record-card .right .type{
        padding: 10rpx;
        border: 1px solid black;
        border-radius: 5px;
        font-size: 24rpx;
    }
    .record-card .right .score {
        margin-top: 30rpx;
        color: red;
        font-size: 60rpx;
    }
    /* record-card end */
    .load-more-text{
        display: block;
        padding: 20rpx;
        margin-top: 20rpx;
        text-align: center;
        color: '#777';
    }
    .trips {
        margin-top: 100rpx;
        font-size: 40rpx;
        text-align: center;
    }
</style>
