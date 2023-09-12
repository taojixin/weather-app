<template>
	<view class="manage-city">
		<h1>城市管理</h1>
		<navigator url="/pages/search-city/search-city">
			<view class="addCity" @tap="addClick">
				<span class="iconfont">&#xe623;</span>
				<span class="search-position">搜索位置</span>
			</view>
		</navigator>
		<view class="city-list" v-if="cityList.length !== 0">
			<template v-for="(item,index) in cityList" :key="item.adcode">
				<div class="city-weather-info" @tap='itemCityClick(item)'>
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
			</template>

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
				cityList: []
			};
		},
		methods: {
			addClick() {
				uni.navigateTo({
					url: '/pages/add-city/add-city'
				})
			},

			itemCityClick(cityItem) {
				const currentCity = {
					adcode: cityItem.adcode,
					areaName: cityItem.cityName
				}
				console.log(currentCity);
				uni.setStorageSync('currentCity', JSON.stringify(currentCity))
				uni.showToast({
					icon: 'none',
					title: '切换成功！'
				})
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		},
		onLoad() {
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
				console.log(res);
				this.cityList = res
			})
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

		.city-list {
			display: flex;
			flex-wrap: wrap;

			.city-weather-info {
				width: 100vw;
				margin: 5px 5vw;
				padding: 20px 10px;
				background-color: skyblue;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: white;
			}
		}
	}
</style>