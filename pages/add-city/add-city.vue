<template>
	<view class="add-city">
		<h1>城市管理</h1>
		<uni-search-bar class="search-bar" @confirm="" @input="" @focus="isHotAddress = true" @cancel='isHotAddress = false'
			placeholder="搜索位置" />

		<view class="hot-address" v-if="isHotAddress">
			<view class="title">热门城市</view>
			<view class="tags">
				<view class="tag" v-for="(item) in hotAddress" :style="position(hotAddress[0].id)" :key="item.id"
					@tap="positionClick">
					{{item.label}}
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isHotAddress: false,
				city: {
					code: "",
					name: "定位中..."
				},
				hotCity: [{
						code: "110100",
						name: "北京"
					},
					{
						code: "310100",
						name: "上海"
					},
					{
						code: "330100",
						name: "杭州"
					},
					{
						code: "440100",
						name: "广州"
					},
					{
						code: "440300",
						name: "深圳"
					},
					{
						code: "320100",
						name: "南京"
					},
					{
						code: "500100",
						name: "重庆"
					},
					{
						code: "510100",
						name: "成都"
					}
				],
				hotAddress: [{
						id: 0,
						label: '定位',
						value: '000000'
					},
					{
						id: 1,
						label: '北京',
						value: '110000'
					},
					{
						id: 2,
						label: '上海',
						value: '310000'
					},
					{
						id: 3,
						label: '广州',
						value: '440100'
					},
					{
						id: 4,
						label: '深圳',
						value: '440300'
					},
					{
						id: 5,
						label: '杭州',
						value: '330100'
					},
					{
						id: 6,
						label: '成都',
						value: '510100'
					},
					{
						id: 7,
						label: '巴中',
						value: '1232131'
					},
					{
						id: 8,
						label: '安岳县',
						value: '512921'
					},

				]
			};
		},
		methods: {
			position(id) {
				if (id === 0) {
					return {
						'color': 'blue'
					}
				} else {
					return ''
				}
			},
		},
		onLoad() {

		}
	}
</script>

<style lang="scss">
	.add-city {
		h1 {
			margin: 20px;
		}

		.hot-address {
			margin: 10px;

			.title {
				color: gray;
			}

			.tags {
				border: 1px solid gray;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.tag {
					background-color: #cdcdcd;
					border-radius: 10px;
					padding: 5px;
					margin: 5px;
					font-size: 16px;
					color: white;
				}
			}
		}
	}
</style>