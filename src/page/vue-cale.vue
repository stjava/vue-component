<template>
    <div class="cale-wrap">
        <!--<Vue-Calen></Vue-Calen>-->
        <vue-todo-Calen :day-data="dayData" multiple show-all-day></vue-todo-Calen>
    </div>
</template>
<script>

import VueCalen from '@/components/VueCalen'
import VueTodoCalen from '@/components/VueTodoCalen'
export default {
    components: {
        VueCalen,
        VueTodoCalen
    },
    data: function () {
        return {
            dayData: {
                '20170622': {
                    text: 'asda',
                    style: {
                        color:'red'
                    }
                }
            }
            
        }
    }
}
</script>
<style>
.cale-wrap {
    width: 50%;
    margin: 16px;
}
</style>
