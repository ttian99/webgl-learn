var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_MvpMatrix;
    uniform vec3 u_LightColor;
    uniform vec3 u_LightDirection;
    attribute vec3 a_Normal;
    uniform vec3 u_AmbientLightColor;
    uniform mat4 u_NormalMatrix;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix) * (a_Normal));
        float NdotL = max(dot(normal, u_LightDirection), 0.0);
        vec3 diffuse = u_LightColor * vec3(a_Color) * NdotL;
        vec3 ambient = u_AmbientLightColor * vec3(a_Color);
        v_Color = vec4(diffuse + ambient, a_Color.a);
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

    // 计算模型矩阵
    var modelMatrix = new Matrix4();
    modelMatrix.setTranslate(0, 1, 0); //沿y轴平移
    modelMatrix.rotate(90, 0, 0, 1); //绕z轴旋转

    // 逆转矩阵
    var normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    // 计算模型视图投影矩阵
    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (u_MvpMatrix < 0) return;
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // 入射光线信息
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    // 环境光线
    var u_AmbientLightColor = gl.getUniformLocation(gl.program, 'u_AmbientLightColor');
    gl.uniform3f(u_AmbientLightColor, 0.2, 0.2, 0.2);

    // 清空背景
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 绘制立方体
    gl.drawElements(gl.TRIANGLES, n / 2, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffer(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    // 顶点坐标
    var vertexArr = new Float32Array([
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]);
    //顶点索引
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);
    // 颜色: 红色立方体
    var colorArr = new Float32Array([
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
    ]);

    // 法向量
    var normalArr = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    ]);

    initArrayBuffer(gl, vertexArr, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, colorArr, 3, gl.FLOAT, 'a_Color');
    initArrayBuffer(gl, normalArr, 3, gl.FLOAT, 'a_Normal');

    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) return;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.error('===> ' + attribute);
        return;
    }
    // var FSIZE = data.BYTES_PER_ELEMENTS;
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    return true;
}