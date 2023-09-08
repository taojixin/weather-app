<template>
	<view class="hao-bigbox">
		<!-- 搜索 -->
		<view class="hao-search" v-if="isSearch">
			<view class="hao-searchCent">
				<image src="/static/haoIndexListImg/search.png" class="hao-searchImg"></image>
				<input type="text" v-model="inputKey" @input="searchInput" placeholder="请输入搜索信息" class="hao-searchInput" />
			</view>
		</view>
		<!-- 搜索内容 -->
		<view v-if="isSearch && searchList.length > 0" class="hao-searchScroll">
			<scroll-view scroll-y style="width:100%;height:100%;">
				<view>
					<view class="hao-secondEach" v-for="(item,index) in searchList" :key="item[idValue]" @tap="selectIndex(item)">
						<view class="hao-avatar" v-if="isAvatar">
							<image :src="item[avatarValue]" class="hao-avatarImg"></image>
						</view>
						<view class="hao-text">
							<view class="hao-name">{{item[nameValue]}}</view>
							<view class="hao-fu" v-if="isFu">{{item[fuValue]}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 右侧索引 -->
		<view class="hao-letters" v-if="isLetters&&searchList.length <= 0" :style="{'top':isSearch?'90rpx':'0rpx','height':isSearch?'calc(100% - 90rpx)':'100%'}">
			<image src="/static/haoIndexListImg/top.png" class="hao-letterTop" v-if="isTop" @tap="goTop"></image>
			<view
			 v-for="(item,index) in letters" 
			 :key="item" 
			 :style="{'height':indexEachHH+'rpx','background-color':(currentCeiling==index&&isIndexAc)?indexAcColor:''}"
			 class="hao-lettersEach" 
			 :class="(currentCeiling==index&&isIndexAc)?'hao-lettersEachAc':''"
			 @touchmove="handleTouchMove" 
			 @touchend="handleTouchEnd(item,index)"
			 @tap="handleLetterClick(item,index)">
				{{item}}
			</view>
		</view>
		
		<!-- 提示当前索引 -->
		<view class="hao-toastIndex" v-if="isIndexToast && toastIndex">{{toastIndex}}</view>
		
		<!-- 吸顶 -->
		<view class="ceiling" v-if="currentCeiling !== null&&isCeil&&listInfo.length>0&&searchList.length <= 0&&isOkCurrent" :style="{'top':isSearch?'90rpx':'0rpx'}">{{listInfo[currentCeiling].id.split('-')[1]}}</view>
		
		<!-- 列表 -->
		<scroll-view
		 scroll-y 
		 class="hao-scroll" 
		 @scroll="listenScroll" 
		 :scroll-top="scrollTop"
		 :scroll-into-view="scrollEachId" 
		 v-show="searchList.length <= 0" 
		 :style="{'top':isSearch?'90rpx':'0rpx','height':isSearch?'calc(100% - 90rpx)':'100%'}">
			<view>
				<view class="hao-modu" v-if="isCurrentCity || isHotCity">
					<view class="hao-current" v-if="isCurrentCity">
						<view class="hao-moduTitle">当前定位城市</view>
						<view class="hao-currentBox">
							<view class="hao-currentLs">
								<image src="/static/haoIndexListImg/posi.png" class="hao-currentImg"></image>
								<view class="hao-currentCity" @tap="selectIndex(currentCity)">{{currentCity[nameValue] || '暂无'}}</view>
							</view>
						</view>
					</view>
					<view class="hao-hotCity" v-if="isHotCity && hotCity.length>0">
						<view class="hao-moduTitle">热门城市</view>
						<view class="hao-hotCityBox">
							<view v-for="(item,index) in hotCity" :key="item[idValue]" @tap="selectIndex(item)" class="hao-hotEachCity">{{item[nameValue]}}</view>
						</view>
					</view>
				</view>
				
				<view v-for="(item,index) in cityList" :key="index" class="hao-each">
					<view class="hao-eachTitle" :id="'hao-'+index">{{index}}</view>
					<view class="hao-second">
						<view v-for="(ite,ind) in item" :key="ite[idValue]" class="hao-secondEach" @tap="selectIndex(ite)">
							<view class="hao-avatar" v-if="isAvatar">
								<image :src="ite[avatarValue]" class="hao-avatarImg"></image>
							</view>
							<view class="hao-text">
								<view class="hao-name">{{ite[nameValue]}}</view>
								<view class="hao-fu" v-if="isFu">{{ite[fuValue]}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:'hao-indexList',
		data() {
			return {
				inputKey:'',//搜索关键字
				searchTimeout:null,//搜索防抖
				searchList:[],//搜索内容
				scrollEachId:'all',//跳转到对应列表子项的id
				toastIndex:'',//当前索引提示内容
				indexEachHH:36,//索引项的高度，单位rpx
				afterConverHH:0,//索引项的高度转换成PX值
				indexFirstTT:0,//索引第一个子元素顶部位置，单位px
				indexLastBB:0,//索引最后一个子元素底部位置，单位px
				isOk:true,//索引滑动节流
				isIndexGo:false,//在滑动索引时是否让列表跳转
				currentCeiling:null,//当前吸顶项和当前索引
				listInfo:[],//列表分类项位置信息
				scrollInfo:{},//scroll的位置信息
				scrollTop:0.01,//跳转至scroll某个位置
				isOkCurrent:false,//当列表不长时，吸顶就不显示
			}
		},
		props:{
			//右侧索引
			letters:{
				type:Array,
				default:() =>[]
			},
			//是否显示右侧索引
			isLetters:{
				type:Boolean,
				default:true
			},
			//是否显示索引提示
			isIndexToast:{
				type:Boolean,
				default:true
			},
			//id对应的值名
			idValue:{
				type:String,
				default:'id'
			},
			//名字对应的值名
			nameValue:{
				type:String,
				default:'name'
			},
			//当前城市
			currentCity:{
				type:Object,
				default:() =>{}
			},
			//是否显示当前城市
			isCurrentCity:{
				type:Boolean,
				default:true
			},
			//热门城市
			hotCity:{
				type:Array,
				default:() =>[]
			},
			//是否显示热门城市
			isHotCity:{
				type:Boolean,
				default:true
			},
			//是否显示搜索
			isSearch:{
				type:Boolean,
				default:true
			},
			//城市列表
			cityList:{
				type:Object,
				default:() =>{}
			},
			//是否显示头像
			isAvatar:{
				type:Boolean,
				default:false
			},
			//头像对应的值名
			avatarValue:{
				type:String,
				default:'avatar'
			},
			//是否显示副标题
			isFu:{
				type:Boolean,
				default:false
			},
			//副标题对应的值名
			fuValue:{
				type:String,
				default:'fu'
			},
			//是否吸顶
			isCeil:{
				type:Boolean,
				default:true
			},
			//是否显示当前索引背景色
			isIndexAc:{
				type:Boolean,
				default:true
			},
			//当前索引背景色
			indexAcColor:{
				type:String,
				default:'#5594f9'
			},
			//是否显示回顶部图标
			isTop:{
				type:Boolean,
				default:false
			}
		},
		mounted() {
			this.afterConverHH = uni.upx2px(this.indexEachHH);//将索引项的高度值转成px
			this.getLocation();
		},
		methods:{
			//回顶部
			goTop(){
				this.scrollTop = 0;
				//防止第二次点击不跳
				setTimeout(() =>{
					this.scrollTop = 0.01;
				},200)
			},
			//搜索输入
			searchInput(){
				if(this.searchTimeout){
					clearTimeout(this.searchTimeout)
				}
				if(!this.inputKey){
					this.searchList = [];
					return
				}
				//查询匹配的数据
				this.searchTimeout = setTimeout(() =>{
					let data = this.cityList;
					let result = [];
					let list = Object.values(data).flat();
					list.map(r =>{
						if(r[this.nameValue].indexOf(this.inputKey) !== -1){
							result.push(r)
						}
					})
					this.searchList = result;
				},800)
			},
			//获取节点信息
			getLocation(){
				const that = this;
				//获取每项索引的位置信息
				uni.createSelectorQuery()
				.in(this)
				.selectAll('.hao-lettersEach')
				.boundingClientRect(rect => {
				  that.indexFirstTT = Math.round(rect[0].top);
				  that.indexLastBB = Math.round(rect[rect.length-1].bottom);
				})
				.exec();
				
				//获取scroll位置信息
				uni.createSelectorQuery()
				.in(this)
				.select('.hao-scroll')
				.boundingClientRect(rect => {
					that.scrollInfo = rect;
				})
				.exec();
				
				//获取列表每个分类项位置信息
				uni.createSelectorQuery()
				.in(this)
				.selectAll('.hao-eachTitle')
				.boundingClientRect(rect => {
					that.listInfo = rect;
				})
				.exec();
			},
			//监听滚动
			listenScroll(e){
				let top = this.scrollInfo.top || e.target.offsetTop;//scroll顶部的位置
				let scrollTop = e.detail.scrollTop;//scroll滚动了多少
				let allTop = top + scrollTop;

				if(this.currentCeiling !== null){
					//大于最后一个
					if(allTop >= this.listInfo[this.listInfo.length-1].top){
						this.currentCeiling = this.listInfo.length-1;
						return
					}else if(allTop > this.listInfo[this.currentCeiling].top && allTop > this.listInfo[this.currentCeiling+1].top){
						//当前位置远大于上一个的位置，通过遍历查询在哪
						//查询当前所在的位置
						let aa = this.listInfo.slice(this.currentCeiling+1,this.listInfo.length);//截取后半段遍历
						let bb = true;
						aa.some((r,v) =>{
							if(allTop < r.top && bb){
								this.currentCeiling += v;
								bb = false;
							}
						})
						return
					}
					
					//当前位置小于之前
					if(allTop < this.listInfo[this.currentCeiling].top){
						//小于第一个就隐藏
						if(allTop < this.listInfo[0].top){
							this.currentCeiling = null;
						}else{
							let aa = this.listInfo.slice(0,this.currentCeiling).reverse();//截取前半段遍历并倒序
							let bb = true;
							aa.some((r,v) =>{
								if(allTop >= r.top && bb){
									this.currentCeiling = this.currentCeiling - v - 1;
									bb = false;
								}
							})
						}
					}
				}else{
					//在第一个与第二个之间
					if(this.listInfo.length>0 && allTop >= this.listInfo[0].top && allTop < this.listInfo[1].top){
						this.currentCeiling = 0;
						//当列表够长时才让吸顶显示
						if(!this.isOkCurrent){
							this.isOkCurrent = true;
						}
					}else if(this.listInfo.length>0 && allTop > this.listInfo[0].top && allTop > this.listInfo[1].top){
						let bb = true;
						this.listInfo.some((r,v) =>{
							if(allTop < r.top && bb){
								this.currentCeiling = v;
								bb = false;
							}
						})
						//当列表够长时才让吸顶显示
						if(!this.isOkCurrent){
							this.isOkCurrent = true;
						}
					}else{
						this.currentCeiling = null;
					}
				}
			},
			//选取
			selectIndex(e){
				if(!e || e.target)return;
				console.log('选取',e)
				this.$emit('haoTap',e);
			},
			//点击索引跳对应项
			handleLetterClick(e,index){
				this.scrollEachId = 'hao-' + e;
				this.currentCeiling = index;
			},
			//手指在索引滑动中
			handleTouchMove(e){
				if(this.isOk){
					//节流
					this.isOk = false;
					setTimeout(() =>{
						//当前滑动到的位置
						if(e.touches[0]){
							let nowY = Math.round(e.touches[0].pageY);//四舍五入
							//在索引区域内
							if(nowY >= this.indexFirstTT && nowY <= this.indexLastBB){
								let aa = nowY - this.indexFirstTT;
								let bb = aa/this.afterConverHH;
								let cc = parseInt(bb);
								if(bb > cc){
									this.toastIndex = this.letters[cc];//提示索引
									//当end方法比move方法先执行时
									if(this.isIndexGo){
										this.isIndexGo = false;
										this.currentCeiling = cc;
										this.scrollEachId = 'hao-' + this.letters[cc];//跳到索引指定位置
										setTimeout(() =>{
											this.toastIndex = '';//关闭提示
										},700)
									}
								}else{
									this.toastIndex = this.letters[cc-1];//提示索引
									//当end方法比move方法先执行时
									if(this.isIndexGo){
										this.isIndexGo = false;
										this.currentCeiling = cc-1;
										this.scrollEachId = 'hao-' + this.letters[cc-1];//跳到索引指定位置
										setTimeout(() =>{
											this.toastIndex = '';//关闭提示
										},700)
									}
								}
							}else{
								//超出范围就为空
								this.toastIndex = '';
							}
						}
						this.isOk = true;
					},100)
				}
			},
			//手指在索引滑动结束
			handleTouchEnd(e,index){
				//有索引值才跳转
				if(this.toastIndex){
					//isOk为true代表滑动真正结束，否则让isIndexGo来决定最后跳转
					//由于滑动方法处做了节流，当快速滑动时end会比move先执行
					if(this.isOk){
						this.scrollEachId = 'hao-' + this.toastIndex;//跳到索引指定位置
						this.currentCeiling = index;
						setTimeout(() =>{
							this.toastIndex = '';
						},700)
					}else{
						this.isIndexGo = true;//让滑动处来执行跳转
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hao-bigbox{
		position: absolute;
		top: 0;
		left: 0;
		height:100%;
		width: 100%;
		background-color: #fff;
		
		/* 搜索 */
		.hao-search{
			width:100%;
			height:90rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.hao-searchCent{
				width: 94%;
				height: 60rpx;
				background-color:#f4f6fa;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius:30rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				.hao-searchImg{
					width:26rpx;
					height:26rpx;
					margin-right:16rpx;
				}
				.hao-searchInput{
					flex: 1;
					height:40rpx;
					font-size: 28rpx;
					color: #666;
				}
			}
		}
		
		/*搜索结果*/
		.hao-searchScroll{
			position:absolute;
			top:90rpx;
			left:0;
			width:100%;
			height:calc(100% - 90rpx);
			background:#fff;
			padding:0 30rpx;
			box-sizing: border-box;
		}
	
		/*右侧索引*/
		.hao-letters{
			position: absolute;
			top: 0;
			right: 0;
			width: 60rpx;
			z-index: 6;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.hao-letterTop{
				width:36rpx;
				height: 36rpx;
			}
			.hao-lettersEach{
				width:36rpx;
				height: 36rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #333;
				font-size: 28rpx;
			}
			.hao-lettersEachAc{
				color: #fff;
				border-radius: 50%;
			}
		}
		/*当前索引提示内容*/
		.hao-toastIndex{
			position: absolute;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 160rpx;
			height: 160rpx;
			line-height: 160rpx;
			text-align: center;
			font-size: 56rpx;
			font-weight: 700;
			border-radius: 20rpx;
			z-index: 6;
			background-color: #ddd;
			color: #fff;
		}
		
	
		/* 当前与热门 */
		.hao-modu{
			width:100%;
			padding:20rpx 30rpx;
			box-sizing: border-box;
			.hao-current{
				width:100%;
				padding-bottom:20rpx;
			}
			.hao-hotCity{
				width:100%;
			}
			.hao-moduTitle{
				width:100%;
				font-size:30rpx;
				color:#333;
				font-weight:600;
				margin-bottom:20rpx;
			}
			.hao-currentBox{
				width:100%;
				display: flex;
				align-items: center;
				.hao-currentLs{
					border-radius:10rpx;
					background-color: #fff;
					border:2rpx solid #eee;
					padding:0 40rpx;
					height:50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					.hao-currentImg{
						width: 28rpx;
						height: 28rpx;
						margin-right: 10rpx;
					}
					.hao-currentCity{
						color:#333;
						font-size: 28rpx;
					}
				}
			}
			.hao-hotCityBox{
				width:100%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.hao-hotEachCity{
					padding:0 20rpx;
					width:140rpx;
					height:50rpx;
					line-height: 50rpx;
					text-align: center;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color:#333;
					font-size: 28rpx;
					border-radius:10rpx;
					margin-bottom:26rpx;
					margin-right:30rpx;
					background-color: #fff;
					border:2rpx solid #eee;
				}
			}
		}
	
		/* 数据列表 */
		.hao-scroll{
			position:absolute;
			width:100%;
			left: 0;
			background-color:#fff;
			.hao-each{
				width:100%;
				.hao-eachTitle{
					font-size:32rpx;
					color:#333;
					background-color: #f4f4f4;
					padding: 10rpx 30rpx;
					box-sizing: border-box;
					font-weight: 600;
				}
				.hao-second{
					width:100%;
					padding: 0 30rpx;
					box-sizing: border-box;
				}
			}
		}
		
		/*吸顶*/
		.ceiling{
			position:absolute;
			left:0;
			width:100%;
			z-index: 1;
			font-size:32rpx;
			color:#333;
			background-color: #f4f4f4;
			padding: 10rpx 30rpx;
			box-sizing: border-box;
			font-weight: 600;
		}
		
		/*搜索结果与列表的每一项*/
		.hao-secondEach{
			width:100%;
			display: flex;
			align-items: center;
			padding:20rpx 0;
			border-bottom:2rpx solid #f4f4f4;
			.hao-avatar{
				width:90rpx;
				height:90rpx;
				margin-right:20rpx;
				.hao-avatarImg{
					width:100%;
					height:100%;
					border-radius: 8rpx;
				}
			}
			.hao-text{
				flex:1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.hao-name{
					font-size:30rpx;
					color:#333;
				}
				.hao-fu{
					font-size:24rpx;
					color:#999;
				}
			}
		}
		.hao-secondEach:last-child{
			border-bottom:none;
		}
	}
</style>