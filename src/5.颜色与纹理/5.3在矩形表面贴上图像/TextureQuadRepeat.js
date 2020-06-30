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
    uniform sampler2D u_Sampler;
    varying vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_texturePosition);
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
    // 修改纹理坐标: 重复出现图片
    var vetices = new Float32Array([
        -0.5, 0.5, -0.3, 1.7,
        -0.5, -0.5, -0.3, -0.2,
        0.5, 0.5, 1.7, 1.7,
        0.5, -0.5, 1.7, -0.2,
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
    var texture = gl.createTexture();
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (u_Sampler < 0) {
        return;
    }

    var image = new Image();
    image.onload = function() {
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    image.src = 'a1.jpg';
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    //反转Y轴
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //启用0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D
    //将0号纹理传递给着色器中的取样器变量
    gl.uniform1i(u_Sampler, 0);


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    /**
        6.三角带 gl.TRIANGLE_STRIP：共享一条边，逆时针顺序绘制
        7.三角扇 gl.TRIANGLE_FAN： 共享一个顶点，前1个三角形最后一边和后1个点
     */
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}