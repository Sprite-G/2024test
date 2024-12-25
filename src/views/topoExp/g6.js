import G6 from '@antv/g6';

import defaultTopoImage from './topoImg/device.png';
import defaultTopoBeginImage from './topoImg/deviceBegin.png';
import defaultTopoEndImage from './topoImg/deviceEnd.png';

let graph = null;

let topoData = {};


export const topoUtils = {
    // 初始化
    init(id, obj, callback) {
        topoData = obj;
        const that = this;
        const element = document.getElementById(id);
        this.registerEdge();
        this.registerNodeDefault();
        graph = new G6.Graph({
            container: id,
            width: element.offsetWidth, // Number，必须，图的宽度
            height: element.offsetHeight, // Number，必须，图的高度
            fitView: true,
            fitCenter: true,
            linkCenter: true,
            modes: {
                // 默认模式下
                default: [
                    'click-select', 'zoom-canvas', 'drag-canvas', 'click-node',
                    {
                        type: 'tooltip',
                        formatText(model) {
                            return that.setNodeTip(model)
                        },
                        offset: 10,
                    },
                    {
                        type: 'edge-tooltip',
                        formatText(model) {
                            return that.setEdgeTip(model)
                        },
                        offset: 10,
                    },

                ],
                move: ['click-select', 'drag-node', 'zoom-canvas', 'drag-combo', 'drag-canvas'],
                edit: ['create-edge', 'zoom-canvas', 'drag-canvas'],
            },
            // layout: {
            //     type: 'circular',
            // },
            defaultEdge: {
                type: "quadratic-edge",
                style: {
                    cursor: 'pointer',
                    stroke: '#17e6bc',
                    lineWidth: 1,
                    lineAppendWidth: 8,
                    startArrow: true,
                    endArrow: false
                }
            },
            defaultNode: {
                type: "quadratic-node",
            },
        });
        graph.data({
            nodes: obj.nodes,
            edges: obj.edges
        });
        graph.render(); // 渲染图
        // 监听节点拖动事件
        graph.on('node:dragend', (e) => {
            let device = { ...e.item.getModel() };
            const data = obj.nodes.find(item => {
                return item.id === device.id;
            })
            data.x = device.x;
            data.y = device.y;
            console.log("data", obj.nodes)
        });
        graph.on('node:click', (e) => {
            const nodeItem = e.item // 获取被点击的节点元素对象
            const device = nodeItem.getModel();
            callback("node-click", device);

        })
    },
    // 自定义链路/可流动
    registerEdge() {
        const lineDash = [5, 5, 5, 5];
        const defaultConf = {
            style: {
                lineAppendWidth: 5,
                lineDash: [0, 0],
                lineDashOffset: 0,
                opacity: 1,
                labelCfg: {
                    style: {
                        fillOpacity: 1
                    }
                }
            },
            update: undefined,
            /**
             * 绘制边
             * @override
             * @param  {Object} cfg   边的配置项
             * @param  {G.Group} group 边的容器
             * @return {G.Shape} 图形
             */
            drawShape(cfg, group) {
                const item = group.get("item");
                let shape = null;
                // console.log("1111", cfg.flow)
                const shapeStyle = this.getShapeStyle(cfg, item);
                if (cfg.flow) {
                    const attr = Object.assign({
                        stroke: cfg.style.stroke || 'red',
                        lineAppendWidth: cfg.style.lineWidth || 5,
                        lineWidth: cfg.style.lineWidth || 1
                    }, shapeStyle)

                    shape = group.addShape('path', {
                        attrs: attr,
                        name: 'path-shape',
                    });

                } else {
                    shape = group.addShape("path", {
                        className: "edge-path",
                        attrs: shapeStyle
                    });
                }
                if (cfg.startIdent || cfg.endIdent) {
                    const circle = '#fc7f40';
                    const startPoint = cfg.startPoint; // 获取起点  
                    const endPoint = cfg.endPoint; // 获取终点

                    if (cfg.startIdent) {
                        let pointAtDistance = null;
                        // 获取链路上距离结束节点40px的点坐标
                        if (cfg.edgeOffset) {
                            const controlPoints = this.getControlPoints(cfg);
                            pointAtDistance = this.getBezierPointAtDistance(startPoint, controlPoints[0], endPoint, 40);
                        } else {
                            pointAtDistance = this.getPointAtDistance(startPoint, endPoint, 40)
                        }
                        group.addShape('circle', {
                            attrs: {
                                x: pointAtDistance.x,
                                y: pointAtDistance.y,
                                r: 3,
                                fill: circle,
                            },
                        });
                    }
                    if (cfg.endIdent) {
                        let pointAtDistance = null;
                        // 获取链路上距离结束节点40px的点坐标
                        if (cfg.edgeOffset) {
                            const controlPoints = this.getControlPoints(cfg);
                            pointAtDistance = this.getBezierPointAtDistance(endPoint, controlPoints[0], startPoint, 40);
                        } else {
                            pointAtDistance = this.getPointAtDistance(endPoint, startPoint, 40)
                        }
                        group.addShape('circle', {
                            attrs: {
                                x: pointAtDistance.x,
                                y: pointAtDistance.y,
                                r: 3,
                                fill: circle,
                            },
                        });
                    }
                }
                return shape;
            },
            // 计算二次贝塞尔曲线的点  
            getQuadraticBezierPoint(t, p0, p1, p2) {
                const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
                const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
                return { x, y };
            },

            // 计算贝塞尔曲线的长度  
            getBezierLength(startPoint, controlPoint, endPoint, segments = 100) {
                let length = 0;
                for (let i = 0; i < segments; i++) {
                    const t1 = i / segments;
                    const t2 = (i + 1) / segments;

                    const point1 = this.getQuadraticBezierPoint(t1, startPoint, controlPoint, endPoint);
                    const point2 = this.getQuadraticBezierPoint(t2, startPoint, controlPoint, endPoint);

                    const dx = point2.x - point1.x;
                    const dy = point2.y - point1.y;
                    length += Math.sqrt(dx * dx + dy * dy);
                }
                return length;
            },
            // 获取距离起始点指定距离的贝塞尔曲线点
            getBezierPointAtDistance(startPoint, controlPoint, endPoint, distance) {
                const totalLength = this.getBezierLength(startPoint, controlPoint, endPoint);
                if (distance > totalLength) {
                    throw new Error("Distance exceeds the length of the curve.");
                }

                let accumulatedLength = 0;
                let t = 0;

                const segments = 100;
                for (let i = 0; i < segments; i++) {
                    const t1 = i / segments;
                    const t2 = (i + 1) / segments;

                    const point1 = this.getQuadraticBezierPoint(t1, startPoint, controlPoint, endPoint);
                    const point2 = this.getQuadraticBezierPoint(t2, startPoint, controlPoint, endPoint);

                    const dx = point2.x - point1.x;
                    const dy = point2.y - point1.y;
                    const segmentLength = Math.sqrt(dx * dx + dy * dy);

                    if (accumulatedLength + segmentLength >= distance) {
                        const remainingDistance = distance - accumulatedLength;
                        t = t1 + (remainingDistance / segmentLength) * (t2 - t1);
                        break;
                    }

                    accumulatedLength += segmentLength;
                }
                return this.getQuadraticBezierPoint(t, startPoint, controlPoint, endPoint);
            },
            // 获取链路上距离起始节点一定距离的点坐标  
            getPointAtDistance(start, end, distance) {
                const totalDistance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
                // 处理距离超过总长度的情况  
                if (distance >= totalDistance) {
                    return end; // 如果距离大于或等于总长度，则返回终点  
                }
                const ratio = distance / totalDistance;
                return {
                    x: start.x + (end.x - start.x) * ratio,
                    y: start.y + (end.y - start.y) * ratio,
                };
            },
            drawLabel(cfg, group) {
                const labelCfg = cfg.labelCfg || {};
                const labelStyle = this.getLabelStyle(cfg, labelCfg, group);
                const text = group.addShape("text", {
                    attrs: {
                        ...labelStyle,
                        text: cfg.label,
                        fontSize: 12,
                        fill: "#404040",
                        cursor: "pointer"
                    },
                    className: "edge-label"
                });
                return text;
            },
            /**
             * 获取图形的配置项
             * @internal 仅在定义这一类节点使用，用户创建和更新节点
             * @param  {Object} cfg 节点的配置项
             * @return {Object} 图形的配置项
             */
            getShapeStyle(cfg, item) {
                const startPoint = cfg.reverse ? cfg.endPoint : cfg.startPoint;
                const endPoint = cfg.reverse ? cfg.startPoint : cfg.endPoint;
                // const { startPoint, endPoint } = cfg;
                const type = item.get("type");
                const defaultStyle = this.getStateStyle("default", true, item);
                if (type === "node") {
                    return Object.assign({}, cfg.style, defaultStyle);
                }
                const controlPoints = this.getControlPoints(cfg);
                let points = [startPoint]; // 添加起始点
                // 添加控制点
                if (controlPoints) {
                    points = points.concat(controlPoints);
                }
                // 添加结束点
                points.push(endPoint);
                const path = this.getPath(points, 1, cfg);

                const style = Object.assign({}, { path }, cfg.style, defaultStyle);
                return style;
            },
            getControlPoints(cfg) {
                let controlPoints = cfg.controlPoints; // 指定controlPoints
                if (!controlPoints || !controlPoints.length) {
                    const startPoint = cfg.reverse ? cfg.endPoint : cfg.startPoint;
                    const endPoint = cfg.reverse ? cfg.startPoint : cfg.endPoint;
                    const innerPoint = G6.Util.getControlPoint(
                        startPoint,
                        endPoint,
                        0.5,
                        cfg.edgeOffset || 0
                    );
                    controlPoints = [innerPoint];
                }
                return controlPoints;
            },

            /**
             * 获取三次贝塞尔曲线的path
             * @param {array} points 起始点和两个控制点
             * @returns
             */
            getPath(points, type, cfg) {
                const path = [];
                cfg.edgeOffset = cfg.edgeOffset || 0;
                path.push(["M", points[0].x, points[0].y]);
                path.push(["Q", points[1].x, points[1].y, points[2].x, points[2].y]);
                return path;
            },
            /**
             * 根据不同状态，获取不同状态下的样式值
             * @param {string} name
             * @param {string} value
             * @param {Item} item
             */
            getStateStyle(name, value, item) {
                const model = item.getModel();
                const { style = {} } = model;
                const defaultStyle = Object.assign({}, this.style, style);

                // 更新颜色
                return {
                    ...defaultStyle
                };
            },
            afterDraw(cfg, group) {
                if (!cfg.flow) return;
                const shape = group.get('children')[0];
                let index = 0;
                shape.animate(
                    () => {
                        index++;
                        if (index > 9) {
                            index = 0;
                        }
                        const res = {
                            lineDash,
                            lineDashOffset: -index,
                        };
                        return res;
                    },
                    {
                        repeat: true, // whether executes the animation repeatly
                        duration: 5000, // the duration for executing once
                    },
                );
            },
        };
        G6.registerEdge("quadratic-edge", defaultConf, "quadratic");
    },
    // 注册节点-服务
    registerNodeDefault() {
        const defaultConf = {
            draw(cfg, group) {
                let image = defaultTopoImage;
                if (cfg.isBegin) {
                    image = defaultTopoBeginImage;
                } else if (cfg.isEnd) {
                    image = defaultTopoEndImage;
                }
                const shape = group.addShape("image", {
                    attrs: {
                        x: 0,
                        y: 0,
                        width: 50,
                        height: 50,
                        img: image,
                        style: {
                            cursor: 'pointer',
                        }
                    }
                });
                if (cfg.name) {
                    // 添加文字
                    const name = group.addShape('text', {
                        // attrs: style
                        attrs: {
                            x: 25,
                            y: 65, // 调整y坐标使文字60图片下方
                            textAlign: 'center',
                            textBaseline: 'middle',
                            text: cfg.name,
                            fill: '#666',
                            position: "bottom",
                        },
                        name: `text-name`,
                    });
                    name.on('click', (ev) => {

                    })
                }
                return shape;
            },
            update: undefined,

        }
        G6.registerNode("quadratic-node", defaultConf);
    },
    // 下载图片
    downloadImage() {
        graph.downloadFullImage('设备拓扑图', 'image/png', {
            backgroundColor: '#fff', // 设置背景颜色
            padding: [30, 15, 15, 15],
        })
    },
    // label太长处理
    fittingString(str, maxWidth, fontSize) {
        let currentWidth = 0;
        let res = str;
        const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
        str.split('').forEach((letter, i) => {
            if (currentWidth > maxWidth) return;
            if (pattern.test(letter)) {
                // Chinese charactors
                currentWidth += fontSize;
            } else {
                // get the width of single letter according to the fontSize
                currentWidth += G6.Util.getLetterWidth(letter, fontSize);
            }
            if (currentWidth > maxWidth) {
                res = `${str.substr(0, i)}\n${str.substr(i)}`;
            }
        });
        return res;
    },
    // 更新
    updateItem(nodeType, obj) {
        graph.updateItem(nodeType, obj)
    },
    // 查找
    findById(id) {
        return graph.findById(id)
    },
    // 设置模式
    setMode(mode) {
        graph.setMode(mode);
    },
    // 设置node提示
    setNodeTip(node) {
        return `
        <div class="topo-tooltip">
            <div>设备名称：${node.devName || "-"}</div>
            <div>IP地址：${node.ip}</div>
        </div>`;
    },
    // 设置node提示
    setEdgeTip(value) {
        const sourceNode = topoData.nodes.find(item => {
            return item.id === value.source;
        })
        const targetNode = topoData.nodes.find(item => {
            return item.id === value.target;
        })
        return `<div class="topo-tooltip">
            <div><label>本端设备：</label>${sourceNode.devName || '-'}</div>
            <div><label>对端设备：</label>${targetNode.devName || '-'}</div>
            <div><label>丢包率：</label>${ '0%'}</div>
            <div><label>抖动：</label>${'0ms'}</div>
            <div><label>时延：</label>${value.latency || '3ms'}</div>
            </div>`;
    },
}