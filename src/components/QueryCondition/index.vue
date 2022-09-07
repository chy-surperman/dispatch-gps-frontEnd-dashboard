<template>
    <el-row :gutter="20" style="margin:15px;">
        <el-col :span="3"  v-if="isShowGroupName">
            <el-select size="mini" v-model="select.groupName" @change="groupNameChange" placeholder="请选择大队">
                <el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
            </el-select>
        </el-col>

        <el-col :span="3" v-if="isShowRouteName">
            <el-select size="mini" v-model="select.routeName" placeholder="请选择线路">
                <el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
            </el-select>
        </el-col>

        <el-col :span="3" v-if="isShowQueryType">
            <el-select size="mini" v-model="select.dateType" placeholder="时间模式">
                <el-option v-for="type in dateTypes" :key="type" :label="type" :value="type"></el-option>
            </el-select>
        </el-col>
        
        <el-col :span="5" style="padding-right:0;">
            <el-date-picker v-show="select.dateType == '日'"
                v-model="select.startDate" size="mini" type="date" placeholder="选择起始日期" format="yyyy-MM-dd"value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker v-show="select.dateType == '月'"
                v-model="select.startDate" size="mini" type="month" placeholder="选择起始月份" format="yyyy-MM-dd"value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker v-show="select.dateType == '年'"
                v-model="select.startDate" size="mini" type="year" placeholder="选择起始年份" format="yyyy-MM-dd"value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-col>
        <div class="zhi_divider">
            <span>至</span>
        </div>
        <el-col :span="5">
            <el-date-picker v-show="select.dateType == '日'"
                v-model="select.endDate" size="mini" type="date" placeholder="选择结束日期" format="yyyy-MM-dd"value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker v-show="select.dateType == '月'"
                v-model="select.endDate" size="mini" type="month" placeholder="选择结束月份" format="yyyy-MM-dd"value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker v-show="select.dateType == '年'"
                v-model="select.startDate" size="mini" type="year" placeholder="选择结束年份" format="yyyy-MM-dd"value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-col>

        <el-col :span="2">
            <el-button type="primary" size="mini" @click="query">查询</el-button>
        </el-col>
    </el-row>
</template>

<script>
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getPieData,getRadarData} from '@/api/analysis'
    import {getRouteGroup,getRouteNames} from '@/api/common'
    import vChart from '@/components/echarts/vChart'
    export default {
        props:["isShowRouteName","isShowQueryType","isShowGroupName"],
        data(){
            return {
                dateTypes:['日','月','季度','年'],
                routeList:[],
                routeGroups:[],
                select:{
                    groupName:'',
                    startDate:'',
                    endDate:'',
                    routeName:'',
                    dateType:'日'
                },
            }
        },
        created(){
            this._getRouteGroup();
        },
        methods:{
            _getRouteNames(groupName){
				getRouteNames({groupName}).then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.routeList = resp.result;
					}
				})
            },
            _getRouteGroup(){
                getRouteGroup().then(resp => {
                    if(resp.code == REQ_SUCCESS){
                        this.routeGroups = resp.result;
                    }
                });
            },
            groupNameChange(val){
                this.select.groupName = val;
                this._getRouteNames(val);
            },
            query(){
                this.$emit('query',this.select)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .zhi_divider{
        color:#606266;
        margin-left:-15px;
        width:28px;
        height:28px;
        line-height:28px;
        float:left;
    }
</style>