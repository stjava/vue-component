<template>
    <div class="cale-table">
        <div class="v-date-picker-header">
            <span @click="prevYear()" class="ivu-picker-panel-icon-btn ivu-date-picker-prev-btn ivu-date-picker-prev-btn-arrow-double">
                <i class="ivu-icon ivu-icon-ios-arrow-left"></i>
            </span>
            <span @click="prevMonth()" class="ivu-picker-panel-icon-btn ivu-date-picker-prev-btn ivu-date-picker-prev-btn-arrow">
                <i class="ivu-icon ivu-icon-ios-arrow-left"></i>
            </span>
            <span class="ivu-date-picker-header-label">{{timeYY}}年</span>
            <span class="ivu-date-picker-header-label">{{timeMM}}月</span>
            <span @click="nextYear()" class="ivu-picker-panel-icon-btn ivu-date-picker-next-btn ivu-date-picker-next-btn-arrow-double">
                <i class="ivu-icon ivu-icon-ios-arrow-right"></i>
            </span>
            <span @click="nextMonth()" class="ivu-picker-panel-icon-btn ivu-date-picker-next-btn ivu-date-picker-next-btn-arrow">
                <i class="ivu-icon ivu-icon-ios-arrow-right"></i>
            </span>
        </div>
        <!-- 日历主体 -->
        <table class="cale-style">
            <thead>
                <tr>
                    <td>日</td>
                    <td>一</td>
                    <td>二</td>
                    <td>三</td>
                    <td>四</td>
                    <td>五</td>
                    <td>六</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="y in 6">
                    <td v-for="x in 7" @click="tdClick(x,y)" :class="caleTDClass(x,y)">
                        <div v-text="tdDate(x,y)" class="vtodo-td-text" :class="caleThisMonthClass(x,y)">
                        </div>
                        <span class="vtodo-td-data" v-html="tdText(x,y)" :style="tdStyle(x,y)">
    
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name: 'vue-todo-calen',
    props: {
        dayData: Object,
        canSelect: Boolean,//可以被选择
        multiple: Boolean,   //多选
        showAllDay: Boolean
    },
    data: function () {
        return {
            timeYY: '',
            timeMM: '',
            timeDD: '',
            dateList: [],
            activeTd: []
        }
    },
    created: function () {
        //页面创建时
        this.initDate();
    },
    computed: {

    },
    methods: {
        //初始化
        initDate: function () {
            //初始化日历
            this.setNowDate();
            //当前月
            let monthNow = new Date(this.timeYY, this.timeMM - 1, 1);
            //第一天
            let fisrtDay = monthNow.getDay();
            //当前时间的字符串
            let thisTimeStr = this.getDateStr(new Date());
            //遍历42个TD
            for (let day = 0; day < 42; day++) {
                //生成当前表格的日期
                let _thisDay = new Date(this.timeYY, this.timeMM - 1, day + 1 - fisrtDay);
                let _thisDayStr = this.getDateStr(_thisDay);
                let dataTemp = {
                    //当前表格日期
                    date: _thisDay,
                    //当前表格的日期字符串
                    daysStr: _thisDayStr,
                    isThisDay: _thisDayStr == thisTimeStr ? true : false, //当前表格是否是今天
                    //当前表格是否是这个月
                    isThisMonth: _thisDay.getMonth() == (this.timeMM - 1) ? true : false
                };
                //一定要用push，不然不会触发视图更新
                this.dateList.push(dataTemp);
            }
        },
        //创建日历
        renderCalc: function () {
            //判断当前月第一天是星期几
            let monthNow = new Date(this.timeYY, this.timeMM - 1, 1);
            let fisrtDay = monthNow.getDay();
            //当前时间的字符串
            // let thisTimeStr = this.getDateStr(new Date(this.timeYY, this.timeMM, this.timeDD));
            let nowDay = this.getDateStr(new Date());
            //遍历42个TD
            for (let day = 0; day < 42; day++) {
                //生成当前表格的日期
                let _thisDay = new Date(this.timeYY, this.timeMM - 1, day + 1 - fisrtDay);
                let _thisDayStr = this.getDateStr(_thisDay);
                this.dateList[day].date = _thisDay;
                this.dateList[day].daysStr = _thisDayStr;
                //当前表格是否是今天;
                this.dateList[day].isThisDay = (_thisDayStr == nowDay) ? true : false;
                this.dateList[day].isThisMonth = _thisDay.getMonth() == (this.timeMM - 1) ?
                    true : false;
            }
        },
        setNowDate: function () {
            //获取今日时间
            let dateNow = new Date();
            this.timeYY = dateNow.getFullYear();
            this.timeMM = dateNow.getMonth() + 1;
            this.timeDD = dateNow.getDate();
        },
        clickNow: function () {
            this.setNowDate();
            this.renderCalc();
        },
        //是否为闰年
        isLeap: function (year) {
            return (year % 100 == 0 ? res = (year % 400 == 0 ? 1 : 0) : res = (year % 4 ==
                0 ? 1 : 0));
        },
        getMonthList: function () {
            //根据年份返回当前年 每个月天数 的数组
            return (new Array(31, 28 + this.isLeap(this.timeYY), 31, 30, 31, 30, 31, 31, 30,
                31, 30, 31)); //各月份的总天数
        },
        getDateStr: function (date) {
            // 根据传入日期，返回其字符串
            var _year = date.getFullYear();
            var _month = date.getMonth() + 1; // 月从0开始计数
            var _d = date.getDate();
            _month = (_month > 9) ? ("" + _month) : ("0" + _month);
            _d = (_d > 9) ? ("" + _d) : ("0" + _d);
            return _year + _month + _d;
        },
        //计算需要绑定的class(td)
        caleThisMonthClass: function (x, y) {
            return {
                'cale-notThisMonth': !(this.dateList[((y - 1) * 7 + x) - 1].isThisMonth),
            };
        },
        caleTDClass: function (x, y) {
            let isActiveTd = false;
            for (let i = 0; i < this.activeTd.length; i++) {
                if (this.activeTd[i] == this.dateList[((y - 1) * 7 + x) - 1].daysStr) {
                    isActiveTd = true;
                }
            }
            return {
                'active-td': isActiveTd,
                'cale-isThisDay': this.dateList[((y - 1) * 7 + x) - 1].isThisDay
            };
        },
        //计算单元格的值
        tdDate: function (x, y) {
            if (this.showAllDay) {
                return this.dateList[((y - 1) * 7 + x) - 1].date.getDate();
            } else {
                if (this.dateList[((y - 1) * 7 + x) - 1].isThisMonth) {
                    return this.dateList[((y - 1) * 7 + x) - 1].date.getDate();
                }
            }
        },
        //单元格显示的文字
        tdText: function (x, y) {
            return this.dayData[this.dateList[((y - 1) * 7 + x) - 1].daysStr] ? this.dayData[this.dateList[((y - 1) * 7 + x) - 1].daysStr].text : '';
        },
        //单元格的样式
        tdStyle: function (x, y) {
            return this.dayData[this.dateList[((y - 1) * 7 + x) - 1].daysStr] ? this.dayData[this.dateList[((y - 1) * 7 + x) - 1].daysStr].style : '';
        },
        prevMonth: function () {
            // 上一月
            if (this.timeMM > 1) {
                this.timeMM -= 1;
            } else {
                this.timeYY -= 1;
                this.timeMM = 12;
            }
            this.$emit('on-change', new Date(this.timeYY, this.timeMM - 1, this.timeDD))
            this.renderCalc();
        },
        nextMonth: function () {
            // 下一月
            if (this.timeMM < 12) {
                this.timeMM += 1;
            } else {
                this.timeYY += 1;
                this.timeMM = 1;
            }
            this.$emit('on-change', new Date(this.timeYY, this.timeMM - 1, this.timeDD))
            this.renderCalc();
        },
        prevYear: function () {
            // 上一年
            this.timeYY -= 1;
            this.$emit('on-change', new Date(this.timeYY, this.timeMM - 1, this.timeDD))
            this.renderCalc();
        },
        nextYear: function () {
            // 下一年
            this.timeYY += 1;
            this.$emit('on-change', new Date(this.timeYY, this.timeMM - 1, this.timeDD))
            this.renderCalc();
        },
        turnMonth: function (month) {
            //跳转到某月
            this.timeMM = month;
            this.renderCalc();
        },
        //某一天的点击事件
        tdClick: function (x, y) {
            if (this.showAllDay) {
                this.setActiveTd((((y - 1) * 7 + x) - 1));
                this.$emit('day-click', this.dateList[((y - 1) * 7 + x)], this.activeTd)
            } else {
                if (this.dateList[((y - 1) * 7 + x) - 1].isThisMonth) {
                    this.setActiveTd((((y - 1) * 7 + x) - 1));
                    this.$emit('day-click', this.dateList[((y - 1) * 7 + x)], this.activeTd)
                }
            }
        },
        //设置活动单元格
        setActiveTd(index) {
            let tempArr = [];
            if (this.multiple) {
                for (let i = 0; i < this.activeTd.length; i++) {
                    if (this.activeTd[i] != this.dateList[index].daysStr) {
                        tempArr.push(this.activeTd[i]);
                    }
                }
                if (tempArr.length == this.activeTd.length) {
                    this.activeTd.push(this.dateList[index].daysStr);
                } else {
                    this.activeTd = tempArr;
                }
            } else if (this.canSelect) {
                tempArr.push(this.dateList[index].daysStr);
                this.activeTd = tempArr;
            } else {
                this.activeTd = tempArr;
            }
        }
    }
}
</script>
<style>
@import "../css/init.css";
@import "https://cdn.bootcss.com/iview/2.0.0-rc.15/styles/iview.css";

.cale-table {
    /*width: 240px;*/
    /*height: 0px;*/
    width: 100%;
    background-color: #fff;
    padding: 8px;
    color: #495060;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    /*font: 12px '\5B8B\4F53';*/
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1, Arial, sans-serif;
}

.cale-table table {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    /*color: #555;*/
    font-size: 13px;
    /*border: 1px solid #c2c2c2;*/
}

.v-date-picker-header {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid #e9eaec;
}

.cale-table table thead {
    color: #bbbec4;
    /*background-color: #e2e2e2;
            border-bottom: 1px solid #c2c2c2;*/
}

.cale-table table thead td {
    width: 12%;
    height: 50px;
    min-height: 50px;
}

.cale-table table thead td>div {
    width: 100%;
    height: inherit;
}

.cale-table table tbody td {
    min-height: 50px;
    height: 50px;
    cursor: pointer;
    border: 1px solid #dddee1;
}

.cale-table table tbody td:not(.cale-isThisDay):hover {
    background-color: #eee;
}
















/* 不是本月 */

.cale-notThisMonth {
    color: #b2b2b2 !important;
}

.cale-isThisDay {
    color: #2d8cf0;
    /*background-color: #e2e2e2 !important;*/
}

.vtodo-td-text {
    padding: 0 8px 0 0;
    text-align: right;
    position: relative;
    /*border-bottom: 1px solid #e2e2e2;*/
}

.vtodo-td-data {
    color: #ada994
    /*color: #19be6b*/
}















































/*当前活动的表格*/

.active-td {
    background-color: #eee;
}
</style>


