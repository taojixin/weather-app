<template>
	<view class="content">
		<!-- 1.顶部标题 -->
		<view class="top">
			<navigator url="/pages/manage-city/manage-city">
				<view class="left">+</view>
			</navigator>
			<view class="title">{{livesWeatherInfo.province}} {{livesWeatherInfo.city}}</view>
			<!-- <view class="right" @tap="otherClick">···</view> -->
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
		
		<!-- 生活指数 -->
		<view class="life" v-if="lifeIndex.length !== 0">
			<view class="life-item" v-for="item in lifeIndex">
				<!-- <span class="iconfont">&#xe650;</span> -->
				<span v-html="item.icon"></span>
				<div class="title">{{item.title}}</div>
				<div class="desc">{{item.desc}}</div>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		chooseWeatherIcon
	} from '../../utils/chooseWeacherIcon.js'
	import {
		getLifeIndexSer
	} from '../../services/life.js'
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
				currentCity: {},
				lifeIndex: []
			}
		},
		onLoad() {
			// 1.获取当前城市信息
			this.getCurrentCity()
			// 2.获取天气信息
			this.getWeatherInfoOnload()
			// 3.获取生活指数信息
			getLifeIndexSer(this.currentCity.areaName.replace('市', '').replace('县', '').replace('区', '')).then(res => {
				console.log(res);
				this.lifeIndex.push({
					id: 1,
					title: res.data.diaoyu.name.replace('指数', ''),
					desc: res.data.diaoyu.desc,
					icon: '<span class="iconfont">&#xe650;</span>'
				})
				this.lifeIndex.push({
					id: 2,
					title: res.data.kongtiao.name.replace('指数', ''),
					desc: res.data.kongtiao.desc,
					icon: '<span class="iconfont">&#xe617;</span>'
				})
				this.lifeIndex.push({
					id: 3,
					title: res.data.shushidu.name.replace('指数', ''),
					desc: res.data.shushidu.desc,
					icon: '<span class="iconfont">&#xe634;</span>'
				})
				this.lifeIndex.push({
					id: 4,
					title: res.data.chuanyi.name.replace('指数', ''),
					desc: res.data.chuanyi.desc,
					icon: '<span class="iconfont">&#xe696;</span>'
				})
				this.lifeIndex.push({
					id: 5,
					title: res.data.fangshai.name.replace('指数', ''),
					desc: res.data.fangshai.desc,
					icon: '<span class="iconfont">&#xe607;</span>'
				})
				this.lifeIndex.push({
					id: 6,
					title: res.data.yundong.name.replace('指数', ''),
					desc: res.data.yundong.desc,
					icon: '<span class="iconfont">&#xe807;</span>'
				})
				this.lifeIndex.push({
					id: 7,
					title: res.data.lvyou.name.replace('指数', ''),
					desc: res.data.lvyou.desc,
					icon: '<span class="iconfont">&#xe60c;</span>'
				})
				this.lifeIndex.push({
					id: 8,
					title: res.data.yusan.name.replace('指数', ''),
					desc: res.data.yusan.desc,
					icon: '<span class="iconfont">&#xe698;</span>'
				})
				this.lifeIndex.push({
					id: 9,
					title: res.data.ziwaixian.name.replace('指数', ''),
					desc: res.data.ziwaixian.desc,
					icon: '<span class="iconfont">&#xe6cf;</span>'
				})
				console.log(this.lifeIndex);
			})
		},
		methods: {
			// 天气icon
			chooseWeatherIconVue(a) {
				return chooseWeatherIcon(a)
			},
			// 添加地址
			addCityOnload() {
				let localCity = JSON.parse(uni.getStorageSync("localCity") || '[]')
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
					// console.log(res);
					this.livesWeatherInfo = res.lives[0]
				})
				// 预报天气
				getForecastWeatherSer(this.currentCity.adcode).then(res => {
					// console.log(res);
					this.forecastWeatherInfo = res.forecasts[0].casts
				})
			},
			// 设置当前城市
			getCurrentCity() {
				if (uni.getStorageSync('currentCity')) {
					this.currentCity = JSON.parse(uni.getStorageSync('currentCity'))
					// console.log(this.currentCity);
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
		// border: 3px solid gray;
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

	.life {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		
		.life-item {
			width: 30vw;
			margin: 10px 0 30px 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			span {
				margin-bottom: 10px;
				font-size: 50px;
			}
			.title {
				font-size: 14px;
			}
			.desc {
				font-size: 12px;
				color: #cecece;
				padding: 0 10px;
			}
		}
	}
</style>