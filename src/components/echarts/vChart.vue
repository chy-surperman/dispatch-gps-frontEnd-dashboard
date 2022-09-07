<template>
    <div :class="calssName" ref="sysChart" :style="{width:width,height:height,marginTop:'25px'}"></div>
</template>

<script>
    export default {
        name:'vCharts',
        props:["options","calssName","id","width","height","wtest","listenDownload"],
        data(){
            return {
                myChart:{}
            }
        },
        mounted(){
            this.initEchart();
            // if(this.listenDownload == 200){
            //     this.listenDownloadEvent();
            // }
        },
        beforeDestroy(){
            // if(this.listenDownload == 200){
            //     this.$EventBus.$off('down_route_daily_table');
            // }
        },
        methods:{
            initEchart(){
                this.myChart = this.$echarts.init(this.$refs.sysChart);
                this.myChart.setOption(this.options);
            },
            listenDownloadEvent(){
                this.$EventBus.$on('down_route_daily_table',(event) => {
                    let dataURL = this.myChart.getDataURL({
                        pixelRatio: 2,
                        backgroundColor: '#fff'
                    });
                    let option = this.myChart.getOption();
                    this.saveFile(option.title[0].text, dataURL);
                });
            },
            saveFile(filename,data){  
			    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');  
			    save_link.href = data;  
			    save_link.download = filename;  
			    
			    var event = document.createEvent('MouseEvents');  
			    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);  
			    save_link.dispatchEvent(event);  
			},
        },
        watch:{
            options(val){
                this.options = val;
                this.myChart.setOption(this.options);
            },
            wtest(val){
                this.wtest = val;
            }
        }
    }
</script>