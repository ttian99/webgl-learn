// 顶点着色器（设置坐标、设置尺寸）
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;
// 片源着色器（设置颜色）
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;
// gl_FragColor = u_FragColor;

function main() {
    // 获取<canvas>元素
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        console.error('Failed to retrieve the <canvas> element');
        return;
    }

    // 获取webgl的绘图上下文
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering for WebGL');
        return;
    }

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.');
        return;
    }

    // 获取a_Position变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.error('Failed to get the storage location of a_Position');
        return;
    }
    // 获取片元颜色
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (u_FragColor < 0) {
        console.error('Failed to get the storage location of u_FragColor');
        return;
    }



    // 指定清空<canvas>的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 清楚canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 监听鼠标点击事件
    canvas.onmousedown = function(ev) {
        click(gl, ev, a_Position, u_FragColor);
    }

    // 将顶点参数传给了
    // gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0);


    // // 清空<canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // // 绘制1个点
    // gl.drawArrays(gl.POINTS, 0, 1);
}


/** 点击 */
var g_points = [];
var g_colors = [];
function click(gl, ev, a_Position, u_FragColor) {
    var x = ev.clientX; // 鼠标点击x坐标
    var y = ev.clientY; // 鼠标点击y坐标
    var rect = ev.target.getBoundingClientRect(); 
    // 变换坐标系
    x = (x - rect.left - rect.width / 2) / (rect.width / 2);
    y = (rect.height / 2 - (y - rect.top)) / (rect.height / 2);
    
    g_points.push([x, y]);

    // 设定颜色
    if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x >= 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 0.0, 1.0, 1.0]);
    } else {
        g_colors.push([0.5, 0.5, 0.5, 1.0]);
    }

    // 清楚canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var len = g_points.length;
    for (let i = 0; i < len; i++) {
        // 将点的位置传递到变量中a_Position
        gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0)
        // 将点的颜色传递到变量u_FragColor中
        gl.uniform4f(u_FragColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);
        //绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}