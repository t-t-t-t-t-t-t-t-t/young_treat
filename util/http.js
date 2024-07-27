const BASE_URL = "http://116.205.180.90:8080";
export default function Request({
	url,
	method,
	data = null,
	contentType = 'application/json'
}) {
	uni.showLoading({
		title: '加载中'
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			data: data || {},
			method: method || 'GET',
			header: {
				// || '' 考虑到登录API没有authentication。
				'authentication': getApp().globalData.authentication ||
					uni.getStorageSync('authentication') || '',
				'Content-Type': contentType
			},
			success(res) {
				if (res.statusCode !== 200) { // 返回错误
					if (res.statusCode == 401) { // 没有authentication，或者token失效
						uni.removeStorage({ // 移除失效的authentication
							key: "authentication",
							success: () => {
								uni.redirectTo({
									url: "/pages/login/login"
								});
							}
						});
						return;
					}
					return reject()
				}
				resolve(res.data)
			},
			fail(err) {
				reject(err)
			},
			complete() {
				uni.hideLoading()
			}
		})
	})
};