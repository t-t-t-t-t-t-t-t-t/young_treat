<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			//获取高度
			this.getHeaderHeight();
			//获取帖子分类
			this.getPostClassify();
			//获取热门搜索记录
			this.getHotRecord(10);
			try {
				const authentication = uni.getStorageSync('authentication');
				if (authentication ) {
					console.log("已登录");
					this.globalData.authentication = authentication;
					console.log(authentication)
				} else {
					console.log("没有authentication需要登陆")
					uni.reLaunch({
						url: '/pages/login/login'
					});
				}
			} catch (e) {
				console.log("登录出错", e)
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
			
		},
		onShow: function() {
			console.log('App Show');
			
		},
		onHide: function() {
			console.log('App Hide');
		},
		globalData: {  
			//自定义头部组件的默认高度
		    height: '60px'  ,
			//服务器ip地址
			baseUrl:"http://116.205.180.90:8080",
			//图片资源的根目录
			srcRoot:"https://hamster-test.oss-cn-shenzhen.aliyuncs.com/src/",
			//用户登录标识authentication
			authentication:"",
			
			//分享内容相关
			desc:"", //分享的描述
			
			//帖子分类列表
			postLists:[],
			//分类映射表
			classMap:[],
			//热搜记录
			hotRecord:[],
		},
		methods: {  
			//获取自定义头部组件高度
			getHeaderHeight(){
				//获取设备安全区域的信息
				let area = uni.getSystemInfoSync();
				let menu = uni.getMenuButtonBoundingClientRect();
				let h = area.statusBarHeight+menu.height + (menu.top - area.statusBarHeight) * 2 ;
				h = h + "px";
				this.globalData.height = h;
			},
			//获取帖子分类
			getPostClassify(){
				uni.request({
					url:this.globalData.baseUrl+"/square/getclass",
					success: (res) => {
						if(res.statusCode!=200)return;
						console.log("帖子分类获取成功！")
						this.globalData.postLists = res.data.data;
						//构建分类映射表
						this.globalData.classMap = this.globalData.postLists.reduce((map,item)=>{
							map[item.classId] = item.className;
							return map;
						},{})
					},
					fail: (err) => {
						console.log("帖子分类获取失败！"+err)
					}
				})
			},
			//获取热门搜索记录
			getHotRecord(nums){
				uni.request({
					url:this.globalData.baseUrl+"/article/getTopSearchWords",
					data:{
						nums:nums
					},
					success: (res) => {
						this.globalData.hotRecord = res.data.data.topWords;
						
						console.log("热搜记录获取成功！")
					},
					fail: (err) => {
						console.log("热搜记录获取失败！")
					}
				})
			}
		}  
	}
</script>

<style lang="scss">
	// 每个页面公共css
	@import url("static/font/iconfont/iconfont.css");
	// 引入uView基础样式
	@import "uview-ui/index.scss";
	.passageMargin{
		margin: 30rpx 0;	
	}
	
	.main-bgc{
		background-color: #A9DEE2;
	}
	
	.sub-bgc1{
		background-color: #afe6df;
	}
	
	.sub-bgc2{
		background-color: #70BCB2;
	}
	
	.main-fonsize{
		font-size: 30rpx;
	}
</style>
