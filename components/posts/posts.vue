<!-- 社区用户发表的帖子 -->
<template>
	<view>
		<view class="piece">
			<!-- 头部头像以及username 日期 -->
			<view class="head">
				<!-- 头像 -->
				<view class="profile-pic">
					<image class="image" :src="item.profile!=null?item.profile:'https://c-ssl.duitang.com/uploads/item/202003/09/20200309170801_nuuuH.jpeg'" alt="" />
				</view>
				<!-- 右边 -->
				<view class="right">
					<!-- 作者 -->
					<view class="username" style="color: #70BCB2;">
						{{item.authorName}}
					</view>
					<!-- 日期 -->
					<view class="time">
						{{item.createTime}}
					</view>
				</view>
				<i class="iconfont icon-idea-full decoration"></i>
				<text class="animation" v-show="ifshowRaise">+1</text>
			</view>
			<!-- 文字 -->
			<view class="words">
				{{item.content}}
			</view>
			<!-- 图片 -->
			<view class="noPic" v-if="item.image===null">
			</view>
			<view class="pic_mode2" v-else-if="item.image.length==1">
				<image :src="url" alt="" v-for="(url,index) in item.image" :key="index" mode="widthFix" class="pic2"/>
			</view>
			<view class="pic_mode3" v-else-if="item.image.length==4">
				<image :src="url" alt="" v-for="(url,index) in item.image" :key="index" mode="aspectFill" class="pic3"/>
			</view>
			<view class="pic_mode1" v-else-if="item.image.length>0">
				<image :src="url" alt="" v-for="(url,index) in item.image" :key="index" mode="aspectFill" class="pic1"/>
			</view>
			<!-- 底部栏 -->
			<view class="bottom">
				<!-- 标签 -->
				<view class="tag">
					{{item.className || classMap[item.classId]}}
				</view>
				<view class="operation">
					<!-- 转发 -->
					<view class="forward">
						<image :src="forward_url" class="icon"></image>
						<view class="numText">{{item.forwardNum==0?"转发":item.forwardNum}}</view>
						<!-- 隐藏在文字下方的分享按钮 -->
						<button open-type="share" class="share" @tap="switchShare(item.content)">111</button>
					</view>
					<!-- 评论 -->
					<view class="comments" @click="navToComments()">
						<image :src="comments_url" class="icon"></image>
						<view class="numText">{{item.postNum==0?"评论":item.postNum}}</view>
					</view>
					<!-- 喜欢 -->
					<view class="love" @click="switchLove()"> 
						<image :src="item.isLoved?loved_url:love_url" class="icon"></image>
						<view class="numText">{{item.loveNum==0?"点赞":item.loveNum}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		name:"posts",
		props:{
			//帖子的信息
			item:{
				type:Object,
				require:true,
			},
			//目前获取了多少条数据
			totalNum:0,
			//帖子标签名
			label:{
				type:String,
				default:"碎碎念"
			}
		},
		data() {
			return {
				//用户凭证
				authentication:getApp().globalData.authentication,
				//点赞url
				loveUrl:getApp().globalData.baseUrl+"/square/love",
				//转发url
				forwardUrl:getApp().globalData.baseUrl+"/square/forward",
				
				love_url:"/static/src/love.png",
				loved_url:"/static/src/loved.png",
				forward_url:"/static/src/forward.png",
				comments_url:"/static/src/comments.png",
				
				
				//是否展示动画
				ifshowRaise:false,
				flag:{
					type:Boolean,
					default:true,
				}
			};
		},
		computed:{
			classMap(){
				return getApp().globalData.classMap;
			}
		},
		methods:{
			//更新帖子数据
			updatePost(){
				this.$emit("update",this.item.id);
			},
			//改变点赞的状态
			switchLove(){
				//设置交互动画
				if(this.flag && !this.item.isLoved){
					this.flag = false;
					this.ifshowRaise = true;
					setTimeout(()=>{
						this.ifshowRaise = false;
						this.flag = true;
					},2000);
				}
				//发送点赞请求
				uni.request({
					url:this.loveUrl,
					method:"POST",
					data:{
						squareId:this.item.id,
					},
					header:{
						authentication:this.authentication
					},
					success: (res) => {
						if(res.statusCode!=200){
							console.log("点赞失败！"+res.errMsg);
							return;
						}
						this.updatePost()
					},
					fail: (err) => {
						console.log("点赞失败！");
						console.log(err);
					}
				});
			},
			//跳转至评论区
			navToComments(){
				uni.navigateTo({
					url:`/pages/comments/comments?id=${this.item.id}`
				})
			},
			//改变分享状态
			switchShare(desc){
				//获取分享描述内容保存到全局变量中
				getApp().globalData.desc = desc;
				//设置交互动画
				if(this.flag){
					this.flag = false;
					this.ifshowRaise = true;
					setTimeout(()=>{
						this.ifshowRaise = false;
						this.flag = true;
					},2000);
				}
				//发送转发请求
				uni.request({
					url:this.forwardUrl,
					method:"POST",
					data:{
						squareId:this.item.id,
					},
					header:{
						authentication:this.authentication
					},
					success: (res) => {
						if(res.statusCode!=200){
							console.log("转发失败！"+res.errMsg);
							return;
						}
						this.updatePost()
					},
					fail: (err) => {
						console.log("转发失败！");
						console.log(err);
					}
				});
			},
		}
		
	}
</script>

<style lang="scss" scoped>
	@keyframes raise{
		0%{}
		100%{
			translate: 0 -50rpx;
			transform: scale(40%);
			color: #fff;
		}
	}
	.piece{
		background-color: #fff;
		border-radius: 30rpx;
		margin: 0 20rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		.head{
			position: relative;
			display: flex;
			padding: 28rpx 33rpx;
			.animation{
				position: absolute;
				right: 8rpx;
				top: 28rpx;
				font-size: 33rpx;
				color: #70BCB2;
				animation: raise 2s;
			}
			.profile-pic{
				width: 105rpx;
				height: 105rpx;
				border-radius: 50%;
				overflow: hidden;
				.image{
					width: 100%;
					height: 100%;
				}
			}
			.right{
				margin-left: 15rpx;
				.username{
					font-family: Source Han Sans;
					font-size: 38.5rpx;
					font-weight: 500;
					line-height: 1.5em;
					color: #3D3D3D;
				}
				.time{
					font-family: Source Han Sans;
					font-size: 28rpx;
					color:#777;
				}
			}
			.decoration{
				position: absolute;
				right: 50rpx;
				top: 30rpx;
				font-size: 50rpx;
				color: #A9DEE2;
			}

		}
		.words{
			padding: 0 37rpx;
			font-family: Source Han Sans;
			font-size: 31.5rpx;
			line-height: 1.5em;
			color: #3D3D3D;
			padding-bottom: 20rpx;
		}
		.pic_mode1{
			display: flex;
			flex-wrap: wrap;
			padding: 0rpx 27rpx 18rpx;
			.pic1{
				width: 207rpx;
				height: 207rpx;
				margin: 6rpx;
			}
		}
		.pic_mode2{
			padding: 0rpx 27rpx 18rpx;
			.pic2{
				width: 400rpx;
				margin: 10rpx;
			}
		}
		.pic_mode3{
			display: flex;
			flex-wrap: wrap;
			padding: 0rpx 200rpx 18rpx 27rpx;
			.pic3{
				width: 210rpx;
				height: 210rpx;
				margin: 6rpx;
			}
		}
		.bottom{
			display: flex;
			margin: 0 37rpx 0;
			padding-bottom: 20rpx;
			justify-content: space-between;
			align-items: center;
			// border-top: 1px solid #e5e5e5;
			color:#ADADAD;
			font-size: 26rpx;
			.tag{
				background-color: #f0fff0;
				color: #70BCB2;
				font-size: 24rpx;
				line-height: 44rpx;
				height: 44rpx;
				padding-left: 15rpx;
				padding-right: 15rpx;
				border-radius: 8rpx;
				box-shadow: 5rpx 7rpx 10rpx 3rpx rgba(62,66,66,0.05);
			}
			.operation{
				display: flex;
				justify-content: space-between;
				.love,.forward,.comments{
					padding: 10rpx 10rpx;
					width: 130rpx;
					.icon{
						width: 50rpx;
						height: 50rpx;
						margin-right: 5rpx;
						vertical-align: bottom;
					}
					.numText{
						display: inline-block;
						width: 55rpx;
						text-align: center;
					}
					line-height: 50rpx;
				}
				.forward{
					position: relative;
					.share{
						position: absolute;
						bottom: 0rpx;
						opacity: 0;
					}
				}
			}
		}
	}
	
</style>