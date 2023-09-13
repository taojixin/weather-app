<template>
	<view class="manage-city">
		<h1>城市管理</h1>
		<navigator url="/pages/search-city/search-city">
			<view class="addCity">
				<span class="iconfont">&#xe623;</span>
				<span class="search-position">搜索位置</span>
			</view>
		</navigator>
		<view class="city-list" v-if="cityList.length !== 0">
			<uni-swipe-action class="uni-swi-act">
				<template v-for="(item,index) in cityList" :key="item.adcode">
					<uni-swipe-action-item>
						<template v-slot:right>
							<view class="delete"  @click="deleteClick(item)">删除</view>
						</template>
						<view>
							<div class="city-weather-info" @tap='itemCityClick(item)' :style="{width: windowWidth - 80 + 'px'}">
								<div class="left">
									<div class="left-top">
										{{item.cityName}}
										<span class="iconfont">&#xe600;</span>
									</div>
									<div class="left-bottom">
										{{item.dayweather}} {{item.daypower}}°C/{{item.nightpower}}°C
									</div>
								</div>
								<div class="right">
									29°C
								</div>
							</div>
						</view>
					</uni-swipe-action-item>
				</template>

			</uni-swipe-action>

		</view>
	</view>
</template>

<script>
	import {
		getForecastWeatherAdcodeSer
	} from '../../services/weather.js'
	export default {
		data() {
			return {
				cityList: [],
				windowWidth: 441
			};
		},
		onLoad() {
			// 获取屏幕宽度
			uni.getSystemInfo({
				success(res) {
					this.windowWidth = res.windowWidth
				}
			})
			// 获取天气信息
			this.getWeatherListInfo()
		},
		methods: {
			// 点击某一个列表选项
			itemCityClick(cityItem) {
				const currentCity = {
					adcode: cityItem.adcode,
					areaName: cityItem.cityName
				}
				uni.setStorageSync('currentCity', JSON.stringify(currentCity))
				uni.showToast({
					icon: 'none',
					title: '切换成功！'
				})
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			deleteClick(itemCity) {
				uni.showLoading({
					title: '删除中，请稍后',
					mask: true
				})
				const cityList = JSON.parse(uni.getStorageSync('localCity'))
				let newCityList = []
				cityList.map(item => {
					if(itemCity.adcode+'' !== item.areaId+'') {
						newCityList.push(item)
					}
				})
				uni.setStorageSync('localCity', JSON.stringify(newCityList))
				Promise.all(newCityList.map(async item => {
					let cityObj = {}
					await getForecastWeatherAdcodeSer(item.areaId).then(res => {
						cityObj.adcode = res.forecasts[0].adcode
						cityObj.cityName = res.forecasts[0].city
						cityObj.daypower = res.forecasts[0].casts[0].daytemp
						cityObj.nightpower = res.forecasts[0].casts[0].nighttemp
						cityObj.dayweather = res.forecasts[0].casts[0].dayweather
					})
					return cityObj
				})).then(res => {
					uni.hideLoading();
					this.cityList = res
				})
			},
			getWeatherListInfo() {
				uni.showLoading({
					title: '加载中，请稍后',
					mask: true
				})
				const localCity = JSON.parse(uni.getStorageSync('localCity') || '[]')
				Promise.all(localCity.map(async item => {
					let cityObj = {}
					await getForecastWeatherAdcodeSer(item.areaId).then(res => {
						cityObj.adcode = res.forecasts[0].adcode
						cityObj.cityName = res.forecasts[0].city
						cityObj.daypower = res.forecasts[0].casts[0].daytemp
						cityObj.nightpower = res.forecasts[0].casts[0].nighttemp
						cityObj.dayweather = res.forecasts[0].casts[0].dayweather
					})
					return cityObj
				})).then(res => {
					uni.hideLoading();
					this.cityList = res
				})
			}
		},
		
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

		.city-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			overflow: hidden;
			.uni-swi-act{
				width: 100%;
			}

			.city-weather-info {
				// width: 90vw;
				margin: 5px 3vw;
				padding: 20px 10px;
				background-color: skyblue;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: white;
			}
			.delete {
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: red;
				margin: 5px 3vw 5px 0;
				padding: 20px 10px;
				border-radius: 10px;
			}
		}
	}
</style>