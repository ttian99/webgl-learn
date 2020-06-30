var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        v_Color = a_Color;
    }
`;

// 首先：内插得到的颜色赋值给v_Color
// 然后：在片元着色器内再赋值给gl_FragColor
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;

function main() {
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log('no support canvas');
        return;
    }

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('get gl error');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('init shaders error');
        return;
    }

    var n = initVertexBuffer(gl);
    if (n < 0) {
        console.log('n is error');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


function initVertexBuffer(gl) {
    var n = 3;    

    var vertexArr = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0
    ]);

    // 缓冲对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('create vertex buffer error');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArr, gl.STATIC_DRAW);

    var FSIZE = vertexArr.BYTES_PER_ELEMENT;

    // 坐标
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('get Location of a_Position error');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 5 * FSIZE, 0 * FSIZE);
    gl.enableVertexAttribArray(a_Position);

    // 颜色
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('get Location of a_Color error');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(a_Color);

    return n;
}