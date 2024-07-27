<template>
	<view class="body">
		<!-- 搜索框 -->
		<view class="search" :style="{width : mode==0?'':'82%'}">
			<input class="search_input" type="text" :focus="focusState" confirm-type="search" placeholder="搜索发现更多" 
			v-model="text" maxlength="12" @input="showButton" @focus="switchSearch()" @blur="focusState=false"/>
			<!-- 搜索图标 -->
			<img src="/static/src/search_logo.png" alt="" />
			<!-- 删除图标 -->
			<view class="delIcon" @tap="delText()">
				<u-icon name="close-circle" size="30" v-show="text.length!==0&&mode===1"></u-icon>
			</view>
		</view>
		<view class="search-btn" v-show="mode===1" @tap="search()">搜索</view>
	</view>
</template>

<script>
	//导入事件总线
	import { EventBus } from '@/main';
	export default {
		name:"searchBar",
		data() {
			return {
				// 输入框内容
				text:"",
				// 哪一种输入框模式
				mode:0 ,//0代表输入框占满屏幕宽度，1代表输入框右侧有个搜索按钮
				//输入框的获焦状态
				focusState: true // 默认获取焦点
			};
		},
		// 在组件的生命周期钩子中订阅事件
		created() {
			EventBus.$on('searched', (searchText) => {
				if(searchText!==""){
					//在搜索框里展示 父组件传过来的值
					this.text = searchText;
					//隐藏 搜索 按钮
					this.mode = 0;
				}
			});
		},
		methods:{
			//显示右侧的 搜索 按钮
			showButton(e){
				// 清除输入框里的空格
				this.text = e.detail.value.replace(/\s/g, '')
				//如果文字为空，隐藏 搜索 按钮
				if(this.text==='')this.mode = 0;
				//否则，展示 搜索 按钮
				else this.mode = 1;
			},
			//用户点击了搜索后的回调
			search(){
				this.mode = 0;
				//向搜索文章页面传值,告诉它显示 搜索内容
				this.$emit("searching",this.text);
			},
			//当搜索框里有文字且mode为0时，点击会切换mode变为1，且令 搜索文章 页面显示 搜索记录
			switchSearch(){
				if(this.mode===0&&this.text.length!==0){
					this.mode = 1;
					//向搜索文章页面传值,告诉它显示 搜索记录   使用 $nextTick 确保在 DOM 更新之后再执行获得焦点的操作
					this.$nextTick(()=>{
						this.$emit("searching","");
					})
					
				}
			},
			//点击 搜索框内 删除 按钮 后的回调
			delText(){
				//删除 搜索框里的 内容
				this.text='';
				//切换搜索框的状态
				this.mode=0;
				//让搜索框重新获焦
				this.focusState = true;
			},
		}
	}
</script>

<style lang="scss" scoped>
.body{
	position: fixed;
	padding: 15rpx 20rpx 28rpx;
	width: 100%;
	background-color: #fff;
	display: flex;
	z-index: 100;
	.search{
		position: relative;
		height: 70rpx;
		width: 100%;
		.search_input{
			box-sizing: border-box;
			font-size: 30rpx;
			height: 100%;
			padding: 0rpx 90rpx;
			border-radius: 40rpx;
			opacity: 1;
			background: #fff;
			border: 4rpx solid #A9DEE2;
		}
		img{
			position: absolute;
			height: 40rpx;
			width: 40rpx;
			top: 16rpx;
			left: 23rpx;
		}
		.delIcon{
			display: inline-block;
			position: absolute;
			top: 6rpx;
			right: 23rpx;
			padding: 12rpx;
		}
	}
	.search-btn{
		flex: 1;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 36rpx;
		color: #70BCB2;
		padding: 0 6rpx 0 20rpx;
		margin-left: 15rpx;
	}
}
</style>