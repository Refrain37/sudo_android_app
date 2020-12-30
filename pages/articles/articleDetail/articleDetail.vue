<template>
	<div id="container" class="article-detail-container">
        <!-- 文章信息 start -->
        <view class="article-info">
            <view class="title">{{title}}</view>
            <view class="author">{{author}}</view>
            <view class="time">{{time}}</view>
        </view>
        <!-- 文章信息 end -->
        
        <!-- 文章内容 start -->
        <!-- <view class="article-content" v-html="content"></view> -->
        <rich-text class="article-content" :nodes="content"></rich-text>
        <!-- 文章内容 end -->
        
        <!-- 评论列表 start -->
        <view class="comment-list">
            <text class="header" id="header">热门评论</text>
            <view class="list-box" v-if="commentList.length > 0">
                <comment-item class="comment-item" v-for="(comment,index) in commentList" :key="index"
                :content="comment.content"
                :create_at="comment.create_at"
                :username="comment.username"
                :userAvatar="comment.avatar"
                ></comment-item>
                <text class="load-more-text" @tap="getCommentList" v-if="commentList.length < total">加载更多</text>
            </view>
            <text class="trips" v-if="commentList.length === 0">暂无评论，发表一下自己的看法吧！</text>
        </view>
        <!-- 评论列表 end -->
        
        <view id="bottom"></view>
        
        <!-- 评论框 start -->
        <view class="comment-box">
            <input class="content" placeholder="写评论..." type="text" v-model="commentContent" />
            <button class="submit-btn" type="default" @click="submit">评论</button>
        </view>
        <!-- 评论框 end -->
	</div>
</template>

<script>
    import { getArtcileDetail,getComments,addFavorite,deleteFavorite,submitComment} from '../../../api/article.js'
    import { showError,parseTime } from '../../../utils/index.js'
    import { getToken } from '../../../utils/auth.js'
    import CommentItem from '../../../components/CommentItem/CommentItem.vue'
    
	export default {
		name:'article-detail',
        components:{
            CommentItem
        },
		data() {
			return {
				id:null,
                title:null, 
                content:null,
                time:null,
                author:null,
                isFavorite:false,
                // comment
                commentList:[],
                total:null,
                page:1,
                commentContent:'',
                count:0, // 已发的评论数
			}
		},
        methods:{
            // get article data
            async getData() {
               try{
                   const res = await getArtcileDetail(this.id)
                   if(res.code === 200) {
                       let {title,content,author,createTime,is_favorite} = res.data
                       this.title = title
                       this.content = content
                       this.author = author
                       this.time = parseTime(createTime,'{m}/{d} {h}:{i}')
                       this.isFavorite = is_favorite
                       this.handleFavoriteBtn() // change btn style
                       
                       this.getCommentList() // get comments
                   }
               }catch(e){
                  showError() 
               } 
            },
            // get comment list
            async getCommentList() {
                try{
                    const res = await getComments(this.id,this.page)
                    if(res.code === 200) {
                        this.page ++
                        this.total = res.data.total
                        let list = res.data.lists.splice(this.count)
                        // format
                        list = list.map(item => {
                            return {
                                content:item.content,
                                create_at:item.create_at,
                                username:item.user.name,
                                avatar:item.user.avatar
                            }
                        })
                        this.commentList = [...this.commentList,...list]
                        this.page > 2 && this.scroll() // while loadmore
                    }
                }catch(e){
                    showError()
                }
            },
            // submit comment
            async submit() {
                // check has login
                if(!getToken()) {
                    uni.navigateTo({
                        url:'../../user/login/login'
                    })
                }else{
                    try{
                        const res = await submitComment(this.id,this.commentContent)
                        if(res) {
                            this.commentContent = '' // clear
                            this.total += 1
                            this.count += 1
                            // add new comment to list
                            const data = res.data
                            this.commentList.unshift({
                                content:data.content,
                                create_at:data.create_at,
                                username:data.user.name,
                                avatar:data.user.avatar
                            })
                            this.scroll("#header")
                        }
                    }catch(e){
                        showError()
                    }
                }
            },
            // handle favorite button
            handleFavoriteBtn() {
                let pages = getCurrentPages();
                let page = pages[pages.length - 1]; // 获取当前页
                let currentWebview = page.$getAppWebview();
                let titleObj = currentWebview.getStyle().titleNView;
                if (!titleObj.buttons) {
                	return;
                }
                titleObj.buttons[0].color = this.isFavorite?'#d5c400':'#000000'  // change color
                currentWebview.setStyle({
                	titleNView: titleObj
                });
            },
            // add favorite
            addFavoriteArticle() {
                addFavorite(this.id).then(res => {
                    if(res.code === 200 || res.code === 50002) {   
                        this.isFavorite = true
                        this.handleFavoriteBtn()
                    }else{
                        showError()
                    }
                })
            },
            // delete favorite
            deleteFavoriteArticle() {
                deleteFavorite(this.id).then(res => {
                    if(res.code === 200 || res.code === 50002) {
                        this.isFavorite = false
                        this.handleFavoriteBtn()
                    }else {
                        showError()
                    }
                })
            },
            scroll(position = "#bottom") {
                uni.createSelectorQuery().select(position).boundingClientRect(data=>{
                    uni.createSelectorQuery().select("#container").boundingClientRect((res)=>{
                        uni.pageScrollTo({
                            duration:300,
                            scrollTop:data.top - res.top
                        })
                    }).exec()
                }).exec();
            }
        },
        onNavigationBarButtonTap(obj) {
            // check login status
            if(!getToken()) {
                uni.navigateTo({
                    url:'../../user/login/login'
                })
            }else{
                if(!this.isFavorite) {
                    this.addFavoriteArticle()
                }else{
                   let _self = this
                   uni.showModal({
                       content:'确认取消收藏？',
                       success(res) {
                           if(res.confirm) {
                                _self.deleteFavoriteArticle()
                           }
                       }
                   })
                   
                }
            }
        },
        onPageScroll(obj) {
            let distance = obj.scrollTop
            // set navigationBar title
            if(distance < 300) {
                uni.setNavigationBarTitle({
                    title:' '
                })
            }else {
                uni.setNavigationBarTitle({
                    title:this.title
                })
            }
        },
        onLoad(option) {
            let id = option.id
            this.id = id
            this.getData()
        }
	}
</script>

<style scoped lang="scss">
    $gray:rgba(225, 225, 226,.7);
    $deepGray:rgba($color: #777777, $alpha: 1.0);
    
    .article-detail-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90%;
        margin: 0 auto;
        padding: 60rpx 0 150rpx;
        .article-info{
            width: 100%;
            display: flex;
            flex-direction: column;
            .title{
                font-size: 55rpx;
            }
            .author{
                margin-top: 30rpx;
                color: $deepGray;
                font-size: 30rpx;
            }
            .time{
                margin-top: 10rpx;
                color: $deepGray;
                font-size: 30rpx;
            }
        }
        .article-content {
            margin-top: 60rpx;
            width: 100%;
            overflow: hidden;
        }
        /* comment-list start */
        .comment-list{
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-top: 50rpx;
            .header{
                width: 20%;
                padding-bottom: 20rpx;
                border-bottom: 2px solid black;
                text-align: center;
            }
            .list-box{
                margin-top: 30rpx;
                .comment-item{
                    border-bottom: 1px solid $gray;
                }
                .load-more-text{
                    display: block;
                    padding: 20rpx;
                    margin-top: 20rpx;
                    text-align: center;
                    color: $deepGray;
                }
            }
            .trips {
                margin-top: 30rpx;
                padding: 30rpx;
                text-align: center;
            }
        }
        /* comment-list end */
        /* comment-box start */
        .comment-box{
            display: flex;
            flex-direction: row;
            align-items: center;
            position: fixed;
            left: 0;
            bottom: var(--window-bottom);
            width: 100%;
            border-top: 1px solid $gray;
            background-color: white;
            box-sizing: border-box;
            padding: 25rpx 40rpx;
            .content{
                min-height: 80rpx;
                flex: 1;
                padding: 20rpx;
                border: 0px solid transparent;
                border-radius: 7px;
                box-sizing: border-box;
                background-color: $gray;
            }
            .submit-btn{
                width: 120rpx;
                height: 80rpx;
                margin: 0 0 0 30rpx;
                border-radius: 7px;
                font-size: 30rpx;
            }
            .submit-btn::after{
                border: 0px solid transparent;
                border-radius: 7px;
            }
        }
        /* comment-box end */
    }
</style>

<style scoped>
    
    .article-content .one-p{
        margin-top: 20rpx;
    }
    .article-content img{
        max-width: 100%;
    }
</style>
