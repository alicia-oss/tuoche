<template>
  <a-card :bordered="false">

    <!--     查询区域 -->
    <div class="table-page-search-wrapper">
      <a-row :gutter="30">
        <a-col :span="18">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="30">
              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">
                <a-form-item label="姓名">
                  <a-input placeholder="请输入姓名模糊查询" v-model="queryParam.realname"></a-input>
                </a-form-item>
              </a-col>

              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">
                <a-form-item label="电话号码">
                  <a-input placeholder="请输入电话号码模糊查询" v-model="queryParam.phone"></a-input>
                </a-form-item>
              </a-col>

              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">
                <a-form-item label="身份证号码">
                  <a-input placeholder="请输入身份证号码模糊查询" v-model="queryParam.phone"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>

        <a-col :span="6">
           <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :xl="8" :lg="9" :md="10" :sm="24">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
        </a-col>
      </a-row>
    </div>

    <!--     操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!--     table区域-begin-->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        <span style="float:right;">
          <a @click="loadData()"><a-icon type="sync" />刷新</a>
          <a-divider type="vertical" />
           <a-popover title="自定义列" trigger="click" placement="leftBottom">
            <template slot="content">
              <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
                <a-row style="width: 400px">
                  <template v-for="(item,index) in defColumns">
                    <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                        <a-col :span="12"><a-checkbox :value="item.dataIndex"><j-ellipsis :value="item.title" :length="10"></j-ellipsis></a-checkbox></a-col>
                    </template>
                  </template>
                </a-row>
              </a-checkbox-group>
            </template>
            <a><a-icon type="setting" />设置</a>
          </a-popover>
        </span>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        :rowKey="record=>record.id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="()=>handleDetail(record)">详情</a>
                 <a-divider type="vertical" />
            <a @click="handleBusiness(record)">业务</a>
          <a-divider type="vertical" />
            <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                   <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>

    <modal ref="modalForm" @ok="modalFormOk"></modal>
    <business-modal ref="businessModal" @ok="modalFormOk"></business-modal>
  </a-card>
</template>

<script>

import {ListMixin} from "@/components/My/mixins/ListMixin";
import Modal from './childComponents/Modal'
import BusinessModal from "./childComponents/BusinessModal";

export default {
  name: 'Index',
  components:{
    Modal,
    BusinessModal
  },
  mixins:[ListMixin],
  data() {
    return {
      inputData:{

      },
      // 默认列
      defColumns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '身份证号码',
          align: 'center',
          dataIndex: 'identityCard'
        },
        {
          title: '电话号码',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'action'
          }
        }
      ],

      url:{
        list:'/bank/customer/list',
        delete:'/bank/customer/delete',
        deleteBatch:'/bank/customer/deleteBatch'
      }
    }
  },
  methods: {
    //办理业务
    handleBusiness(record){
      this.$refs.businessModal.edit(record);
      this.$refs.businessModal.method = "add";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.title = "业务办理";
    },
    //搜索方法
    handleEdit(record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.method = "edit";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.title = "编辑储户信息";
    },

    handleAdd() {
      this.$refs.modalForm.add();
      this.$refs.modalForm.method = "add";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.title = "新增储户信息";
    },

    handleDetail(record,index) {
      this.currentModalIndex = index;
      if(index >= this.dataSource.length-1){
        this.$refs.modalForm.ableNext = false;
      }
      else{
        this.$refs.modalForm.ableNext = true;
      }
      if(index <= 0 ){
        this.$refs.modalForm.ableLast = false;
      }
      else{
        this.$refs.modalForm.ableLast = true;
      }
      this.$refs.modalForm.method = "check";
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.disableSubmit = true;
      this.$refs.modalForm.title = "查看储户信息";
    },

    //查询参数需要自己设计，去上面的查询框里面改，举例如下
    // onBirthdayChange: function (value, dateString) {
    //   // console.log(dateString[0],dateString[1]);
    //   this.queryParam.birthday_begin=dateString[0];
    //   this.queryParam.birthday_end=dateString[1];
    // },


  }

}
</script>

<style scoped>

</style>