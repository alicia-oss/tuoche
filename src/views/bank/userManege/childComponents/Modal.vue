<template>
  <div>
    <a-modal
      style="padding-bottom: 10px;width: 35%"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      @ok="handleOk"
      cancelText="关闭">

      <template slot="title">
        <div class="title">
          <a-icon type="form" style="color: #1890ff;margin-right: 10px"></a-icon>{{title}}
        </div>
      </template>

      <template slot="footer" >
        <div v-if="method!=='check'">
          <a-button style="margin: 10px" key="reset"  @click="handleReset" >
            重置
          </a-button>
          <a-button style="margin: 10px" key="back"  @click="handleCancel" >
            取消
          </a-button>
          <a-button style="margin: 10px" key="submit" type="primary" :loading="loading" @click="handleOk">
            保存
          </a-button>
        </div>

        <div v-else>
          <a-button  style="margin: 10px" key="last" :disabled="!ableLast" @click="handleLast" >
            上一条
          </a-button>
          <a-button  style="margin: 10px" key="next" :disabled="!ableNext" @click="handleNext" >
            下一条
          </a-button>

          <a-button style="margin: 10px" key="submit" type="primary" :loading="loading" @click="handleCancel">
            关闭
          </a-button>
        </div>
      </template>
      <a-spin :spinning="confirmLoading">
        <div class="table" >
          <div class="item">
            <a-form-model ref="form"  :label-col="labelCol" :wrapper-col="wrapperCol"  :model="model" :rules="validatorRules">
              <div v-show="method !=='check'">

                <a-form-model-item label="账号" required prop="account" hasFeedback>
                  <a-input v-model="model.account"    placeholder="请输入账号"/>
                </a-form-model-item>

                  <a-form-model-item label="员工姓名" required prop="name" hasFeedback>
                    <a-auto-complete
                      :data-source="inputData.employeeId"
                      placeholder="请输入员工姓名"
                      v-model="model.name"
                      @select="handleComplete"
                    ></a-auto-complete>
                  </a-form-model-item>

                <a-form-model-item label="员工工号" required prop="employeeId" hasFeedback>
                  <a-auto-complete
                    :data-source="inputData.employeeId"
                    placeholder="请输入员工工号"
                    v-model="model.employeeId"
                  ></a-auto-complete>
                </a-form-model-item>

                  <a-form-model-item label="职位" required  prop="role" hasFeedback >
                    <a-select mode="multiple" placeholder="请输入职位" v-model="model.role">
                      <a-select-option  v-for="item in inputData.role" :value="item.key">
                        {{item.value}}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>

                  <a-form-model-item label="创建日期"  prop="createTime" hasFeedback>
                    <a-date-picker style="width: 100%;" valueFormat="YYYY-MM-DD" :disabled="true"  v-model="model.createTime" />
                  </a-form-model-item>

                <a-form-model-item label="更新日期"   prop="updateTime" hasFeedback>
                  <a-date-picker style="width: 100%;" :disabled="true" valueFormat="YYYY-MM-DD" v-model="model.updateTime" />
                </a-form-model-item>

                  <a-form-model-item label="上传人"  prop="uploadUserId" hasFeedback >
                    <a-input  placeholder="请输入上传人"  v-model="model.uploadUserName" :disabled="true"/>
                  </a-form-model-item>

              </div>
              <div  v-show="method === 'check'">

                <a-form-model-item label="账号" required prop="account" hasFeedback>
                  <a-input v-model="model.account"  :read-only="true"  placeholder="请输入账号"/>
                </a-form-model-item>

                <a-form-model-item label="员工姓名" required prop="name" hasFeedback>
                  <a-input v-model="model.name"  :read-only="true"/>
                </a-form-model-item>

                <a-form-model-item label="员工工号" required prop="employeeId" hasFeedback>
                  <a-input v-model="model.employeeId"  :read-only="true"/>
                </a-form-model-item>

                <a-form-model-item label="职位"  prop="role" hasFeedback >
                  <a-input v-model="model.role"  :read-only="true"/>
                </a-form-model-item>

                <a-form-model-item label="创建日期"  prop="createTime" hasFeedback>
                  <a-input v-model="model.createTime"  :read-only="true"/>
                </a-form-model-item>

                <a-form-model-item label="更新日期"  prop="updateTime" hasFeedback>
                  <a-input v-model="model.updateTime" :read-only="true" />
                </a-form-model-item>

                <a-form-model-item label="上传人"  prop="uploadUserId" hasFeedback >
                  <a-input v-model="model.uploadUserName"  :read-only="true"/>
                </a-form-model-item>
              </div>
            </a-form-model>

          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { ModalMixin} from "@/components/My/mixins/ModalMixin";
import {getAction} from "@/api/manage";
import {toLine} from "@/utils/util";

export default {
  name: "Modal",
  mixins:[ModalMixin],
  data () {
    return {
      inputData: {
        employeeId:["张海青-0441","张三-0442","李四-3d464b4ea0d2491aab8a7bde74c57e95"],
        apartment:["测试部门01","测试部门02","测试部门03","测试部门04"],
        role:[{key:1,value:'管理员'},{key:2,value: '业务员'}]
      },

      validatorRules:{
        account: [{required: true, message: '请输入账号!'}, {validator:this.checkVal, trigger: 'blur' }],
        employeeId: [{required: true, message: '请输入工号!'}, {validator:this.checkVal, trigger: 'blur' }],
      },
      url: {
        add: "/bank/user/add",
        edit: "/bank/user/edit",
        check:'/bank/user/check'
      },
    }
  },

  methods: {
    handleComplete(){
      let temp = this.model.name.split("-");
      this.model.name = temp[0];
      this.model.employeeId = temp[1];
    },

    add () {
      this.edit({});
      let myData = new Date();
      this.model.createTime = myData.Format("yyyy-MM-dd");
      this.model.updateTime = myData.Format("yyyy-MM-dd");
      this.model.uploadUserName = this.$store.getters.nickname + "-" + this.$store.getters.employeeId;
    },

    // /**
    //  * 数据重复校验
    //  * @param rule:
    // field: "account"
    // fullField: "account"
    // type: "string"
    //  */
    checkVal(rule, value, callback){
      let params = new Object() ;
      let reg = /[a-zA-Z]\d{5,}/;
      if(!reg.test(value)){
        return callback(new Error("账号必须用字母开头！"));
      }
      this.$set(params,toLine(rule.field),value)
      console.log('校验',params);
      getAction(this.url.check,params).then((res)=>{
        if(!res.success){
          return callback(new Error(res.message));
        }
        else{
          return callback();
        }
      })
    }


  }
}
</script>

<style scoped>
.table{
  display: flex ;
  width: 100%;
}

.item{
  flex: 1 ;

}

.item-right{
  flex: 1 ;
  height: auto;
}
.title{
  font-size: 20px;
}

::v-deep .ant-form-item{
  margin-bottom: 10px;
}

</style>