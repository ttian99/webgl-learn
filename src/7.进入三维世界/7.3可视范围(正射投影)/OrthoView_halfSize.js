var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjMatrix;
    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
        v_Color = a_Color;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;

function main() {
    var canvas = document.getElementById('webgl');
    if (!canvas) return;

    var gl = getWebGLContext(canvas);
    if (!gl) return;

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return;
    }

    var n = initVertexBuffer(gl);
    if (n < 0) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 正射投影矩阵
    var projMatrix = new Matrix4();
    // 原始值
    // projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
    // projMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, 0.0, 0.5);
    projMatrix.setOrtho(-0.3, 0.3, 1.0, 0.0, 0.0, 1.0);
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    // 视图矩阵
    var viewMatrix = new Matrix4();
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    document.onkeydown = function(ev) {
        keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
    }

    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function initVertexBuffer(gl) {
    var n = 9;
    var vertexArr = new Float32Array([
        // 绿色三角形 最后
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4, 
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4, 
        // 黄色三角形 中间
        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, 
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4, 
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4, 
        // 蓝色三角形 最前
        0.0, 0.5, 0.0, 0.4, 0.4, 1.0, 
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0, 
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4, 
    ]);
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArr, gl.STATIC_DRAW);

    var FSIZE = vertexArr.BYTES_PER_ELEMENT;

    // 坐标
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) return;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
    gl.enableVertexAttribArray(a_Position);

    // 颜色
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) return;
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
    gl.enableVertexAttribArray(a_Color);

    return n;
}


var eyeX = 0.20, eyeY = 0.25, eyeZ = 0.25;
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if (ev.keyCode == 39) { // 左
        eyeX -= 0.01;
    } else if (ev.keyCode == 37) { //右
        eyeX += 0.01;
    } else {
        return;
    }

    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
    viewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n); 
}