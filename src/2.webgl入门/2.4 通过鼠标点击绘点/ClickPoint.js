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
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

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

    // 指定清空<canvas>的颜色
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    // 清楚canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 监听鼠标点击事件
    canvas.onmousedown = function(ev) {
        click(gl, ev, a_Position);
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
function click(gl, ev, a_Position) {
    var x = ev.clientX; // 鼠标点击x坐标
    var y = ev.clientY; // 鼠标点击y坐标
    var rect = ev.target.getBoundingClientRect(); 
    // 变换坐标系
    x = (x - rect.left - rect.width / 2) / (rect.width / 2);
    y = (rect.height / 2 - (y - rect.top)) / (rect.height / 2);
    
    g_points.push(x); g_points.push(y);

    // 清楚canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var len = g_points.length;
    for (let i = 0; i < len; i+=2) {
        // 将点的位置传递到变量中a_Position
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0)
        //绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}