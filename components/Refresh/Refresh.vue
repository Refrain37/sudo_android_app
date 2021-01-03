<template>
	<view class="content" :style="{'--color': color, '--playState': playState}">
		<view class="refresh swapping-squares-spinner">
			<view class="square"></view>
			<view class="square"></view>
			<view class="square"></view>
			<view class="square"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'refresh',
		props: {
			color: {
				type: String,
				default: '#04C4C4'
			},
			playState: {
				type: String,
				default: 'paused'
			}
		}
	}
</script>

<style lang="scss" scoped>
    /* 以父组件传递的值为变量值 */
	$color: var(--color);
	$playState: var(--playState);
	
	.refresh {
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		view {
			animation-play-state: $playState!important;
		}
	}
	
	.swapping-squares-spinner {
	  position: relative;
	}
	.swapping-squares-spinner .square {
	  height: calc(65rpx * 0.25 / 1.3);
	  width:  calc(65rpx * 0.25 / 1.3);
	  animation-duration: 1000ms;
	  border: calc(65rpx * 0.04 / 1.3) solid $color;
	  margin-right: auto;
	  margin-left: auto;
	  position: absolute;
	  animation-iteration-count: infinite;
	}
	.swapping-squares-spinner .square:nth-child(1) {
	  animation-name: swappingSquares-child-1;
	  animation-delay: 500ms;
	}
	.swapping-squares-spinner .square:nth-child(2) {
	  animation-name: swappingSquares-child-2;
	  animation-delay: 0ms;
	}
	.swapping-squares-spinner .square:nth-child(3) {
	  animation-name: swappingSquares-child-3;
	  animation-delay: 500ms;
	}
	.swapping-squares-spinner .square:nth-child(4) {
	  animation-name: swappingSquares-child-4;
	  animation-delay: 0ms;
	}
	@keyframes swappingSquares-child-1 {
	  50% {
		transform: translate(150%,150%) scale(2,2);
	  }
	}
	@keyframes swappingSquares-child-2 {
	  50% {
		transform: translate(-150%,150%) scale(2,2);
	  }
	}
	@keyframes swappingSquares-child-3 {
	  50% {
		transform: translate(-150%,-150%) scale(2,2);
	  }
	}
	@keyframes swappingSquares-child-4 {
	  50% {
		transform: translate(150%,-150%) scale(2,2);
	  }
	}
</style>