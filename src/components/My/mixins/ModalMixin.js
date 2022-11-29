
import TextBorder from "@/components/My/tools/commen/TextBorder";
import { httpAction } from '@/api/manage'

export const ModalMixin = {
  data(){
    return {
      disableSubmit:false,
      ableNext:true,
      ableLast:true,
      method:"",
      loading:false,
      title:"操作",
      visible: false,
      model: {},
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 14 },
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      confirmLoading: false,
    }
  },
  components:{
    TextBorder,
  },
  //如果你想要更改下面的方法请在index中重写该方法
  methods: {
    edit (record) {
      this.model = Object.assign({}, record);
      this.visible = true;
    },
    close () {
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.$emit('close');
      this.visible = false;
    },



    handleOk(){
      const that = this;
      this.$refs.form.validate(valid=>{
        if(valid) {
          console.log(valid);
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if(this.method === "add"){
            httpurl+=this.url.add;
            method = 'post';
          }
          else if(this.method === "edit"){
            httpurl+=this.url.edit;
            method = 'put';
          }
          httpAction(httpurl,this.model,method).then((res)=>{
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

    handleCancel () {
      this.close()
    },

    handleReset(){
      this.add();
    },

    //check模式
    handleLast(){
      this.$emit('last');
    },

    handleNext(){
      this.$emit('next');
    },

  }
}

