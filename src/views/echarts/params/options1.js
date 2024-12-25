let option = {
    "color": [
        "#0090FF",
        "#36CE9E",
        "#FFC005",
        "#FF515A",
        "#8B5CFF",
        "#00CA69"
    ],
    "legend": {
        "right": 10,
        "top": 10
    },
    "tooltip": {
        "trigger": "axis",
        "extraCssText": "background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;",
        "axisPointer": {
            "type": "shadow",
            "shadowStyle": {
                "color": "#ffffff",
                "shadowColor": "rgba(225,225,225,1)",
                "shadowBlur": 5
            }
        }
    },
    "grid": {
        "top": 80,
        "left": 10,
        "bottom": 10,
        "right": 40,
        "containLabel": true
    },
    "xAxis": [
        {
            "type": "category",
            "boundaryGap": false,
            "axisLabel": {
                "formatter": "{value}月",
                "textStyle": {
                    "color": "#333"
                }
            },
            "axisLine": {
                "lineStyle": {
                    "color": "#D9D9D9"
                }
            },
            "data": [
                "2024-07",
                "2024-08",
                "2024-09",
                "2024-10",
                "2024-11",
                "2024-12"
            ]
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "axisLabel": {
                "textStyle": {
                    "color": "#666"
                }
            },
            "nameTextStyle": {
                "color": "#666",
                "fontSize": 12,
                "lineHeight": 40
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "type": "dashed",
                    "color": "#E9E9E9"
                }
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            }
        },
        {
            "type": "value",
            "axisLabel": {
                "textStyle": {
                    "color": "#666"
                }
            },
            "nameTextStyle": {
                "color": "#666",
                "fontSize": 12,
                "lineHeight": 40
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "type": "dashed",
                    "color": "#E9E9E9"
                }
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            }
        }
    ],
    "series": [
        {
            "color": "#0090FF",
            "name": "接入学校数",
            "yAxisIndex": 0,
            "type": "line",
            "smooth": true,
            "showSymbol": false,
            "zlevel": 3,
            "lineStyle": {
                "normal": {
                    "color": "#0090FF"
                }
            },
            "data": [
                "1",
                "1",
                "2",
                "0",
                "3",
                "2"
            ]
        },
        {
            "color": "#36CE9E",
            "name": "注册学生数",
            "yAxisIndex": 0,
            "type": "line",
            "smooth": true,
            "showSymbol": false,
            "zlevel": 3,
            "lineStyle": {
                "normal": {
                    "color": "#36CE9E"
                }
            },
            "data": [
                "0",
                "5",
                "9",
                "6",
                "29",
                "12"
            ]
        },
        {
            "color": "#FFC005",
            "name": "学生活跃数",
            "yAxisIndex": 1,
            "type": "line",
            "smooth": true,
            "showSymbol": false,
            "zlevel": 3,
            "lineStyle": {
                "normal": {
                    "color": "#FFC005"
                }
            },
            "data": [
                "0",
                "0",
                "0",
                "0",
                "36",
                "20"
            ]
        }
    ]
}

export default option