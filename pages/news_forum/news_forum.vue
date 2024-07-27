<template>
	<view class="body">
		<!-- 自定义头部 -->
		<view class="Myheader" :style="{height:h}">
			<myNavigationBar titleName="论坛" :needMenu="2"></myNavigationBar>
		</view>
		<!-- 当滚动高度超过搜索框后，显示一个固定的搜索框 -->
		<!-- 搜索框 -->
		<view v-show="isSticky" >
			<view class="fixsearch" :style="{top:searchH}" @tap="goToSearch()">
				<img src="/static/src/search_logo.png" alt="" />
				<text>搜索发现更多...</text>
			</view>
		</view>
		<!-- 个性化搜索区域 -->
		<view class="box">
			<view class="area">
				<!-- 个性化logo区域 -->
				<view class="logo">
					<image :src="picUrl" mode="aspectFit" style="width: 250rpx;height: 160rpx;"></image>
					<view class="big">
						养趣
					</view>
					<view class="small">
						一个年轻化的社区
					</view>
					<view class="small">
						养生文化的博物馆
					</view>
				</view>
				<!-- 搜索区域 -->
				<view class="search-area">
					<!-- 搜索框 -->
					<view class="search" @tap="goToSearch()">
						<input type="text" disabled confirm-type="search" placeholder="搜索发现更多..."/>
						<img src="/static/src/search_logo.png" alt="" />
					</view>
				</view>
			</view>
		</view>
		<!-- 按钮导航 -->
		<!-- <view class="passage-nav" :style="{top:h}"> -->
			<!-- <view class="left" @click="hotSearch()">
				热搜
				<div class="underline" v-show="nav_choice==1"></div>
			</view>
			<view class="right" @click="recommendPassage()">
				推荐
				<div class="underline" v-show="nav_choice==2"></div>
			</view> -->
		<!-- </view> -->
		<!-- 热榜 -->
		<view class="hotList">
			<u-divider half-width="120" fontSize="40" margin-bottom="26" margin-top="36" color="#70BCB2">热榜
			</u-divider>
		</view>
		<!-- 分割色 -->
		<!-- <view class="spilt">	</view> -->
		<!-- 文章模块 -->
		<view class="passageList">
			<!-- 热搜文章模块 -->
			<view class="hotPassagers" v-show="nav_choice==1">
				<passage v-for="(passage,index) in hotPassages" :key="passage.id" @tap="updatePassage(index)"
				:passage_info="passage" :order="index+1">
				</passage>
			</view>
			<!-- 推荐文章模块 -->
			<!-- <view class="recmdPassagers" v-show="nav_choice==2">
				<recmdPassage v-for="(passage,index) in recmdPassages" :key="passage.id" 
				:passage_info="passage" class="passageMargin">
				</recmdPassage>
			</view> -->
		</view>
		<bottomLoading :isLoading="isLoading"></bottomLoading>
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
				//固定的搜索框的距离顶部的高度
				searchH:"",
				//当前选中了那个导航选项 “热搜” or “推荐”
				nav_choice:1,
				//热搜文章列表
				hotPassages:[],
				//推荐文章列表
				recmdPassages:[],
				//每页获取多少条数据
				pageSize:10,
				//现在是第几页
				pageNum:1,
				//吸顶状态
				isSticky:false, //搜索框是否吸顶
				//logo图片
				picUrl:getApp().globalData.srcRoot + "sublogo.png",
				//加载的提示状态
				isLoading:0,
			}
		},
		onLoad() {
			//吸顶的搜索框的距顶高度
			this.searchH = parseInt(this.h)-36+"px";
			//初始化热搜文章列表
			this.hotPassages = [];
			//获取热搜文章列表
			this.getPassages(this.pageNum,this.pageSize,0);
		},
		//页面触底
		onReachBottom() {
			if(this.isLoading===2)return;
			//修改 下拉加载状态
			this.isLoading = 1;
			//页码加1
			this.pageNum++;
			//获取更多文章
			this.getPassages(this.pageNum,this.pageSize,0);
		},
		//检测页面滚动
		onPageScroll(e) {
			// 获取当前滚动位置
			let scrollPosition = e.scrollTop;
		
			// 获取 要吸顶 搜索框的初始位置
			uni.createSelectorQuery().select('.search').boundingClientRect(data => {
			  // 判断是否处于吸附状态
			  if (data.top + data.height < parseInt(this.h)) {
				// 元素处于吸附状态
				this.isSticky = true;
			  } 
			  else{
				this.isSticky = false; 
			  }
			}).exec();
		},

		methods:{
			//请求文章数据
			getPassages(page,pageSize,classId=0){
				uni.request({
					url:getApp().globalData.baseUrl+"/article",
					data:{
						page:page,
						pageSize:pageSize,
						classId:classId
					},
					header:{
						authentication:getApp().globalData.authentication,
					},
					success: (res) => {
						//如果登录凭证过期则显示模态框，让用户回去重新登录
						if(res.statusCode==401){
							this.reLogin = true;
							return;
						}
						//文章列表
						let passages = res.data.data.records
						if(passages.length===0){
							this.isLoading = 2;
							console.log("文章已经被全部获取了！");
							return;
						}
						//追加到热搜文章列表里
						this.hotPassages = [...this.hotPassages,...passages];
						console.log("获取文章信息成功！");
					},
					fail: (err) => {
						console.log("获取文章失败！"+err)
					}
				})
			},
			//切换为热搜文章
			hotSearch(){
				this.nav_choice=1;
			},
			//切换为推荐文章
			recommendPassage(){
				this.nav_choice=2;
			},
			//跳转到搜索页面
			goToSearch(){
				uni.navigateTo({
					url:"/pages/searchPassage/searchPassage"
				})
			},
			//更新文章列表相应位置的数据
			updatePassage(index){
				let newObj = this.hotPassages[index];
				newObj.hit++;
				this.hotPassages.splice(index,1,newObj);
			}
		}
	}
</script>

<style lang="scss">
	page{
		// background-color: #A9DEE2;
	}
	.body{
		.fixsearch{
			position: fixed;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 60%;
			height: 30px;
			z-index: 102;
			margin-left: 5%;
			border-radius: 15px;
			background: #fff;
			font-size: 14px;
			color: #999;
			
			img{
				height: 18px;
				width: 18px;
				margin-right: 8px;
			}
		}
	}
	.box{
		background-color: #fff;
	}
	
	.area{
		border-radius:0 0 35rpx 35rpx;
		opacity: 1;
		background: #A9DEE2;
		overflow: hidden;
		.logo{
			padding-top: 50rpx;
			text-align: center;
			font-feature-settings: "kern" on;
			color: #3D3D3D;
			.big{
				font-family: YouSheBiaoTiHei;
				font-weight: 550;
				font-size: 100rpx;
				margin-bottom: 30rpx;
			}
			.small{
				margin-bottom: 5rpx;
				font-family: Source Han Sans;
				font-weight: 400;
				font-size: 32rpx;
			}
		}
		.search-area{
			width: 640rpx;
			margin: 50rpx auto 0;
			.search{
				position: relative;
				width: 100%;
				height: 100rpx;
				margin-bottom: 60rpx;
				input{
					height: 100%;
					padding: 0rpx 120rpx;
					border-radius: 20rpx;
					opacity: 1;
					background: #fff;
					font-size: 34rpx;
				}
				img{
					position: absolute;
					height: 63rpx;
					width: 63rpx;
					top: 20rpx;
					left: 28rpx;
				}
			}
			
			.records{
				display: flex;
				font-size: 30rpx;
				color: #3D3D3D;
				text{
					width: 230rpx;
				}
				.list{
					display: flex;
					flex-wrap: wrap;
					height: 156rpx;
					margin-left: 20rpx;
					color: #777;
					overflow: hidden;
					.item{
						padding: 4rpx 30rpx;
						margin:0 40rpx 30rpx 0;
						border-radius: 10rpx;
						background-color: #70BCB2;
						color: #fff;
					}
				}
			}
		}
		
	}

	.passage-nav{
		position: sticky;
		z-index: 100;
		text-align: center;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		font-size: 40rpx;
		color: #3D3D3D;
		padding: 30rpx 0 0;
		// background-color: #fafffa;
		background-color: white;
		.left,.right{
			width: 100rpx;
		}
		.underline{
			height: 6rpx;
			width: 100rpx;
			margin: 10rpx auto 8rpx;
			background-color: #70BCB2;
			
		}
	}
	
	.passageList{
		background-color: #fff;
		padding-top: 20rpx;
	}
	
	.spilt{
		height: 10rpx;
		background-color: #D8D8D8;
	}
	
	.bottom{
		background-color: #fff;
		padding: 20rpx 0;
	}
</style>
