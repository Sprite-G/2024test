import G6 from '@antv/g6';
let addedNodeCount = 0;
G6.registerBehavior('click-add-node', {
    // 设定该自定义行为需要监听的事件及其响应函数
    getEvents() {
        // 监听的事件为 canvas:click，响应函数是 onClick
        return {
            'canvas:click': 'onClick',
        };
    },
    // 点击事件
    onClick(ev) {
        const graph = this.graph;
        // 在图上新增一个节点
        const node = this.graph.addItem('node', {
            x: ev.canvasX,
            y: ev.canvasY,
            id: `node-${addedNodeCount}`, // 生成唯一的 id
        });
        addedNodeCount++;
    },
});
G6.registerBehavior('click-add-edge', {
    // 设定该自定义行为需要监听的事件及其响应函数
    getEvents() {
        return {
            'node:click': 'onClick', // 监听事件 node:click，响应函数是 onClick
            mousemove: 'onMousemove', // 监听事件 mousemove，响应函数是 onMousemove
            'edge:click': 'onEdgeClick', // 监听事件 edge:click，响应函数是 onEdgeClick
        };
    },
    // getEvents 中定义的 'node:click' 的响应函数
    onClick(ev) {
        const node = ev.item;
        const graph = this.graph;
        // 鼠标当前点击的节点的位置
        const point = { x: ev.x, y: ev.y };
        const model = node.getModel();
        if (this.addingEdge && this.edge) {
            graph.updateItem(this.edge, {
                target: model.id,
            });

            this.edge = null;
            this.addingEdge = false;
            
        } else {
            // 在图上新增一条边，结束点是鼠标当前点击的节点的位置
            this.edge = graph.addItem('edge', {
                source: model.id,
                target: point,
            });
            this.addingEdge = true;
        }
    },
    // getEvents 中定义的 mousemove 的响应函数
    onMousemove(ev) {
        // 鼠标的当前位置
        const point = { x: ev.x, y: ev.y };
        if (this.addingEdge && this.edge) {
            // 更新边的结束点位置为当前鼠标位置
            this.graph.updateItem(this.edge, {
                target: point,
            });
        }
    },
    // getEvents 中定义的 'edge:click' 的响应函数
    onEdgeClick(ev) {
        const currentEdge = ev.item;
        // 拖拽过程中，点击会点击到新增的边上
        if (this.addingEdge && this.edge == currentEdge) {
            graph.removeItem(this.edge);
            this.edge = null;
            this.addingEdge = false;
        }
    },
});
export const data = {
    // 点集
    nodes: [
        {
            id: 'node1', // String，该节点存在则必须，节点的唯一标识
            x: 100, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
        },
        {
            id: 'node2', // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
            label: '节点2', // String，可选，该节点的文本标签
        },
    ],
    // 边集
    edges: [
        {
            source: 'node1', // String，必须，起始点 id
            target: 'node2', // String，必须，目标点 id
            label: '边1', // String，可选，边的文本标签
        },
    ],
};
const minimap = new G6.Minimap({
    size: [100, 100],
    className: 'minimap',
    type: 'delegate',
});

export let graph = null;
export const init = async (id) => {
    graph = new G6.Graph({
        container: id, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: 1000, // Number，必须，图的宽度
        height: 800, // Number，必须，图的高度
        // fitView: true,
        fitViewPadding: [20, 40, 50, 20],
        defaultEdge: {
            type: "quadratic-edge",
            style: {
                cursor: 'pointer',
                stroke: 'red',
                lineWidth: 1,
                lineAppendWidth: 8,
                startArrow: true,
                endArrow: false,
                opacity: 0.1,
            },
            labelCfg: {
                autoRotate: true,
            }
        },
        defaultNode: {
            type: "quadratic-node",
            labelCfg: {
                style: {
                    fill: 'red',
                },
                size: 30,
                style: {
                    fill: 'red',
                    stroke: '#666',
                    lineWidth: 1,
                },

            }
        },
        nodeStateStyles: {
            // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
            hover: {
                fill: 'lightsteelblue',
            },
            // 鼠标点击节点，即 click 状态为 true 时的样式
            click: {
                stroke: 'orange',
                lineWidth: 3,
            },
            selected: {
                stroke: 'green',
                lineWidth: 3,
                fill: 'red'
            }
        },
        edgeStateStyles: {
            // 鼠标点击边，即 click 状态为 true 时的样式
            click: {
                stroke: 'steelblue',
            },
        },

        layout: {
            // Object，可选，布局的方法及其配置项，默认为 random 布局。
            type: 'force', // 指定为力导向布局
            preventOverlap: true, // 防止节点重叠
            linkDistance: 200,
            nodeSize: 60        // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
        },
        animate: true,
        modes: {
            default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'click-select',
                {
                    type: 'tooltip', // 提示框
                    formatText(model) {
                        // 提示框文本内容
                        const text = 'label: ' + model.label + '<br/> class: ' + model.class;
                        return text;
                    },
                },
                {
                    type: 'edge-tooltip', // 边提示框
                    formatText(model) {
                        // 边提示框文本内容
                        const text =
                            'source: ' +
                            model.source +
                            '<br/> target: ' +
                            model.target +
                            '<br/> weight: ' +
                            model.weight;
                        return text;
                    },
                },
            ], // 允许拖拽画布、放缩画布、拖拽节点
            edit: [],
            addNode: ['click-add-node', 'click-select'],
            // 增加边交互模式
            addEdge: ['click-add-edge', 'click-select'],
        },
        plugins: [minimap],
    });
    graph.on('node:mouseenter', (e) => {
        const nodeItem = e.item; // 获取鼠标进入的节点元素对象
        graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
    });
    graph.on('node:mouseleave', (e) => {
        const nodeItem = e.item; // 获取鼠标离开的节点元素对象
        graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
    });
    graph.on('node:click', (e) => {
        // 先将所有当前是 click 状态的节点置为非 click 状态
        const clickNodes = graph.findAllByState('node', 'click');
        clickNodes.forEach((cn) => {
            graph.setItemState(cn, 'click', false);
        });
        const nodeItem = e.item; // 获取被点击的节点元素对象
        graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
    });
    graph.on('edge:click', (e) => {
        // 先将所有当前是 click 状态的边置为非 click 状态
        const clickEdges = graph.findAllByState('edge', 'click');
        clickEdges.forEach((ce) => {
            graph.setItemState(ce, 'click', false);
        });
        const edgeItem = e.item; // 获取被点击的边元素对象
        graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
    });
    const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json',
    );
    const data2 = await response.json();

    const nodes = data2.nodes;
    nodes.forEach((node) => {
        if (!node.style) {
            node.style = {};
        }
        switch (
        node.class // 根据节点数据中的 class 属性配置图形
        ) {
            case 'c0': {
                node.type = 'circle'; // class = 'c0' 时节点图形为 circle
                break;
            }
            case 'c1': {
                node.type = 'rect'; // class = 'c1' 时节点图形为 rect
                node.size = [35, 20]; // class = 'c1' 时节点大小
                break;
            }
            case 'c2': {
                node.type = 'ellipse'; // class = 'c2' 时节点图形为 ellipse
                node.size = [35, 20]; // class = 'c2' 时节点大小
                break;
            }
        }
    });
    const edges = data2.edges;
    edges.forEach((edge) => {
        if (!edge.style) {
            edge.style = {};
        }
        edge.style.lineWidth = edge.weight; // 边的粗细映射边数据中的 weight 属性数值
    });

    graph.data(data2); // 读取 Step 2 中的数据源
    graph.render(); // 渲染图

}

