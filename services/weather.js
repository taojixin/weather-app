import {
	http
} from './http.js'
import {
	gaodeKey,
	appid,
	appsecret
} from '../assets/global-variables.js'

// 高德天气api *************************************************
// 获取实时天气
export function getLivesWeatherSer(adcode) {
	return http({
		methods: "GET",
		url: `https://restapi.amap.com/v3/weather/weatherInfo?key=${gaodeKey}&extensions=base&city=${adcode}`,
	})
}
// 获取预报天气
export function getForecastWeatherSer(adcode) {
	return http({
		methods: "GET",
		url: `https://restapi.amap.com/v3/weather/weatherInfo?key=${gaodeKey}&extensions=all&city=${adcode}`,
	})
}
// 获取预报天气根据adcode
export function getForecastWeatherAdcodeSer(adcode) {
	return http({
		methods: "GET",
		url: `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${gaodeKey}&extensions=all`,
	})
}


// 免费天气api *************************************************
// 最近七天天气
export function getSevenWeatherSer() {
	return http({
		methods: "GET",
		url: `https://v0.yiketianqi.com/api?unescape=1&version=v9&appid=${appid}&appsecret=${appsecret}`
	})
}
// 根据城市名称获取七天天气信息
export function getSevenWeatherCityNameSer(cityName) {
	return http({
		methods: "GET",
		url: `https://yiketianqi.com/api?unescape=1&version=v9&appid=${appid}&appsecret=${appsecret}&city=${cityName}`
	})
}
// 根据经纬度获取七天天气信息
export function getSevenLoLaWeatherSer(longitude,latitude	) {
	return http({
		methods: "GET",
		url: `https://v0.yiketianqi.com/api?unescape=1&version=v9&appid=${appid}&appsecret=${appsecret}&lng=${longitude}&lat=${latitude}`
	})
}