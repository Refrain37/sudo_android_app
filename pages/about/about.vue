<template>
	<div class="about-container">
		<view class="terminal">
            <view class="header">
                <text class="circle red"></text>
                <text class="circle yellow"></text>
                <text class="circle green"></text>
            </view>
            <view class="content">
                <view class="block">
                    <text>root@Sudo #</text>
                    <text class="word">{{command}}</text>
                </view>
                <view class="block result">
                    <text style="display: block;" v-for="item of info">{{item}}</text>
                </view>
                <view class="block">
                    <text>root@Sudo #</text>
                    <text class="mark">|</text>
                </view>
            </view>
        </view>
	</div>
</template>

<script>
	export default {
		name:'about',
		data() {
			return {
				info:['hello! we are Sudo.','我们来自18物网1班','感谢你对于本项目的阅读'],
                command:'cat sudo.info'
			}
		}
        
	}
</script>

<style scoped lang="scss">
    .about-container{
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        .terminal{
            background: #2B2B2B;
            width: 650rpx;
            height: 520rpx;
            box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            .header{
                background: #E5E5E5;
                padding: 8rpx;
                padding-left: 0;
                border-radius: 4px 4px 0 0;
                .circle{
                    width: 24rpx;
                    height: 24rpx;
                    border-radius: 50%;
                    display: inline-block;
                    margin-left: 10rpx;
                }
                .red{
                   background-color: #ff0000; 
                }
                .yellow{
                    background-color: #FFAA36;
                }
                .green{
                    background-color: #4DB700;
                }
            }
            .content{
                padding:8rpx;
                color: white;
                font-size: 28rpx;
                .result{
                    font-size: 26rpx;
                }
                .block {
                    margin-bottom: 4rpx;
                    .mark{
                      font-weight: 500;
                      animation: blink .6s step-end infinite;
                    }
                    @keyframes blink {
                      0%,100%{
                        opacity: 0;
                      }
                      50%{
                        opacity: 1;
                      }      
                    }
                }
             }
        }
        
    }
</style>
