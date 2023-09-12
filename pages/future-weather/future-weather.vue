<template>
	<view>
		<!-- 1.城市 -->
		<h2 class="city">{{cityName}}</h2>
		<!-- 天气列表 -->
		<view class="weather-list">
			<template v-for="(item,index) in cityWeatherInfo">
				<view class="day-weather">
					<view class="weak" style="color: white;">
						{{index === 0 ? '今天' : item.week}}
					</view>
					<view class="date">{{item.date.substring(5,10)}}</view>
					<span v-html="chooseWeatherIconVue(item.wea_day)"></span>
					<view class="">{{item.wea_day}}</view>
					<view class="">{{item.tem2}}°C</view>
					<view class="direction-bottom">
						<span class="iconfont">&#xe796;</span>
					</view>
					<span v-html="chooseWeatherIconVue(item.wea_night)"></span>
					<view class="">{{item.wea_night}}</view>
					<view class="">{{item.tem1}}°C</view>
					<view class="">
						<span class="iconfont">&#xe679;</span>
						<span>{{item.win_speed}}</span>
					</view>
					<view class="air-level">
						<span class="iconfont">&#xe697;</span>{{item.air_level}}
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import {
		chooseWeatherIcon
	} from '../../utils/chooseWeacherIcon.js'
	import {
		getSevenWeatherCityNameSer
	} from "../../services/weather.js"
	export default {
		data() {
			return {
				cityName: '',
				cityWeatherInfo: [],
				currentCity: {}
			};
		},
		onLoad() {
			uni.showLoading({
				title: '加载中，请稍后',
				mask: true
			})
			this.currentCity = JSON.parse(uni.getStorageSync('currentCity'))
			getSevenWeatherCityNameSer(this.currentCity.areaName.replace('市','').replace('区','').replace('县', '')).then(res => {
				console.log(res);
				this.cityName = res.city
				this.cityWeatherInfo = res.data
				uni.hideLoading()
			})
		},
		methods: {
			chooseWeatherIconVue(day) {
				return chooseWeatherIcon(day)
			}
		}
	}
</script>

<style lang="scss">
	.city {
		text-align: center;
		margin-top: 3vh;
	}

	.weather-list {
		overflow: auto;
		display: flex;
		flex-wrap: nowrap;
		margin-top: 3vh;

		.day-weather {
			flex-shrink: 0;
			color: #666;
			width: 80px;
			border-radius: 10px;
			box-sizing: border-box;
			background-color: skyblue;
			margin: 0 2vw;
			padding: 5px 0;
			display: flex;
			flex-direction: column;
			align-items: center;

			view {
				margin: 10px 0;
			}

			.direction-bottom {
				margin: 50px 0;
			}

			.air-level {
				background-color: white;
				border-radius: 10px;
				padding: 2px 10px;
			}
		}
	}
</style>