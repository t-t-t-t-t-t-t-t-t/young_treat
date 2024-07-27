<template>
	<view class="body">
		<!-- 自定义头部栏 -->
		<view class="Myheader" :style="{height:h}">
			<myNavigationBar :needMenu="1" titleName="视频搜索" :ifcheck="false" bgc="#fff"></myNavigationBar>
		</view>
		<!-- 搜索框 -->
		<view class="searchBar">
			<searchBar @searching="goSearching()"></searchBar>
		</view>
		<!-- 搜索记录 -->
		<view class="searchRecord" v-show="!ifSearched">
			<!-- 历史搜索记录 -->
			<view class="hisRecord">
				<!-- 标题栏 -->
				<view class="head">
					<!-- 标题 -->
					<view class="title">
						历史搜索
					</view>
					<!-- 删除图标 -->
					<u-icon name="trash" @tap="isAlert=true" v-if="recordList.length>0"></u-icon>
				</view>
				<!-- 记录内容(不为空) -->
				<view class="record">
					<view class="list">
						<view class="item" v-for="(record,index) of recordList" :key="index" @tap="goSearching(record)">{{record}}</view>
					</view>
				</view>
				<!-- 搜索记录为空时 -->
				<u-empty text="无搜索记录" mode="history" icon-size="180" font-size="32" v-show="recordList.length===0"></u-empty>
			</view>
			<!-- 热门搜索记录 -->
			<view class="hotRecord">
				<!-- 标题栏 -->
				<view class="head">
					<!-- 标题 -->
					<view class="title">
						养趣热搜
						<icon class="iconfont icon-remen" style="margin-left: 10rpx;color: red;font-size: 30rpx;"></icon>
					</view>
				</view>
				<!-- 记录内容(不为空) -->
				<view class="record">
					<view class="list">
						<view class="item" v-for="(record,index) of hotRecord" :key="index" @tap="goSearching(record)">{{record}}</view>
					</view>
				</view>
				<!-- 搜索记录为空时 -->
				<u-empty text="无热搜记录" mode="history" icon-size="180" font-size="32" v-show="hotRecord.length===0"></u-empty>
			</view>
		</view>
		
		<!-- 搜索内容 -->
		<view class="searchPassage" v-show="ifSearched" style="padding: 30rpx;">
			<!-- 文章 -->
			<myVideo v-for="(video,index) in videoList" :key="passage.id"
			:video="video">
			</myVideo>
			<!-- 搜索结果为空时 -->
			<u-empty text="无搜索结果" mode="search" icon-size="180" font-size="32" margin-top="80" v-if="videoList.length===0 && !flag"></u-empty>
		</view>
		
		<!-- 底部加载栏 -->
		<bottomLoading :isLoading="isloading" v-if="videoList.length!==0"></bottomLoading>
		
		<!-- 加载中动画 -->
		<view class="loader" v-if="flag">
		</view>
		
		<!-- 清空提示模态框 -->
		<u-modal v-model="isAlert" :content="cleartips" title="温馨提示" show-cancel-button="true"
		confirm-color="#70BCB2" mask-close-able="true" :title-style="{color:'#fa5353'}" @confirm="clear()">
		</u-modal>
		<!-- 重新登录提示窗 -->
		<u-modal v-model="reLogin" :content="tips" confirm-color="#70BCB2" title="温馨提示" 
		:title-style="{color:'#fa5353'}" @confirm="goToLogin()">
		</u-modal>
	</view>
</template>

<script>
	//导入事件总线
	import { EventBus } from '@/main';
	export default {
		data() {
			return {
				//是否展示模态框
				isAlert:false,
				cleartips:"确认清除历史记录？",
				// 搜索记录列表
				recordList:[],
				// 热门搜索记录
				hotRecord:[],
				//显示搜索记录还是搜索内容
				ifSearched:false, //默认显示搜索记录
				//搜索页数
				pageNum:1,
				//每页文章数量
				pageSize:10,
				//视频内容
				videoList:[],
				//是否正在加载中
				flag:false,
				//底部加载状态
				isloading:0,
				//搜索内容
				searchText:"",
			};
		},
		mounted() {
			//从本地存储中获取 历史搜索记录
			try {
				this.recordList = uni.getStorageSync('recordList');
				if (this.recordList) {
					console.log("获取搜索记录成功！");
				}
			} catch (e) {
				console.log("用户暂无搜索记录！")
				this.recordList = [];
			}
			//从全局中获取 热搜记录
			this.hotRecord = getApp().globalData.hotRecord
		},
		//触底
		onReachBottom() {
			if(this.isloading===2)return;
			//要获取下一页的内容
			this.pageNum++;
			//修改加载状态
			this.isloading = 1;
			//获取更多文章
			this.getVideo(this.pageNum,this.pageSize,this.searchText)
		},
		methods:{
			//清空搜索记录
			clear(){
				this.recordList = [];
				//从本地缓存中异步移除指定 recordList
				uni.removeStorage({
					key:"recordList",
					success: () => {
						console.log("清空搜索记录成功！");
					},
					fail: () => {
						console.log("清空搜索记录失败！");
					}
				})
			},
			//搜索
			goSearching(searchText){
				//更新当前搜索内容
				this.searchText = searchText;
				//向子组件传值
				EventBus.$emit('searched', searchText);
				//当用户搜索后，点击搜索框会显示 搜索记录
				if(searchText===""){
					this.ifSearched = false;
					return;
				}
				//清空文章列表
				this.videoList = [];
				//清空页码
				this.pageNum = 1;
				//还原底部加载栏状态
				this.isloading = 0;
				//当用户搜索时，显示搜索内容，并将 搜索记录 进行本地存储
				this.ifSearched = true;
				//加载中
				this.flag = true;
				//获取文章数据
				this.getVideo(this.pageNum,this.pageSize,searchText);
				//将 搜索记录 进行本地存储
				this.saveRecord(searchText);
			},
			//将 搜索记录 进行本地存储
			saveRecord(searchText){
				if(this.recordList.length===0)this.recordList=[searchText];
				else{
					//检查此搜索内容是否已出现过
					let index = this.recordList.indexOf(searchText);
					//已经出现过则删除
					if(index !== -1)this.recordList.splice(index,1);
					this.recordList.unshift(searchText); //将本次的搜索内容追加在 历史搜索记录列表的头部
				} 
				//限制历史搜索记录最大长度为 15
				if(this.recordList.length>15)this.recordList.splice(15,1);
				uni.setStorage({
					key:"recordList",
					data:this.recordList,
					success: () => {
						console.log("保存搜索记录成功！")
					},
					fail: () => {
						console.log("保存搜索记录失败！")
					}
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
						if(videos.length===0){
							//改为“没有更多”状态
							this.isloading = 2;
							console.log("帖子已经被全部获取了！");
							return;
						}
						this.videoList = [...this.videoList,...videos];
						//改为“隐藏”状态
						this.isLoading = 0;
					},
					fail: (err) => {
						console.log("获取视频数据失败！");
					},
					complete: () => {
						//消除加载中状态
						this.flag = false;
					}
				})
			}

		},
	}
</script>

<style lang="scss" scoped>
.body{
	.searchBar{
		height: 113rpx;
	}
	.searchRecord{
		padding: 40rpx 30rpx;
		.head{
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
		}
		.record{
			padding: 30rpx 0;
			margin-top: 10rpx;
			.list{
				display: flex;
				flex-wrap: wrap;
				overflow: hidden;
				font-size: 28rpx;
				line-height: 28rpx;
				.item{
					padding: 14rpx 26rpx;
					margin:0 20rpx 20rpx 0;
					border-radius: 40rpx;
					background-color: #A9DFD8;
					color: #fff;
				}
			}
		}
	}
	
	// 加载中动画
	.loader {
	  --c1:#673b14;
	  --c2:#f8b13b;
	  width: 40px;
	  height: 80px;
	  border-top: 4px solid var(--c1);
	  border-bottom: 4px solid var(--c1);
	  background: linear-gradient(90deg, var(--c1) 2px, var(--c2) 0 5px,var(--c1) 0) 50%/7px 8px no-repeat;
	  display: grid;
	  overflow: hidden;
	  animation: l5-0 2s infinite linear;
	  margin: 60rpx auto;
	}
	.loader::before,
	.loader::after {
	  content: "";
	  grid-area: 1/1;
	  width: 75%;
	  height: calc(50% - 4px);
	  margin: 0 auto;
	  border: 2px solid var(--c1);
	  border-top: 0;
	  box-sizing: content-box;
	  border-radius: 0 0 40% 40%;
	  -webkit-mask: 
	    linear-gradient(#000 0 0) bottom/4px 2px no-repeat,
	    linear-gradient(#000 0 0);
	  -webkit-mask-composite: destination-out;
	          mask-composite: exclude;
	  background: 
	    linear-gradient(var(--d,0deg),var(--c2) 50%,#0000 0) bottom /100% 205%,
	    linear-gradient(var(--c2) 0 0) center/0 100%;
	  background-repeat: no-repeat;
	  animation: inherit;
	  animation-name: l5-1;
	}
	.loader::after {
	  transform-origin: 50% calc(100% + 2px);
	  transform: scaleY(-1);
	  --s:3px;
	  --d:180deg;
	}
	@keyframes l5-0 {
	  80%  {transform: rotate(0)}
	  100% {transform: rotate(0.5turn)}
	}
	@keyframes l5-1 {
	  10%,70%  {background-size:100% 205%,var(--s,0) 100%}
	  70%,100% {background-position: top,center}
	}
}
</style>