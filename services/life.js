import {
	http
} from './http.js'
import {
	gaodeKey,
	appid,
	appsecret
} from '../assets/global-variables.js'


// 免费天气api *************************************************
// 获取生活指数
export function getLifeIndexSer(city) {
	return http({
		methods: "GET",
		url: `https://www.tianqiapi.com/life/lifepro?appid=${appid}&appsecret=${appsecret}&city=${city}`,
	})
}