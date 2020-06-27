var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
    }
`;

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`

function main() {
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        console.error('not support canvas!');
        return;
    }

    var gl = getWebGLContext(canvas);
    if (!gl) {
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return;
    }

    var n = initVertexBuffer(gl);
    if (n < 0) {
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    /**
     *  1.点 gl.POINTS
        2.线段 gl.LINES
        3.线条 gl.LINE_STRIP
        4.回路 gl.LINE_LOOP
        5.三角形 gl.TRIANGLES
        6.三角带 gl.TRIANGLE_STRIP：共享一条边，逆时针顺序绘制
        7.三角扇 gl.TRIANGLE_FAN： 共享一个顶点，前1个三角形最后一边和后1个点
     */
    gl.drawArrays(gl.LINE_LOOP, 0, n);
}

/** 初始化缓冲对象 */
function initVertexBuffer(gl) {
    var vetices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vetices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}