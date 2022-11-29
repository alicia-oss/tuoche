<template>
  <div>
    <a-modal
      width="800px"
      style="padding-bottom: 10px"
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
        <a-form-model ref="form"  :label-col="labelCol" :wrapper-col="wrapperCol"  :model="model" :rules="validatorRules">

               <div v-show="method !=='check'">
                   <a-form-model-item label="姓名" required prop="realname" hasFeedback>
                     <a-input v-model="model.realname" placeholder="请输入姓名"/>
                   </a-form-model-item>
                   <a-form-model-item label="身份证号码" required prop="identityCard" hasFeedback>
                     <a-input v-model="model.identityCard" placeholder="请输入身份证号码"/>
                   </a-form-model-item>
                   <a-form-model-item label="电话号码" required prop="phone" hasFeedback>
                     <a-input v-model="model.phone" placeholder="请输入电话号码"/>
                   </a-form-model-item>
                   <a-form-model-item label="密码" required prop="phone" hasFeedback>
                     <a-input-password v-model="model.password" placeholder="请输入密码"/>
                   </a-form-model-item>
                   <a-form-model-item label="创建日期" prop="createTime" hasFeedback>
                     <a-date-picker style="width: 100%;" valueFormat="YYYY-MM-DD" :disabled="true"
                                    v-model="model.createTime"/>
                   </a-form-model-item>
                   <a-form-model-item label="更新日期" prop="updateTime" hasFeedback>
                     <a-date-picker style="width: 100%;" :disabled="true" valueFormat="YYYY-MM-DD"
                                    v-model="model.updateTime"/>
                   </a-form-model-item>
                   <a-form-model-item label="上传人" prop="uploadUserId" hasFeedback>
                     <a-input placeholder="请输入上传人" v-model="model.uploadUserName" :disabled="true"/>
                   </a-form-model-item>

              </div>
          <div v-show="method === 'check'">
            <div class="table">
              <div class="item">
                <text-border title="储户信息">
                  <a-form-model-item label="姓名" required prop="realname" hasFeedback>
                    <a-input v-model="model.realname" :read-only="true"/>
                  </a-form-model-item>

                  <a-form-model-item label="身份证号码" required prop="identityCard" hasFeedback>
                    <a-input v-model="model.identityCard" :read-only="true"/>
                  </a-form-model-item>

                  <a-form-model-item label="电话号码" required prop="phone" hasFeedback>
                    <a-input v-model="model.phone" :read-only="true"/>
                  </a-form-model-item>

                  <a-form-model-item label="存款金额"  prop="balance" hasFeedback>
                    <a-input v-model="model.balance" :read-only="true"/>
                  </a-form-model-item>

                  <a-form-model-item label="创建日期" prop="createTime" hasFeedback>
                    <a-input v-model="model.createTime" :read-only="true"/>
                  </a-form-model-item>

                  <a-form-model-item label="更新日期" prop="updateTime" hasFeedback>
                    <a-input v-model="model.updateTime" :read-only="true"/>
                  </a-form-model-item>

                  <a-form-model-item label="上传人" prop="uploadUserId" hasFeedback>
                    <a-input v-model="model.uploadUserName" :read-only="true"/>
                  </a-form-model-item>
                </text-border>
              </div>
              <div class="item-right">
                <text-border title="存取款记录">
                  <a-table
                    size="middle"
                    :bordered="false"
                    :pagination="false"
                    :rowKey="record=>record.id"
                    :columns="defColumns"
                    :dataSource="dataSource">
                  </a-table>
                </text-border>
              </div>
            </div>

        </div>
        </a-form-model>
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
      dataSource:[],
      defColumns:[
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
     customRender:function (t) {
       if (t === 0) {
         return '存款'
       } else {
         return '取款'
       }
     }
        },
        {
          title: '金额',
          align: 'center',
          dataIndex: 'amount'
        },
        {
          title: '操作时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '操作人',
          align: 'center',
          dataIndex: 'uploadUserName'
        },
      ],
      inputData: {
      },
      validatorRules:{},
      url: {
        list:"/bank/deposit-log/list",
        add: "/bank/customer/add",
        edit: "/bank/customer/edit",
        check:'/bank/customer/check'
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

    edit (record) {
      this.model = Object.assign({}, record);
      if(this.method === 'check'){
        getAction(this.url.list,{customerId:this.model.id}).then((res)=>{
          this.dataSource = res.result.records || res.result;
          console.log('记录',res);
        })
      }
      this.visible = true;
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
  margin-bottom: 12px;
}

</style>