<template>
	<div class="question-detail-container">
		<swiper class="questions-swiper" :current="current" duration="300" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">
		    <swiper-item v-for="(item,index1) in questions" :key="index1">
                
                <!-- 问题卡片 start -->
		        <view class="question-card">
                    <view class="index">{{index1+1}}/{{questions.length}}</view>
                    <view class="content">{{item.title}}</view>
                    <view class="options">
                        <radio-group @change="radioChange">
                            <label class="option" v-for="(option, index2) in item.options" :key="option.value">
                                <view><radio :value="option.value" :checked="index2 === optionCurrent[index1]" /></view>
                                <view class="name">{{option.name}}</view>
                            </label>
                        </radio-group>
                    </view>
                </view>
                <!-- 问题卡片 end -->
                
		    </swiper-item>
		</swiper>
        
        <button class="submit" @click="submit" type="default" :disabled="disabled">提交</button>
        
        <!-- score start -->
        <view class="score-box" v-if="isSubmited">
            <view class="score-card">
                <image class="header" src="../../../static/imgs/score_bg.jpg" mode="aspectFill"></image>
                <view class="title">Congratulation!!!</view>
                <view class="score">{{score}}</view>
                <button class="comfirm-btn" type="default" @click="navigato">确认</button>
            </view>
        </view>
        <!-- score end -->
	</div>
</template>

<script>
    import {getQuestions,submitScore} from '../../../api/questions.js'
    import { showError} from '../../../utils/index.js'
        
	export default {
		name:'question-detail',
		data() {
			return {
                id:0,
                answers:[], // 答案
                current:0, // 当前题目索引
				questions:[], // 题目列表
                selected:[], // 已选选项
                optionCurrent:[], // 题目当前选择答案
                score:0, // 得分
                isSubmited:false,
                disabled:true // 是否可提交
			}
		},
        methods:{
            navigato() {
                uni.navigateBack({
                    delta:1
                })
            },
            // 切换题号
            swiperChange(e) {
                let index = e.target.current
                this.current = index
            },
            // 切换选项
            radioChange(evt) {
                let options = this.questions[this.current].options
                for(let i = 0; i < options.length;i++) {
                    if(options[i].value === evt.target.value) {
                        this.optionCurrent[this.current] = i // 设置当前题目选中的答案选项
                        this.selected.splice(this.current,1,evt.target.value) // !保存选择答案的值:解决无法监听数组内容变化
                        break
                    }
                }
            },
            // 计算分值
            count() {
                let right = 0 // 答对题目数
                let length = this.answers.length
                for(let i = 0; i < length; i++) {
                    if(this.answers[i] === this.selected[i]) {
                        right +=1
                    }
                }
                this.score =  Math.floor(100 / length * right) // get score
            },
            // 提交
            submit() {
                for(let item of this.selected) {
                    if(!item) {
                        uni.showToast({
                            icon:'none',
                            title:'选项不完整！请进行检查'
                        })
                        return
                    }
                }
                this.count()
                submitScore(this.id,this.score).then(res => {
                    if(res.code === 200) {
                        this.isSubmited = true
                        uni.vibrateShort() // 振动
                    }
                })
            },
            // 格式初始化
            init() {
                let answers = []
                this.questions.forEach(item => {
                    answers.push(item.answer) // set answers
                    // format options
                    let options = []
                    for(let key in item.options) {
                        options.push({
                            name:item.options[key],
                            value:key
                        })
                    }
                    item.options = options
                })
                this.answers = answers
                
                // 初始化数组长度
                let len = this.questions.length
                this.selected = new Array(len)
                this.optionCurrent = new Array(len)
            },
            async getData(id,type) {
                let data = id?{id}:{type}
                const res = await getQuestions(data)
                if(res.code === 200) {
                    this.id = res.data.id
                    this.questions = res.data.questions
                    this.init()
                }else{
                    showError()
                }
            }
        },
        watch:{
            selected:{
                handler(val) {
                    if(val.includes(undefined)) {
                        this.disabled = true
                    }else{
                        this.disabled = false
                    }
                },
                deep:true
            }
        },
        onLoad(e) {
            let id = e.id
            let type = e.type
            this.getData(id,type)
        }
	}
</script>

<style scoped>
    .question-detail-container{
        height: 100vh;
        position: relative;
    }
    .questions-swiper{
        height: 100%;
    }
    
    /* question-card start */
    .questions-swiper .question-card {
        width: 90%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 40rpx;
        margin: 50rpx auto 0;
        background-color: #fff;
        border: 0px solid transprent;
        border-radius: 7px;
    }
    .question-card .index{
        padding-bottom: 20rpx;
        border-bottom: .1px solid rgb(163,163,163);
        font-size: 50rpx;
    }
    .question-card .content {
        margin-top: 30rpx;
    }
    .question-card .options{
        margin-top: 30rpx;
        font-size: 30rpx;
    }
    .question-card .options .option{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 37rpx;
        padding: 20rpx;
        border: 0px solid transprent;
        border-radius: 7px;
        background:  rgb(248,248,248);
    }
    .options .option .name{
        margin-left: 10rpx;
    }
    /* question-card end */
    
    .submit{
        height: 130rpx;
        width: 130rpx;
        display: inline-block;
        position: absolute;
        right: 80rpx;
        bottom: 100rpx;
        border-radius: 50%;
        font-size: 30rpx;
        line-height: 130rpx;
        box-shadow: .5px .5px 5px #bebebe;
    }
    .submit::after{
        border: 0;
    }
    
    /* score start */
    .score-box{
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,.5);
        z-index: 100;
    }
    .score-card{
        height: 60%;
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #FFFFFF;
        border-radius: 7px;
        animation: appear 1s 1;
    }
    @keyframes appear{
        from{
            opacity: 0;
        }
        to{
            opacity: 1;
        }
    }
    
    .header{
        width: 100%;
        height: 40%;
        border-radius: 7px 7px 0 0;
    }
    .title{
        margin-top: 30rpx;
        font-size: 50rpx;
        font-style: italic;
        text-shadow:1px 1px #aaa;
        animation:title 2s infinite;
    }
    @keyframes title{
        from{
            transform: rotateY(0deg);
        }
        to{
            transform: rotateY(360deg);
        }
    }
    
    .score-card .score{
        margin-top: 50rpx;
        font-size:110rpx;
        color: red;
    }
    .score-card .score::after{
        content:'分';
        font-size: 50rpx;
    }
    .comfirm-btn{
        margin-top: 50rpx;
        width: 80%;
    }
    /* score end */
</style>
