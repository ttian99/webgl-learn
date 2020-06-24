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

    // 将顶点参数传给了
    gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0);

    // 指定清空<canvas>的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制1个点
    gl.drawArrays(gl.POINTS, 0, 1);
}