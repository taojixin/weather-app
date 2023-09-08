<template>
	<view class="new-city">
		<!-- 1.城市 -->
		<view class="city">{{cityName}}</view>
		<!-- 天气列表 -->
		<view class="weather-list">
			<template v-for="(item,index) in cityWeatherInfo">
				<view class="day-weather">
					<view class="date">{{item.date.substring(5,10)}}</view>
					<span v-html="chooseWeatherIconVue(item.dayweather)"></span>
					<view class="">{{item.dayweather}}</view>
					<view class="">{{item.daytemp}}°C</view>
					<view class="direction-bottom">
						<span class="iconfont">&#xe796;</span>
					</view>
					<span v-html="chooseWeatherIconVue(item.nightweather)"></span>
					<view class="">{{item.nightweather}}</view>
					<view class="">{{item.nighttemp}}°C</view>
					<view class="">
						<span class="iconfont">&#xe679;</span>
						<span>{{item.nightpower}}级</span>
					</view>
				</view>
			</template>
		</view>
		<!-- 添加到主页 -->
		<div class="add-to-city" @tap='addCityClick'>
			<span class="iconfont">&#xeb89;</span>
			<span>添加到主页</span>
		</div>
	</view>
</template>

<script>
	import {
		getForecastWeatherAdcodeSer
	} from '../../services/weather.js'
	import {
		chooseWeatherIcon
	} from '../../utils/chooseWeacherIcon.js'
	export default {
		data() {
			return {
				cityName: '',
				cityWeatherInfo: [],
				areaId: 0,
				areaName: ''
			};
		},
		onLoad(options) {
			this.areaId = options.areaId
			this.areaName = options.areaName
			console.log(options.areaId, options.areaName);
			// getForecastWeatherAdcodeSer(options.areaName.replace('省', '').replace('市', '')).then(res => {
			getForecastWeatherAdcodeSer(options.areaId).then(res => {
				console.log(res.forecasts[0].casts);
				this.cityName = res.forecasts[0].city
				this.cityWeatherInfo = res.forecasts[0].casts
			})
		},
		methods: {
			chooseWeatherIconVue(a) {
				return chooseWeatherIcon(a)
			},
			addCityClick() {
				// let localCity = []
				let localCity = JSON.parse(uni.getStorageSync("localCity"))
				console.log(localCity);
				localCity.push({
					areaId: this.areaId,
					areaName: this.areaName
				})
				uni.setStorageSync('localCity', JSON.stringify(localCity))
				// uni.navigateTo({
				// 	url: `pages/manage-city/manage-city`
				// })
			}
		}
	}
</script>

<style lang="scss">
	.new-city {
		padding: 3vh 3vw;

		.city {
			font-size: 30px;
			color: #666;
		}

		.weather-list {
			overflow-x: scroll;
			display: flex;
			flex-wrap: nowrap;
			margin-top: 3vh;

			.day-weather {
				color: #666;
				width: 25vw;
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
			}
		}

		.add-to-city {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-top: 3vh;
			color: mediumpurple;

			.iconfont {
				font-size: 50px;
			}
		}
	}
</style>