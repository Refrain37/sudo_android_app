<template>
	<div class="question-list-container">
		<view class="questions-list">
            <view class="questions-card" v-for="(item,index) in list">
                <text class="title">{{item.title}}</text>
                <text class="time">{{item.create_time | time}}</text>
                <button class="start-btn" type="default" @click="navigato(item.id)">开始答题</button>
            </view>
        </view>
	</div>
</template>

<script>
    import {getQuestionList} from '../../../api/questions.js'
    import { showError,parseTime} from '../../../utils/index.js'
    
    const TYPE = {
        WEEK:'weekly',
        SPECIAL:'special'
    }
        
	export default {
		name:'question-list',
		data() {
			return {
                type:null,
				list:[],
                total:0,
                currentPage:1
			}
		},
        methods:{
            async getList() {
                try{
                    const res = await getQuestionList(this.type,this.currentPage)
                    if(res) {
                        this.currentPage +=1 // change page
                        this.total = res.data.total
                        let lists = res.data.lists
                        this.list = [...this.list,...lists]
                    }
                }catch(e){
                    showError()
                }
            },
            // 设置导航栏标题
            setNavigatorTitle(type) {
                let title
                
                if(type === TYPE.WEEK) {
                    title = '每周答题'
                }else if(type === TYPE.SPECIAL) {
                    title = '专项答题'
                }
                
                uni.setNavigationBarTitle({
                    title: title
                });
            },
            navigato(id) {
                uni.navigateTo({
                    url:`../questionDetail/questionDetail?id=${id}`
                })
            }
        },
        filters:{
            time(val) {
                return parseTime(val,'{y}/{m}/{d}')
            }
        },
        onReachBottom() {
          if(this.total > this.list.length) {
              this.getList()
          }  
        },
        onLoad(e) {
            let type = e.type
            this.type = type
            this.setNavigatorTitle(type)
            this.getList()
        }
	}
</script>

<style scoped>
    .question-list-container .questions-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50rpx 0;
    }
    .questions-list .questions-card{
        width: 90%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        margin-top: 40rpx;
        padding: 40rpx;
        border: 1px solid transparent;
        border-radius: 7px;
        background-color: #fff;
    }
    .questions-list .questions-card:first-child{
        margin-top: 0;
    }
    .questions-list .questions-card .title{
        font-size: 34rpx;
    }
     .questions-list .questions-card .time{
         margin-top: 10rpx;
         font-size: 26rpx;
     }
      .questions-list .questions-card .start-btn{
          margin-top: 10rpx;
          margin-right: 0;
          font-size: 30rpx;
      }
</style>
