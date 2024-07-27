<template>
	<view class="body">
		<!-- 头部 -->
		<view class="Myheader" :style="{height: h}">
			<myNavigationBar titleName="社区"></myNavigationBar>
		</view>
		<!-- 回到顶部按钮 -->
		<button class="toTop" v-show="ifToTop[current]" @tap="scrollToTop()">
			<i class="iconfont icon-zhiding"></i>
		</button>
		<!-- 帖子发布按钮 -->
		<button class="launch" @tap="toPublish()">
			<i class="iconfont icon-fabu"></i>
		</button>
		
		<view class="banner">
			<!-- 导航菜单 -->
			<view style="height: 6%;">
				<u-tabs-swiper ref="uTabs" name="className" :list="list" :current="current" @change="tabsChange" :is-scroll="true"
				 swiperWidth="750" active-color="#70BCB2" gutter="66">
				 </u-tabs-swiper>
			</view>
			<!-- 帖子内容 -->
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
			class="contents">
				<swiper-item class="swiper-item" v-for="(num,i) in list" :key="num.id">
					<scroll-view scroll-y style="height: 100%;width: 100%;" 
					refresher-enabled @refresherrefresh="onpullDownRefresh()" :refresher-triggered="isRefresh"
					@scrolltolower="onreachBottom" @scroll="onpageScroll" :scroll-top="scrollTop" scroll-with-animation>
						<!-- 加载中动画 -->
						<view class="loader" v-if="content_pieces_arr[i]===undefined">
						</view>
						<view class="posts"  v-for="(item, index) in content_pieces_arr[i]" :key="index">
							<posts :item="item" :totalNum="content_pieces_arr[i]==undefined?0:content_pieces_arr[i].length" 
							@update="updatePost" :label="i==0?'找搭子':num.className">
							</posts>
						</view>
						<!-- 底部加载栏 -->
						<bottomLoading :isLoading="isLoading[i]" bgc="#eef1ee"></bottomLoading>
					</scroll-view>
				</swiper-item>
			</swiper>
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
				// 所有帖子
				content_pieces_arr : [],
				//获取第几页的数据
				pageNum:[],
				//每次获取多少条数据
				pageSize:10,
				//是否开启了下拉刷新
				isRefresh:false,
				//下拉加载的提示状态
				isLoading:[],
				//导航菜单列表
				list: {
					type:Array,
					default:[]
				},
				// 因为内部的滑动机制限制，需将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				//是否展示“回到顶部”按钮
				ifToTop:[false,false,false,false,false,false,false,false],
				scrollTop: 0, //滚动条距离顶部的距离
			};
		},
		onLoad() {
			let size = getApp().globalData.postLists.length||10;
			//初始化页码
			for(let i=0;i<size;i++){
				this.pageNum[i] = 1;
			}
			//初始化下拉刷新状态
			for(let i=0;i<size;i++){
				this.isLoading[i] = 0;
			}
			//初始化数组，防止array.splice异常；
			for(let i=0;i<size;i++){
				this.content_pieces_arr[i] = [];
			}
			//获取帖子数据
			for(let i=0;i<size;i++){
				let classID = getApp().globalData.postLists[i].classId
				this.getPieces(1,this.pageSize,i,classID);
			}
		},
		methods:{
			//获取第current类的第page页的size条数据
			getPieces(page,size,current,classID){
				//发送请求
				uni.request({
					url:getApp().globalData.baseUrl + "/square/page",
					data:{
						page:page,
						pageSize:size,
						classId:classID
					},
					header:{
						authentication:getApp().globalData.authentication,
					},
					success: (res) => {
						//获取帖子列表
						let pieces = res.data.data.records
						//修改下拉刷新状态
						this.isRefresh = false
						//隐藏加载框
						uni.hideToast()
						//如果登录凭证过期则显示模态框，让用户回去重新登录
						if(res.statusCode==401){
							this.reLogin = true;
							return;
						}
						//没有更多帖子信息了
						if(pieces.length===0){
							this.isLoading.splice(current,1,2);
							console.log("帖子已经被全部获取了！");
							return;
						}
						if(page===1)
							this.content_pieces_arr.splice(current,1,pieces);
						else this.content_pieces_arr[current] = [...this.content_pieces_arr[current],...pieces];
						this.isLoading.splice(current,1,0);
						console.log("获取帖子信息成功！");
					},
					fail: (error) => {
						console.log("获取帖子信息失败！");
						console.log(error);
					},
					complete: () => {
						if(this.list.length===undefined){
							this.list = getApp().globalData.postLists;
						}
					}
				})
			},
			//点赞、转发、评论后更新帖子数据
			updatePost(id){
				//找到所需要更新的帖子的索引位置
				let pos = 0;
				for(let i=0;i<this.content_pieces_arr[this.current].length;i++){
					if(this.content_pieces_arr[this.current][i].id === id){
						pos = i;
						break;
					}
				}
				//更新操作的那条帖子的数据
				uni.request({
					url:getApp().globalData.baseUrl + `/square/${id}`,
					header:{
						authentication:getApp().globalData.authentication,
					},
					success: (res) => {
						//获取帖子列表
						let newObj = res.data.data
						this.content_pieces_arr[this.current].splice(pos,1,newObj);
						console.log("更新帖子信息成功！");
						//向社区页面传值
					},
					fail: (error) => {
						console.log("更新帖子信息失败！"+error);
					}
				})
			},
			
			//滚动到顶部
			scrollToTop(){
				//获取0~1的随机数
				let random = Math.random();
				//将距离顶部的高度设置为 该随机数， 不设置为0是因为那样可能会置顶失败
				this.scrollTop = random;
				//重置是否置顶列表
				for(let i = 0;i<this.ifToTop.length;i++){
					this.ifToTop.splice(i,1,false);
				}
			},
			//监视滚动的距离
			onpageScroll(event){
				// 滚动距离超过2000时显示 "置顶" 按钮
				if(event.detail.scrollTop>2000){
					this.ifToTop.splice(this.current,1,true);
				}
				// 滚动距离小于600时隐藏 "置顶" 按钮
				else if(event.detail.scrollTop<400){
					this.ifToTop.splice(this.current,1,false);
				}
			},
		
			//轮播图和导航菜单相关方法
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				if(this.isLoading[this.current]===2)return;
				//页码加1
				this.pageNum[this.current]++;
				//修改 下拉加载状态
				if(this.isLoading[this.current]!==2)this.isLoading.splice(this.current,1,1);
				//获取更多帖子
				this.getPieces(this.pageNum[this.current],this.pageSize,this.current,this.list[this.current].classId);
			},
			//下拉刷新处理函数
			onpullDownRefresh() {
				//数据清理
				this.content_pieces_arr[this.current] = [];
				this.pageNum[this.current]=1;
				//重新获取帖子
				this.getPieces(this.pageNum[this.current],this.pageSize,this.current,this.list[this.current].classId);
				//改变下拉刷新状态
				this.isRefresh = true;
				//显示加载框
				uni.showToast({
					title:"正在加载中",
					icon: "loading",
					mask:true,
					duration:3000
				});
			},
			
			//跳转至发布文章页面
			toPublish(){
				uni.navigateTo({
					url:"/pages/publish/publish"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.Myheader{
		height: 180rpx;
	}
	.body{
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #eef1ee;
		.launch,.toTop{
			position: fixed;
			width: 80rpx;
			height: 80rpx;
			padding: 0;
			background-color: #70BCB2;
			border-radius: 20rpx;
			bottom:50rpx;
			right: 60rpx;
			z-index: 1;
			.iconfont{
				line-height: 80rpx;
				color: #fff;
				font-size: 50rpx;
			}
		}
		.toTop{
			bottom: 150rpx;
		}
	}
	.banner{
		flex:1;
		.contents{
			height: 94%;
			.posts{
				margin-top: 26rpx;
				margin-bottom: 26rpx;
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
	
</style>
