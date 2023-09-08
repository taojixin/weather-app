export const http = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			...options,
			success(res) {
				if(res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res.data)
				} else {
					uni.showToast({
						icon: 'none',
						title: '请求错误！'
					})
					reject(res)
				}
			},
			fail(err) {
				uni.showToast({
					icon: 'none',
					title: '网络错误，请换个网络试试！'
				})
				reject(res)
			}
		})
	})
}