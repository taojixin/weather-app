<template>
	<view>
		
	</view>
</template>

<script>
	import {getSevenWeatherSer} from "../../services/weather.js"
	export default {
		data() {
			return {
				
			};
		},
		onLoad() {
			getSevenWeatherSer().then(res => {
				console.log(res);
			})
		}
	}
</script>

<style lang="scss">

</style>
