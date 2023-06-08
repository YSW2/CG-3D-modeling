"use strict";

var modelViewMatrix; // 모델뷰 매트릭스
var projection

var modelViewMatrixLoc; // 모델뷰 매트릭스 위치
var projectionLoc

var fieldOfView = 45 // 시야각
var aspectRatio = 1; // 종횡비
var near = 0.1; // 가까운 평면
var far = 100.0; // 먼 평면
var eye = [0, 0, 2]
var at = [0, 0, 0]
var up = [0, 1, 0]

var lightPosition = vec4(2.0, 2.0, 2.0, 1.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.5, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;

var ambientProduct = mult(lightAmbient, materialAmbient);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);
var specularProduct = mult(lightSpecular, materialSpecular);

window.onload = function init()
{
    var canvas1 = document.getElementById( "gl-canvas1" ); // 캔버스1
    var canvas2 = document.getElementById( "gl-canvas2" ); // 캔버스2
    var canvas3 = document.getElementById( "gl-canvas3" ); // 캔버스3
    
    var gl1 = WebGLUtils.setupWebGL( canvas1 ); // WebGL1
    var gl2 = WebGLUtils.setupWebGL( canvas2 ); // WebGL2
    var gl3 = WebGLUtils.setupWebGL( canvas3 ); // WebGL3

    if ( !gl1 ) { alert( "WebGL isn't available" ); }

    var Y = [
        //Y뒷면
        vec3(-0.6,  0.8, 0),
        vec3( -0.2,  0, 0),
        vec3(-0.2,  0.8, 0),

        vec3(-0.2,  0.8, 0),
        vec3(-0.2,   0, 0),
        vec3(0, 0.4, 0),

        vec3(0, 0.4, 0),
        vec3(-0.2, 0, 0),
        vec3(-0.2, -0.8, 0),

        vec3(-0.2, -0.8, 0),
        vec3(0.2, -0.8, 0),
        vec3(0, 0.4, 0),

        vec3(0, 0.4, 0),
        vec3(0.2, -0.8, 0),
        vec3(0.2, 0, 0),

        vec3(0, 0.4, 0),
        vec3(0.2, 0, 0),
        vec3(0.2, 0.8, 0),

        vec3(0.2,  0.8, 0),
        vec3(0.2,  0, 0),
        vec3(0.6,  0.8, 0),

        //Y앞면
        vec3(-0.6,  0.8, 0.4),
        vec3( -0.2,  0, 0.4),
        vec3(-0.2,  0.8, 0.4),

        vec3(-0.2,  0.8, 0.4),
        vec3(-0.2,   0, 0.4),
        vec3(0, 0.4, 0.4),

        vec3(0, 0.4, 0.4),
        vec3(-0.2, 0, 0.4),
        vec3(-0.2, -0.8, 0.4),

        vec3(-0.2, -0.8, 0.4),
        vec3(0.2, -0.8, 0.4),
        vec3(0, 0.4, 0.4),

        vec3(0, 0.4, 0.4),
        vec3(0.2, -0.8, 0.4),
        vec3(0.2, 0, 0.4),

        vec3(0, 0.4, 0.4),
        vec3(0.2, 0, 0.4),
        vec3(0.2, 0.8, 0.4),

        vec3(0.2,  0.8, 0.4),
        vec3(0.2,  0, 0.4),
        vec3(0.6,  0.8, 0.4),

        //천장 네모1
        vec3(-0.2, 0.8, 0),
        vec3(-0.6, 0.8, 0.4),
        vec3(-0.2, 0.8, 0.4),
        
        vec3(-0.2, 0.8, 0),
        vec3(-0.6, 0.8, 0),
        vec3(-0.6, 0.8, 0.4),
        
        //바닥 네모
        vec3(-0.2, -0.8, 0.4),
        vec3(-0.2, -0.8, 0),
        vec3(0.2, -0.8, 0),
        
        vec3(-0.2, -0.8, 0.4),
        vec3(0.2, -0.8, 0),
        vec3(0.2, -0.8, 0.4),

        //천장 네모2
        vec3(0.2, 0.8, 0),
        vec3(0.2, 0.8, 0.4),
        vec3(0.6, 0.8, 0.4),
        
        vec3(0.2, 0.8, 0),
        vec3(0.6, 0.8, 0.4),
        vec3(0.6, 0.8, 0),

        //천장 네모3
        vec3(-0.2, 0.8, 0),
        vec3(-0.2, 0.8, 0.4),
        vec3(0, 0.4, 0),

        vec3(-0.2, 0.8, 0.4),
        vec3(0, 0.4, 0.4),
        vec3(0, 0.4, 0),

        //천장 네모4
        vec3(0.2, 0.8, 0),
        vec3(0, 0.4, 0),
        vec3(0.2, 0.8, 0.4),

        vec3(0.2, 0.8, 0.4),
        vec3(0, 0.4, 0),
        vec3(0, 0.4, 0.4),

        //왼쪽 네모1
        vec3(-0.6, 0.8, 0),
        vec3(-0.2, 0, 0.4),
        vec3(-0.6, 0.8, 0.4),

        vec3(-0.6, 0.8, 0),
        vec3(-0.2, 0, 0),
        vec3(-0.2, 0, 0.4),

        //왼쪽 네모2
        vec3(-0.2, 0, 0.4),
        vec3(-0.2, 0, 0),
        vec3(-0.2, -0.8, 0),

        vec3(-0.2, 0, 0.4),
        vec3(-0.2, -0.8, 0),
        vec3(-0.2, -0.8, 0.4),

        //오른쪽 네모1
        vec3(0.6, 0.8, 0),
        vec3(0.6, 0.8, 0.4),
        vec3(0.2, 0, 0.4),

        vec3(0.6, 0.8, 0),
        vec3(0.2, 0, 0.4),
        vec3(0.2, 0, 0),

        //오른쪽 네모2
        vec3(0.2, 0, 0.4),
        vec3(0.2, -0.8, 0),
        vec3(0.2, 0, 0),

        vec3(0.2, 0, 0.4),
        vec3(0.2, -0.8, 0.4),
        vec3(0.2, -0.8, 0),
    ];
    
    var S = [
        //S뒷면
        vec3(-0.6, -0.8, 0),
        vec3(0.2, -0.4, 0),
        vec3(-0.6, -0.4, 0),

        vec3(-0.6, -0.8, 0),
        vec3(0.2, -0.8, 0),
        vec3(0.2, -0.4, 0),

        vec3(0.2, -0.8, 0),
        vec3(0.6, -0.4, 0),
        vec3(0.2, -0.4, 0),

        vec3(0.6, -0.4, 0),
        vec3(0.2, -0.2, 0),
        vec3(0.2, -0.4, 0),

        vec3(0.6, -0.4, 0),
        vec3(0.6, 0.2, 0),
        vec3(0.2, -0.2, 0),

        vec3(0.6, 0.2, 0),
        vec3(-0.6, -0.2, 0),
        vec3(0.2, -0.2, 0),

        vec3(0.6, 0.2, 0),
        vec3(-0.2, 0.2, 0),
        vec3(-0.6, -0.2, 0),

        vec3(-0.2, 0.2, 0),
        vec3(-0.6, 0.4, 0),
        vec3(-0.6, -0.2, 0),

        vec3(-0.2, 0.2, 0),
        vec3(-0.2, 0.4, 0),
        vec3(-0.6, 0.4, 0),

        vec3(-0.2, 0.4, 0),
        vec3(-0.2, 0.8, 0),
        vec3(-0.6, 0.4, 0),

        vec3(-0.2, 0.8, 0),
        vec3(-0.2, 0.4, 0),
        vec3(0.6, 0.4, 0),

        vec3(-0.2, 0.8, 0),
        vec3(0.6, 0.4, 0),
        vec3(0.6, 0.8, 0),

        //S앞면
        vec3(-0.6, -0.8, 0.4),
        vec3(0.2, -0.4, 0.4),
        vec3(-0.6, -0.4, 0.4),

        vec3(-0.6, -0.8, 0.4),
        vec3(0.2, -0.8, 0.4),
        vec3(0.2, -0.4, 0.4),

        vec3(0.2, -0.8, 0.4),
        vec3(0.6, -0.4, 0.4),
        vec3(0.2, -0.4, 0.4),

        vec3(0.6, -0.4, 0.4),
        vec3(0.2, -0.2, 0.4),
        vec3(0.2, -0.4, 0.4),

        vec3(0.6, -0.4, 0.4),
        vec3(0.6, 0.2, 0.4),
        vec3(0.2, -0.2, 0.4),

        vec3(0.6, 0.2, 0.4),
        vec3(-0.6, -0.2, 0.4),
        vec3(0.2, -0.2, 0.4),

        vec3(0.6, 0.2, 0.4),
        vec3(-0.2, 0.2, 0.4),
        vec3(-0.6, -0.2, 0.4),

        vec3(-0.2, 0.2, 0.4),
        vec3(-0.6, 0.4, 0.4),
        vec3(-0.6, -0.2, 0.4),

        vec3(-0.2, 0.2, 0.4),
        vec3(-0.2, 0.4, 0.4),
        vec3(-0.6, 0.4, 0.4),

        vec3(-0.2, 0.4, 0.4),
        vec3(-0.2, 0.8, 0.4),
        vec3(-0.6, 0.4, 0.4),

        vec3(-0.2, 0.8, 0.4),
        vec3(-0.2, 0.4, 0.4),
        vec3(0.6, 0.4, 0.4),

        vec3(-0.2, 0.8, 0.4),
        vec3(0.6, 0.4, 0.4),
        vec3(0.6, 0.8, 0.4),

        //옆면
        vec3(-0.6, -0.8, 0),
        vec3(0.2, -0.8, 0.4),
        vec3(-0.6, -0.8, 0.4),
        
        vec3(-0.6, -0.8, 0),
        vec3(0.2, -0.8, 0),
        vec3(0.2, -0.8, 0.4),

        vec3(0.2, -0.8, 0.4),
        vec3(0.2, -0.8, 0),
        vec3(0.6, -0.4, 0),

        vec3(0.2, -0.8, 0.4),
        vec3(0.6, -0.4, 0),
        vec3(0.6, -0.4, 0.4),

        vec3(0.6, -0.4, 0.4),
        vec3(0.6, -0.4, 0),
        vec3(0.6, 0.2, 0),

        vec3(0.6, 0.2, 0.4),
        vec3(0.6, -0.4, 0.4),
        vec3(0.6, 0.2, 0),

        vec3(0.6, 0.2, 0.4),
        vec3(0.6, 0.2, 0),
        vec3(-0.2, 0.2, 0),

        vec3(0.6, 0.2, 0.4),
        vec3(-0.2, 0.2, 0),
        vec3(-0.2, 0.2, 0.4),

        vec3(-0.2, 0.2, 0),
        vec3(-0.2, 0.4, 0,4),
        vec3(-0.2, 0.2, 0.4),
        
        vec3(-0.2, 0.2, 0.4),
        vec3(-0.2, 0.4, 0),
        vec3(-0.2, 0.4, 0.4),

        vec3(-0.2, 0.4, 0),
        vec3(0.6, 0.4, 0.4),
        vec3(-0.2, 0.4, 0.4),
        
        vec3(-0.2, 0.4, 0),
        vec3(0.6, 0.4, 0),
        vec3(0.6, 0.4, 0.4),

        vec3(0.6, 0.4, 0),
        vec3(0.6, 0.8, 0),
        vec3(0.6, 0.4, 0.4),        

        vec3(0.6, 0.4, 0.4),
        vec3(0.6, 0.8, 0),
        vec3(0.6, 0.8, 0.4),

        vec3(0.6, 0.8, 0.4),
        vec3(0.6, 0.8, 0),
        vec3(-0.2, 0.8, 0),

        vec3(0.6, 0.8, 0.4),
        vec3(-0.2, 0.8, 0),
        vec3(-0.2, 0.8, 0.4),

        vec3(-0.2, 0.8, 0),
        vec3(-0.6, 0.4, 0.4),
        vec3(-0.2, 0.8, 0.4),

        vec3(-0.2, 0.8, 0),
        vec3(-0.6, 0.4, 0),
        vec3(-0.6, 0.4, 0.4),

        vec3(-0.6, 0.4, 0),
        vec3(-0.6, -0.2, 0.4),
        vec3(-0.6, 0.4, 0.4),

        vec3(-0.6, 0.4, 0),
        vec3(-0.6, -0.2, 0),
        vec3(-0.6, -0.2, 0.4),

        vec3(-0.6, -0.2, 0),
        vec3(0.2, -0.2, 0),
        vec3(-0.6, -0.2, 0.4),
        
        vec3(-0.6, -0.2, 0.4),
        vec3(0.2, -0.2, 0),
        vec3(0.2, -0.2, 0.4),

        vec3(0.2, -0.2, 0),
        vec3(0.2, -0.4, 0.4),
        vec3(0.2, -0.2, 0.4),
        
        vec3(0.2, -0.2, 0),
        vec3(0.2, -0.4, 0),
        vec3(0.2, -0.4, 0.4),

        vec3(0.2, -0.4, 0),
        vec3(-0.6, -0.4, 0.4),
        vec3(0.2, -0.4, 0.4),

        vec3(0.2, -0.4, 0),
        vec3(-0.6, -0.4, 0),
        vec3(-0.6, -0.4, 0.4),

        vec3(-0.6, -0.4, 0),
        vec3(-0.6, -0.8, 0),
        vec3(-0.6, -0.4, 0.4),
        
        vec3(-0.6, -0.8, 0),
        vec3(-0.6, -0.8, 0.4),
        vec3(-0.6, -0.4, 0.4),
        
    ];

    var W = [
        //W뒷면
        vec3(-0.7, 0.8, 0),
        vec3(-0.425, -0.8, 0),
        vec3(-0.4, 0.8, 0),
        
        vec3(-0.425, -0.8, 0),
        vec3(-0.275, 0.0, 0),
        vec3(-0.4, 0.8, 0),

        vec3(-0.275, 0.0, 0),
        vec3(-0.425, -0.8, 0),
        vec3(-0.125, -0.8, 0),

        vec3(-0.125, -0.8, 0),
        vec3(-0.15, 0.8, 0),
        vec3(-0.275, 0.0, 0),

        vec3(-0.15, 0.8, 0),
        vec3(-0.125, -0.8, 0),
        vec3(0, 0, 0),
        
        vec3(0, 0, 0),
        vec3(0.15, 0.8, 0),
        vec3(-0.15, 0.8, 0),
        
        vec3(0.15, 0.8, 0),
        vec3(0, 0, 0),
        vec3(0.125, -0.8, 0),

        vec3(0.125, -0.8, 0),
        vec3(0.275, 0.0, 0),
        vec3(0.15, 0.8, 0),

        vec3(0.125, -0.8, 0),
        vec3(0.425, -0.8, 0),
        vec3(0.275, 0.0, 0),

        vec3(0.275, 0.0, 0),
        vec3(0.425, -0.8, 0),
        vec3(0.4, 0.8, 0),

        vec3(0.4, 0.8, 0),
        vec3(0.425, -0.8, 0),
        vec3(0.7, 0.8, 0),

        //W앞면
        vec3(-0.7, 0.8, 0.4),
        vec3(-0.425, -0.8, 0.4),
        vec3(-0.4, 0.8, 0.4),
        
        vec3(-0.425, -0.8, 0.4),
        vec3(-0.275, 0.0, 0.4),
        vec3(-0.4, 0.8, 0.4),

        vec3(-0.275, 0.0, 0.4),
        vec3(-0.425, -0.8, 0.4),
        vec3(-0.125, -0.8, 0.4),

        vec3(-0.125, -0.8, 0.4),
        vec3(-0.15, 0.8, 0.4),
        vec3(-0.275, 0.0, 0.4),

        vec3(-0.15, 0.8, 0.4),
        vec3(-0.125, -0.8, 0.4),
        vec3(0, 0, 0.4),
        
        vec3(0, 0, 0.4),
        vec3(0.15, 0.8, 0.4),
        vec3(-0.15, 0.8, 0.4),
        
        vec3(0.15, 0.8, 0.4),
        vec3(0, 0, 0.4),
        vec3(0.125, -0.8, 0.4),

        vec3(0.125, -0.8, 0.4),
        vec3(0.275, 0.0, 0.4),
        vec3(0.15, 0.8, 0.4),

        vec3(0.125, -0.8, 0.4),
        vec3(0.425, -0.8, 0.4),
        vec3(0.275, 0.0, 0.4),

        vec3(0.275, 0.0, 0.4),
        vec3(0.425, -0.8, 0.4),
        vec3(0.4, 0.8, 0.4),

        vec3(0.4, 0.8, 0.4),
        vec3(0.425, -0.8, 0.4),
        vec3(0.7, 0.8, 0.4),

        //윗면
        vec3(-0.7, 0.8, 0),
        vec3(-0.7, 0.8, 0.4),
        vec3(-0.4, 0.8, 0),

        vec3(-0.4, 0.8, 0),
        vec3(-0.7, 0.8, 0.4),
        vec3(-0.4, 0.8, 0.4),
        
        vec3(-0.15, 0.8, 0),
        vec3(-0.15, 0.8, 0.4),
        vec3(0.15, 0.8, 0),
        
        vec3(0.15, 0.8, 0),
        vec3(-0.15, 0.8, 0.4),
        vec3(0.15, 0.8, 0.4),

        vec3(0.4, 0.8, 0),
        vec3(0.4, 0.8, 0.4),
        vec3(0.7, 0.8, 0),
        
        vec3(0.7, 0.8, 0.4),
        vec3(0.7, 0.8, 0),
        vec3(0.4, 0.8, 0.4),

        vec3(-0.4, 0.8, 0),
        vec3(-0.4, 0.8, 0.4),
        vec3(-0.275, 0, 0),

        vec3(-0.275, 0, 0),
        vec3(-0.4, 0.8, 0.4),
        vec3(-0.275, 0, 0.4),
        
        vec3(-0.15, 0.8, 0),
        vec3(-0.275, 0, 0),
        vec3(-0.15, 0.8, 0.4),

        vec3(-0.275, 0, 0),
        vec3(-0.275, 0, 0.4),
        vec3(-0.15, 0.8, 0.4),

        vec3(0.15, 0.8, 0),
        vec3(0.15, 0.8, 0.4),
        vec3(0.275, 0, 0),

        vec3(0.275, 0, 0),
        vec3(0.15, 0.8, 0.4),
        vec3(0.275, 0, 0.4),

        vec3(0.4, 0.8, 0),
        vec3(0.275, 0, 0),
        vec3(0.4, 0.8, 0.4),

        vec3(0.275, 0, 0),
        vec3(0.275, 0, 0.4),
        vec3(0.4, 0.8, 0.4),

        //밑면
        vec3(-0.425, -0.8, 0),
        vec3(-0.125, -0.8, 0),
        vec3(-0.425, -0.8, 0.4),

        vec3(-0.125, -0.8, 0.4),
        vec3(-0.425, -0.8, 0.4),
        vec3(-0.125, -0.8, 0),

        vec3(0.425, -0.8, 0),
        vec3(0.425, -0.8, 0.4),
        vec3(0.125, -0.8, 0),
        
        vec3(0.125, -0.8, 0.4),
        vec3(0.125, -0.8, 0),
        vec3(0.425, -0.8, 0.4),
        
        vec3(-0.125, -0.8, 0),
        vec3(0, 0, 0),
        vec3(-0.125, -0.8, 0.4),
        
        vec3(0, 0, 0),
        vec3(0, 0, 0.4),
        vec3(-0.125, -0.8, 0.4),

        vec3(0.125, -0.8, 0),
        vec3(0.125, -0.8, 0.4),
        vec3(0, 0, 0),
        
        vec3(0, 0, 0),
        vec3(0.125, -0.8, 0.4),
        vec3(0, 0, 0.4),

        //옆면
        vec3(-0.7, 0.8, 0),
        vec3(-0.425, -0.8, 0),
        vec3(-0.7, 0.8, 0.4),

        vec3(-0.425, -0.8, 0),
        vec3(-0.425, -0.8, 0.4),
        vec3(-0.7, 0.8, 0.4),

        vec3(0.7, 0.8, 0),
        vec3(0.7, 0.8, 0.4),
        vec3(0.425, -0.8, 0),

        vec3(0.425, -0.8, 0),
        vec3(0.7, 0.8, 0.4),
        vec3(0.425, -0.8, 0.4),
    ]

    var numY = Y.length; // 정점 개수
    var numS = S.length;
    var numW = W.length;

    //
    //  Configure WebGL
    //

    // Load the data into the GPU
    modelViewMatrix = mat4(); // 모델뷰 매트릭스 초기화
    projection = mat4();

    var newmodelViewMatrix = mat4();
    const program1 = setGL(gl1, canvas1, Y, modelViewMatrix); // WebGL1 초기화
    const program2 = setGL(gl2, canvas2, S, modelViewMatrix); // WebGL2 초기화
    const program3 = setGL(gl3, canvas3, W, modelViewMatrix); // WebGL2 초기화

    canvas1.addEventListener('mousemove', function(event) {
        var rect = canvas1.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;
        var x = (mouseX / canvas1.width) * 2 - 1;
        var y = (1 - mouseY / canvas1.height) * 2 - 1;
      
        var neweye = [4*x, 4*y, 2];
        newmodelViewMatrix = lookAt(neweye, at, up);
        selectGL(gl1, program1, newmodelViewMatrix);
        render(gl1, numY);
      });

      canvas2.addEventListener('mousemove', function(event) {
        var rect = canvas2.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;
        var x = (mouseX / canvas2.width) * 2 - 1;
        var y = (1 - mouseY / canvas2.height) * 2 - 1;
      
        var neweye = [4*x, 4*y, 2];
        newmodelViewMatrix = lookAt(neweye, at, up);
        selectGL(gl2, program2, newmodelViewMatrix);
        render(gl2, numS);
      });

      canvas3.addEventListener('mousemove', function(event) {
        var rect = canvas3.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;
        var x = (mouseX / canvas3.width) * 2 - 1;
        var y = (1 - mouseY / canvas3.height) * 2 - 1;
      
        var neweye = [4*x, 4*y, 2];
        newmodelViewMatrix = lookAt(neweye, at, up);
        selectGL(gl3, program3, newmodelViewMatrix);
        render(gl3, numW);
      });

    render(gl1, numY); // WebGL1 렌더링
    render(gl2, numS); // WebGL2 렌더링
    render(gl3, numW); // WebGL2 렌더링

    console.log(lookAt(eye, at, up));
    console.log(mult(translate(eye), rotateY(-90)));
};

function setGL(gl, canvas, vertices, modelViewMatrix){ // WebGL 초기화 함수

    canvas.width = 400; // 캔버스 너비
    canvas.height = 400; // 캔버스 높이
    gl.viewport( 0, 0, canvas.width, canvas.height ); // 뷰포트 설정
    gl.clearColor( 0.2, 0.2, 0.2, 1.0 ); // 배경색 설정
    
    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" ); // 셰이더 초기화
    var bufferId = gl.createBuffer(); // 버퍼 생성
    gl.useProgram(program);
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); // 버퍼 바인딩
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); // 버퍼 데이터 설정

    // Associate out shader variables with our data buffer

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix"); // 모델뷰 매트릭스 위치 설정
    projectionLoc = gl.getUniformLocation(program, "projection")

    modelViewMatrix = lookAt(eye, at, up)
    projection = perspective(fieldOfView, aspectRatio, near, far);
    
    var vPosition = gl.getAttribLocation( program, "vPosition" ); // 정점 위치 설정 
    var vNormal = gl.getAttribLocation(program, "vNormal");

    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 ); // 정점 위치 설정
    gl.enableVertexAttribArray( vPosition ); // 정점 위치 활성화
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix)); // 모델뷰 매트릭스 설정
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    return program;
}

function selectGL(gl, program, newmodelViewMatrix){
    gl.useProgram(program);
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionLoc = gl.getUniformLocation(program, "projection")

    gl.uniformMatrix4fv(projectionLoc, false, flatten(projection))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(newmodelViewMatrix));
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}

function render(gl, numvertices) { // 렌더링 함수
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 캔버스 초기화
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.drawArrays( gl.TRIANGLES, 0, numvertices); // 도형 그리기
}
