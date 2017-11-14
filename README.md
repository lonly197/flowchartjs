# flowchartjs

[![Build Status](https://travis-ci.org/lonly197/cachejs.svg?branch=master)](https://travis-ci.org/lonly197/cachejs)

> A Simple FlowChart Libary Base On JsPlumb

[Demo](https://cdn.rawgit.com/lonly197/flowchartjs/master/demo/index.html)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run dll
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Import Libary

```JavaScript
import Chart from './lib/js/flowchartjs'
```

You can replace your favorite style by modifying the flowchart.css file.

```CSS
@import './lib/css/flowchart.ccc'
```

## How To Use

Usage in vue:

```JavaScript
created() {
      // Initial
      Chart.ready(() => {
        // Create Chart
        this.chart = new Chart(this.$refs['flow-container'], {
          // Defines a custom event that is fired when a node is clicked
          onNodeClick(data) {
            console.log(data);
          }
        })
      })
    }
```

```JavaScript
methods: {
      /** Add Chart Node
       * @augments
       * @param name Node Name
       * @param nodeType The Type of Node[0:'Start Node', 1:'Process Node', 2:'End Node']
       */
      addNode(name, nodeType = 1) {
        if (this.chart) {
          this.nodes.push(name)
          // 添加节点
          this.chart.addNode(name, 250, 10, {
            class: 'node', // Custom node style
            data: { // Node binding data, can be obtained in the click event
              name
            },
            nodeType, // Node Type
            id: 'node-1' // Node Id
          })
        }
      },
      /**
       * Save Chart Config To Json String
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
       * Load Chart From Json String
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
       * Clear Chart
       */
      clearChart() {
        if (this.chart) {
          this.chart.clear()
          this.$message.success('The FlowChart Remove Success!');
        } else {
          this.$message.error('The FlowChart Has Not Be Initiald')
        }
      }
    }
```

For a detailed explanation on how things work, check out the [guide](https://jsplumbtoolkit.com/community/doc/home.html) and [docs for jsPlumb](https://jsplumbtoolkit.com/community/apidocs/index.html).

