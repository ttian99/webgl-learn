var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ModelMatrix;
    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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

    // 创建模型矩阵
    var modelMatrix = new Matrix4();
    modelMatrix.setTranslate(0.75, 0, 0);
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (u_ModelMatrix < 0) return;
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // 创建视图矩阵
    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (u_ViewMatrix < 0) return;
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    // 创建投影
    var projMatrix = new Matrix4();
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1.0, 100);
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if (u_ProjMatrix < 0) return;
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    // 绘制右侧的一组三角形  
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);

    // 绘制左侧的一组三角形
    modelMatrix.setTranslate(-0.75, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
    var n = 9;
    var vertexArr = new Float32Array([
        // 绿色三角形 最后
        0.0, 1.0, -4.0, 0.4, 1.0, 0.4,
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, 0.4, 0.4,
        // 黄色三角形 中间
        0.0, 1.0, -2.0, 1.0, 1.0, 0.4,
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 0.4, 0.4,
        // 蓝色三角形 最前
        0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
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