<template>
  <a-modal
    width="850px"
    style="padding-bottom: 10px;"
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
    </template>

    <a-spin :spinning="confirmLoading">

        <a-form-model ref="form"  :label-col="labelCol" :wrapper-col="wrapperCol"  :model="model" :rules="validatorRules">
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

                <a-form-model-item label="存款金额" required prop="balance" hasFeedback>
                  <a-input prefix="￥" suffix="RMB"  v-model="model.balance"   :read-only="true" />
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
              <text-border title="业务信息填写">
                <a-form-model-item label="业务类型" required prop="type" >
                  <a-radio-group name="type"  v-model="model.type">
                    <a-radio :value="0">
                      存款
                    </a-radio>
                    <a-radio :value="1">
                      取款
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>

                <a-form-model-item label="金额" required prop="amount" hasFeedback>
                  <a-input v-model="model.amount" placeholder="请输入金额(单位:RMB)"/>
                </a-form-model-item>

                <a-form-model-item label="密码" required prop="password" hasFeedback>
                  <a-input-password v-model="model.password" aria-placeholder="请输入密码"></a-input-password>
                </a-form-model-item>
              </text-border>
            </div>
          </div>
        </a-form-model>

    </a-spin>

  </a-modal>

</template>

<script>
import {ModalMixin} from "@/components/My/mixins/ModalMixin";
import {httpAction, postAction} from "@/api/manage";

export default {
  name: "BusinessModal",
  mixins:[ModalMixin],
  data(){
    return{
      validatorRules:{},
      url:{
        getMoney:"/bank/customer/get",
        putMoney:"/bank/customer/put"
      }
    }
  },
  methods:{
    handleOk(){
      const that = this;
      console.log(this.model)
      this.$refs.form.validate(valid=>{
        if(valid) {
          console.log(valid);
          that.confirmLoading = true;
          let httpurl = '';
          if(this.model.type === 0){
            httpurl+=this.url.putMoney;
          }
          else if(this.model.type === 1){
            httpurl+=this.url.getMoney;
          }
          let formdata = new FormData();
          for (let modelKey in this.model) {
            formdata.append(modelKey,this.model[modelKey]);
          }
          console.log(formdata);
          this.model.amount = Number.parseInt(this.model.amount);
          postAction(httpurl,formdata).then((res)=>{
            if(res.success){
              that.$message.success(res.message);
              that.$emit('ok');
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })
        }
      })
    },
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