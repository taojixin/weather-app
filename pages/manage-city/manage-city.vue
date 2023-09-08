<template>
	<view class="manage-city">
		<h1>城市管理</h1>
		<navigator url="/pages/search-city/search-city">
			<view class="addCity" @tap="addClick">
				<span class="iconfont">&#xe623;</span>
				<span class="search-position">搜索位置</span>
			</view>
		</navigator>

		<div class="city-weather-info">
			<div class="left">
				<div class="left-top">
					书宛路
					<span class="iconfont">&#xe600;</span>
				</div>
				<div class="left-bottom">
					空气优 29°C/23°C
				</div>
			</div>
			<div class="right">
				29°C
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			addClick() {
				uni.navigateTo({
					url: '/pages/add-city/add-city'
				})
			}
		}
	}
</script>

<style lang="scss">
	.manage-city {
		h1 {
			margin: 20px;
		}

		.addCity {
			-webkit-tap-highlight-color: transparent;
			border-radius: 20px;
			padding: 5px 10px;
			margin: 0 5vw;
			background-color: #f4f6fa;
			color: gray;
			margin-bottom: 20px;

			.search-position {
				margin-left: 10px;
			}
		}

		.city-weather-info {
			margin: 0 5vw;
			padding: 20px 10px;
			background-color: skyblue;
			border-radius: 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: white;
		}
	}
</style>