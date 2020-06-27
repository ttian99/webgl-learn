var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main() {
        gl_Position = u_xformMatrix * a_Position;
    }
`;
var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
`;
var scaleX = 0.1, scaleY = 0.2, scaleZ = 0.0;
function main() {
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log("get Canvas error");
        return;
    }

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('init shaders error');
        return;
    }

    var n = initVertexBuffer(gl);
    if (n < 0) {
        console.log('initVertexBuffer Error');
        return;
    }

    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    var xformMatrix = new Float32Array([
        scaleX, 0.0, 0.0, 0.0,
        0.0, scaleY, 0.0, 0.0,
        0.0, 0.0, scaleZ, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

// 初始化
function initVertexBuffer(gl) {
    var vBuffer = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    let n = 3;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vBuffer, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (!a_Position < 0) {
        console.log('get a_Position error');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}