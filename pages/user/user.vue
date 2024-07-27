<template>
	<view class="body">
		<!-- 自定义头部栏 -->
		<view class="Myheader" :style="{height:h}">
			<myNavigationBar :titleName="mytitle"></myNavigationBar>
		</view>
		<!-- 绿色的信息模块 -->
		<view class="green">
			<!-- 个人简单信息 -->
			<view class="info">
				<view class="pfp">
					<image :src="userInfo.profile==null?defaultPic:userInfo.profile" mode="aspectFill"></image>
				</view>
				<view class="right">
					<view class="name-sex">
						{{userInfo.name}}
						<image src="/static/src/men.png" mode="aspectFill" v-if="userInfo.gender==='男'"></image> 
						<image src="/static/src/woman.png" mode="aspectFill" v-else-if="userInfo.gender==='女'"></image>
						<image src="/static/src/noSex.png" mode="aspectFill" v-else></image> 
						<image class="edit" src="/static/src/edit.png" mode="aspectFill" @click="navToInfo()"></image>
					</view>
					<view class="tagbox">
						<text class="tag" 
						v-for="(item,index) in tags" :key="index">{{item}}</text>
					</view>
					<view class="position" v-if="userInfo.province!='×××'">
						<icon class="iconfont icon-weizhi"></icon>{{userInfo.province}} {{userInfo.city}}
					</view>
					<view class="position" v-else style="color: red;">
						中 国
					</view>
					<view class="intro" v-if="userInfo.intro!=''">
						<icon class="iconfont icon-shuoshuo"></icon>{{userInfo.intro}}
					</view>
					<view class="intro" v-else>
						<icon class="iconfont icon-shuoshuo"></icon>这个人很神秘，什么也没有留下...
					</view>
				</view>
			</view>
			<!-- 白色的模块 -->
			<view class="white">
				<!-- 功能按钮 -->
				<view class="buttons" :style="{top:h}" :class="isSticky?'sticky':''">
					<!-- 发布 -->
					<view class="button" :class="current==0?'checked':''"
					@click="showRelease()">
						发布
						<text v-show="current==0">◉</text>
					</view>
					<!-- 收藏 -->
					<view class="button" :class="current==1?'checked':''"
					@click="showCollect()">
						收藏
						<text v-show="current==1">◉</text>
					</view>
				</view>
				<view class="trans"></view>
				<!-- 用户发表的帖子 -->
				<view class="myPost" v-show="current==0">
					<view :class="index>0?'marginTop':'' " 
					v-for="(item, index) in postInfo" :key="item.id">
						<posts :item="item" :totalNum="postInfo==undefined?0:postInfo.length" @update="updatePost">
						</posts>
					</view>
					<view class="space" style="margin-top: 80rpx;" v-if="postInfo.length===0">
						<u-empty text="暂未发布" mode="data" icon-size="150" font-size="30"></u-empty>
					</view>
				</view>
				<!-- 用户收藏的文章 -->
				<view class="myPost" v-show="current==1">
					<view :class="index>0?'marginTop':'' "
					v-for="(item, index) in lovePassage" :key="item.id" @tap="updatePassage(index)">
						<recmdPassage :passage_info="item"></recmdPassage>
					</view>
					<view class="space" style="margin-top: 80rpx;" v-if="lovePassage.length===0">
						<u-empty text="暂无收藏" mode="favor" icon-size="150" font-size="30"></u-empty>
					</view>
				</view>
				<bottomLoading :isLoading="isLoading[current]" bgc="#eef1ee"
				v-if="current===0&&postInfo.length!==0 || current===1&&lovePassage.length!==0">
				</bottomLoading>
			</view>
			<!-- 关注和粉丝 -->
			<!-- <view class="link"> -->
				<!-- 关注 -->
				<!-- <view class="regard"> -->
					<!-- <view class="num"> -->
						<!-- 128 -->
					<!-- </view> -->
					<!-- 关注 -->
				<!-- </view> -->
				<!-- 粉丝 -->
				<!-- <view class="fans"> -->
					<!-- <view class="num"> -->
						<!-- 8 -->
					<!-- </view> -->
					<!-- 粉丝 -->
				<!-- </view> -->
			<!-- </view> -->
		</view>
		
		<!-- 重新登录提示窗 -->
		<u-modal v-model="reLogin" :content="tips" confirm-color="#70BCB2" title="温馨提示" 
		:title-style="{color:'#fa5353'}" @confirm="goToLogin()">
		</u-modal>
	</view>
</template>

<script>
//导入事件总线
import { EventBus } from '@/main';
//导入请求接口
import { getUserTag } from '../../util/userApi';
	export default {
		data() {
			return {
				//自定义头部标题
				mytitle:"我的",
				//用户相关的帖子信息
				postInfo:[],
				//用户收藏的文章
				lovePassage:[],
				//获取相关
				postNum:1 ,//当前获取第几页的帖子
				passageNum:1 ,//当前获取第几页的文章
				pageSize:6, //一次获取多少条数据
				//当前是否吸顶
				isSticky:false,
				//当前选择了 “发布 ”还是 “收藏”
				current:0,
				//加载的提示状态
				isLoading:[0,0],
				//用户的个人信息
				userInfo:{},
				//用户标签
				tags:"",
				//默认的用户头像
				defaultPic:"https://img2.baidu.com/it/u=3137292743,4185686625&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
			};
		},
		// 在组件的生命周期钩子中订阅 收藏 事件
		created() {
			//更新用户的收藏文章列表
			EventBus.$on('update', (id,option) => {
				console.log("用户的收藏文章数据已更新！")
				let len = this.lovePassage.length
				if(!option){
					if(len>0)len--;
				}
				else len++;
				//获取用户收藏的文章
				this.getPieces(1,len,3);
			});
		},
		onLoad(){
			if(this.lovePassage.length!==0)return;
			//获取用户个人信息
			this.getUserInfo();
			//获取用户发布的帖子
			this.getPieces(1,6,1);
			//获取用户收藏的文章
			this.getPieces(1,6,2);
			//获取用户标签
			getUserTag().then(res=>{
				this.tags = res.data.marks
			})
		},
		//页面触底
		onReachBottom() {
			if(this.isLoading[this.current]===2)return;
			//修改 下拉加载状态
			this.isLoading.splice(this.current,1,1);
			//页码加1
			if(this.current===0){
				this.postNum++;
				//获取更多帖子
				this.getPieces(this.postNum,this.pageSize,1);
			}
			else{
				this.passageNum++;
				//获取更多文章
				this.getPieces(this.passageNum,this.pageSize,2);
			} 
		},
		//检测页面滚动
		onPageScroll(e) {
			// 获取当前滚动位置
			let scrollPosition = e.scrollTop-parseInt(this.h);
			
			// 当滚动位置超过用户昵称时，让用户昵称显示在自定义头部
			uni.createSelectorQuery().select('.position').boundingClientRect(data => {
			  if (parseInt(this.h) >= data.top) {
				//改变自定义头部名为 用户昵称
				this.mytitle = this.userInfo.name;
			  } 
			  else{
				//改变自定义头部名为 我的
				this.mytitle = "我的";
			  }
			}).exec();
			
			// 获取 要吸顶 元素的初始位置
			uni.createSelectorQuery().select('.buttons').boundingClientRect(data => {
			  // 判断是否处于吸附状态
			  if (scrollPosition >= data.top) {
				// 元素处于吸附状态
				this.isSticky = true;
			  } 
			  else{
				this.isSticky = false; 
			  }
			}).exec();
		},
		methods:{
			//获取用户个人信息
			getUserInfo(){
				uni.request({
					url:getApp().globalData.baseUrl+"/user/info",
					header:{
						authentication:getApp().globalData.authentication,
					},
					success: (res) => {
						//如果登录凭证过期则显示模态框，让用户回去重新登录
						if(res.statusCode==401){
							this.reLogin = true;
							return;
						}
						if(res.statusCode!=200){
							console.log("用户信息获取失败");
							return;
						}
						this.userInfo = res.data.data;
						console.log("用户信息获取成功！")
					},
					fail: (err) => {
						console.log("用户信息获取失败");
					}
				})
			},
			//跳转至个人信息修改页面
			navToInfo(){
				uni.navigateTo({
					url:`/pages/userInfos/userInfos?avatarUrl=${this.userInfo.profile}&name=${this.userInfo.name}
					&gender=${this.userInfo.gender}&birthday=${this.userInfo.birthday}&province=${this.userInfo.province}
					&city=${this.userInfo.city}&introduction=${this.userInfo.intro}`,
				})
			},
			//展示发布帖子信息
			showRelease(){
				this.current = 0;
			},
			//展示收藏文章信息
			showCollect(){
				this.current = 1;
			},
			//在点赞或转发后更新帖子和文章
			updatePost(e){
				// 根据current的不同获取不同内容
				let addUrl = "";
				if(this.current===0)addUrl = "/user/post"; 
				else addUrl = "/user/concelltion"
				//重新渲染数据
				uni.request({
					url:getApp().globalData.baseUrl + addUrl,
					data:{
						page: 1,
						pageSize: e,
					},
					header:{
						authentication:getApp().globalData.authentication,
					},
					success: (res) => {
						if(this.current===0){
							this.postInfo = res.data.data.records;
						}
						else{
							this.lovePassage = res.data.data.records;
						}
						console.log("更新帖子信息成功！");
						//向社区页面传值
					},
					fail: (error) => {
						console.log("更新帖子信息失败！"+error);
					}
				})
			},
			//获取第page页的size条数据，option为1则获取用户发布的帖子，为2则获取用户收藏的文章,否则为更新用户收藏的文章
			getPieces(page,size,option){
				// 根据option的不同获取不同内容
				let addUrl = "";
				if(option===1)addUrl = "/user/post"; 
				else addUrl = "/user/concelltion"
				
				//显示加载框
				uni.showToast({
					title:"正在加载中",
					icon: "loading",
					mask:true,
					duration:3000
				});
				
				//发送请求
				uni.request({
					url:getApp().globalData.baseUrl+addUrl,
					data:{
						page:page,
						pageSize:size
					},
					header:{
						authentication:getApp().globalData.authentication,
					},
					success: (res) => {
						//隐藏加载框
						uni.hideToast()
						let pieces = res.data.data.records;
						if(pieces.length===0){
							this.isLoading.splice(option-1, 1, 2);
							console.log("帖子已经被全部获取了！");
							return;
						}
						if(option===1){
							this.postInfo = [...this.postInfo,...pieces];
						}
						else if(option===2){
							this.lovePassage = [...this.lovePassage,...pieces];
						}
						else{
							this.lovePassage = pieces;
						}
						console.log("获取信息成功！");
					},
					fail: (error) => {
						console.log("获取信息失败！");
						console.log(error);
					}
				})
			},
			//点进帖子后更改帖子的浏览量
			updatePassage(index){
				let newObj = this.lovePassage[index];
				newObj.hitNum++;
				this.lovePassage.splice(index,1,newObj);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.iconfont{
		margin-right: 10rpx;
	}
	.marginTop{
		margin-top: 30rpx;
	}
	.body{
		background-color: #eef1ee;
		height: 100vh;
		.green{
			background-color: #A9DEE2;
			.info{
				display: flex;
				padding: 87rpx 45.5rpx 20rpx;
				margin-bottom: 80rpx;
				justify-content: space-between;
				.pfp{
					height: 210rpx;
					width: 210rpx;
					border-radius: 50%;
					overflow: hidden;
					image{
						height: 100%;
						width: 100%;
					}
				}
				.right{
					width: 425rpx;
					.name-sex{
						position: relative;
						font-family: Source Han Sans;
						font-size: 40rpx;
						image{
							width: 36rpx;
							height: 36rpx;
							margin-left: 16rpx;
							vertical-align: top;
						}
						.edit{
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							right: 0;
							top:10rpx;
						}
					}
					.tagbox{
						margin: 10rpx 0;
						font-size: $main-fontsize;
						.tag{
							display: inline-block;
							padding: 6rpx 10rpx;
							border-radius:10rpx;
							background-color: #87CEFA;
							color: white;
						}
					}
					.position{
						// margin-left:8rpx;
						font-family: Source Han Sans;
						font-size: 28rpx;
						color: #3D3D3D;
					}
					.intro{
						// margin-left: 8rpx;
						font-family: Source Han Sans;
						font-size: 28rpx;
						color: #3D3D3D;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
				}
			}
			.link{
				display: flex;
				justify-content: space-evenly;
				text-align: center;
				color: #3D3D3D;
				font-size: 30rpx;
				.num{
					font-family: Source Han Sans;
					font-size: 44rpx;
					margin-bottom: 8rpx;
				}
				.regard{
					padding: 20rpx 40rpx;
					width: 200rpx;
				}
				.fans{
					padding: 20rpx 40rpx;
					width: 200rpx;
				}
			}
		}
		//两个按钮：“发布”、“收藏”
		.white{
			background-color: #eef1ee;
			border-radius: 30rpx 30rpx 0 0;
			padding-bottom: 10rpx;
			.buttons{
				position: sticky;
				border-radius: 30rpx 30rpx 0 0;
				display: flex;
				justify-content: space-evenly;
				text-align: center;
				font-size: 30rpx;
				color: #777;
				background-color: #fff;
				font-weight: 550;
				.button{
					padding: 28rpx 60rpx 0;
					font-size: 33rpx;
					text-align: center;
					width: 200rpx;
				}
				.checked{
					color:#70BCB2;
				}
			}
			
			.sticky{
				border-radius: 0;
				z-index: 100;
			}
			
			.trans{
				height: 50rpx;
				background: linear-gradient(#fff, #eef1ee);
			}
		}
		
		.myPost{
			background-color: #eef1ee;
			padding-bottom: 1rpx;
		}
	}
</style>
