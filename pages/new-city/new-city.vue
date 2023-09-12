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
	import {removeDuplicates} from '../../utils/removeDuplicates.js'
	export default {
		data() {
			return {
				cityName: '',
				cityWeatherInfo: [],
				areaId: 0,
				areaName: '',
			};
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中，请稍后',
				mask: true
			})
			this.areaId = options.areaId
			this.areaName = options.areaName
			console.log(options.areaId, options.areaName);
			// getForecastWeatherAdcodeSer(options.areaName.replace('省', '').replace('市', '')).then(res => {
			getForecastWeatherAdcodeSer(options.areaId).then(res => {
				console.log(res.forecasts[0].casts);
				this.cityName = res.forecasts[0].city
				this.cityWeatherInfo = res.forecasts[0].casts
				uni.hideLoading()
			})
		},
		methods: {
			chooseWeatherIconVue(a) {
				return chooseWeatherIcon(a)
			},
			addCityClick() {
				// 获取本地城市列表并添加新的城市
				let localCity = JSON.parse(uni.getStorageSync("localCity") || '[]')
				localCity.push({
					areaId: this.areaId,
					areaName: this.areaName
				})
				const newLocalCity = removeDuplicates(localCity) // 去除重复返回新的列表
				uni.setStorageSync('localCity', JSON.stringify(newLocalCity))
				uni.showToast({
					icon:'none',
					title:'添加成功！'
				})
				// 将新的城市添加为当前城市
				const currentCity = {
					adcode: this.areaId,
					areaName: this.areaName
				}
				uni.setStorageSync('currentCity', JSON.stringify(currentCity))
				// 跳转到首页
				uni.reLaunch({
					url: '/pages/index/index'
				})
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