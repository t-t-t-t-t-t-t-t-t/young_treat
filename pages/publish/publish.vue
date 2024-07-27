<!-- 发布帖子页面 -->

<template>
	<view class="body">
		<!-- 自定义头部 -->
		<view class="Myheader" :style="{height:h}">
			<myNavigationBar titleName="发布" :needMenu="1"></myNavigationBar>
		</view>
		<!-- 主体区域 -->
		<view class="box">
			<!-- 顶部通知栏 -->
			<view class="notice">
				<u-notice-bar mode="horizontal" :list="notice" type="success"></u-notice-bar>
			</view>
			<view class="banner">
				<u-form :model="myform">
					<!-- 文字内容 -->
					<view class="txt">
						<u-input class="content" placeholder="这一刻的想法..." v-model="myform.content" type="textarea"
						height="200"/>
					</view>
					<!-- 选择图片 -->
					<u-upload ref="uUpload" :action="uploadUrl" :auto-upload="false" name="file"
					 max-count="9" width="193" height="193" :header="picHeader" @on-uploaded="finishUpload"
					 @on-error="alert">
					 </u-upload>
				</u-form>
			</view>
			<!-- 分类栏 -->
			<u-cell-group>
				<u-cell-item icon="list-dot" title="话题" label="选择帖子分类" :icon-style="{color:'#70BCB2',marginRight:'30rpx'}"
				:value="classifications[myform.classifyId]" @click="show=true;">
				</u-cell-item>
			</u-cell-group>
			<!-- 分类弹窗 -->
			<u-picker v-model="show" mode="selector" :range="classifications" confirm-color="#70BCB2" @confirm="getClassify"></u-picker>
			<button class="btn-publish" @tap="submit()" :disabled="myform.content==''" 
			:style="{backgroundColor:(myform.content===''?'':'#70BCB2')}">发布</button>
		</view>
		<!-- 重新登录提示窗 -->
		<u-modal v-model="reLogin" :content="tips" confirm-color="#70BCB2" title="温馨提示" 
		:title-style="{color:'#fa5353'}" @confirm="goToLogin()">
		</u-modal>
		<!-- 重新发布提示窗 -->
		<u-modal v-model="ifError" content="图片上传失败,请重新发布" confirm-color="#70BCB2" title="温馨提示" 
		:title-style="{color:'#fa5353'}">
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//顶部通知栏
				notice:[
					'推荐养趣用户们主动选择帖子分类，以获得更多的曝光量',
				],
				//表单数据
				myform: {
					content: '',
					pics: [],
					classifyId: 0
				},
				//上传图片的服务器地址
				uploadUrl:getApp().globalData.baseUrl+'/common/upload',
				//是否展示分类选项
				show: false,
				classifications:[ //分类列表
					'打卡','育发','熬夜','膳食','拔罐','针灸','理疗',
				],
				// 图片上传的header
				picHeader:{
					//数据类型
					'Content-Type':"multipart/form-data",
					//用户凭证，用于上传时被携带在header中
					authentication:getApp().globalData.authentication,
				},
				
				//是否上传失败
				ifError:false,
				//是否需要重新发布
				ifReUpload:false,
			};
		},
		onLoad() {
			//拿到帖子分类列表（不含“推荐”）
			this.classifications = getApp().globalData.postLists.map(obj=>obj.className);
			this.classifications.shift()
		},
		methods:{
			// picky选择器的点击确认后的回调函数,用于设置分类
			getClassify(arr){
				this.myform.classifyId = arr[0];
			},
			// 点击 发布 按钮后的处理函数
			submit(){
				this.ifReUpload = false;
				//手动上传图片
				this.$refs.uUpload.upload();
			},
			//上传失败
			alert(){
				console.log("帖子发布失败！");
				this.ifError = true;
				this.ifReUpload = true;//防止手动上传图片导致帖子自动发布
			},
			//上传完成后
			finishUpload(lists, name){
				if(this.ifReUpload)return;//必须是点击 发布 按钮才能执行以下逻辑
				//得到上传成功的响应列表
				let sucLists = lists.filter(obj=>obj.progress==100);
				if(sucLists.length!=lists.length)return;//阻断帖子的发布
				//得到图片url列表
				const urlLists = sucLists.map(obj=>obj.response.data);
				//发送post请求上传帖子
				uni.request({
					url:getApp().globalData.baseUrl+"/square/upload",
					method:"POST",
					data:{
						content:this.myform.content,
						image:urlLists,
						classId:getApp().globalData.postLists[this.myform.classifyId+1].classId
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
						console.log("帖子发布成功！");
						uni.reLaunch({
							url:"/pages/community/community"
						})
					},
					fail: (err) => {
						console.log("帖子发布失败！"+err)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.box{
	margin: 0rpx auto;
	width: 93%;
	.notice{
		margin: 30rpx 0;
	}
	.banner{
		background-color: #f9fbf9;
		border-radius: 20rpx;
		padding: 29rpx;
		margin-bottom: 60rpx;
		.txt{
			padding: 0 16rpx;
			margin-bottom: 60rpx;
		}
	}
	.btn-publish{
		width: 200rpx;
		height: 80rpx;
		color: #fff;
		background-color: #afe6df;
		line-height: 80rpx;
		margin: 50rpx auto;
		border-radius: 40rpx;
	}
}

</style>
