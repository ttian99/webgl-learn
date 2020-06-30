var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main() {
        gl_Position = u_xformMatrix * a_Position;
    }
`;
var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

var ANGLE = 100.0;
var ANGLE_STEP = 20;

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

    // 初始化Shader
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.');
        return;
    }

    var n = initVertexBuffer(gl);
    if (n < 0) {
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var xformMatrix = new Matrix4();
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

    let currentAngle = 0;
    var tick = function() {
        currentAngle = animate(currentAngle);
        draw(gl, currentAngle, n, xformMatrix, u_xformMatrix);
        requestAnimationFrame(tick);
    }
    tick();
}

function initVertexBuffer(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    let n = 3;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('a_Position error');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}

function draw(gl, currentAngle, n, xformMatrix, u_xformMatrix) {
    xformMatrix.setRotate(currentAngle, 0, 0, 1);
    xformMatrix.translate(0.35, 0, 0);
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

var g_last = Date.now();
function animate(angle) {
    var now = Date.now();
    var delTime = now - g_last;
    g_last = now;
    var newAngle = angle + (delTime * ANGLE_STEP) / 1000.0;
    return newAngle %= 360;
}