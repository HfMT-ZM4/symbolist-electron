
function matrixMultiply(a, b) {
    var result = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    var a11 = a[0];
    var a12 = a[1];
    var a13 = a[2];
    var a21 = a[3];
    var a22 = a[4];
    var a23 = a[5];
    var a31 = a[6];
    var a32 = a[7];
    var a33 = a[8];
    
    var b11 = b[0];
    var b12 = b[1];
    var b13 = b[2];
    var b21 = b[3];
    var b22 = b[4];
    var b23 = b[5];
    var b31 = b[6];
    var b32 = b[7];
    var b33 = b[8];

    result[0] = a11*b11 + a12*b21 + a13*b31;
    result[1] = a11*b12 + a12*b22 + a13*b32;
    result[2] = a11*b13 + a12*b23 + a13*b33;

    result[3] = a21*b11 + a22*b21 + a23*b31;
    result[4] = a21*b12 + a22*b22 + a23*b32;
    result[5] = a21*b13 + a22*b23 + a23*b33;
    
    result[6] = a31*b11 + a32*b21 + a33*b31;
    result[7] = a31*b12 + a32*b22 + a33*b32;
    result[8] = a31*b13 + a32*b23 + a33*b33;
    
    return result;
}

function matrixTranslate(m, x, y) {
    var n = [
        1, 0, x,
        0, 1, y,
        0, 0, 1
    ];
    
    return matrixMultiply(n, m);
}

function matrixRotate(m, theta) {
    var n = [
        Math.cos(theta), -Math.sin(theta), 0,
        Math.sin(theta), Math.cos(theta), 0,
        0, 0, 1
    ];
    
    return matrixMultiply(n, m);
}

