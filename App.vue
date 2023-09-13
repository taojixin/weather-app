<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@font-face {
	  font-family: 'iconfont';
	  src: url('./assets/iconfont/iconfont.woff2?t=1694509256470') format('woff2'),
	       url('./assets/iconfont/iconfont.woff?t=1694509256470') format('woff'),
	       url('iconfont.ttf?t=1694509256470') format('truetype');
	}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 20px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
</style>
