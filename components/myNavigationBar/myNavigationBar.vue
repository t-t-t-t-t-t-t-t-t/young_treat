<!-- 自定义的头部栏组件 -->
<template>
	<view class="nav-box" :style="{paddingTop:headerArea.status_height+'px',backgroundColor:bgc}">
		<view class="content" :style="{height:headerArea.title_height+'px'}">
			<!-- 菜单 -->
			<view class="menu" v-if="needMenu===0">
				<img :src="picUrl" alt="" />
			</view>
			<!-- 返回 -->
			<view class="goback" v-else-if="needMenu===1"  @click="check()">
				<text class="iconfont icon-fanhui1"></text>
			</view>
			<!-- 无 -->
			<view class="nothing" v-else-if="needMenu===2" >
			</view>
			<view class="title">{{titleName}}</view>
		</view>
		<u-modal v-model="isAlert" :content="tips" title="温馨提示" show-cancel-button="true"
		confirm-color="#70BCB2" mask-close-able="true" :title-style="{color:'#fa5353'}" @confirm="goBack()">
		</u-modal>
	</view>
</template>

<script>
	export default {
		name:"myNavigationBar",
		props:{
			//头部栏的标题名
			titleName:{
				type:String,
				default:"养趣-年轻化社区"
			},
			//是否需要左侧菜单按钮
			needMenu:{
				type:Number,
				default:0
			},
			//背景颜色
			bgc:{
				type:String,
				default:"#A9DEE2"
			},
			//返回是是否再次询问用户
			ifcheck:{
				type:Boolean,
				default:true
			},
			//返回后是否需要刷新页面
			ifReload:false,
		},
		methods:{
			//再次询问用户
			check(){
				//显示模态框
				if(this.ifcheck)this.isAlert = true;
				else this.goBack();
			},
			//返回上一页
			goBack(){
				uni.navigateBack({
					success: () => {
						if(!this.ifReload)return;
						let pages = getCurrentPages(); // 当前页面栈
						let beforePage = pages[pages.length - 1]; // 前一个页面
						beforePage.onLoad(); // 执行前一个页面的onLoad方法
					}
				});
			}
		},
		computed:{
			//处理手机状态高度适配问题
			//头部栏默认40px
			headerArea() {
			  let area = uni.getSystemInfoSync();
			  // #ifdef MP-WEIXIN
			  let menu = uni.getMenuButtonBoundingClientRect();
			  return {
				status_height: area.statusBarHeight,
				title_height: menu.height + (menu.top - area.statusBarHeight) * 2,
				menuLeft: menu.left,
				
			  };
			  // #endif
			  // #ifndef MP-WEIXIN
			  return {
				status_height: area.statusBarHeight,
				title_height: uni.upx2px(80),
				menuLeft: 0
			  };
			  // #endif
			},
		},
		data() {
			return {
				//是否显示模态框
				isAlert:false,
				tips:"内容暂未保存，是否返回上一页" ,//模态框提示内容
				//左侧图片路径
				picUrl:getApp().globalData.srcRoot + "sublogo.png",
			};
		}
	}
</script>

<style lang="scss" scoped>
	.nav-box{
		//由于设置了吸顶效果，该头部组件会脱标，需要在引用到它的页面中给组件的父盒子加一个宽度
		// 头部栏吸顶效果
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 101;
		padding-bottom: 6px;
		.content{
			display: flex;
			align-items: center;
			text-align: center;
			.menu{
				z-index: 1;
				width: 40px;
				img{
					margin-left: 10px;
					height: 40px;
					width: 62px;
				}	
			}
			.goback{
				width: 40px;
				z-index: 1;
				.iconfont{
					margin-left: 10px;
					font-size: 24px;
					line-height: 40px;
					color: #000;
				}
			}
			.nothing{
				width: 40px;
			}
			
			.title{
				flex: 1;
				color: #3D3D3D;
				font-size: 18px;
				font-family: 思源黑体;
				line-height: 40px;
				margin-left: -40px;
			}
		}
		
	}
</style>