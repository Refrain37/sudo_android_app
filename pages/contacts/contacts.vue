<template>
	<div class="contacts-container">
        <uni-swipe-action>
            <uni-swipe-action-item 
            v-for="(contact,index) in contacts"
            :key="contact.id"
            :right-options="options" @click="remove(contact.id)">
                <view class="contact-info-warp" @click="navigato(contact)">
                    <image class="avatar" :src="contact.avatar" mode="aspectFill"></image>
                    <view class="info-body">
                        <text class="username">{{contact.name}}</text>
                        <text class="introduction">{{contact.introduction}}</text>
                    </view>
                </view>
            </uni-swipe-action-item>
        </uni-swipe-action>
        <view class="hint">共{{contacts.length}}位联系人</view>
	</div>
</template>

<script>
    import {getFriends,deleteFriend} from '../../api/contacts.js'
    import {showError} from '../../utils/index.js'
    import uniSwiperAction from '../../components/uni-swipe-action-item/uni-swipe-action-item.vue'
    import uniSwiperActionItem from '../../components/uni-swipe-action-item/uni-swipe-action-item.vue'
    
	export default {
		name:'contacts',
        components:{
            uniSwiperAction,
            uniSwiperActionItem
        },
		data() {
			return {
				contacts:[],
                options:[
                    {
                        text: '删除',
                        style: {
                            backgroundColor: 'rgb(239, 86, 86)'
                        }
                    }
                ]
			}
		},
        methods:{
            // 获取好友列表
            async getContacts(cbk) {
                try{
                    let res = await getFriends()
                    if(res.data) {
                        this.contacts = res.data
                    }
                    cbk && cbk()
                }catch(e){
                    showError()
                }
                
            },
            // 删除好友
            async remove(id) {
                uni.showModal({
                  content:'是否删除好友？',
                  success: res => {
                      if(res.confirm) {
                          // 请求接口
                          deleteFriend(id).then(res => {
                              if(res.msg === 'success'){
                                  // 数组中删除
                                  let index = this.contacts.findIndex(item => item.id === id)
                                  if(index !== -1) {
                                      this.contacts.splice(index,1)
                                  }
                                  uni.vibrateShort() // 振动
                                  uni.showToast({
                                      title:'删除成功',
                                      icon:'none'
                                  })
                              }else{
                                  uni.showToast({
                                      title:'删除失败',
                                      icon:'none'
                                  })
                              }
                          })
                      }else if(res.cancel) {
                          console.log('cancel');
                      }
                  }
                })
            },
            // 跳转聊天界面
            navigato(info) {
                let {id,name,avatar} = info
                uni.navigateTo({
                    url:`chat/chat?id=${id}&name=${name}&avatar=${avatar}`
                })
            }
        },
        // 监听'添加好友'按钮
        onNavigationBarButtonTap(obj) {
            if(obj) {
                uni.navigateTo({
                    url:'add/add'
                })
            }
        },
        onPullDownRefresh() {
            this.getContacts(() => {
                uni.stopPullDownRefresh()
            })
        },
        onLoad() {
            this.getContacts()
        },
        onShow() {
            this.getContacts()
        }
	}
</script>

<style scoped>
    .contact-info-warp {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        padding: 20rpx 30rpx;
        border-bottom: .1px solid #E5E5E5;
        background: #fff;
    }
    .contact-info-warp .avatar {
        width: 120rpx;
        height: 120rpx;
        border: 1px solid transparent;
        border-radius: 50%;
    }
    .contact-info-warp .info-body{
        margin-left: 20rpx;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .contact-info-warp .info-body .username{
        font-size: 32rpx;
    }
    .contact-info-warp .info-body .introduction {
        margin-top: 10rpx;
        font-size: 26rpx;
        color: #555555;
    }
    
    .hint{
        padding: 30rpx 0;
        font-size: 32rpx;
        color: #555555;
        letter-spacing: 3rpx;
        text-align: center;
        background: white;
    }
</style>
