<template>
	<el-row class="panel-group">
        <el-col :span="4"  class="card-panel" style="margin-left:0">
			<div class="card-panel-icon-wrapper">
				<i class="el-icon-datacenter-gongjiaoche icon-size" style="color: #9266f9;"></i>
			</div>
			<div class="card-panel-description">
				<div class="card-panel-text">
					昨日出车/司机数
				</div>
				<span class="card-panel-num" v-text="panel.vehicles"></span>
                <span class="card-panel-num">/</span>
                <span class="card-panel-num" v-text="panel.drivers"></span>
			</div>
		</el-col>

		<el-col :span="4"  class="card-panel">
			<div class="card-panel-icon-wrapper">
				<i class="el-icon-money icon-size" style="color: #40c9c6;"></i>
			</div>
			<div class="card-panel-description">
				<div class="card-panel-text">
					昨日营收
				</div>
				<span class="card-panel-num" v-text="panel.totalRenues">
				</span>
			</div>
		</el-col>

		<el-col :span="4"  class="card-panel">
			<div class="card-panel-icon-wrapper">
				<i class="el-icon-datacenter-xunhuan icon-size" style="color: #36a3f7;"></i>
			</div>
			<div class="card-panel-description">
				<div class="card-panel-text">
					昨日油/电耗
				</div>
				<span class="card-panel-num" v-text="panel.totalFuels"></span>
				<span class="card-panel-num">/</span>
				<span class="card-panel-num" v-text="panel.totalCharges"></span>
			</div>
		</el-col>

		<el-col :span="4"  class="card-panel">
			<div class="card-panel-icon-wrapper">
				<i class="el-icon-cpu icon-size" style="color: #f4516c;"></i>
			</div>
			<div class="card-panel-description">
				<div class="card-panel-text">
					昨日客流量
				</div>
				<span class="card-panel-num" v-text="panel.totalCharges"></span>
			</div>
		</el-col>

		<el-col :span="4"  class="card-panel">
			<div class="card-panel-icon-wrapper">
				<i class="el-icon-datacenter-licheng1 icon-size" style="color: #34bfa3;"></i>
			</div>
			<div class="card-panel-description">
				<div class="card-panel-text">
					昨日总里程/趟次
				</div>
				<span class="card-panel-num" v-text="panel.totalMileages"></span>
                <span class="card-panel-num">/</span>
                <span class="card-panel-num" v-text="panel.totalTrips"></span>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getPanelData} from '@/api/analysis'
	export default {
		name:"cardPanel",
		data(){
			return {
				panel:{
					drivers:'',
					totalCharges:'',
					totalFuels:'',
                    totalRenues:'',
                    totalMileages:'',
                    totalTrips:'',
					vehicles:''
				}
			}
		},
		created(){
			this._getPanelData();
		},
		methods:{
			_getPanelData(){
				getPanelData().then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.panel = resp.result;
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.panel-group .card-panel{
	    height: 110px;
	    cursor: pointer;
	    font-size: 11px;
	    position: relative;
	    overflow: hidden;
        color: #666;
        margin: 0 17px;
	    background: #fff;
	    -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	    border-color: rgba(0, 0, 0, 0.05);
	}
	
	.panel-group .card-panel .card-panel-icon-wrapper {
	    float: left;
	    margin: 10px 0 0 0px;
	    padding: 10px;
	    -webkit-transition: all 0.38s ease-out;
	    transition: all 0.38s ease-out;
	    border-radius: 6px;
	}

	.panel-group .card-panel .card-panel-description {
	    float: right;
	    font-weight: bold;
	    margin: 20px;
	    margin-left: 0px;
	}
	.panel-group .card-panel .card-panel-description .card-panel-text {
	    line-height: 18px;
	    color: rgba(0, 0, 0, 0.45);
	    font-size: 14px;
	    margin-bottom: 12px;
	}
	.panel-group .card-panel .card-panel-description .card-panel-num {
	    font-size: 18px;
	}
	.icon-size{
		font-size: 39px;
	}
</style>