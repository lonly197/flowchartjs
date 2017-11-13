# jsPlumb 基本概念

---

## 一、默认属性

- `Anchor`：锚点(连接点位置)，可以设置在任何没有锚点的目标上(`endPoint`)
- `Anchors`：设置在connect的源和目标点的连接点位置，默认是 `BottomCenter`
- `Connector`：连接线（比如：`["Bezier", {curviness: 63}]`为贝塞尔曲线）
- `ConnectionsDetachable`：是否在连接点可以用鼠标拖动[`true/false`]
- `Container`：容器
- `DoNotThrowErrors`：设置当锚点(`Anchor`)、端点(`endPoint`)和连接器(`Connector`)不存在的时候是否抛出异常
- `ConnectionOverlays`：默认覆盖附着在每个连接器
- `DragOptions`：为 被 `jsPlumb.draggable` 设置了拖拽的元素拖拽时设置的css样式.eg:
		hoverClass: "dropHover",//释放时指定鼠标停留在该元素上使用的css class;
		activeClass: "dragActive"//可拖动到的元素使用的css class
- `Endpoint`: 端点的形状定义，比如圆：`[ "Dot", { radius:5 } ]`；正方形：`Rectangle`
- `Endpoints`：设置了连接器的源和目标端点的形状，eg圆： `[ [ "Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ]`
- `EndpointOverlays`:默认覆盖附着在每个端点
- `EndpointStyle`：端点的默认样式
- `EndpointStyles`：设置了连接器的源和目标端点的样式
- `EndpointHoverStyle`：端点的hover状态样式
- `EndpointHoverStyles` ：设置了连接器的源和目标端点端点的hover状态样式
- `HoverPaintStyle` ：
- `LogEnabled`：jsPlumb内部日志是否开启。
- `Overlays`：默认覆盖连接器和端点样式，装饰连接器,如标签、箭头等
- `MaxConnections` ：设置连接点最多可以连接几条线
- `PaintStyle` ：设置连接点的样式
- `connectorStyle`：设置连接线样式
- `ReattachConnections` ：
- `RenderMode` ：默认渲染模式
- `Scope`：连接点的标识符，只有标识符相同的连接点才能连接

## 二、锚点(Anchor)

### 1 . 默认锚位置:

- Top (TopCenter)
- TopRight
- Right (RightMiddle)
- BottomRight
- Bottom (BottomCenter)
- BottomLeft
- Left (LeftMiddle)
- TopLeft
- Center

eg：

	//定义了一个在底部中间的锚点位置
	jsPlumb.connect({...., anchor:"Bottom", ... });

### 2 . 基于数组的语法 [x,y,dx,dy]

- x-相对该锚点在x轴坐标比例（最大1）
- y-相对该锚点y轴坐标比例（最大1）
- dx-控制锚的方向
- dy-同上

eg：

	//定义了一个在底部中间的锚点位置
	jsPlumb.connect({...., anchor:[ 0.5, 1, 0, 1 ], ... });

如果锚点位置无法满足你的需求，还可以设置锚点的偏移量[x,y,dx,dy,offSetX,offSetY] ,下面设置了Y轴偏移50px，锚点Y坐标会+50px:

	jsPlumb.connect({...., anchor:[ 0.5, 1, 0, 1, 0, 50 ], ... });

### 3 . 动态锚

- 数组定义

	没有特殊的语法来创建一个动态锚;可以提供一个静态数组锚规格,如:

		var dynamicAnchors = [ [ 0.2, 0, 0, -1 ],  [ 1, 0.2, 1, 0 ], [ 0.8, 1, 0, 1 ], [ 0, 0.8, -1, 0 ] ];
		jsPlumb.connect({...., anchor:dynamicAnchors, ... });

	或者组合：

		var dynamicAnchors = [ [ 0.2, 0, 0, -1 ],  [ 1, 0.2, 1, 0 ],  "Top", "Bottom" ];
		jsPlumb.connect({...., anchor:dynamicAnchors, ... });

	这样锚点会根据位置自动调整到最合适的位置(定义的数组里几个点中)

- 默认定义

	jsPlumb提供了一个动态锚 `AutoDefault` 选择从 前 , 右 , 底 和 左 :

		jsPlumb.connect({...., anchor:"AutoDefault", ... });

### 4 . 多边形锚

- Circle(圆)
- Ellipse(椭圆)
- Triangle(三角形)
- Diamond(菱形)
- Rectangle(矩形)
- Square(正方形)

#### (1) 单个多边形

eg：

	jsPlumb.addEndpoint("someElement", {
		endpoint:"Dot",
		anchor:[ "Perimeter", { shape:"Circle" } ]
	});

如果锚点的宽高一样，该锚点位置为动态圆周。宽高不同为椭圆，类似正方形和矩形。

默认情况下，锚点个数为60，我们还可以手动指定：

eg（指定150个动态锚点）：

	jsPlumb.addEndpoint("someDiv", {
	    endpoint:"Dot",
	    anchor:[ "Perimeter", { shape:"Square", anchorCount:150 }]
	});

#### (2) 组合锚点（三角形与菱形）：

	jsPlumb.connect({
	    source:"someDiv",
	    target:"someOtherDiv",
	    endpoint:"Dot",
	    anchors:[
	        [ "Perimeter", { shape:"Triangle" } ],
	        [ "Perimeter", { shape:"Diamond" } ]
	    ]
	});

#### (3) 自定义角度多边形锚点

	jsPlumb.connect({
	    source:"someDiv",
	    target:"someOtherDiv",
	    endpoint:"Dot",
	    anchors:[
	        [ "Perimeter", { shape:"Triangle", rotation:25 } ],
	        [ "Perimeter", { shape:"Triangle", rotation:-335 } ]
	    ]
	});

上面定义了两个三角形旋转不同角度得到的组合图形（旋转适用带角度的多边形）。

### 5. CSS类和锚点

#### (1)介绍

锚点的不同位置可以有多种css样式，那就要有不同的css类提供支持。

被写入到锚点的CSS类和元素与jsPlumb实例相关联的前缀默认的前缀:

	jsplumb-endpoint-anchor-

eg：

	var ep = jsPlumb.addEndpoint("someDiv", {
	  anchor:[0.5, 0, 0, -1, 0, 0, "top" ]
	};

jsPlumb将会分配这个类给创建的 `endpoint` 和元素 `someDiv`：

	jsplumb-endpoint-anchor-top


#### (2)示例

一个使用动态锚的例子:

	var ep = jsPlumb.addEndpoint("someDiv", {
	  anchor:[
	    [ 0.5, 0, 0, -1, 0, 0, "top" ],
	    [ 1, 0.5, 1, 0, 0, 0, "right" ]
	    [ 0.5, 1, 0, 1, 0, 0, "bottom" ]
	    [ 0, 0.5, -1, 0, 0, 0, "left" ]
	  ]
	});

这里的类分配给端点和元素循环这些值作为锚位置的变化:

	jsplumb-endpoint-anchor-top
	jsplumb-endpoint-anchor-right
	jsplumb-endpoint-anchor-left
	jsplumb-endpoint-anchor-bottom

如果您提供多个类名,jsPlumb不会预先考虑类中的每个词的前缀:

	var ep = jsPlumb.addEndpoint("someDiv", {
	  anchor:[ 0.5, 0, 0, -1, 0, 0, "foo bar" ]
	});

会导致2个类被添加到端点和元素:

	jsplumb-endpoint-anchor-foo 和 bar

#### (3)改变锚类前缀

前缀 `endpointAnchorClass` 用于锚类存储为jsPlumb的成员，这个前缀是可更改的:

	jsPlumb.endpointAnchorClass = "anchor_";

或者

	var jp = jsPlumb.getInstance();
	jp.endpointAnchorClass = "anchor_";

## 三、连接线(器)(Connectors)

### 1. 简介
jsPlumb提供了四种连接线：

- `straight`(直线)
- `Bezier`(贝塞尔曲线)
- `flowchart`(流程图)
- `state machine`

### straight

在两个端点之间画一条直线。 它支持两个构造函数参数:

- `stub`：可选的,默认值为0。此参数的任何正值将导致在与连接线的两端产生一段不可改变方向的线段
- `gap`：可选，默认为0像素。在连接线的一端和连接的元素之间指定一个间隙。

### Bezier

贝塞尔提供了一个立方的贝塞尔曲线。 它支持一个构造函数参数:

- `curviness`：参数可选,默认为150。 定义了曲线的弯曲程度。

### flowchart

垂直或水平的连接线，提供了四个参数：

- `stub`：这是最小长度，以像素为单位，最初的存根，源自一个端点。这是一个可选的参数，并且可以是一个整数，它指定了连接器的每个末端的存根，或是一个整数数组，指定[源目标]端点的连接。默认值为30像素的整数
- `alwaysRespectStubs` ：可选，默认为false。
- `gap`：可选，默认为0像素。在连接线的一端和连接的元素之间指定一个间隙。
- `midpoint`：可选，默认为0.5。这是一个流程图中最长的部分将被绘制的2个元素之间的距离。
- `cornerRadius`：默认为0。此参数的正值将改变弯角的度数。

### state machine

略微弯曲的线（实际上是二次Bezier曲线），类似于状态机的连接器，支持的构造函数参数：

- `margin`：可选；默认为5。定义连接线开始/结束的元素的距离。
- `curviness`：可选的,默认为10，定义了曲线的弯曲程度。
- `proximityLimit` ： 可选,默认为80。 连接线的两端之间的最小距离 它描绘为一条直线而非二次贝塞尔曲线。

## 四、端点(Endpoints)

### 简介

端点是连接里的一个端点外观和行为表现的集合，jsPlumb实现了四个端点：

- Dot(点)
- Rectangle(矩形)
- Blank(空)
- image(图像)

### 创建

有不同的方式创建 `endpoint`：

#### (1)connect

并通过一个元素id或DOM元素作为源/目标,创建并分配一个新的端点

eg：

	jpInstance.connect({
        source: "state1",
        target: "state2",
        scope: "state3"
    });

#### (2)addEndpoint
创建一个新的端点

	jpInstance.addEndpoint("myDivId", EndpointConfig)

#### (3)makeSource()

	jpInstance.makeSource(...)

### 类型

#### (1)Dot
就是在屏幕上画一个点，它支持三个构造函数参数:

- `radius`：可选，默认为10像素。 定义点的半径
- `cssClass` ：可选，端点元素的CSS类。
- `hoverClass` 可选的，元素或连线的hover属性样式类

#### (2)Rectangle

绘制一个矩形。 支持构造函数参数有:

- `width`：可选的，默认为20像素。定义矩形的宽度。
- `height`：可选的，默认为20像素。定义矩形的高。
- `cssClass` ：可选的，端点元素的CSS类。
- `hoverClass` ：可选的，元素或连线的hover属性样式类

#### (3)Image

从一个指定的URL加载图像，这个端点支持三种构造函数参数:

- `src`：图片的url
- `cssClass` ：可选的，端点元素的CSS类。
- `hoverClass` ：可选的，元素或连线的hover属性样式类

## 五、覆盖（连接元素）(Overlays)

### 简介

jsPlumb带有五个类型的覆盖图:
- Arrow(箭头) ：一个可配置的箭头，在某些点上涂上了一个可配置的箭头。你可以控制箭头的长度和宽度，“折返”点一点尾巴分折回来，和方向（允许值为1和1；1是默认的，意味着在连接点方向）
- Label(标签)：一个可配置的连线标签
- PlainArrow(平原箭头)：没有监听的三角形箭头
- Diamond(钻石)：钻石箭头
- Custom(自定义)：可自定义DOM元素

### 位置

位置表明连接元素在连接线的位置，通常有三种表明方式：

- [0 . . 1]范围内的十进制数，表明在连接线的位置比例，默认0.5
- [1 . . . ] (>1)的数字表明沿着连接线的绝对路径的像素
- 小于零的整数数组:
	(1):指定一个覆盖在端点的中心位置：

		location:[ 0.5, 0.5 ]

	(2):沿着x轴从左上角叠加5像素

		location: [ 5, 0 ]

	(3):沿着x轴从右下角叠加放置5像素

		location: [ -5, 0 ]

对于位置的操作，jsPlumb提供了两个方法：

- getLocation ——返回当前位置
- setLocation ——设置当前位置

### 使用

使用场景(出现以下调用的时候)：

- `jsPlumb.connect`
- `jsPlumb.addEndpoint`
- jsPlumb.makeSource

注： 没有 `jsPlumb.makeTarget`

#### 1. 在 `jsPlumb.connect` 被调用时使用

(1). 下面指定了 一个默认配置的箭头和一个文字为foo的标签文本：

	jsPlumb.connect({
	  ...
	  overlays:[
	    "Arrow",
	      [ "Label", { label:"foo", location:0.25, id:"myLabel" } ]
	    ],
	  ...
	});

此连接的箭头在连接线的中间，lable标签则是在连接线的四分之一处；这里添加了一个id，它可以在以后移除或修改标签时使用。

(2). 箭头位置位于连接线距离50像素(绝对位置):

	jsPlumb.connect({
	  ...
	  overlays:[
	    "Arrow",
	      [ "Label", { label:"foo", location:50, id:"myLabel" } ]
	    ],
	    ...
	});

#### 2. 在 `jsPlumb.addEndpoint` 被调用时使用

此连接将有10x30像素箭坐落在连接头，标签“foo”则位于中点。端点本身也有一个覆盖，位于[ - 0.5 *宽，- 0.5 *高]相对于端点的左上角。

	jsPlumb.addEndpoint("someDiv", {
	  ...
	  overlays:[
	    [ "Label", { label:"foo", id:"label", location:[-0.5, -0.5] } ]
	  ],
	  connectorOverlays:[
	    [ "Arrow", { width:10, length:30, location:1, id:"arrow" } ],
	    [ "Label", { label:"foo", id:"label" } ]
	  ],
	  ...
	});

注：在addEndpoint 使用 `connectorOverlays` 代替 `overlays`，因为 `overlays`指向端点覆盖。

#### 3. 在 jsPlumb.makeSource

同样使用 `connectorOverlays`，而且 `makeSource` 支持 `endpoint` 参数。
此连接将有10x30像素箭坐落在连接头，标签“foo”位于中点。

	jsPlumb.makeSource("someDiv", {
	  ...
	  endpoint:{
	    connectorOverlays:[
	      [ "Arrow", { width:10, length:30, location:1, id:"arrow" } ],
	      [ "Label", { label:"foo", id:"label" } ]
	    ]
	  }
	  ...
	});

#### 4. `addOverlay` 方法

`Endpoints` 和 `Connections` 都有一个方法： `addOverlay`，它提供一个单一的方法定义一个 覆盖(Overlays):

	var e = jsPlumb.addEndpoint("someElement");
	e.addOverlay([ "Arrow", { width:10, height:10, id:"arrow" }]);

### Overlay Types（覆盖类型）

#### 1. Arrow(箭头)

一个箭头 使用四个点：头、两个尾点和一个foldback(监听)，它允许箭头的箭尾缩进。此覆盖的可用构造函数参数：

- width：宽度
- length：长度
- location：在连接线上的位置
- direction：默认1-向前，-1向后
- foldback：箭头沿轴到尾点的监听。默认是0.623
- paintStyle：`Endpoints` 和 `Connectors` 的样式对象

#### 2. PlainArrow（平原箭头）
这其实就是一个 foldback=1 的 Arror；继承Arror的构造函数

#### 3. Diamond（菱形）

这其实就是一个 foldback=2 的 Arror；继承Arror的构造函数

#### 4. Label（标签）

(1) 介绍

提供装饰连接器的文本标签。可用的构造函数参数是：

- label : 文本显示。 您可以提供一个函数,而不是纯文本:连接作为一个参数传递,它应该返回一个字符串。
- cssClass :可选的css类使用的标签。现在优先使用 labelStyle 参数。
- labelStyle ： 可选参数标签的外观。 可用参数有：
	- font ：一种适用于画布元素的字体字符串
	- fillStyle ：标签的背景颜色填充，可选。
	- color ：字体颜色，可选
	- padding ：表示标签的宽度的比例，而不是px和ems。
	- borderWidth ：标签的边框宽度，默认0
	- borderStyle ：标签边框的样式，可选
- location ：标签位置

(2). `getLabel` 和 `setLabel`

标签覆盖提供了两个方法 `getLabel` 和 `setLabel` 用于动态地get/set标签内容:

	var c = jsPlumb.connect({
	  source:"d1",
	  target:"d2",
	  overlays:[
	    [ "Label", {label:"FOO", id:"label"}]
	  ]
	});

	...

	var label = c.getOverlay("label");
	console.log("Label is currently", label.getLabel());
	label.setLabel("BAR");
	console.log("Label is now", label.getLabel());

这个例子里，标签被赋予一个id ‘label’，然后检索这个id动态设置lable的值。

Connections 和 Endpoints 都支持 标签覆盖：

	var conn = jsPlumb.connect({
	  source:"d1",
	  target:"d2",
	  label:"FOO"
	});

	...

	console.log("Label is currently", conn.getLabel());
	conn.setLabel("BAR");
	console.log("Label is now", conn.getLabel());

(3). 动态设置label

	var conn = jsPlumb.connect({
	  source:"d1",
	  target:"d2"
	});

	...

	conn.setLabel(function(c) {
	  var s = new Date();
	  return s.getTime() + "milliseconds have elapsed since 01/01/1970";
	});
	console.log("Label is now", conn.getLabel());

#### 5. Custom（自定义）

jsPlumb允许自定义一个 OverLays，你只需要实现 create(component)：

	var conn = jsPlumb.connect({
	  source:"d1",
	  target:"d2",
	  paintStyle:{
	    strokeStyle:"red",
	    lineWidth:3
	  },
	  overlays:[
	    ["Custom", {
	      create:function(component) {
	        return $("<select id='myDropDown'><option value='foo'>foo</option><option value='bar'>bar</option></select>");
	      },
	      location:0.7,
	      id:"customOverlay"
	    }]
	  ]
	});

注意 此处的id为 `customeOverlay` ，你可以在 Connection 或者 Endpoint上使用 `getOverlay(id) ` 方法。

### 隐藏/显示 Overlays（覆盖）

可以使用 `setVisible` 方法控制 `Overlays` 的显示属性，或者在一个连接上使用 `showOverlay(id)` 和 `hideOverlay(id)`。

(1). 使用id：

	var connection = jsPlumb.connect({
	  ...
	  overlays:[
	    "Arrow",
	    [ "Label", { label:"foo", location:0.25, id:"myLabel" } ]
	  ],
	  ...
	});

	// time passes

	var overlay = connection.getOverlay("myLabel");
	// now you can hide this Overlay:
	overlay.setVisible(false);
	// there are also hide/show methods:
	overlay.show();
	overlay.hide();

(2). 使用 `showOverlay(id)` 和 `hideOverlay(id)`：

Connection 和 Endpoint 可以使用`showOverlay(id)` 和 `hideOverlay(id)`：

	var connection = jsPlumb.connect({
	  ...
	  overlays:[
	    "Arrow",
	    [ "Label", { label:"foo", location:-30 , id:"myLabel" }]
	  ],
	  ...
	});

	// time passes

	connection.hideOverlay("myLabel");

	// more time passes

	connection.showOverlay("myLabel");

### 删除 Overlays(覆盖)

	var connection = jsPlumb.connect({
	  ...
	  overlays:[
	    "Arrow",
	    [ "Label", { label:"foo", location:0.25 , id:"myLabel"} ]
	  ],
	  ...
	});

	// time passes

	connection.removeOverlay("myLabel");
