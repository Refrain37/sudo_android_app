<template>
	<div class="home-container">
        <!-- 顶部选项卡 start -->
        <scroll-view class="top-scroll" scroll-with-animation scroll-x :scroll-left="scrollLeft">
            <view v-for="(tab,index) in tabBars" :key="tab.id" class="tab-item" :id="tab.id" :data-current="index" @click="tabChange(index)">
                <text class="tab-item-title" :class="tabIndex==index ? 'tab-item-title-active' : ''">{{tab.name}}</text>
            </view>
        </scroll-view>
        <!-- 顶部选项卡 end -->
        
        <!-- 文章列表 start -->
        <swiper :current="tabIndex" class="swiper-box" duration="300" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">
          <swiper-item v-for="(tab,index1) in tabBars" :key="index1" >
            <Refresh :color=color :playState="playState"></Refresh>
            <view class="article-list-warp" :style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend">
            <scroll-view class="article-list" scroll-y @scrolltolower="loadMore(index1)" :scroll-top="scrollTop" :style="getHeight">
                <article-card class="article-item" v-for="(article,index2) in articles[index1].data" :key="index2"
                    :id="article.id"
                    :title="article.title"
                    :time="article.createTime"
                    :cover="article.cover ? article.cover :''"
                    :commentCount="article.commentCount"
                ></article-card>
                <view class="loading">{{articles[index1].loadingText}}</view>
            </scroll-view>
            </view>
          </swiper-item>
        </swiper>
        <!-- 文章列表 end -->
	</div>
</template>

<script>
    import {getCategories,getArticles} from '../../../api/article.js'
    import { showError } from '../../../utils/index.js'
    
    import articleCard from '../../../components/ArtilceCard/ArticleCard.vue'
    import Refresh from '../../../components/Refresh/Refresh.vue'
    
    
	export default {
		name:'home',
        components:{
            articleCard,
            Refresh
        },
		data() {
			return {
				tabBars: [], // 选项卡列表
                tabIndex:0, // 当前选项卡索引
                articles:[] ,// 文章列表
                page:1,
                // 下拉刷新控制
                coverTransform: 'translateY(0px)',
                coverTransition: '0s',
                playState: 'paused', // 控制动画状态
                color:'#5e5e5e', // 动画颜色
                scrollTop: -1,
                refresh:false, // 控制刷新状态
                startY:0,
                moveY:0,
                moving:false,
                refreshTime:1000
			}
		},
        watch: {
        	// 监听refresh值 避免多次触发方法
        	'refresh'(val) {
        		if (val) {
                    console.log('refresh')
                    this.handleRefresh()
        		}
        	}
        },
        methods:{
            // 格式化
            format() {
              let list = []
              /*
              * articles的为
              * [
              *    {data:[],loadingText:'',id:item.id,total:0,page:1},
              *    {data:[],loadingText:'',id:item.id,total:0,page:1}
              * ]
              * ps:不用ts真难受...
              */
              for(let item of this.tabBars) {
                  list.push({
                      id:item.id,
                      total:0,
                      data:[],
                      loadingText:'加载更多',
                      page:1
                  })
              }
              this.articles = list
            },
            // 获取分类
            async getCats() {
                try{
                    const res = await getCategories()
                    if(res.data) {
                        this.tabBars = res.data.lists
                        this.tabBars && this.format() // 格式化新闻列表
                        this.articles && this.getData(0) // 请求首页数据
                    }
                }catch(e){
                    console.log('fail to get cats');
                }
            },
            // 请求文章列表
            async getData(index,cbk) {
                let articleInfo = this.articles[index]
                try{
                    const res = await getArticles(articleInfo.page,articleInfo.id)
                    if(res.data.lists) {
                        articleInfo.page +=1 // page change
                        articleInfo.total = res.data.total
                        let list = res.data.lists
                        if(cbk) {
                            cbk(list)
                            return
                        }
                        articleInfo.data = [...articleInfo.data,...list]
                    }
                }catch(e){
                    showError()
                }
               
            },
            // 选项卡切换
            tabChange(index) {
                if(this.tabBars === index) {
                    return false
                }
                this.tabIndex = index;
                // 切换到没有数据的tab
                if(this.articles[index].data.length === 0) {
                    // 请求数据
                   this.getData(index)
                }
            },
            // 新闻列表切换
            swiperChange(e) {
                let index = e.target.current
                this.tabIndex = index
                // 切换到没有数据的tab
                if(this.articles[index].data.length === 0) {
                    // 请求数据
                   this.getData(index)
                }
            },
            /* 下拉刷新 group*/
            handleRefresh() {
                let index = this.tabIndex
                let articleInfo = this.articles[index]
                articleInfo.page = 1 // reset
                this.getData(index,list => {
                    articleInfo.data = list
                })
            },
            coverTouchstart(e) {
            	this.coverTransition = 'transform .1s linear'
            	this.startY = e.touches[0].clientY // 下拉距离
            },
            coverTouchmove(e) {
            	if (this.refresh) {
            		return
            	}
            	this.moveY = e.touches[0].clientY
            	let moveDistance = this.moveY - this.startY
            	if(moveDistance < 0){
            		this.moving = false
            		return
            	}
            	this.moving = true
            	if(moveDistance >= 60){
            		this.refresh = true // 开始刷新
            		this.coverTransform = `translateY(60px)`
            		this.playState = 'running' // 改变动画状态
            	}
            },
            coverTouchend() {
            	if (!this.refresh) {
            		return
            	}
                // 刷新完成
            	setTimeout(() => {
            		if(this.moving === false){
            			return
            		}
            		this.moving = false
            		this.refresh = false // 结束刷新
            		this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)'
            		this.coverTransform = 'translateY(0px)'
            		this.playState = 'paused' // 改变动画状态
            	}, this.refreshTime)
            },
            // 加载更多
            loadMore(index) {
                let articleInfo = this.articles[index]
                if(articleInfo.total === articleInfo.data.length) {
                    articleInfo.loadingText = '暂无更多数据...'
                    return
                }
                articleInfo.loadingText = '正在加载...'
                this.getData(index)
            }
        },
        computed:{
            scrollLeft() {
                return (this.tabIndex - 1) * 60;
            },
            getHeight() {
            	let height = uni.getSystemInfoSync().windowHeight - uni.upx2px(0 + 92)
            	return `height: ${height}px;`
            }
        },
        onLoad() {
            this.getCats()
        }
	}
</script>

<style scoped lang="scss">
    page{
        width: 100%;
        min-height: 100%;
        display: flex;
    }
    
    .home-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: hidden;
    }
    /* 顶部选项卡 start */
    .top-scroll {   
        background: #fff;
        white-space: nowrap;
        border-bottom: 1px solid rgb(235, 235, 235);
    }
        
    .tab-item {
       height: 90rpx;
       display: inline-block;
       line-height: 90rpx;
       margin: 0 10rpx;
       padding: 0 20rpx;
    }
    
    .tab-item-title {
        color: rgb(163,163,163);
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        flex-wrap: nowrap;
    }
    
    .tab-item-title-active {
        padding-bottom: 6rpx;
        color: #555;
        border-bottom: 4rpx solid #555;
    }
    /* 顶部选项卡 end */
    
    /* 新闻列表 start */
    .swiper-box{
        // flex: 1;
        width: 100%;
        height: calc(100vh - 90rpx - 1px);
    }
    .article-list-warp{
        background-color: white;
        width: 100%;
        margin-top: -100rpx;
    }
    .article-list{
        width: 100%;
        height: 100%;
    }
    .article-list .article-list:last-child{
        border-bottom: 0px;
    }
    /* 新闻列表 end */
    .loading{
        padding: 40rpx;
        text-align: center;
        font-size: 28rpx;
        color: #999;
        letter-spacing: 3rpx;
    }
</style>
