var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform vec4 u_Translation;
    void main() {
        gl_Position = a_Position + u_Translation;
    }
`;
var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
`;

var Tx = 0.5, Ty = 0.5, Tz = 0;
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

    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    gl.uniform4f(u_Translation,Tx, Ty, Tz, 0.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
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
        return;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}
