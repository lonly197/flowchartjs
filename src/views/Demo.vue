<template>
  <div>
    <el-row>
      <el-col :span="4">
        <h3>Add Node</h3>
        <el-button class="flow-btn" type="primary" plain @click="addNode('startNode',0)">Start Node</el-button>
        <el-button class="flow-btn" type="primary" plain @click="addNode('processNode',1)">Process Node</el-button>
        <el-button class="flow-btn" type="primary" plain @click="addNode('endNode',2)">End Node</el-button>
      </el-col>
      <el-col :span="20">
        <div class="flow-container" ref="flow-container"></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <h3>Edit Chart</h3>
        <el-button class="flow-btn" type="success" round @click="saveChart">Save Chart</el-button>
        <el-button class="flow-btn" type="warning" round @click="loadChart">Load Chart</el-button>
        <el-button class="flow-btn" type="danger" round @click="clearChart">Clear Chart</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 14}" placeholder="Please Inpute The Json Config Of FlowChart" v-model="chartConfig">
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Chart from '../../static/js/flowchart'
  import UUID from '@/utils/uuid'

  export default {
    name: 'Demo',
    data() {
      return {
        nodeConfig: {
          basicX: 250,
          basicY: 20,
          endY: 350,
          newX: 50,
          newY: 50
        },
        chart: null,
        nodes: [],
        chartConfig: ''
      }
    },
    methods: {
      /** 添加流程节点
       * @augments
       * @param name 节点类型
       */
      addNode(name, nodeType = 1) {
        if (this.chart) {
          this.nodes.push(name)

          // 添加节点
          const startY = this.nodeConfig.basicY * this.nodes.length
          this.chart.addNode(name, this.nodeConfig.basicX, startY, {
            class: 'node', // 自定义节点样式
            data: { // 节点绑定数据，在click事件中可以获取
              name
            },
            nodeType,
            id: UUID.getUUID
          })
        }
      },
      /**
       * 保存流程图配置信息
       */
      saveChart() {
        if (this.chart) {
          this.chartConfig = this.chart.toJson()
          this.$message.success('The FlowChart Save Success!')
        } else {
          this.$message.error('The FlowChart Has Not Be Initiald')
        }
      },
      /**
       * 从配置信息中加载流程图
       */
      loadChart() {
        if (this.chart) {
          this.chart.clear()
          this.chart.fromJson(this.chartConfig)
          this.$message.success('The FlowChart Load Success!');
        } else {
          this.$message.error('The FlowChart Has Not Be Initiald')
        }
      },
      /**
       * 清空流程图
       */
      clearChart() {
        if (this.chart) {
          this.chart.clear()
          this.$message.success('The FlowChart Remove Success!');
        } else {
          this.$message.error('The FlowChart Has Not Be Initiald')
        }
      }
    },
    created() {
      Chart.ready(() => { // 初始化
        // 创建画布
        this.chart = new Chart(this.$refs['flow-container'], {
          onNodeClick(data) { // 点击节点时触发的事件
            console.log(data);
          }
        })
      })
    }
  }
</script>

<style scoped>
  @import "../../static/css/index.css";
  @import "../../static/css/flowchart.css";
</style>
