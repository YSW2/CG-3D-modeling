"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var bodyColor = [129/255, 209/255, 122/255, 1.0];
var eyeColor = [1.0, 1.0, 1.0, 1.0];
var lineColor = [0.2, 0.2, 0.2, 1.0];
var objectColor = [180/255, 180/255, 73/255, 1.0];

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];


var torsoId = 0;
var torso2Id = 15;
var neckId  = 1;
var neck2Id = 14;
var head1Id = 1;
var headId = 10;
var head2Id = 11;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 12;
var tail2Id = 13;
var eyeId = 16;
var leftmiddleLegId = 17;
var rightmiddleLegId = 18;
var mouthId = 19;
var mouth2Id = 20;
var objectId = 21;
var groundId = 100;

var torsoHeight = 0.8;
var torsoWidth = 4.5;
var torso2Height = 0.8;
var torso2Width = 2.9;
var upperArmHeight = 0.52;
var lowerArmHeight = 0.5;
var upperArmWidth  = 0.3;
var lowerArmWidth  = 0.28;
var upperLegWidth  = 0.35;
var lowerLegWidth  = 0.28;
var lowerLegHeight = 0.5;
var upperLegHeight = 0.6;
var middleLegHeight = 0.6;
var middleLegWidth = 0.34;
var headHeight = 1.3;
var headWidth = 2.6;
var neckHeight = 1.0;
var neckWidth = 1.4;
var neck2Height = 1.0;
var neck2Width = 2.3;
var tailHeight = 1.0;
var tailWidth = 0.9;
var tail2Height = 1.0;
var tail2Width = 0.5;
var eyeHeight = 0.4;
var eyeWidth = 0.4;
var mouthHeight = 0.5;
var mouthWidth = headWidth;
var mouth2Height = 0.25;
var mouth2Width = 1.0;
var torsoXWidth = 2.0;
var objectHeight = 1.0;
var objectWidth = 1.0;
var groundHeight = 6;
var groundWidth = 20;

var dinoNodes = 21;
var objectNodes = 1;
var numAngles = 11;
var angle = 0;

var theta = [95, 0, 90, 90, 90, 90, 180, -90, 180, -90, 0, 0, 0, 0, 0, 0, 180, 0, 0, 0, 0];
var torso_y = 0;
var torso_z = 10;
var movefront = 0;
var tailmove = 0;
var tail2move = 0;
var torsoJump = 0;

var numVertices = 24;

var jumpevent = false;
var stack = [];

var figure = [];
var intervalId;
var objectintervalId;

for( var i=0; i<dinoNodes; i++) figure[i] = createNode(null, null, null, null);

var colorLocation;

var vBuffer;
var modelViewLoc;
var test_x = 0;
var objectlock = true;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case groundId:

    m = translate(0, -5.2, 0);
    m = mult(m, rotate(torso_z, 1, 0, 0));
    figure[groundId] = createNode( m, ground, null, null);
    break;

    case objectId:
        
    m = translate(11, 0, 0);
    m = mult(m, translate(test_x, 0, 0));
    m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
    m = mult(m, rotate(torso_y, 1, 0, 0 ));
    m = mult(m, rotate(torso_z, 0, 0, 1 ));
    figure[objectId] = createNode( m, object, null, null );
    break;
    

    case torsoId:

    m = translate(-7, 0, 0);
    m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
    m = mult(m, rotate(torso_y, 1, 0, 0 ));
    m = mult(m, rotate(torso_z, 0, 0, 1 ));
    m = mult(m, translate(0.0, torsoJump, 0.0));
    figure[torsoId] = createNode( m, torso, null, torso2Id );
    break;

    case neckId:
    case head1Id:

    m = translate(0.0, neckHeight+0.5*neck2Height, 0.5*(neck2Width-neckWidth));
	m = mult(m, rotate(theta[neckId], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*neckHeight, 0.0));
    figure[neckId] = createNode( m, neck, null, leftUpperArmId);
    break;

    case neck2Id:

    m = translate(0.0, torsoHeight, 0.5*(torsoWidth-neck2Width));
	m = mult(m, rotate(theta[neck2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*neck2Height, 0.0));
    figure[neck2Id] = createNode( m, neck2, tailId, neckId);
    break;

    case headId:
        
    m = translate(0.0, 1.5*mouth2Height, 0.5*(headWidth-mouth2Width));
	m = mult(m, rotate(theta[headId], 1, 0, 0));
	m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, null, eyeId);

    case eyeId:

    m = translate(0.0, headHeight, -0.25*headWidth);
    m = mult(m, translate(0.0, -0.5*eyeHeight, 0.0));
    figure[eyeId] = createNode( m, eye, null, null);

    case mouthId:

    m = translate(0.0, mouthHeight + 0.5*neckHeight, 0.5*(mouthWidth-neckWidth));
    m = mult(m, translate(0.0, 0.5*mouthHeight, 0.0));
    figure[mouthId] = createNode( m, mouth, null, mouth2Id);

    case mouth2Id:

    m = translate(0.0, mouthHeight, -0.5*(mouthWidth-mouth2Width));
    m = mult(m, translate(0.0, 0.5*mouth2Height, 0.0));
    figure[mouth2Id] = createNode( m, mouth2, null, headId);
    
    case torso2Id:
        
    m = translate(0.0, torsoHeight, 0);
    m = rotate(theta[torso2Id], 0, 1, 0 );
    m = mult(m, translate(0.0, -torso2Height, 0.0));
    figure[torso2Id] = createNode( m, torso2, neck2Id, leftUpperLegId );
    break;

    case leftUpperArmId:

    m = translate(-0.3*neck2Width, 0, 1.4*upperArmHeight);
	m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m = translate(0.3*neck2Width, 0, 1.4*upperArmHeight);
	m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, mouthId, rightLowerArmId );
    break;

    case leftUpperLegId:

    m = translate(-(0.25+upperLegWidth), 0.1*upperLegHeight, 0.0);
	m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftmiddleLegId );
    break;

    case rightUpperLegId:

    m = translate(0.25+upperLegWidth, 0.1*upperLegHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightmiddleLegId );
    break;

    case leftmiddleLegId:

    m = translate(0, upperLegHeight, 0.0);
	m = mult(m, rotate(theta[leftmiddleLegId], 1, 0, 0));
    figure[leftmiddleLegId] = createNode( m, leftmiddleLeg, null, leftLowerLegId );
    break;

    case rightmiddleLegId:

    m = translate(0, upperLegHeight, 0.0);
	m = mult(m, rotate(theta[rightmiddleLegId], 1, 0, 0));
    figure[rightmiddleLegId] = createNode( m, rightmiddleLeg, null, rightLowerLegId );
    break;
    
    case leftLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:

    m = translate(0.0, middleLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:

    m = translate(0.0, middleLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    case tailId:

    m = translate(0.0, torsoHeight, -0.55*(torsoWidth-tailWidth));
    m = mult(m, rotate(theta[tailId], 0, 0, 1));
    m = mult(m, translate(tailmove, 0, 0))
    figure[tailId] = createNode( m, tail, null, tail2Id );
    break;

    case tail2Id:

    m = translate(0.0, tailHeight, -0.5*(tailWidth-tail2Width));
    m = mult(m, rotate(theta[tail2Id], 0, 0, 1));
    m = mult(m, translate(tail2move, 0, 0))
    figure[tail2Id] = createNode( m, tail2, null, null );
    break;

    }
}

function traverse(Id) {

    if (Id == null) return; // 만약 Id가 null이면 함수 종료
    stack.push(modelViewMatrix); // 스택에 modelViewMatrix를 push
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform); // modelViewMatrix를 현재 transform과 곱함
    figure[Id].render(); // figure[Id]를 렌더링
    if (figure[Id].child != null) traverse(figure[Id].child); // 만약 figure[Id]의 자식이 있다면 traverse 함수를 재귀호출
    modelViewMatrix = stack.pop(); // 스택에서 modelViewMatrix를 pop
    if (figure[Id].sibling != null) traverse(figure[Id].sibling); // 만약 figure[Id]의 형제가 있다면 traverse 함수를 재귀호출
}

function ground(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(groundWidth, groundHeight, 0.9*groundWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, objectColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}
function object(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(objectWidth, objectHeight, objectWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, objectColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoXWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function torso2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torso2Height, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(0.8*torsoXWidth, torso2Height, torso2Width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(torsoXWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function eye() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, eyeHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(1.01*torsoXWidth, eyeHeight, eyeWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, eyeColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function neck() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, neckHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(neckWidth, neckHeight, neckWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function neck2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, neck2Height, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(torsoXWidth, neck2Height, neck2Width) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function mouth() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, mouthHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(torsoXWidth-0.01, mouthHeight, mouthWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function mouth2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, mouth2Height, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(torsoXWidth-0.01, mouth2Height, mouth2Width) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function leftmiddleLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * middleLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(middleLegWidth, middleLegHeight, middleLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function rightmiddleLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * middleLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(middleLegWidth, middleLegHeight, middleLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function tail() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(0.6*torsoXWidth, tailHeight, tailWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function tail2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tail2Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tail2Width, tail2Height, tail2Width) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, lineColor);
        gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
    modelViewMatrix = mat4();

    const slider1 = document.getElementById('slider1');
      
    slider1.addEventListener('input', event => {
        theta[torsoId] = event.target.value;
        torso_z = event.target.value/18;
        initNodes(torsoId);
      });

    document.addEventListener("keydown", handleKeyDown);
    async function handleKeyDown(event) {
        if (event.key === "ArrowUp") {
            if(!jumpevent){
                jumpevent = true;
                var i = 0;
                while(true){
                    var jumpvalue = Math.sin(i);
                    if(jumpvalue < 0) {
                        theta[headId] = 0;
                        torsoJump = 0;

                        initNodes(headId);
                        initNodes(torsoId);
                        break;
                    }
                    theta[headId] = -jumpvalue*30;
                    theta[leftUpperArmId] = 90+jumpvalue*45;
                    theta[leftLowerArmId] = 90-jumpvalue*70;
                    theta[rightUpperArmId] = 90-jumpvalue*30;
                    theta[rightLowerArmId] = 90-jumpvalue*70;
                    torsoJump = jumpvalue*5;

                    initNodes(headId);
                    initNodes(torsoId);
                    initNodes(leftUpperArmId);
                    initNodes(rightUpperArmId);
                    initNodes(leftLowerArmId);
                    initNodes(rightLowerArmId);

                    await sleep(16);
                    i += 0.07;
                }
                jumpevent = false;
            }
        } else if (event.key === "ArrowDown") {
        } else if (event.key === "ArrowLeft") {
        } else if (event.key === "ArrowRight") {
        }
      }

    gl.useProgram(program);
    setGL(gl, program);

    for(i=0; i<dinoNodes; i++) initNodes(i);
    render1();

    initNodes(objectId);
    render2();

    initNodes(groundId);
    render3();

    resumeInterval();
    intervalId = setInterval(function() {
        var randomvalue = Math.random() * 10;
        if(randomvalue < 3 && objectlock) {
            objectlock = false;
            test_x = 0;
            moveObject();
        }
      }, 500);
}

function setGL(gl, program, i) {
    // 모델뷰 매트릭스와 프로젝션 매트릭스를 uniform 변수로 설정
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    // 모델뷰 매트릭스와 색상 변수를 가져옴
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
    colorLocation = gl.getUniformLocation(program, "u_color");
    // CULL_FACE와 DEPTH_TEST를 활성화
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // 큐브를 그림
    cube();

    // 버퍼 생성
    vBuffer = gl.createBuffer();

    // 버퍼를 ARRAY_BUFFER로 바인딩하고 데이터를 전송
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    // vPosition 변수를 가져옴
    var vPosition = gl.getAttribLocation(program, "vPosition");
    // vPosition 변수를 설정하고 활성화
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

var render1 = function() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    traverse(torsoId);
    requestAnimFrame(render1);
}

var render2 = function() {        
    traverse(objectId);
    requestAnimationFrame(render2);
}

var render3 = function() {
    traverse(groundId);
    requestAnimationFrame(render3);
}
async function scheduleRandomEvent() {
    const randomTime = Math.random() * 2000 + 1000; // 0과 5000 사이의 랜덤한 시간 설정 (단위: 밀리초)
    setTimeout(randomEvent, randomTime);
  }

  function resumeInterval() {
    intervalId = setInterval(function() {
        movefront += 0.2;
            var movefront_cos = Math.cos(movefront);
            var movefront_sin = Math.sin(movefront-0.2);

            theta[leftUpperLegId] = 180 + (movefront_cos*40);
            theta[rightUpperLegId] = 180 - movefront_cos*40;
            theta[leftmiddleLegId] = movefront_sin*45 + 45;
            theta[rightmiddleLegId] = -movefront_sin*45 + 45;
            theta[tailId] = movefront_cos*7;
            theta[tail2Id] = movefront_cos*10;
            tailmove = -movefront_cos*0.3;
            tail2move = -movefront_cos*0.4;

            initNodes(leftUpperLegId);
            initNodes(rightUpperLegId);
            initNodes(tailId);
            initNodes(tail2Id);
            initNodes(leftmiddleLegId);
            initNodes(rightmiddleLegId);
      }, 16);
  }

  function pauseInterval() {
    clearInterval(intervalId);
  }

  function moveObject(){
    objectintervalId = setInterval(function() {
        test_x -= 0.3;
        initNodes(objectId);
        if(test_x < -22) {
            test_x = 0; 
            objectlock = true;
            clearInterval(objectintervalId);
        }
    }, 16);
}

function randomEvent() {
    // 이벤트 발생시키는 로직 작성
    console.log("이벤트 발생!");
  }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  } 