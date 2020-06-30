var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_texturePosition;
    varying vec2 v_texturePosition;
    void main() {
        gl_Position = a_Position;
        v_texturePosition= a_texturePosition;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    varying vec2 v_texturePosition;
    void main() {
        vec4 color0 = texture2D(u_Sampler0, v_texturePosition);
        vec4 color1 = texture2D(u_Sampler1, v_texturePosition);
        gl_FragColor = color0 * color1;
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

    // 配置纹理
    if (initTextures(gl, n)) {
        return;
    }

    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // /**
    //     6.三角带 gl.TRIANGLE_STRIP：共享一条边，逆时针顺序绘制
    //     7.三角扇 gl.TRIANGLE_FAN： 共享一个顶点，前1个三角形最后一边和后1个点
    //  */
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

/** 初始化缓冲对象 */
function initVertexBuffer(gl) {
    var vetices = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vetices, gl.STATIC_DRAW);
    var FSIZE = vetices.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        return -1;
    }
    var a_texturePosition = gl.getAttribLocation(gl.program, 'a_texturePosition');
    if (a_texturePosition < 0) {
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0 * FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_texturePosition, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(a_texturePosition);

    return n;
}

function initTextures(gl, n) {
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    var image0 = new Image();
    var image1 = new Image();
    image0.onload = function () {
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    }
    image0.src = 'a1.jpg';
    image1.onload = function () {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    }
    image1.src = 'a2.gif';
}

var g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, unitId) {
    //反转Y轴
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //启用0号纹理单元
    if (unitId == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }
    //绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D
    //将0号纹理传递给着色器中的取样器变量
    gl.uniform1i(u_Sampler, unitId);

    if (g_texUnit0 && g_texUnit1) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }

}