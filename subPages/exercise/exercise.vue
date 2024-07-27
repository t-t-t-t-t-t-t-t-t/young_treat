<!-- 养生操 -->
<template>
	<view class="body">
		<!-- 头部 -->
		<view class="Myheader" :style="{height: h}">
			<myNavigationBar titleName="养生视频" needMenu="1" :ifcheck="false" bgc="#fff"></myNavigationBar>
		</view>
		<!-- 视频内容 -->
		<view class="content">
			<view v-for="(obj,index) in videoList" :key="obj.id"
			class="vidioBox" style="margin-bottom: 60rpx;">
				<myVideo :video="obj"></myVideo>
			</view>
			<!-- 底部加载栏 -->
			<bottomLoading :isLoading="isLoading[0]"></bottomLoading>
		</view>
		
		<view class="search-btn" @tap="goToSearch()">
			<icon class="iconfont icon-sousuo"></icon>
		</view>
		
		<!-- 重新登录提示窗 -->
		<u-modal v-model="reLogin" :content="tips" confirm-color="#70BCB2" title="温馨提示" 
		:title-style="{color:'#fa5353'}" @confirm="goToLogin()">
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//获取第几页的视频
				page:1,
				//每页获取多少条视频数据
				pageSize:5,
				//视频对象列表
				videoList:[],
				//下拉加载的提示状态
				isLoading:[0,0],
			};
		},
		//触底
		onReachBottom(){
			if(this.isLoading[0]===2)return;//没有更多数据了
			this.page++;//页码加1
			//修改 下拉加载状态
			this.isLoading.splice(0,1,1);
			//获取更多数据
			this.getVideo(this.page,this.pageSize,"");
		},
		created() {
			//获取pageSize条视频数据
			this.getVideo(this.page,this.pageSize,"");
		},
		methods:{
			//跳转到视频搜索页面
			goToSearch(){
				uni.navigateTo({
					url:"/subPages/searchVideo/searchVideo"
				})
			},
			//获取第page页的pageSize条数据(content相关内容)
			getVideo(page,pageSize,content){
				uni.request({
					url:getApp().globalData.baseUrl + "/video/video",
					method:'GET',
					header:{
						authentication:getApp().globalData.authentication
					},
					data:{
						page,
						pageSize,
						search:content,
					},
					success: (res) => {
						//如果登录凭证过期则显示模态框，让用户回去重新登录
						if(res.statusCode==401){
							this.reLogin = true;
							return;
						}
						if(res.statusCode!==200){
							console.log("获取视频数据失败！");
							return;
						}
						//获取到的视频对象数组
						console.log("获取视频数据成功！");
						let videos = res.data.data.records;
						let current = 0;
						if(videos.length===0){
							//改为“没有更多”状态
							this.isLoading.splice(current,1,2);
							console.log("帖子已经被全部获取了！");
							return;
						}
						this.videoList = [...this.videoList,...videos];
						//改为“隐藏”状态
						this.isLoading.splice(current,1,0);
					},
					fail: (err) => {
						console.log("获取视频数据失败！");
					}
				})
			}
		},	
	}
</script>

<style lang="scss" scoped>
.content{
	padding: 30rpx;
}
.search-btn{
	position: fixed;
	bottom: 60rpx;
	right: 50rpx;
	width: 100rpx;
	height: 100rpx;
	background-color: $main-bgc;
	text-align: center;
	border-radius: 50%;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	.iconfont{
		color:white;
		font-size: 46rpx;
		line-height: 100rpx;
	}
}
</style>
