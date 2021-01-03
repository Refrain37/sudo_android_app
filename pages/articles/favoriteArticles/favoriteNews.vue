<template>
	<div class="favorite-container">
		<scroll-view v-if="favoriteArticles.length" class="favorite-articles" scroll-y="true" >
            <view class="favorite-article" 
            hover-class="hoverClass"
             v-for="(article,index) in favoriteArticles" :key="article.id" 
             @tap="navigato(article.id)"
             @longpress="remove(article.id)"
            >
                <text class="title">{{article.title}}</text>
                <text>></text>
            </view>
            <view class="loading" @tap="loadMore">{{loadingText}}</view>
		</scroll-view>
        <view v-else class="trips">暂无收藏文章...</view>
	</div>
</template>

<script>
    import {getFavoriteArtciles,deleteFavorite} from '../../../api/article.js'
    import { showError } from '../../../utils/index.js'
    
    
	export default {
		name:'favorite',
		data() {
			return {
				page:1,
                totalPage:null,
                favoriteArticles:[]
			}
		},
        methods:{
            // get list
            async getList(cbk) {
                const res = await getFavoriteArtciles(this.page)
                if(res) {
                    this.page +=1 // page add
                    this.totalPage = res.data.pageTotal
                    let list = res.data.lists
                    list = list.map(item => {
                        return {
                            id:item.article_id,
                            title:item.article.title
                        }
                    })
                    if(cbk) {
                        cbk(list)
                        return
                    }
                    this.favoriteArticles = [...this.favoriteArticles,...list]
                }
            },
            // navigato detail
            navigato(id) {
                uni.navigateTo({
                    url:`../articleDetail/articleDetail?id=${id}`
                })
            },
            // remove favorite
            remove(id) {
                uni.showModal({
                  content:'是否取消收藏？',
                  success: (res) => {
                      if(res.confirm) {
                          deleteFavorite(id) // request api
                          .then(result => {
                              let index = this.favoriteArticles.findIndex(item => item.id === id)
                              if(index !== -1) {
                                  this.favoriteArticles.splice(index,1)
                              }
                               uni.vibrateShort() // 振动
                          })
                          .catch(err => {
                              showError()
                          })
                      }else if(res.cancel) {
                          console.log('cancel');
                      }
                  }
                })
            },
            // load-more
            loadMore() {
                if(this.totalPage > this.page) {
                    this.getList()
                }
            }
        },
        computed:{
            loadingText() {
                if(this.totalPage > this.page) {
                    return '加载更多'
                }else {
                    return '暂无更多数据'
                }
            }
        },
        onPullDownRefresh() {
            this.page = 1
            this.getList(list => {
                this.favoriteArticles = list
            })
            uni.stopPullDownRefresh()
        },
        onShow() {
            this.page = 1
            this.getList(list => {
                this.favoriteArticles = list
            })
        }
	}
</script>

<style>
    page{
        background-color: #fff;
    }
    .favorite-articles{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .favorite-article{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 30rpx;
        border-bottom: .1px solid #E5E5E5;
        font-size: 32rpx;
        color:  rgb(163,163,163);
    }
    .hoverClass{
        background: rgba(100,100,100,.1);
    }
    .favorite-article:last-child{
        border-bottom: 0;
    }
    .favorite-article .title{
        color: black;
        max-width: 85%;
    }
    .loading{
        padding:20rpx;
        text-align: center;
        font-size: 28rpx;
        color: #999;
        letter-spacing: 3rpx;
    }
    
    .trips {
        margin-top: 100rpx;
        font-size: 40rpx;
        text-align: center;
    }
</style>
