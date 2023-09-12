<template>
	<view class="content">
		<!-- 1.顶部标题 -->
		<view class="top">
			<navigator url="/pages/manage-city/manage-city">
				<view class="left">+</view>
			</navigator>
			<view class="title">{{livesWeatherInfo.province}} {{livesWeatherInfo.city}}</view>
			<view class="right" @tap="otherClick">···</view>
		</view>
		<!-- 2.实时天气 -->
		<view class="weather">
			<view class="temperature">
				{{livesWeatherInfo.temperature}}°C
			</view>
			<view class="today-weather">
				<span v-html="chooseWeatherIconVue(livesWeatherInfo.weather)"></span>
				{{livesWeatherInfo.weather}} {{forecastWeatherInfo[0]?.daytemp}}°C/{{forecastWeatherInfo[0]?.nighttemp}}°C
			</view>
			<view class="other">
				<view class="wind">
					{{livesWeatherInfo.winddirection}}风{{livesWeatherInfo.windpower}}级 | 湿度{{livesWeatherInfo.humidity}}%
				</view>
			</view>
		</view>
		<!-- 3.未来天气 -->
		<view class="future-weather" v-if="forecastWeatherInfo.length !== 0">
			<template v-for="(item,index) in forecastWeatherInfo">
				<view class="day" v-if="index !== forecastWeatherInfo.length - 1">
					<view class="icon">
						<span v-html="chooseWeatherIconVue(item.dayweather)"></span>
						<view class="date">{{index === 0 ? '今天' : (index === 1 ? '明天' : (index === 2 ? '后天' : item.date))}}</view>
					</view>
					<view class="date-weather">{{item.dayweather}} <span style="color: skyblue;">转</span>
						{{item.nightweather}}
					</view>
					<view class="date-temperature">{{item.daytemp}}°C/{{item.nighttemp}}°C</view>
				</view>
			</template>
			<navigator url="/pages/future-weather/future-weather">
				<button>查看近7日天气</button>
			</navigator>
		</view>
	</view>
</template>

<script>
	import {
		chooseWeatherIcon
	} from '../../utils/chooseWeacherIcon.js'
	import {
		gaodeKey
	} from '../../assets/global-variables.js'
	import {
		getLivesWeatherSer,
		getForecastWeatherSer,
		getSevenLoLaWeatherSer
	} from '../../services/weather.js'
	import {
		removeDuplicates
	} from '../../utils/removeDuplicates.js'
	export default {
		data() {
			return {
				// 实时天气
				livesWeatherInfo: {},
				// 预报天气
				forecastWeatherInfo: [],
				currentCity: {}
			}
		},
		onLoad() {
			// 1.获取当前城市信息
			if (uni.getStorageSync('currentCity')) {
				this.currentCity = JSON.parse(uni.getStorageSync('currentCity'))
				console.log(this.currentCity);
			} else {
				// 将当前城市添加到城市列表
				this.addCityOnload()
				// 设置默认城市
				const currentCity = {
					adcode: '510117',
					areaName: '郫都区'
				}
				uni.setStorageSync('currentCity', JSON.stringify(currentCity))
				this.currentCity = JSON.parse(uni.getStorageSync('currentCity'))

				uni.showToast({
					icon: 'none',
					title: '默认城市为郫都区'
				})
			}
			// 2.获取天气信息
			this.getWeatherInfoOnload()
		},
		methods: {
			// 天气icon
			chooseWeatherIconVue(a) {
				return chooseWeatherIcon(a)
			},
			// 添加地址
			addCityOnload() {
				let localCity = JSON.parse(uni.getStorageSync("localCity") || '[]')
				console.log(localCity);
				localCity.push({
					areaId: 510117,
					areaName: '郫都区'
				})
				const newLocalCity = removeDuplicates(localCity)
				uni.setStorageSync('localCity', JSON.stringify(newLocalCity))
			},
			// 请求天气信息
			getWeatherInfoOnload() {
				// 实时天气
				getLivesWeatherSer(this.currentCity.adcode).then(res => {
					console.log(res);
					this.livesWeatherInfo = res.lives[0]
				})
				// 预报天气
				getForecastWeatherSer(this.currentCity.adcode).then(res => {
					// console.log(res);
					this.forecastWeatherInfo = res.forecasts[0].casts
				})
			},
			otherClick() {
				uni.clearStorage().then(res => {
					uni.showToast({
						icon: 'none',
						title: '清理成功！'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		height: 100vh;
		background-image: url('../../assets/images/bg.jpg');
		color: white;
		overflow: scroll;
		padding: 3vh 0;
	}

	.top {
		font-size: 20px;
		padding: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left,
		.right {
			font-size: 40px;
		}
	}

	.weather {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 50px 0 200px;

		.temperature {
			font-size: 80px;
		}

		.today-weather {
			margin: 20px 0;
		}
	}

	.future-weather {
		margin: 10px;
		border: 3px solid gray;
		border-radius: 5px;
		padding-bottom: 15px;

		.day {
			display: flex;
			justify-content: space-between;
			font-size: 20px;
			padding: 15px 30px;

			.icon {
				display: flex;

				.date {
					margin-left: 10px;
				}
			}
		}

		button {
			border-radius: 30px;
			background-color: #43b7ff;
			color: white;
			margin: 0 15px;
		}
	}
</style>