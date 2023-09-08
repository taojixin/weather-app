<template>
	<view class="add-city">
		<hao-indexList 
		  :letters="letters" 
		  idValue="areaId" nameValue="areaName" 
			:currentCity="currentCity"
			:hotCity="hotCity" :cityList="cityList" 
			@haoTap='haoClick'>
		</hao-indexList>

	</view>
</template>

<script>
	import {
		cityList
	} from '../../assets/city-list.js'
	export default {
		data() {
			return {
				//索引 城市首字母集合
				letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X',
					'Y', 'Z'
				],
				//当前城市
				currentCity: {
					"areaId": "430100",
					"areaName": "长沙市",
				},
				//热门城市
				hotCity: [{
						"areaId": "110100",
						"areaName": "北京市",
					},
					{
						"areaId": "310100",
						"areaName": "上海市",
					},
					{
						"areaId": "440100",
						"areaName": "广州市",
					},
					{
						"areaId": "440300",
						"areaName": "深圳市",
					},
				],
				cityList: cityList,
			};
		},
		methods: {
			haoClick(val) {
				uni.navigateTo({
					url: `/pages/new-city/new-city?areaId=${val.areaId}&areaName=${val.areaName}`
				})
			}
		},
		onLoad() {

		}
	}
</script>

<style lang="scss">
</style>