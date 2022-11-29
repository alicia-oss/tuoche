<template>
 <div>
     <a-button @click="test11">level11</a-button>
     <a-button @click="test12">level12</a-button>
     <a-button @click="test21">level21</a-button>
     <a-button @click="test22">level22</a-button>
     <a-button @click="test31">level31</a-button>
     <a-button @click="test32">level32</a-button>
 </div>
</template>

<script>
import {getAction} from "@/api/manage";
import {timeFix} from "@/utils/util";

export default {
  name: "test",
  data(){
    return {
      url:{
        level11:"/bank/security/test11",
        level12:"/bank/security/test12",
         level21:"/bank/security/test21",
        level22:"/bank/security/test22",
        level31:"/bank/security/test31",
       level32:"/bank/security/test32",
      }
    }
  },
  methods:{
    test11(){
      getAction(this.url.level11).then((res)=>{
        this.$notification.success({
          message: 'level11',
        })
      })
    },
    test12(){
      getAction(this.url.level12).then((res)=>{
        this.$notification.success({
          message: 'level12',
        })
      })
    },
    test21(){
      getAction(this.url.level21).then((res)=>{
        this.$notification.success({
          message: 'level21',
        })
      })
    },
    test22(){
      getAction(this.url.level22).then((res)=>{
        this.$notification.success({
          message: 'level22',
        })
      })
    },
    test31(){
      getAction(this.url.level31).then((res)=>{
        this.$notification.success({
          message: 'level31',
        })
      })
    },
    test32(){
      getAction(this.url.level32).then((res)=>{
        this.$notification.success({
          message: 'level32',
        })
      })
    }
  }
}
</script>

<style scoped>

</style>