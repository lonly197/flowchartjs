/**
 * flowchart.js - flowchartjs for create the flowchart
 *
 * @file
 * @author  lonly
 * @version 1.0.0
 * @license The MIT License: Copyright (c) 2010-2017 Lonly.
 */
import {
  jsPlumb
} from 'jsplumb'
import {
  cache as Cache
} from './cache'


/**
 * @class 流程节点
 */
class ChartNode {
  /**
   * @class 流程节点
   * @param {Object} container      节点容器（画布），jquery对象
   * @param {String} id      节点id
   * @param {String} name    节点名称
   * @param {Number} type    节点类型 [0:'开始节点', 1:'流程节点', 2:'结束节点']
   * @param {Number} x       节点x坐标
   * @param {Number} y       节点y坐标
   * @param {Object} [options] 节点附加属性
   * @param {String} [options.color] 节点文字颜色
   * @param {String} [options.bgColor] 节点背景色
   * @param {Number} [options.radius] 节点圆角大小
   * @param {Number} [options.data] 绑定到节点的附加数据
   * @param {Number} [options.container] 节点容器（画布），若设置此选项则会自动将节点添加到画布上
   * @param {Boolean} [options.removable=true] 是否支持删除功能（鼠标放上去显示关闭图标）
   */
  constructor(id, name, type, x, y, options) {
    this._jsPlumb = null
    this._container = null
    this._id = id
    this._name = name
    this._x = x
    this._y = y
    this._clsName = options.class || ''
    this._data = (options && options.data) || {}
    this._data.nodeId = id
    this._data.nodeType = type
    this._options = Object.assign({ // 默认属性
      removable: true
    }, options)
    this._el = null

    if (options && options.container) {
      this.appendTo(options.container)
    }
  }
  static get lineStyle() {
    return {
      lineWidth: 5,
      joinstyle: 'round',
      strokeStyle: '#445566'
    }
  }
  static get labelPos() {
    return {
      TopBottom: [6, 2.5, 6, -2.5],
      Bottom: [6, 2.5],
      Top: [6, -2.5]
    }
  }
  static get anchorPos() {
    return {
      TopBottom: ['Top', 'Bottom'],
      Bottom: ['Bottom'],
      Top: ['Top']
    }
  }
  static get arrowStyle() {
    return ['Arrow', {
      location: 0.7
    }, {
      foldback: 0.7,
      width: 12
    }]
  }
  getId() {
    return this._id
  }
  getData() {
    return this._data || {}
  }
  getPos() {
    return {
      x: this._x,
      y: this._y
    }
  }
  setPlumb(plumb) {
    this._jsPlumb = plumb
  }
  _px(value) {
    return value + 'px'
  }
  appendTo(container) {
    if (!container) {
      console.error('node container is null !')
      return
    }

    const self = this
    const options = self._options
    const px = self._px

    // 创建并插入 dom 节点
    const node = document.createElement('div')
    node.classList.add('window', 'task', `${self._clsName}`)
    node.setAttribute('id', self._id)
    node.style.left = px(self._x)
    node.style.top = px(self._y)
    node.innerHTML = self._name
    Cache.addData(node, 'data', this._data)
    Cache.addData(node, 'node', this)

    if (options.removable) {
      const removeIcon = document.createElement('div')
      removeIcon.classList.add('remove')
      node.append(removeIcon)
    }

    container.append(node)
    this._jsPlumb.draggable(node, {
      grid: [10, 10]
    })

    this._el = node
  }
  /**
   * 添加连接端口
   * @param {Object} options 连接端口参数
   * @param {String} [options.color=#0096f2] 端口颜色
   * @param {Boolean} [options.isSource=false] 是否为源端口
   * @param {Boolean} [options.isTarget=false] 是否为目标端口
   * @param {String} [options.label] 端口名称
   * @param {String} [options.position=bottom] 端口位置，可设置为 'Top'
   */
  addPort(options) {
    const pos = options.position || 'Bottom'
    const anchors = ChartNode.anchorPos[pos]
    for (const anchor of anchors) {
      // 定义节点的基本配置
      const endpointConf = {
        anchor,
        isSource: !!options.isSource,
        isTarget: !!options.isTarget,
        maxConnections: -1,
        overlays: [
          ChartNode.arrowStyle, ['Label', {
            location: ChartNode.labelPos[pos],
            label: options.label || ''
          }]
        ],
        allowLoopback: false,
        dragAllowedWhenFull: options.dragAllowedWhenFull || true
      }
      // console.log('endpointConf', endpointConf)
      this._jsPlumb.addEndpoint(this._el, endpointConf)
    }
  }
  updatePos() {
    const el = this._el
    this._x = parseInt(el.style.left.toString().replace('px', ''), 10)
    this._y = parseInt(el.style.top.toString().replace('px', ''), 10)
  }
  toPlainObj() {
    const item = this
    item.updatePos()

    const data = Object.assign({}, item._data)
    data.nodeId = item._id
    data.positionX = item._x
    data.positionY = item._y
    data.className = item._clsName
    data.removable = item._options.removable

    return data
  }
  dispose() {
    const el = this._el
    this._jsPlumb.remove(el)
  }
}

/**
 * @class 画布
 */
class Chart {
  /**
   * FlowChart初始化
   * @param {Dom} container 挂在点
   * @param {Object} options 自定义事件{onNodeClick: 节点点击事件, onNodeDel: 节点删除事件}
   */
  constructor(container, options) {
    this._jsPlumb = null // 多实例支持！
    this._container = container
    this._nodes = []
    this._seedName = 'flow-chart-node'
    this._seedId = 0
    this.init(options)
  }
  // jsPlumb只有等到DOM初始化完成之后才能使用
  static ready(callback) {
    jsPlumb.ready(callback)
  }
  nodeId() {
    return this._seedName + this._seedId++ + (new Date()).valueOf()
  }
  getNodes() {
    return this._nodes
  }
  /**
   * jsPlumb初始化
   * @param {Object} options 自定义事件{onNodeClick: 节点点击事件, onNodeDel: 节点删除事件}
   */
  init(options) {
    this._jsPlumb = jsPlumb.getInstance()
    // jsPlumb默认配置
    const defaultSetting = {
      DragOptions: {
        cursor: 'pointer',
        zIndex: 5000
      }, // 拖动时鼠标停留在该元素上显示指针，通过css控制
      PaintStyle: {
        lineWidth: 5,
        stroke: '#445566'
      }, // 元素的默认颜色
      HoverPaintStyle: {
        stroke: '#ec9f2e',
        lineWidth: 4
      },
      Endpoint: ['Dot', {
        radius: 5
      }], // 连接点的默认形状
      EndpointStyle: {
        radius: 9,
        fill: '#acd',
        stroke: 'red'
      }, // 连接点的默认颜色
      EndpointHoverStyle: {
        fill: '#ec9f2e',
        stroke: '#acd'
      },
      Anchors: ['Bottom'], // 连接点的默认位置
      Connector: ['Bezier', {
        curviness: 50
      }], // 连接线的默认样式
      ConnectionOverlays: [ChartNode.arrowStyle]
    }
    // 加载默认配置
    this._jsPlumb.importDefaults(defaultSetting)

    if (!this._container) {
      return
    }

    this._container.classList.add('flow-chart-canvas-lkiarest')

    // 点击事件
    if (options && options.onNodeClick) {
      this._container.addEventListener('click', event => {
        const target = event.target
        if (target.getAttribute('class').indexOf('task') >= 0) {
          options.onNodeClick.call(this, target.getAttribute('node'))
        }
      })
    }
    // 删除节点
    this._container.addEventListener('click', event => {
      // let delNode = event.target.parentElement.getAttribute('data-chartnode')
      const delNode = Cache.getData(event.target.parentElement, 'node')
      if (delNode && event.target.getAttribute('class').indexOf('remove') >= 0) {
        const data = delNode.getData()
        const nodeId = delNode.getId()
        delNode.dispose()

        this.removeNode(nodeId)

        if (options && options.onNodeDel) {
          options.onNodeDel.call(this, data)
        }
      }

      event.stopPropagation()
    })
  }
  /**
   * 添加新节点
   * @param {String} name    节点名称
   * @param {Number} type    节点类型 [0:'开始节点', 1:'流程节点', 2:'结束节点']
   * @param {Number} x       节点x坐标
   * @param {Number} y       节点y坐标
   * @param {Object} options 节点参数，可参考 {class ChartNode} 构造参数
   * @param {String} [options.id] 节点id，若未定义则由系统自动分配
   */
  addNode(name, x, y, options) {
    const id = options && options.id || this.nodeId
    const type = options && !Number.isNaN(options.nodeType) ? options.nodeType : 1
    const node = new ChartNode(id, name, type, x, y, options)
    node.setPlumb(this._jsPlumb)
    node.appendTo(this._container)
    this._nodes.push(node)

    // 添加端口
    let isSource = false
    let isTarget = false
    let position = 'Bottom'
    switch (type) {
      case 0:
        isSource = true
        break
      case 2:
        isTarget = true
        position = 'Top'
        break
      default:
        isSource = true
        isTarget = true
        position = 'TopBottom'
    }
    node.addPort({
      isSource,
      isTarget,
      position,
      // label: 'custom label',
      dragAllowedWhenFull: true
    })

    return node
  }
  /**
   * 删除节点
   * @param {String} nodeId    节点Id
   */
  removeNode(nodeId) {
    const nodes = this._nodes
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i]
      if (node.getId() === nodeId) {
        node.dispose()
        nodes.splice(i, 1)
        return node
      }
    }
  }
  /**
   * 序列化以保存
   */
  toJson() {
    // 获取所有节点
    const nodes = []
    this._nodes.forEach(item => {
      nodes.push(item.toPlainObj())
    })

    // 获取所有连接
    const connections = this._jsPlumb.getConnections().map(connection =>
      ({
        connectionId: connection.id,
        pageSourceId: connection.sourceId,
        pageTargetId: connection.targetId,
        anchors: connection.endpoints.map(endpoint => endpoint.anchor.type)
      })
    )

    return JSON.stringify({
      nodes,
      connections
    })
  }
  /**
   * 从Json中加载Chart
   * @param {String} jsonStr    chart配置文件
   */
  fromJson(jsonStr) {
    if (!jsonStr || jsonStr === '') {
      console.error('draw from json failed: empty json string')
      return
    }

    let jsonObj = null

    try {
      jsonObj = JSON.parse(jsonStr)
    } catch (e) {
      console.error('invalid json string', e)
      return
    }

    this.clear()

    const nodes = jsonObj.nodes
    const connections = jsonObj.connections

    if (nodes) {
      nodes.forEach(item => {
        const node = this.addNode(item.name, item.positionX, item.positionY, {
          class: item.className,
          removable: item.removable,
          id: item.nodeId,
          nodeType: item.nodeType,
          data: item
        })

        this._jsPlumb.repaint(node.getId())
      })
    }

    if (connections) {
      connections.forEach(item => {
        this._jsPlumb.connect({
          source: item.pageSourceId,
          target: item.pageTargetId,
          anchors: item.anchors,
          deleteEndpointsOnDetach: false
        })
      })
    }

    this._jsPlumb.repaintEverything()
  }
  /**
   * 清空所有节点
   */
  clear() {
    if (this._nodes) {
      this._nodes.forEach(item => {
        item.dispose()
      })
    }

    this._nodes = []
  }
  dispose() {
    this.clear()
    this._container.off('click') // unbind events
    this._container = null
  }
}

export default Chart
