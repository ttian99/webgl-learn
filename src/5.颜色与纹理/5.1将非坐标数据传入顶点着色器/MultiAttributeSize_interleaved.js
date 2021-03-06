var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`;

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
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
    gl.drawArrays(gl.POINTS, 0, n);
}


function initVertexBuffer(gl) {
    var n = 3;    
    // 混合数据
    var vertexArr = new Float32Array([
        0.0, 0.5, 10.0,
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0
    ]);
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('create vertex buffer error');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArr, gl.STATIC_DRAW);
    
    // 获取数组中每个元素所占据的字节数
    var FSIZE = vertexArr.BYTES_PER_ELEMENT;

    // 赋值坐标数据
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('get Location of a_Position error');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 3 * FSIZE, 0 * FSIZE);
    gl.enableVertexAttribArray(a_Position);

    // 赋值size数据
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('get Location of a_PointSize error');
        return -1;
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 3 * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(a_PointSize);

    return n;
}