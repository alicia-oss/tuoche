<template>
  <a-card :bordered="false">

    <!--     查询区域 -->
    <div class="table-page-search-wrapper">
      <a-row :gutter="30">
        <a-col :span="18">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="30">
              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">
                <a-form-item label="储户姓名">
                  <a-input placeholder="请输入储户姓名模糊查询" v-model="queryParam.realname"></a-input>
                </a-form-item>
              </a-col>

              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">
                <a-form-item label="电话号码">
                  <a-input placeholder="请输入电话号码模糊查询" v-model="queryParam.phone"></a-input>
                </a-form-item>
              </a-col>

<!--              <a-col :xl="queryCol.xl" :lg="queryCol.lg" :md="queryCol.md" :sm="queryCol.sm">-->
<!--                <a-form-item label="">-->
<!--                  <a-select placeholder="请选择职位" v-model="queryParam.role">&ndash;&gt;-->
<!--                    <a-select-option v-for="item in inputData.role"  :value="item.key">-->
<!--                      {{ item.value }}-->
<!--                    </a-select-option>-->
<!--                  </a-select>-->
<!--                </a-form-item>-->
<!--              </a-col>-->
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
<!--    <div class="table-operator">-->
<!--      <a-button type="primary" icon="download">导出</a-button>-->
<!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--        <a-button style="margin-left: 8px"> 批量操作-->
<!--          <a-icon type="down" />-->
<!--        </a-button>-->
<!--      </a-dropdown>-->
<!--    </div>-->

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


      </a-table>
    </div>

    <modal ref="modalForm" @ok="modalFormOk"></modal>

  </a-card>
</template>

<script>

import {ListMixin} from "@/components/My/mixins/ListMixin";
import Modal from "@/views/bank/userManege/childComponents/Modal";

export default {
  name: 'Index',
  components:{
    Modal
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
          title: '储户姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '电话号码',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          customRender:function (t){
            if(t === 0){
              return '存款'
            }
            else{
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

      url:{
        list:'/bank/deposit-log/list',
        delete:'/bank/deposit-log/delete',
        deleteBatch:'/bank/deposit-log/deleteBatch'
      }
    }
  },
  methods: {

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