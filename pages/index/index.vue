<template>
	<view class="content">
		<!-- 1.顶部标题 -->
		<view class="top">
			<navigator url="/pages/add-city/add-city">
				<view class="left">+</view>
			</navigator>
			<view class="title">{{livesWeatherInfo.province}} {{livesWeatherInfo.city}}</view>
			<view class="right">···</view>
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
			<view class="day">
				<view class="icon">
					<span v-html="chooseWeatherIconVue(forecastWeatherInfo[0].dayweather)"></span>
					<view class="date">今天</view>
				</view>
				<view class="date-weather">{{forecastWeatherInfo[0].dayweather}} <span style="color: skyblue;">转</span>
					{{forecastWeatherInfo[0].nightweather}}
				</view>
				<view class="date-temperature">{{forecastWeatherInfo[0].daytemp}}°C/{{forecastWeatherInfo[0].nighttemp}}°C
				</view>
			</view>
			<view class="day">
				<view class="icon">
					<span v-html="chooseWeatherIconVue(forecastWeatherInfo[1].dayweather)"></span>
					<view class="date">明天</view>
				</view>
				<view class="date-weather">{{forecastWeatherInfo[1].dayweather}} <span style="color: skyblue;">转</span>
					{{forecastWeatherInfo[1].nightweather}}
				</view>
				<view class="date-temperature">{{forecastWeatherInfo[1].daytemp}}°C/{{forecastWeatherInfo[1].nighttemp}}°C
				</view>
			</view>
			<view class="day">
				<view class="icon">
					<span v-html="chooseWeatherIconVue(forecastWeatherInfo[2].dayweather)"></span>
					<view class="date">后天</view>
				</view>
				<view class="date-weather">{{forecastWeatherInfo[2].dayweather}} <span style="color: skyblue;">转</span>
					{{forecastWeatherInfo[2].nightweather}}
				</view>
				<view class="date-temperature">{{forecastWeatherInfo[2].daytemp}}°C/{{forecastWeatherInfo[2].nighttemp}}°C
				</view>
			</view>
			<!-- <template v-for="(item,index) in forecastWeatherInfo">
				<view class="day" v-if="index !== forecastWeatherInfo.length - 1">
					<view class="date">{{index === 0 ? '今天' : (index === 1 ? '明天' : (index === 2 ? '后天' : item.date))}}</view>
					<view class="date-weather">{{item.dayweather}} <span style="color: skyblue;">转</span>
						{{item.nightweather}}
					</view>
					<view class="date-temperature">{{item.daytemp}}°C/{{item.nighttemp}}°C</view>
				</view>
			</template> -->
			<button>查看近15日天气</button>
		</view>
	</view>
</template>

<script>
	import {
		chooseWeatherIcon
	} from '../../utils/chooseWeacherIcon.js'
	import {gaodeKey} from '../../assets/global-variables.js'
	export default {
		data() {
			return {
				// 实时天气
				livesWeatherInfo: {},
				// 预报天气
				forecastWeatherInfo: []
			}
		},
		onLoad() {
			// 实时天气
			uni.request({
				url: `https://restapi.amap.com/v3/weather/weatherInfo?city=510117&key=${gaodeKey}&extensions=base`,
				method: "GET",
				success: (res) => {
					this.livesWeatherInfo = res.data.lives[0]
					console.log(res);
				}
			})
			// 预报天气
			uni.request({
				url: `https://restapi.amap.com/v3/weather/weatherInfo?city=510117&key=${gaodeKey}&extensions=all`,
				method: "GET",
				success: (res) => {
					this.forecastWeatherInfo = res.data.forecasts[0].casts
					console.log(res);
				}
			})
		},
		methods: {
			chooseWeatherIconVue(a) {
				return chooseWeatherIcon(a)
			}
		}
	}
</script>

<style lang="scss">
	.content {
		height: 100vh;
		background-image: url('../../assets/images/bg.jpg');
		color: white;
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