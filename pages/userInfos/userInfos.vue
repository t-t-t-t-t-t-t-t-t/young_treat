<!-- 编辑个人资料页面 -->
<template>
	<view class="body">
		<!-- 自定义头部栏 -->
		<view class="Myheader" :style="{height:h}">
			<myNavigationBar :needMenu="1" titleName="编辑资料"></myNavigationBar>
		</view>
		
		<form >
			<!-- 头像 -->
			<button class="pic" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image :src="avatarUrl" mode="aspectFill"></image>
			</button>
			<!-- 内容区域 -->
			<view class="content">
				<!-- 昵称 -->
				<view class="name item">
					<view class="left">
						<text>昵称</text>
					</view>
					<view class="right">
						<input v-model="name" type="nickname" placeholder="填写" placeholder-class="placeClass"
						maxlength="8" confirm-type="done" @blur="changeName"/>
					</view>
				</view>
				<!-- 性别 -->
				<view class="sex item">
					<view class="left">
						<text>性别</text>
					</view>
					<view class="right">
						<u-subsection :list="sex_list" :current="current" @change="sectionChange"
						active-color="#70BCB2" bg-color="#f8f8f8"></u-subsection>
					</view>
				</view>
				<!-- 生日 -->
				<view class="calendar item">
					<view class="left">
						<text>生日</text>
					</view>
					<view class="right">
						<!-- <u-calendar v-model="show_calendar" mode="date" @change="changeBirth" 
						active-bg-color="#A9DFD8" btn-type="success">
						</u-calendar> -->
						<uni-datetime-picker type="date" :value="birthday" :border="false" :clear-icon="false"
						:end="Date.now()" @change="changeBirth">
						</uni-datetime-picker>
						<!-- <view class="text" @click="show_calendar = true">
							{{birthday}}
						</view> -->
					</view>
				</view>
				<!-- 地区 -->
				<view class="area item">
					<view class="left">
						<text>地区</text>
					</view>
					<view class="right">
						<u-picker mode="region" v-model="show_region" :params="params" @confirm="confirmRegion"
						 confirm-color="#70BCB2"></u-picker>
						<view class="text" @click="show_region = true">
							{{myProvince}}&nbsp;&nbsp;{{myCity}}
						</view>
					</view>
				</view>
				<!-- 简介 -->
				<view class="intro item">
					<view class="left">
						<text>简介</text>
					</view>
					<view class="right">
						<textarea class="txt" placeholder-style="color: #aaa;" placeholder="说点什么吧"
						 maxlength="40" confirm-type="done"
						 v-model="introduction"/>
						 <!-- 提示现在输入的字数 -->
						 <view class="tips">
						 	{{introduction.length}} / 40
						 </view>
					</view>
				</view>
			</view>
			<!-- 保存按钮 -->
			<button class="save" @click="saveInfo()">
				保存
			</button>
			<!-- 保存失败提示窗 -->
			<u-modal v-model="reTry" :content="tips" confirm-color="#70BCB2" :show-title="false"
			:title-style="{color:'#fa5353'}">
			</u-modal>
		</form>
	</view>
</template>

<script>
	const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
	export default {
		data() {
			return {
				//用户头像url
				avatarUrl: defaultAvatarUrl,
				
				//用户昵称
				name:"",
				
				//性别列表
				sex_list: [
					{
						name: '男'
					}, 
					{
						name: '女'
					}, 
					{
						name: '不展示'
					}
				],
				//默认的性别展示
				current: 2,
				
				//生日
				show_calendar: false, //是否展示日期 选择弹窗
				birthday:"××××-××-××", //生日日期
				
				//地区
				show_region: false,
				params : {
					province: true,
					city: true,
				},
				myProvince:"×××",
				myCity:"×××",
				
				//简介
				introduction:"",
				
				// 是否展示重新尝试的模态框
				reTry:false,
				tips:"保存失败，请重试！", //模态框提示内容
				
				//是否需要上传头像
				ifneedUpload:false,
			};
		},
		onLoad(info) {
			//用个人页面的个人信息渲染 信息修改页面
			this.avatarUrl = info.avatarUrl;
			this.name = info.name.trim();
			if(info.gender==="男")this.current=0;
			else if(info.gender==="女")this.current=1;
			if(info.birthday!=="null")this.birthday = info.birthday;
			this.myCity = info.city;
			this.myProvince = info.province;
			this.introduction = info.introduction;
		},
		methods:{
			//选择头像后的回调
			onChooseAvatar(e) {
			    const { avatarUrl } = e.detail 
			    this.avatarUrl = avatarUrl;
				this.ifneedUpload = true;
			},
			
			//修改昵称后的回调
			changeName(e){
				this.name = e.detail.value;
			},
			
			//选择性别后的回调
			sectionChange(index){
				this.current = index;
			},
			
			//选择生日后的回调
			changeBirth(date) {
				this.birthday = date;
			},
			
			//选择地区后的回调
			confirmRegion(e){
				let {province,city} = e
				this.myProvince = province.label;
				this.myCity = city.label;
			},
			
			upLoadInfo(){
				let sex = this.sex_list[this.current].name
				//请求除头像外的个人信息
				uni.request({
					url:getApp().globalData.baseUrl+"/user/info",
					method:"POST",
					header:{
						authentication:getApp().globalData.authentication
					},
					data:{
						name:this.name,
						gender:sex==="不展示"?null:sex,
						birthday:this.birthday==="××××-××-××"?null:this.birthday,
						province:this.myProvince,
						city:this.myCity,
						intro:this.introduction
					},
					success: (e) => {
						if(e.statusCode===200){
							console.log("个人信息保存成功！");
							uni.reLaunch({
								url:"/pages/user/user"
							});
						}
						else this.reTry = true;
					},
					fail: (err) => {
						console.log("保存失败"+err)
						this.reTry = true;
					}
				})
			},
			
			//用户保存修改信息后的执行函数
			saveInfo(){
				//如果没有更改头像
				if(!this.ifneedUpload){
					this.upLoadInfo();
				}
				//将头像的本地路径传给后端
				else uni.uploadFile({
					url:getApp().globalData.baseUrl+"/user/profile",
					filePath:this.avatarUrl,
					name:"file", //文件对应的 key , 后端通过这个 key 可以获取到文件二进制内容
					header:{
						authentication:getApp().globalData.authentication,
					},
					success:(res)=>{
						if(res.statusCode!=200){
							console.log("头像上传失败！");
							this.reTry = true;
							return;
						}
						console.log("头像上传成功！")
						this.upLoadInfo();
					},
					fail:()=>{
						console.log("头像上传失败！")
						this.reTry = true;
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
.pic{
	width: 210rpx;
	height: 210rpx;
	margin: 100rpx auto;
	padding: 0;
	border-radius: 50%;
	image{
		width: 100%;
		height: 100%;
	}
}
.content{
	padding: 0 20rpx;
	margin: 0 30rpx;
	border-radius: 20rpx;
	background-color: #fff;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	.item{
		line-height: 72rpx;
		display: flex;
		justify-content: space-between;
		font-size: 32rpx;
		color: #6C6C6C;
		padding: 30rpx 20rpx;
		border-bottom: 2rpx solid #ccc;
	}
	.name{
		.right{
			flex: 1;
			position: relative;
		}
		input{
			position: absolute;
			right: 0rpx;
			font-size: 32rpx;
			display: inline-block;
			width: 330rpx;
			height: 100%;
			text-align: right;
			color: #000;
		}
		//因为style加了‘scoped’，所以要加/deep/才能生效
		/deep/.placeClass{
			color: #aaa;
		}
	}
	.sex{
		.right{
			position: absolute;
			width: 400rpx;
			right: 50rpx;
		}
	}
	.calendar{
		.right{
			// .text{
			// 	position: absolute;
			// 	font-size: 32rpx;
			// 	line-height: 72rpx;
			// 	right: 70rpx;
			// 	color: #606266;
			// }
		}
	}
	.area{
		.left{
			line-height: 72rpx;
		}
		.right{
			.text{
				position: absolute;
				font-size: 32rpx;
				line-height: 72rpx;
				right: 70rpx;
				color: #606266;
			}
		}
	}
	.intro{
		position: relative;
		border-bottom: none;
		line-height: 180rpx;
		.txt{
			position: absolute;
			right: 20rpx;
			line-height: 1.5em;
			text-align: right;
			width: 460rpx;
			height: 180rpx;
		}
		.tips{
			color: #ddd;
			font-size: 30rpx;
			position: absolute;
			right: 0rpx;
			bottom:-60rpx;
		}
	}
}
.save{
	width: 200rpx;
	height: 80rpx;
	color: #fff;
	background-color: #70BCB2;
	line-height: 80rpx;
	margin: 50rpx auto;
	border-radius: 40rpx;
}
</style>
