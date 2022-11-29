<template>
  <a-card :bordered="false">
    <!--     查询区域 -->
    <div class="table-page-search-wrapper">
      <a-row :gutter="30">
        <a-col :span="18">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="30">
              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">
                <a-form-item label="员工姓名">
                  <a-input placeholder="请输入员工姓名模糊查询" v-model="queryParam.name"></a-input>
                </a-form-item>
              </a-col>

              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">
                <a-form-item label="账号">
                  <a-input placeholder="请输入账号模糊查询" v-model="queryParam.account"></a-input>
                </a-form-item>
              </a-col>

              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">
                <a-form-item label="职位">
                  <a-select placeholder="请选择职位" v-model="queryParam.role">-->
                    <a-select-option v-for="item in inputData.role"  :value="item.key">
                      {{ item.value }}
                    </a-select-option>
                  </a-select>
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
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </a-col>
          </span>
        </a-col>
      </a-row>
    </div>

    <!--     操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download">导出</a-button>
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
        :columns="defColumns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="()=>handleDetail(record)">详情</a>
                 <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
          </a-popconfirm>
        </span>


      </a-table>
    </div>

    <modal ref="modalForm" @ok="modalFormOk"></modal>

  </a-card>
</template>

<script>

import {ListMixin} from "@/components/My/mixins/ListMixin";
import Modal from "@/views/bank/userManege/childComponents/Modal";
import test from "@/views/bank/userManege/test";
export default {
  name: 'Index',
  components:{
    Modal,
    test
  },
  mixins:[ListMixin],
  data() {
    return {
      inputData:{
        role:[{key:1,value:'管理员'},{key:2,value: '业务员'}]
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
          title: '员工姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '工号',
          align: 'center',
          dataIndex: 'employeeId'
        },
        {
          title: '职位',
          align: 'center',
          dataIndex: 'roles_dict'
        },
        {
          title: '账号',
          align: 'center',
          dataIndex: 'account'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        // {
        //   title: '性别',
        //   align: "center",
        //   dataIndex: 'sex',
        //   customRender: (text) => {
        //     //字典值替换通用方法
        //     return filterDictTextByCache('sex', text);
        //   }
        // },
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
        list:'/bank/user/list',
        delete:'/bank/user/delete',
        deleteBatch:'/bank/user/deleteBatch'
      }
    }
  },
  methods: {
    //搜索方法
    handleEdit(record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.method = "edit";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.title = "编辑用户信息";
    },

    handleAdd() {
      this.$refs.modalForm.add();
      this.$refs.modalForm.method = "add";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.title = "新增用户信息";
    },

    //查询参数需要自己设计，去上面的查询框里面改，举例如下
    // onBirthdayChange: function (value, dateString) {
    //   // console.log(dateString[0],dateString[1]);
    //   this.queryParam.birthday_begin=dateString[0];
    //   this.queryParam.birthday_end=dateString[1];
    // },
    onIssueDateChange: function(value, dateString) {
      this.queryParam.issueDate_begin = dateString[0];
      this.queryParam.issueDate_end = dateString[1];
    },

  }

}
</script>

<style scoped>

</style>