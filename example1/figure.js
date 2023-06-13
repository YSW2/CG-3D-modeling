"use strict";

var canvas;
var gl;
var program;

var dino1Stop;
var dino2Stop;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;

var modelViewMatrixLoc;
var useTextureLocation;

var bodyColor = [129/255, 209/255, 122/255, 1.0];
var eyeColor = [1.0, 1.0, 1.0, 1.0];
var lineColor = [0.0, 0.0, 0.0, 1.0];
var objectColor = [180/255, 180/255, 73/255, 1.0];
var mole_bodyColor = vec4( 0.49, 0.36, 0.22, 1.0);
var mole_lineColor = vec4( 0.0, 0.0, 0.0, 1.0);
var mole_grassColor = vec4( 0.3, 0.8, 0.2, 1.0 );
var bird_bodyColor = vec4( 0.85, 0.65, 0.125, 1.0);
var bird_lineColor = vec4( 0.0, 0.0, 0.0, 1.0);
var bird_beakColor = vec4( 0.9, 0.9, 0.3, 1.0 );
var bird_wingColor = vec4( 0.75, 0.55, 0.025, 1.0);

var texCoordsArray = [];
var texGroundArray = [];
var vTexCoord;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

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

var fovy = 60;
var aspect = 1;
var near = 0.1;
var far = 1000;
var c_eye = [-10, 6, 20];
var at = [1, 0, 0];
var up = [0, 1, 0]

var torsoId = 0;
var torso2Id = 15;
var neckId  = 1;
var neck2Id = 14;
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

var mole_head1Id = 21;
var mole_head2Id = 22;
var mole_head3Id = 23;
var mole_hand1Id = 24;
var mole_hand2Id = 25;
var mole_hand3Id = 26;
var mole_hand4Id = 27;
var mole_nail1Id = 28;
var mole_nail2Id = 29;
var mole_nail3Id = 30;
var mole_nail4Id = 31;
var mole_nail5Id = 32;
var mole_nail6Id = 33;
var mole_lWhisker1Id = 34;
var mole_lWhisker2Id = 35;
var mole_rWhisker1Id = 36;
var mole_rWhisker2Id = 37;
var mole_eye1Id = 38;
var mole_eye2Id = 39;
var mole_noseId = 40;
var mole_grassId = 41;

var bird_torsoId = 42;
var bird_head1Id = 43;
var bird_head2Id = 44;
var bird_head3Id = 45;
var bird_head4Id = 46;
var bird_leftWing1Id = 47;
var bird_leftWing2Id = 48;
var bird_leftWing3Id = 49;
var bird_leftWing4Id = 50;
var bird_rightWing1Id = 51;
var bird_rightWing2Id = 52;
var bird_rightWing3Id = 53;
var bird_rightWing4Id = 54;
var bird_body1Id = 55;
var bird_body2Id = 56;
var bird_beakId = 57;
var bird_eye1Id = 58;
var bird_eye2Id = 59;

var brachio_torsoId = 60;
var brachio_brachio_body1Id = 61;
var brachio_brachio_body2Id = 62;
var brachio_brachio_body3Id = 63;
var brachio_brachio_neck1Id = 64;
var brachio_brachio_neck2Id = 65;
var brachio_brachio_neck3Id = 66;
var brachio_brachio_neck4Id = 67;
var brachio_brachio_neck5Id = 68;
var brachio_brachio_head1Id = 69;
var brachio_brachio_head2Id = 70;
var brachio_brachio_brLeg1Id = 71;
var brachio_brachio_brLeg2Id = 72;
var brachio_brachio_brLeg3Id = 73;
var brachio_brachio_blLeg1Id = 74;
var brachio_brachio_blLeg2Id = 75;
var brachio_brachio_blLeg3Id = 76;
var brachio_brachio_frLeg1Id = 77;
var brachio_brachio_frLeg2Id = 78;
var brachio_brachio_frLeg3Id = 79;
var brachio_brachio_flLeg1Id = 80;
var brachio_brachio_flLeg2Id = 81;
var brachio_brachio_flLeg3Id = 82;
var brachio_brachio_tail1Id = 83;
var brachio_brachio_tail2Id = 84;
var brachio_brachio_tail3Id = 85;
var brachio_brachio_tail4Id = 86;
var brachio_brachio_tail5Id = 87;
var brachio_brachio_tail6Id = 88;
var brachio_tail7Id = 89;
var brachio_brachio_tail8Id = 90;
var brachio_brachio_tail9Id = 91;
var brachio_brachio_tail10Id = 92;
var brachio_brachio_tail11Id = 93;
var brachio_brachio_tail12Id = 94;
var brachio_brachio_tail13Id = 95;
var brachio_brachio_tail14Id = 96;
var brachio_brachio_tail15Id = 97;

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
var neck2Width = 2.9;
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
var groundWidth = 30;

var head1X = 2.0;
var head1Y = 1.5;
var head1Z = 2.0;
var head2X = 1.5;
var head2Y = 0.5;
var head2Z = 1.5;
var head3X = 0.5;
var head3Y = 0.25;
var head3Z = 0.5;
var hand1X = 0.25;
var hand1Y = 0.25;
var hand1Z = 0.75;
var hand2X = 0.5;
var hand2Y = 0.5;
var hand2Z = 0.75;
var nailX = 0.1;
var nailY = 0.125;
var nailZ = 0.125;
var whiskerX = 0.1;
var whiskerY = 0.025;
var whiskerZ = 0.75;
var eyeX = 0.1;
var eyeY = 0.25;
var eyeZ = 0.25;
var noseX = 0.1;
var noseY = 0.25;
var noseZ = 0.5;
var grassX = 2.25;
var grassY = 1.5;
var grassZ = 3.0;

var bird_torsoX = 3.0;
var bird_torsoY = 0.5;
var bird_torsoZ = 4.0;
var bird_head1X = 1.8;
var bird_head1Y = 0.5;
var bird_head1Z = 2.3;
var bird_head2X = 1.5;
var bird_head2Y = 0.4;
var bird_head2Z = 1.8;
var bird_head3X = 1.3;
var bird_head3Y = 0.3;
var bird_head3Z = 1.3;
var bird_head4X = 1.2;
var bird_head4Y = 0.3;
var bird_head4Z = 1.0;
var bird_beakX = 0.5;
var bird_beakY = 0.3;
var bird_beakZ = 0.5;
var bird_wing1X = 1.5; 
var bird_wing1Y = 0.35;
var bird_wing1Z = 2.0;
var bird_wing2X = 1.0; 
var bird_wing2Y = 0.3;
var bird_wing2Z = 1.0;
var bird_wing3X = 0.8; 
var bird_wing3Y = 0.3;
var bird_wing3Z = 0.8;
var bird_wing4X = 0.5; 
var bird_wing4Y = 0.3;
var bird_wing4Z = 0.5;
var bird_body1X = 3.0;
var bird_body1Y = 0.6;
var bird_body1Z = 4.0;
var bird_body2X = 3.0;
var bird_body2Y = 0.5;
var bird_body2Z = 2.0;
var bird_eyeX = 0.05;
var bird_eyeY = 0.1;
var bird_eyeZ = 0.1;

var brachio_torsoX = 4.0*0.6;
var brachio_torsoY = 1.0*0.6;
var brachio_torsoZ = 6.5*0.6;
var brachio_brachio_body1X = 3.5*0.6;
var brachio_brachio_body1Y = 1.0*0.6;
var brachio_brachio_body1Z = 6.0*0.6;
var brachio_brachio_body2X = 3.5*0.6;
var brachio_brachio_body2Y = 1.0*0.6;
var brachio_brachio_body2Z = 5.5*0.6;
var brachio_brachio_body3X = 3.0*0.6;
var brachio_brachio_body3Y = 1.0*0.6;
var brachio_brachio_body3Z = 4.0*0.6;
var brachio_neckX = 1.0*0.6;
var brachio_neckY = 1.0*0.6;
var brachio_neckZ = 1.0*0.6;
var brachio_brachio_head1X = 1.0*0.6;
var brachio_brachio_head1Y = 1.0*0.6;
var brachio_brachio_head1Z = 2.5*0.6;
var brachio_brachio_head2X = 0.7*0.6;
var brachio_brachio_head2Y = 0.3*0.6;
var brachio_brachio_head2Z = 1.0*0.6;
var brachio_brachio_tail1X = 1.0*0.6;
var brachio_brachio_tail1Y = 1.0*0.6;
var brachio_brachio_tail1Z = 1.0*0.6;
var brachio_brachio_tail2X = 1.0*0.6;
var brachio_brachio_tail2Y = 1.0*0.6;
var brachio_brachio_tail2Z = 0.7*0.6;
var brachio_brachio_tail3X = 0.7*0.6;
var brachio_brachio_tail3Y = 0.7*0.6;
var brachio_brachio_tail3Z = 0.4*0.6;
var brachio_brachio_tail4X = 0.5*0.6;
var brachio_brachio_tail4Y = 0.5*0.6;
var brachio_brachio_tail4Z = 0.38*0.6;
var brachio_brachio_tail5X = 0.5*0.6;
var brachio_brachio_tail5Y = 0.2*0.6;
var brachio_brachio_tail5Z = 0.2*0.6;

var brachio_leg1X = 0.7*0.6;
var brachio_leg1Y = 1.0*0.6;
var brachio_leg1Z = 0.7*0.6;
var brachio_leg3X = 0.7*0.6;
var brachio_leg3Y = 0.5*0.6;
var brachio_leg3Z = 1.5*0.6;

var dinoNodes = 21;
var moleNodes = 21;
var birdNodes = 18;
var brachioNodes = 38;
var objectNodes = 1;
var numAngles = 11;
var angle = 0;
var dg = 0.1;

var theta = [90, 0, 90, 90, 90, 90, 180, -90, 180, -90, 0, 0, 0, 0, 0, 0, 180, 0, 0, 0, 0,//dino
            90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,//mole
            -90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,//bird
            -90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//brachio

var torso_y = 0;
var torso_z = 0;
var mole_x = -50;
var mole_y = 0;
var mole_z = 0;
var bird_x = -50;
var movefront = 0;
var tailmove = 0;
var tail2move = 0;
var torsoJump = 0;
var torsoSit = 0;

var numVertices = 24;

var jumpevent = false;
var brachio_jumpevent = false;
var brachio_torsoSit = 0;
var brachio_torsoJump = 0;

var stack = [];

var figure = [];
var intervalId;
var objectintervalId;

for( var i=0; i<dinoNodes+moleNodes+birdNodes+brachioNodes; i++) figure[i] = createNode(null, null, null, null);

var colorLocation;

var vBuffer;
var modelViewLoc;
var molelock = true;
var birdlock = true;

var pointsArray = [];
var texture1;
var texture2;
var stopRendering = false;
var dinoNum = 0;

var speed = 0.0033; // 스크롤 속도
var offset = 0.0; // 초기 오프셋

var dinoTexture = new Image();
dinoTexture.crossOrigin = "anonymous";
dinoTexture.src = "https://upload.wikimedia.org/wikipedia/commons/0/0c/Development_test_%28Minetest%29_texture_default_grass.png";
dinoTexture.height = 256;
dinoTexture.width = 256;

var brachioTexture = new Image();
brachioTexture.crossOrigin = "anonymous";
brachioTexture.src = "https://static.turbosquid.com/Preview/2014/08/01__12_04_02/dino256.jpg1DF84D8F-C361-4320-812A266C013E0539.jpgDefaultHQ.jpg"

var groundTexture = new Image();
groundTexture.crossOrigin = "anonymous";
groundTexture.src = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2eac4383-7de0-4ada-a0bd-97d553dafec0/d55kqg8-6742f495-c00e-4564-a885-fc133907bfd5.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJlYWM0MzgzLTdkZTAtNGFkYS1hMGJkLTk3ZDU1M2RhZmVjMFwvZDU1a3FnOC02NzQyZjQ5NS1jMDBlLTQ1NjQtYTg4NS1mYzEzMzkwN2JmZDUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.J_M7x96_JN2k2QTOqJaBCbYEr6rSLyBBp3rIcBHVYT8";
groundTexture.height = 256;
groundTexture.width = 256;

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
    figure[groundId] = createNode( m, ground, null, null);
    break;

    case brachio_torsoId:
    m = translate(-6, 0.5, 0);
      m = mult(m, rotate(theta[brachio_torsoId], 0, 1, 0));
      m = mult(m, translate(0.0, brachio_torsoJump, 0.0));
      figure[brachio_torsoId] = createNode(m, brachio_torso, null, brachio_brachio_body1Id);
      break;
    case brachio_brachio_body1Id:
      m = translate(0.0, (0.5*brachio_torsoY+0.5*brachio_brachio_body1Y), 0.0);
      //m = mult(m, rotate(theta[brachio_brachio_body1Id], 1, 0, 0));
      //m = mult(m, rotate(-brachio_torsoSit*15, 1, 0, 0));
      //m = mult(m, translate(0.0, -0.2*brachio_torsoSit, 0.3*brachio_torsoSit));
      figure[brachio_brachio_body1Id] = createNode(m, brachio_body1, brachio_brachio_body2Id, brachio_brachio_body3Id);
      break;
    case brachio_brachio_body3Id:
      m = translate(0.0, (0.5*brachio_brachio_body1Y+0.5*brachio_brachio_body3Y), -(0.25));
      m = mult(m, rotate(theta[brachio_brachio_body3Id], 1, 0, 0));
      figure[brachio_brachio_body3Id] = createNode(m, brachio_body3, brachio_brachio_tail1Id, brachio_brachio_neck1Id);
      break;
    case brachio_brachio_neck1Id:
      m = translate(0.0, 0.0, -(0.5*brachio_brachio_body3Z+0.5*brachio_neckZ));
      m = mult(m, rotate(theta[brachio_brachio_neck1Id], 0, 1, 0));
      m = mult(m, rotate(-brachio_torsoSit*5, 1, 0, 0));
      m = mult(m, translate(0.0, -0.2*brachio_torsoSit, -0.3*brachio_torsoSit));
      figure[brachio_brachio_neck1Id] = createNode(m, brachio_neck1, null, brachio_brachio_neck2Id);
      break;
    case brachio_brachio_neck2Id:
      m = translate(0.0, (0.5*brachio_neckY+0.5*brachio_neckY), 0.0);
      m = mult(m, rotate(theta[brachio_brachio_neck2Id], 0, 1, 0));m = mult(m, rotate(-brachio_torsoSit*5, 1, 0, 0));
      m = mult(m, rotate(-brachio_torsoSit*5, 1, 0, 0));
      m = mult(m, translate(0.0, -0.2*brachio_torsoSit, -0.3*brachio_torsoSit));
      figure[brachio_brachio_neck2Id] = createNode(m, brachio_neck2, null, brachio_brachio_neck3Id);
      break;
    case brachio_brachio_neck3Id:
      m = translate(0.0, (0.5*brachio_neckY+0.5*brachio_neckY), -(0.5*brachio_neckZ));
      m = mult(m, rotate(theta[brachio_brachio_neck3Id], 0, 1, 0));
      m = mult(m, rotate(-brachio_torsoSit*5, 1, 0, 0));
      m = mult(m, translate(0.0, -0.2*brachio_torsoSit, -0.3*brachio_torsoSit));
      figure[brachio_brachio_neck3Id] = createNode(m, brachio_neck3, null, brachio_brachio_neck4Id);
      break;
    case brachio_brachio_neck4Id:
      m = translate(0.0, (0.5*brachio_neckY+0.5*brachio_neckY), -(0.5*brachio_neckZ));
      m = mult(m, rotate(theta[brachio_brachio_neck4Id], 0, 1, 0));
      m = mult(m, rotate(-brachio_torsoSit*5, 1, 0, 0));
      m = mult(m, translate(0.0, -0.2*brachio_torsoSit, -0.3*brachio_torsoSit));
      figure[brachio_brachio_neck4Id] = createNode(m, brachio_neck4, null, brachio_brachio_neck5Id);
      break;
    case brachio_brachio_neck5Id:
      m = translate(0.0, (0.5*brachio_neckY+0.5*brachio_neckY), -(0.5*brachio_neckZ));
      m = mult(m, rotate(theta[brachio_brachio_neck5Id], 0, 1, 0));
      m = mult(m, rotate(-brachio_torsoSit*5, 1, 0, 0));
      m = mult(m, translate(0.0, -0.2*brachio_torsoSit, -0.3*brachio_torsoSit));
      figure[brachio_brachio_neck5Id] = createNode(m, brachio_neck5, null, brachio_brachio_head1Id);
      break;
    case brachio_brachio_head1Id:
      m = translate(0.0, (0.5*brachio_neckY+0.5*brachio_brachio_head1Y), -(0.25*brachio_brachio_head1Z));
      m = mult(m, rotate(theta[brachio_brachio_head1Id], 0, 1, 0));
      m = mult(m, rotate(-brachio_torsoSit*8, 1, 0, 0));
      m = mult(m, translate(0.0, -0.2*brachio_torsoSit, -0.1*brachio_torsoSit));
      figure[brachio_brachio_head1Id] = createNode(m, brachio_head1, null, brachio_brachio_head2Id);
      break;
    case brachio_brachio_head2Id:
      m = translate(0.0, (0.5*brachio_brachio_head1Y+0.5*brachio_brachio_head2Y), 0.0);
      m = mult(m, rotate(theta[brachio_brachio_head2Id], 1, 0, 0));
      figure[brachio_brachio_head2Id] = createNode(m, brachio_head2, null, null);
      break;
    case brachio_brachio_body2Id:
      m = translate(0.0, -(0.5*brachio_torsoY+0.5*brachio_brachio_body2Y), 0.0);
      m = mult(m, rotate(theta[brachio_brachio_body2Id], 1, 0, 0));
      figure[brachio_brachio_body2Id] = createNode(m, brachio_body2, null, brachio_brachio_brLeg1Id);
      break;
    case brachio_brachio_brLeg1Id:
      m = translate(-(1.5*brachio_leg1X), -(0.5*brachio_brachio_body2Y+0.5*brachio_leg1Y), 2.5*brachio_leg1Z);
      m = mult(m, rotate(theta[brachio_brachio_brLeg1Id], 1, 0, 0));
      figure[brachio_brachio_brLeg1Id] = createNode(m, brachio_brLeg1, brachio_brachio_blLeg1Id, brachio_brachio_brLeg2Id);
      break;
    case brachio_brachio_brLeg2Id:
      m = translate(0.0, -(0.5*brachio_leg1Y+0.5*brachio_leg1Y), 0.0);
      m = mult(m, rotate(theta[brachio_brachio_brLeg2Id], 1, 0, 0));
      figure[brachio_brachio_brLeg2Id] = createNode(m, brachio_brLeg2, null, brachio_brachio_brLeg3Id);
      break;
    case brachio_brachio_brLeg3Id:
      m = translate(0.0, -(0.5*brachio_leg1Y+0.5*brachio_leg3Y), -(0.25*brachio_leg3Z));
      m = mult(m, rotate(theta[brachio_brachio_brLeg3Id], 1, 0, 0));
      figure[brachio_brachio_brLeg3Id] = createNode(m, brachio_brLeg3, null, null);
      break;
    case brachio_brachio_blLeg1Id:
      m = translate((1.5*brachio_leg1X), -(0.5*brachio_brachio_body2Y+0.5*brachio_leg1Y), 2.5*brachio_leg1Z);
      m = mult(m, rotate(theta[brachio_brachio_blLeg1Id], 1, 0, 0));
      figure[brachio_brachio_blLeg1Id] = createNode(m, brachio_blLeg1, brachio_brachio_frLeg1Id, brachio_brachio_blLeg2Id);
      break;
    case brachio_brachio_blLeg2Id:
      m = translate(0.0, -(0.5*brachio_leg1Y+0.5*brachio_leg1Y), 0.0);
      m = mult(m, rotate(theta[brachio_brachio_blLeg2Id], 1, 0, 0));
      figure[brachio_brachio_blLeg2Id] = createNode(m, brachio_blLeg2, null, brachio_brachio_blLeg3Id);
      break;
    case brachio_brachio_blLeg3Id:
      m = translate(0.0, -(0.5*brachio_leg1Y+0.5*brachio_leg3Y), -(0.25*brachio_leg3Z));
      m = mult(m, rotate(theta[brachio_brachio_blLeg3Id], 1, 0, 0));
      figure[brachio_brachio_blLeg3Id] = createNode(m, brachio_blLeg3, null, null);
      break;
    case brachio_brachio_frLeg1Id:
      m = translate(-(1.5*brachio_leg1X), -(0.5*brachio_brachio_body2Y+0.5*brachio_leg1Y), -(2.5*brachio_leg1Z));
      m = mult(m, rotate(theta[brachio_brachio_frLeg1Id], 1, 0, 0));
      figure[brachio_brachio_frLeg1Id] = createNode(m, brachio_frLeg1, brachio_brachio_flLeg1Id, brachio_brachio_frLeg2Id);
      break;
    case brachio_brachio_frLeg2Id:
      m = translate(0.0, -(0.5*brachio_leg1Y+0.5*brachio_leg1Y), 0.0);
      m = mult(m, rotate(theta[brachio_brachio_frLeg2Id], 1, 0, 0));
      figure[brachio_brachio_frLeg2Id] = createNode(m, brachio_frLeg2, null, brachio_brachio_frLeg3Id);
      break;
    case brachio_brachio_frLeg3Id:
      m = translate(0.0, -(0.5*brachio_leg1Y+0.5*brachio_leg3Y), -(0.25*brachio_leg3Z));
      m = mult(m, rotate(theta[brachio_brachio_frLeg3Id], 1, 0, 0));
      figure[brachio_brachio_frLeg3Id] = createNode(m, brachio_frLeg3, null, null);
      break;
    case brachio_brachio_flLeg1Id:
      m = translate((1.5*brachio_leg1X), -(0.5*brachio_brachio_body2Y+0.5*brachio_leg1Y), -(2.5*brachio_leg1Z));
      m = mult(m, rotate(theta[brachio_brachio_flLeg1Id], 1, 0, 0));
      figure[brachio_brachio_flLeg1Id] = createNode(m, brachio_flLeg1, null, brachio_brachio_flLeg2Id);
      break;
    case brachio_brachio_flLeg2Id:
      m = translate(0.0, -(0.5*brachio_leg1Y+0.5*brachio_leg1Y), 0.0);
      m = mult(m, rotate(theta[brachio_brachio_flLeg2Id], 1, 0, 0));
      figure[brachio_brachio_flLeg2Id] = createNode(m, brachio_flLeg2, null, brachio_brachio_flLeg3Id);
      break;
    case brachio_brachio_flLeg3Id:
      m = translate(0.0, -(0.5*brachio_leg1Y+0.5*brachio_leg3Y), -(0.25*brachio_leg3Z));
      m = mult(m, rotate(theta[brachio_brachio_flLeg3Id], 1, 0, 0));
      figure[brachio_brachio_flLeg3Id] = createNode(m, brachio_flLeg3, null, null);
      break;
    case brachio_brachio_tail1Id:
      m = translate(0.0, 0.0, (0.5*brachio_brachio_body1Z+0.5*brachio_brachio_tail1Z));
      m = mult(m, rotate(theta[brachio_brachio_tail1Id], 0, 1, 0));
      figure[brachio_brachio_tail1Id] = createNode(m, brachio_tail1, null, brachio_brachio_tail2Id);
      break;
    case brachio_brachio_tail2Id:
      m = translate(0.0, -(0.2*brachio_brachio_tail2Y), (0.5*brachio_brachio_tail1Z+0.5*brachio_brachio_tail2Z));
      m = mult(m, rotate(theta[brachio_brachio_tail2Id], 0, 1, 0));
      figure[brachio_brachio_tail2Id] = createNode(m, brachio_tail2, null, brachio_brachio_tail3Id);
      break;
    case brachio_brachio_tail3Id:
      m = translate(0.0, -(0.3*brachio_brachio_tail2Y), (0.5*brachio_brachio_tail2Z+0.5*brachio_brachio_tail2Z));
      m = mult(m, rotate(theta[brachio_brachio_tail3Id], 0, 1, 0));
      figure[brachio_brachio_tail3Id] = createNode(m, brachio_tail3, null, brachio_brachio_tail4Id);
      break;
    case brachio_brachio_tail4Id:
      m = translate(0.0, -(0.3*brachio_brachio_tail3Y), (0.5*brachio_brachio_tail2Z+0.5*brachio_brachio_tail3Z));
      m = mult(m, rotate(theta[brachio_brachio_tail4Id], 0, 1, 0));
      figure[brachio_brachio_tail4Id] = createNode(m, brachio_tail4, null, brachio_brachio_tail5Id);
      break;
    case brachio_brachio_tail5Id:
      m = translate(0.0, -(0.3*brachio_brachio_tail3Y), (0.5*brachio_brachio_tail3Z+0.5*brachio_brachio_tail3Z));
      m = mult(m, rotate(theta[brachio_brachio_tail5Id], 1, 0, 0));
      figure[brachio_brachio_tail5Id] = createNode(m, brachio_tail5, null, brachio_brachio_tail6Id);
      break;
    case brachio_brachio_tail6Id:
      m = translate(0.0, -(0.3*brachio_brachio_tail3Y), (0.5*brachio_brachio_tail3Z+0.5*brachio_brachio_tail3Z));
      m = mult(m, rotate(theta[brachio_brachio_tail6Id], 1, 0, 0));
      figure[brachio_brachio_tail6Id] = createNode(m, brachio_tail6, null, brachio_tail7Id);
      break;
    case brachio_tail7Id:
      m = translate(0.0, -(0.3*brachio_brachio_tail3Y), (0.5*brachio_brachio_tail3Z+0.5*brachio_brachio_tail3Z));
      m = mult(m, rotate(theta[brachio_tail7Id], 1, 0, 0));
      figure[brachio_tail7Id] = createNode(m, brachio_tail7, null, brachio_brachio_tail8Id);
      break;
    case brachio_brachio_tail8Id:
      m = translate(0.0, -(0.3*brachio_brachio_tail3Y), (0.5*brachio_brachio_tail3Z+0.5*brachio_brachio_tail3Z));
      m = mult(m, rotate(theta[brachio_brachio_tail8Id], 1, 0, 0));
      figure[brachio_brachio_tail8Id] = createNode(m, brachio_tail8, null, brachio_brachio_tail9Id);
      break;
    case brachio_brachio_tail9Id:
        m = translate(0.0, -(0.3*brachio_brachio_tail3Y), (0.5*brachio_brachio_tail3Z+0.5*brachio_brachio_tail3Z));
        m = mult(m, rotate(theta[brachio_brachio_tail9Id], 1, 0, 0));
        figure[brachio_brachio_tail9Id] = createNode(m, brachio_tail9, null, brachio_brachio_tail10Id);
        break;
    case brachio_brachio_tail10Id:
      m = translate(0.0, -(0.4*brachio_brachio_tail4Y), (0.5*brachio_brachio_tail3Z+0.5*brachio_brachio_tail4Z));
      m = mult(m, rotate(theta[brachio_brachio_tail10Id], 1, 0, 0));
      figure[brachio_brachio_tail10Id] = createNode(m, brachio_tail10, null, brachio_brachio_tail11Id);
      break;
    case brachio_brachio_tail11Id:
      m = translate(0.0, -(0.2*brachio_brachio_tail4Y), (0.5*brachio_brachio_tail4Z+0.5*brachio_brachio_tail4Z));
      m = mult(m, rotate(theta[brachio_brachio_tail11Id], 1, 0, 0));
      figure[brachio_brachio_tail11Id] = createNode(m, brachio_tail11, null, brachio_brachio_tail12Id);
      break;
    case brachio_brachio_tail12Id:
      m = translate(0.0, -(0.1*brachio_brachio_tail4Y), (0.5*brachio_brachio_tail4Z+0.5*brachio_brachio_tail4Z));
      m = mult(m, rotate(theta[brachio_brachio_tail12Id], 1, 0, 0));
      figure[brachio_brachio_tail12Id] = createNode(m, brachio_tail12, null, brachio_brachio_tail13Id);
      break;
    case brachio_brachio_tail13Id:
      m = translate(0.0, -(0.1*brachio_brachio_tail4Y), (0.5*brachio_brachio_tail4Z+0.5*brachio_brachio_tail4Z));
      m = mult(m, rotate(theta[brachio_brachio_tail13Id], 1, 0, 0));
      figure[brachio_brachio_tail13Id] = createNode(m, brachio_tail13, null, brachio_brachio_tail14Id);
      break;
    case brachio_brachio_tail14Id:
      m = translate(0.0, 0.0, (0.5*brachio_brachio_tail4Z+0.5*brachio_brachio_tail5Z));
      m = mult(m, rotate(theta[brachio_brachio_tail14Id], 1, 0, 0));
      figure[brachio_brachio_tail14Id] = createNode(m, brachio_tail14, null, brachio_brachio_tail15Id);
      break;
    case brachio_brachio_tail15Id:
      m = translate(0.0, 0.0, (0.5*brachio_brachio_tail5Z+0.5*brachio_brachio_tail5Z));
      m = mult(m, rotate(theta[brachio_brachio_tail15Id], 1, 0, 0));
      figure[brachio_brachio_tail15Id] = createNode(m, brachio_tail15, null, null);
      break;

    case mole_head1Id:

    m = translate(30+mole_x, -0.8, 0);
    m = mult(m, rotate(theta[mole_head1Id], 0, 1, 0));
    m = mult(m, rotate(mole_z, 0, 0, 1));
    figure[mole_head1Id] = createNode(m, mole_head1, null, mole_head2Id);
    break;

    case mole_head2Id:
      m = translate(0.0, (0.5*head1Y+0.5*head2Y), 0.0);
      m = mult(m, rotate(theta[mole_head2Id], 1, 0, 0));
      figure[mole_head2Id] = createNode(m, mole_head2, mole_hand1Id, mole_head3Id);
      break;

    case mole_head3Id:
      m = translate(0.0, (0.5*head2Y+0.5*head3Y), 0.0);
      m = mult(m, rotate(theta[mole_head3Id], 1, 0, 0));
      figure[mole_head3Id] = createNode(m, mole_head3, null, null);
      break;

    case mole_hand1Id:
      m = translate(-(0.5*head1X+0.5*hand1X), -(0.5*head1Y-0.5*hand1Y), 0.5*head1Z);
      m = mult(m, rotate(theta[mole_hand1Id], 1, 0, 0));
      figure[mole_hand1Id] = createNode(m, mole_hand1, mole_hand2Id, mole_hand3Id);
      break;

    case mole_hand3Id:
      m = translate(-(0.5*hand1X+0.5*hand2X), -(0.5*hand2Y-0.5*hand1Y), 0.0);
      m = mult(m, rotate(theta[mole_hand3Id], 1, 0, 0));
      figure[mole_hand3Id] = createNode(m, mole_hand2, null, mole_nail1Id);
      break;

    case mole_nail1Id:
      m = translate(-(0.5*hand2X-0.5*nailX), -(0.5*hand2Y+0.5*nailY), (0.5*hand2Z-0.5*nailZ));
      m = mult(m, rotate(theta[mole_nail1Id], 1, 0, 0));
      figure[mole_nail1Id] = createNode(m, mole_nail, mole_nail2Id, null);
      break;

    case mole_nail2Id:
      m = translate(-(0.5*hand2X-0.5*nailX), -(0.5*hand2Y+0.5*nailY), 0.0);
      m = mult(m, rotate(theta[mole_nail2Id], 1, 0, 0));
      figure[mole_nail2Id] = createNode(m, mole_nail, mole_nail3Id, null);
      break;

    case mole_nail3Id:
      m = translate(-(0.5*hand2X-0.5*nailX), -(0.5*hand2Y+0.5*nailY), -(0.5*hand2Z-0.5*nailZ));
      m = mult(m, rotate(theta[mole_nail3Id], 1, 0, 0));
      figure[mole_nail3Id] = createNode(m, mole_nail, null, null);
      break;

    case mole_hand2Id:
      m = translate(-(0.5*head1X+0.5*hand1X), -(0.5*head1Y-0.5*hand1Y), -(0.5*head1Z));
      m = mult(m, rotate(theta[mole_hand2Id], 1, 0, 0));
      figure[mole_hand2Id] = createNode(m, mole_hand1, mole_lWhisker1Id, mole_hand4Id);
      break;

    case mole_hand4Id:
      m = translate(-(0.5*hand1X+0.5*hand2X), -(0.5*hand2Y-0.5*hand1Y), 0.0);
      m = mult(m, rotate(theta[mole_hand4Id], 1, 0, 0));
      figure[mole_hand4Id] = createNode(m, mole_hand2, null, mole_nail4Id);
      break;

    case mole_nail4Id:
      m = translate(-(0.5*hand2X-0.5*nailX), -(0.5*hand2Y+0.5*nailY), (0.5*hand2Z-0.5*nailZ));
      m = mult(m, rotate(theta[mole_nail4Id], 1, 0, 0));
      figure[mole_nail4Id] = createNode(m, mole_nail, mole_nail5Id, null);
      break;

    case mole_nail5Id:
      m = translate(-(0.5*hand2X-0.5*nailX), -(0.5*hand2Y+0.5*nailY), 0.0);
      m = mult(m, rotate(theta[mole_nail5Id], 1, 0, 0));
      figure[mole_nail5Id] = createNode(m, mole_nail, mole_nail6Id, null);
      break;

    case mole_nail6Id:
      m = translate(-(0.5*hand2X-0.5*nailX), -(0.5*hand2Y+0.5*nailY), -(0.5*hand2Z-0.5*nailZ));
      m = mult(m, rotate(theta[mole_nail6Id], 1, 0, 0));
      figure[mole_nail6Id] = createNode(m, mole_nail, null, null);
      break;

    case mole_lWhisker1Id:
      m = translate(-(0.5*head1X+0.5*whiskerX), -(0.5*whiskerY), -(0.5*head1Z+0.25*whiskerZ));
      m = mult(m, rotate(theta[mole_lWhisker1Id], 1, 0, 0));
      figure[mole_lWhisker1Id] = createNode(m, mole_whisker, mole_lWhisker2Id, null);
      break;

    case mole_lWhisker2Id:
      m = translate(-(0.5*head1X+0.5*whiskerX), -(3.5*whiskerY), -(0.5*head1Z+0.25*whiskerZ));
      m = mult(m, rotate(theta[mole_lWhisker2Id], 1, 0, 0));
      figure[mole_lWhisker2Id] = createNode(m, mole_whisker, mole_rWhisker1Id, null);
      break;

    case mole_rWhisker1Id:
      m = translate(-(0.5*head1X+0.5*whiskerX), -(0.5*whiskerY), (0.5*head1Z+0.25*whiskerZ));
      m = mult(m, rotate(theta[mole_rWhisker1Id], 1, 0, 0));
      figure[mole_rWhisker1Id] = createNode(m, mole_whisker, mole_rWhisker2Id, null);
      break;

    case mole_rWhisker2Id:
      m = translate(-(0.5*head1X+0.5*whiskerX), -(3.5*whiskerY), (0.5*head1Z+0.25*whiskerZ));
      m = mult(m, rotate(theta[mole_rWhisker2Id], 1, 0, 0));
      figure[mole_rWhisker2Id] = createNode(m, mole_whisker, mole_eye1Id, null);
      break;

    case mole_eye1Id:
      m = translate(-(0.5*head1X+0.5*eyeX), (0.5*eyeY), (1.5*eyeZ));
      m = mult(m, rotate(theta[mole_eye1Id], 1, 0, 0));
      figure[mole_eye1Id] = createNode(m, mole_nail, mole_eye2Id, null);
      break;

    case mole_eye2Id:
      m = translate(-(0.5*head1X+0.5*eyeX), (0.5*eyeY), -(1.5*eyeZ));
      m = mult(m, rotate(theta[mole_eye2Id], 1, 0, 0));
      figure[mole_eye2Id] = createNode(m, mole_nail, mole_noseId, null);
      break;

    case mole_noseId:
      m = translate(-(0.5*head1X+0.5*noseY), -(1.5*noseY), 0.0);
      m = mult(m, rotate(theta[mole_noseId], 1, 0, 0));
      figure[mole_noseId] = createNode(m, mole_nose, mole_grassId, null);
      break;

    case mole_grassId:
      m = translate(0.0, -(0.5*head1Y+0.5*grassY), 0.0);
      m = mult(m, rotate(theta[mole_grassId], 1, 0, 0));
      figure[mole_grassId] = createNode(m, mole_grass, null, null);
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

    m = translate(0.0, neckHeight+0.5*neck2Height, 0.5*(neck2Width-neckWidth));
	m = mult(m, rotate(theta[neckId], 0, 1, 0));
    m = mult(m, rotate(torsoSit*15, 1, 0, 0));
    m = mult(m, translate(0.0, -0.2*torsoSit, 0.3*torsoSit));
    m = mult(m, translate(0.0, -0.5*neckHeight, 0.0));
    figure[neckId] = createNode( m, neck, null, leftUpperArmId);
    break;

    case neck2Id:

    m = translate(0.0, torsoHeight, 0.5*(torsoWidth-neck2Width));
	m = mult(m, rotate(theta[neck2Id], 0, 1, 0));
    m = mult(m, rotate(torsoSit*10, 1, 0, 0));
    m = mult(m, translate(0.0, -0.1*torsoSit, 0.5*torsoSit));
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
    m = mult(m, rotate(-torsoSit*20, 1, 0, 0));
    m = mult(m, translate(0.0, -0.2*torsoSit, 0.4*torsoSit));
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

    case bird_torsoId:

      m = translate(bird_x+30, 6, 0);
      m = mult(m, rotate(theta[bird_torsoId], 0, 1, 0));
      figure[bird_torsoId] = createNode(m, bird_torso, null, bird_head1Id);
      break;
    case bird_head1Id:
      //m = translate(0.5* torsoX, 0.5 * torsoY, torsoZ);
      m = translate(0.0, (0.5*bird_torsoY+ 0.5*bird_head1Y), (0.5*bird_torsoZ));
      m = mult(m, rotate(theta[bird_head1Id], 1, 0, 0));
      figure[bird_head1Id] = createNode(m, bird_head1, bird_leftWing1Id, bird_head2Id);
      break;
    case bird_head2Id:
      m = translate(0.0, (0.5*bird_head1Y+0.5 * bird_head2Y), 0.0);
      m = mult(m, rotate(theta[bird_head2Id], 1, 0, 0));
      figure[bird_head2Id] = createNode(m, bird_head2, bird_beakId, bird_head3Id);
      break;
    case bird_head3Id:
      m = translate(0.0, (0.5*bird_head2Y+0.5 * bird_head3Y), 0.0);
      m = mult(m, rotate(theta[bird_head3Id], 1, 0, 0));
      figure[bird_head3Id] = createNode(m, bird_head3, bird_eye1Id, bird_head4Id);
      break;
    case bird_head4Id:
      m = translate(0.0, (0.5*bird_head3Y+0.5 * bird_head4Y), 0.0);
      m = mult(m, rotate(theta[bird_head4Id], 1, 0, 0));
      figure[bird_head4Id] = createNode(m, bird_head4, null, null);
      break;
    case bird_beakId:
      m = translate(0.0, 0.0, 0.5*bird_head1Z+0.5*bird_beakZ);
      m = mult(m, rotate(theta[bird_beakId], 1, 0, 0));
      figure[bird_beakId] = createNode(m, bird_beak, null, null);
      break;
    case bird_eye1Id:
      m = translate(-(0.5*bird_head2X+0.5*bird_eyeX), 0.0, 3*bird_eyeZ);
      m = mult(m, rotate(theta[bird_eye1Id], 1, 0, 0));
      figure[bird_eye1Id] = createNode(m, bird_noon, bird_eye2Id, null);
      break;
    case bird_eye2Id:
      m = translate((0.5*bird_head2X+0.5*bird_eyeX), 0.0, 3*bird_eyeZ);
      m = mult(m, rotate(theta[bird_eye2Id], 1, 0, 0));
      figure[bird_eye2Id] = createNode(m, bird_noon, null, null);
      break;
    case bird_leftWing1Id:
      m = translate(-(0.5*bird_torsoX+ 0.5*bird_wing1X), 0.0, 0.0);
      m = mult(m, rotate(theta[bird_leftWing1Id], 0, 0, 1));
      figure[bird_leftWing1Id] = createNode(m, bird_leftWing1, bird_rightWing1Id, bird_leftWing2Id);
      break;
    case bird_leftWing2Id:
      m = translate( -(0.5*bird_wing1X+0.5*bird_wing2X), 0.0, 0.0);
      m = mult(m, rotate(theta[bird_leftWing2Id], 0, 0, 1));
      figure[bird_leftWing2Id] = createNode(m, bird_leftWing2, null, bird_leftWing3Id);
      break;
    case bird_leftWing3Id:
      m = translate( -(0.5*bird_wing2X+0.5*bird_wing3X), 0.0, 0.5 * bird_wing2Z);
      m = mult(m, rotate(theta[bird_leftWing3Id], 0, 0, 1));
      figure[bird_leftWing3Id] = createNode(m, bird_leftWing3, null, bird_leftWing4Id);
      break;
    case bird_leftWing4Id:
      m = translate( -(0.5*bird_wing3X+0.5*bird_wing4X), 0.5 * bird_wing3Y-0.5*bird_wing4Y, 0.5 * bird_wing3Z);
      m = mult(m, rotate(theta[bird_leftWing4Id], 0, 0, 1));
      figure[bird_leftWing4Id] = createNode(m, bird_leftWing4, null, null);
      break;
    case bird_rightWing1Id:
      m = translate( (0.5*bird_torsoX+ 0.5*bird_wing1X), 0.0, 0.0);
      m = mult(m, rotate(theta[bird_rightWing1Id], 0, 0, 1));
      figure[bird_rightWing1Id] = createNode(m, bird_rightWing1, bird_body1Id, bird_rightWing2Id);
      break;
    case bird_rightWing2Id:
      m = translate( (0.5*bird_wing1X+0.5*bird_wing2X), 0.0, 0.0);
      m = mult(m, rotate(theta[bird_rightWing2Id], 0, 0, 1));
      figure[bird_rightWing2Id] = createNode(m, bird_rightWing2, null, bird_rightWing3Id);
      break;
    case bird_rightWing3Id:
      m = translate( (0.5*bird_wing2X+0.5*bird_wing3X), 0.0, 0.5 * bird_wing2Z);
      m = mult(m, rotate(theta[bird_rightWing3Id], 0, 0, 1));
      figure[bird_rightWing3Id] = createNode(m, bird_rightWing3, null, bird_rightWing4Id);
      break;
    case bird_rightWing4Id:
      m = translate( (0.5*bird_wing3X+0.5*bird_wing4X), 0.0, 0.5 * bird_wing3Z);
      m = mult(m, rotate(theta[bird_rightWing4Id], 0, 0, 1));
      figure[bird_rightWing4Id] = createNode(m, bird_rightWing4, null, null);
      break;
    case bird_body1Id:
      m = translate( (0.0), -(0.5 * bird_torsoY+0.5*bird_body1Y), -0.3 * bird_body1Z);
      m = mult(m, rotate(theta[bird_body1Id], 0, 0, 1));
      figure[bird_body1Id] = createNode(m, bird_body1, null, bird_body2Id);
      break;
    case bird_body2Id:
      m = translate( (0.0), -(0.5*bird_body1Y+0.5*bird_body2Y), -(0.5*bird_body1Z- 0.8* bird_body2Z));
      m = mult(m, rotate(theta[bird_body2Id], 0, 0, 1));
      figure[bird_body2Id] = createNode(m, bird_body2, null, null);
      break;
    }
}

function traverse(Id) {
    if (Id == null) return; // 만약 Id가 null이면 함수 종료
    stack.push(modelViewMatrix); // 스택에 modelViewMatrix를 push
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform); // modelViewMatrix를 현재 transform과 곱함
    if (Id >= dinoNodes && Id < dinoNodes+moleNodes+birdNodes && Id != mole_grassId || Id == eyeId) {
        gl.uniform1i(useTextureLocation, 0);
    }
    else if(Id < dinoNodes){
      gl.uniform1i(useTextureLocation, 1);
    }
    else if(Id >= 60 && Id < 60 + brachioNodes){
        gl.uniform1i(useTextureLocation, 1);
    }
    else{
        gl.uniform1i(useTextureLocation, 1);
    }
    figure[Id].render(); // figure[Id]를 렌더링
    if (figure[Id].child != null) traverse(figure[Id].child); // 만약 figure[Id]의 자식이 있다면 traverse 함수를 재귀호출
    modelViewMatrix = stack.pop(); // 스택에서 modelViewMatrix를 pop
    if (figure[Id].sibling != null) traverse(figure[Id].sibling); // 만약 figure[Id]의 형제가 있다면 traverse 함수를 재귀호출
}

function ground(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(3*groundWidth, groundHeight, 0.9*groundWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    setTexture(groundTexture);
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, objectColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    disableTexture();
    for(var i =0; i<6; i++) {
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  }
}

function brachio_torso(){
  setTexture(brachioTexture);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_torsoX, brachio_torsoY, brachio_torsoZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_body1(){
    setTexture(brachioTexture);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_body1X, brachio_brachio_body1Y, brachio_brachio_body1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_body3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_body3X, brachio_brachio_body3Y, brachio_brachio_body3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_neck1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_neckX, brachio_neckY, brachio_neckZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_neck2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_neckX, brachio_neckY, brachio_neckZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_neck3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_neckX, brachio_neckY, brachio_neckZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_neck4(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_neckX, brachio_neckY, brachio_neckZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_neck5(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_neckX, brachio_neckY, brachio_neckZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_head1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_head1X, brachio_brachio_head1Y, brachio_brachio_head1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_head2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_head2X, brachio_brachio_head2Y, brachio_brachio_head2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_body2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_body2X, brachio_brachio_body2Y, brachio_brachio_body2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_brLeg1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg1X, brachio_leg1Y, brachio_leg1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_brLeg2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg1X, brachio_leg1Y, brachio_leg1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_brLeg3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg3X, brachio_leg3Y, brachio_leg3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_blLeg1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg1X, brachio_leg1Y, brachio_leg1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_blLeg2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg1X, brachio_leg1Y, brachio_leg1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_blLeg3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg3X, brachio_leg3Y, brachio_leg3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_frLeg1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg1X, brachio_leg1Y, brachio_leg1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_frLeg2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg1X, brachio_leg1Y, brachio_leg1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_frLeg3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg3X, brachio_leg3Y, brachio_leg3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_flLeg1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg1X, brachio_leg1Y, brachio_leg1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_flLeg2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg1X, brachio_leg1Y, brachio_leg1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_flLeg3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_leg3X, brachio_leg3Y, brachio_leg3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail1X, brachio_brachio_tail1Y, brachio_brachio_tail1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail2X, brachio_brachio_tail2Y, brachio_brachio_tail2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail2X, brachio_brachio_tail2Y, brachio_brachio_tail2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail4(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail3X, brachio_brachio_tail3Y, brachio_brachio_tail3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail5(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail3X, brachio_brachio_tail3Y, brachio_brachio_tail3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail6(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail3X, brachio_brachio_tail3Y, brachio_brachio_tail3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail7(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail3X, brachio_brachio_tail3Y, brachio_brachio_tail3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail8(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail3X, brachio_brachio_tail3Y, brachio_brachio_tail3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail9(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail3X, brachio_brachio_tail3Y, brachio_brachio_tail3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail10(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail4X, brachio_brachio_tail4Y, brachio_brachio_tail4Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail11(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail4X, brachio_brachio_tail4Y, brachio_brachio_tail4Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail12(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail4X, brachio_brachio_tail4Y, brachio_brachio_tail4Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail13(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail4X, brachio_brachio_tail4Y, brachio_brachio_tail4Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail14(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail5X, brachio_brachio_tail5Y, brachio_brachio_tail5Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  function brachio_tail15(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(brachio_brachio_tail5X, brachio_brachio_tail5Y, brachio_brachio_tail5Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
function mole_head1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(head1X, head1Y, head1Z));  
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }

  function mole_head2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(head2X, head2Y, head2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function mole_head3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(head3X, head3Y, head3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function mole_hand1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(hand1X, hand1Y, hand1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function mole_hand2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(hand2X, hand2Y, hand2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function mole_nail(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(nailX, nailY, nailZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function mole_whisker(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(whiskerX, whiskerY, whiskerZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function mole_eye(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(eyeX, eyeY, eyeZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function mole_nose(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(noseX, noseY, noseZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function mole_grass(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(grassX, grassY, grassZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    setTexture(groundTexture);
    gl.uniform4fv(colorLocation, mole_grassColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(useTextureLocation, 0);
    gl.uniform4fv(colorLocation, mole_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
  }
  

function torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoXWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function torso2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torso2Height, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(0.8*torsoXWidth, torso2Height, torso2Width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(torsoXWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function eye() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, eyeHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(1.01*torsoXWidth, eyeHeight, eyeWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, eyeColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    }
}

function neck() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, neckHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(neckWidth, neckHeight, neckWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function neck2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, neck2Height, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(torsoXWidth-0.01, neck2Height, neck2Width) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function mouth() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, mouthHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(torsoXWidth-0.01, mouthHeight, mouthWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function mouth2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, mouth2Height, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(torsoXWidth-0.01, mouth2Height, mouth2Width) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function leftmiddleLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * middleLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(middleLegWidth, middleLegHeight, middleLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function rightmiddleLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * middleLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(middleLegWidth, middleLegHeight, middleLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function tail() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(0.6*torsoXWidth, tailHeight, tailWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
        gl.uniform4fv(colorLocation, bodyColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    gl.uniform1i(useTextureLocation, 0);
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, lineColor);
      gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
  } 
}

function tail2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tail2Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tail2Width, tail2Height, tail2Width) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) {
      gl.uniform4fv(colorLocation, bodyColor);
      gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
  }
  gl.uniform1i(useTextureLocation, 0);
  for(var i =0; i<6; i++) {
    gl.uniform4fv(colorLocation, lineColor);
    gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
} 
}

function bird_torso(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_torsoX, bird_torsoY, bird_torsoZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_head1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_head1X, bird_head1Y, bird_head1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_head2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_head2X, bird_head2Y, bird_head2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_head3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_head3X, bird_head3Y, bird_head3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_head4(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_head4X, bird_head4Y, bird_head4Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_leftWing1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_wing1X, bird_wing1Y, bird_wing1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_wingColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_leftWing2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_wing2X, bird_wing2Y, bird_wing2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_wingColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_leftWing3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_wing3X, bird_wing3Y, bird_wing3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_wingColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_leftWing4(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_wing4X, bird_wing4Y, bird_wing4Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_wingColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_rightWing1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_wing1X, bird_wing1Y, bird_wing1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_wingColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_rightWing2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_wing2X, bird_wing2Y, bird_wing2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_wingColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  } 
  function bird_rightWing3(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_wing3X, bird_wing3Y, bird_wing3Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_wingColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_rightWing4(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_wing4X, bird_wing4Y, bird_wing4Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_wingColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_lowerBody(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_bodyX, bird_bodyY, bird_bodyZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_leftLeg(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_legX, bird_legY, bird_legZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_rightLeg(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_legX, bird_legY, bird_legZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_body1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_body1X, bird_body1Y, bird_body1Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_body2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_body2X, bird_body2Y, bird_body2Z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_bodyColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_beak(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_beakX, bird_beakY, bird_beakZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_beakColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  function bird_noon(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(bird_eyeX, bird_eyeY, bird_eyeZ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.LINE_LOOP, 4 * i, 4);
    gl.uniform4fv(colorLocation, bird_lineColor);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     texCoordsArray.push(texCoord[0]);
     texGroundArray.push(texCoord[0]);
     pointsArray.push(vertices[b]);
     texCoordsArray.push(texCoord[1]);
     texGroundArray.push(texCoord[1]);
     pointsArray.push(vertices[c]);
     texCoordsArray.push(texCoord[2]);
     texGroundArray.push(texCoord[2]);
     pointsArray.push(vertices[d]);
     texCoordsArray.push(texCoord[3]);
     texGroundArray.push(texCoord[3]);
}


function cube()
{
    quad( 6, 5, 1, 2 );
    quad( 2, 1, 0, 3 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
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

    projectionMatrix = perspective(fovy, aspect, near, far);
    modelViewMatrix = lookAt(c_eye, at, up)


    texture1 = gl.createTexture();
    texture2 = gl.createTexture();

    useTextureLocation = gl.getUniformLocation(program, "u_useTexture");
    
    const button1 = document.getElementById('cammera1');
    const button2 = document.getElementById('cammera2');
    const model1 = document.getElementById('dino1');
    const model2 = document.getElementById('dino2');
      
    button1.addEventListener('click', function() {
        c_eye = [-10, 6, 20];
        at = [1, 0, 0];
        modelViewMatrix = lookAt(c_eye, at, up)
      });

      button2.addEventListener('click', function() {
        c_eye = [-20, 15, 0]
        at = [10, 0, 0];
        modelViewMatrix = lookAt(c_eye, at, up)
      });

      model1.addEventListener('click', function() {
        dinoNum = 0;
      });

      model2.addEventListener('click', function() {
        dinoNum = 1;
      });

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    async function handleKeyDown(event) {
        if (event.key === "ArrowUp") {
            if(dinoNum == 0) dinoJump();
            else brachio_Jump();
        } else if (event.key === "ArrowDown") {
            if(dinoNum == 0) dinoSit();
            else brachio_Sit();

        } else if (event.key === "ArrowLeft") {
        } else if (event.key === "ArrowRight") {
        }
      }

      async function handleKeyUp(event) {
        if (event.key === "ArrowDown"){
            if(dinoNum == 0) dinoStand();
            else brachio_Stand();
        }
      }

    gl.useProgram(program);
    setGL(gl, program);

    for(i=0; i<dinoNodes; i++) initNodes(i);
    render1_tirano();

    for(i=dinoNodes; i<dinoNodes+moleNodes; i++) initNodes(i);
    render2();

    initNodes(groundId);
    render3();

    for(i=dinoNodes+moleNodes; i<dinoNodes+moleNodes+birdNodes; i++) initNodes(i);
    render4();

    //resumeInterval();
    intervalId = setInterval(function() {
        var randomvalue = Math.random() * 10;
        if(randomvalue < 3 && birdlock && molelock) {
            birdlock = false;
            molelock = false;
            var randomvalue2 = Math.random() * 2;
            if(randomvalue2 > 1) mole_x = 0;
            else bird_x = 0;
        }
      }, 100);
}

function setGL(gl, program) {
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

    var tBuffer = gl.createBuffer();
    vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
}

function moveGround() {
    offset += speed; // 시간이 지남에 따라 오프셋을 증가
    if (offset > 1.0) offset -= 1.0; // 오프셋이 1을 초과하면 1을 뺍니다. 이는 텍스처를 래핑하기 위한 것입니다.

    texGroundArray[0] = vec2(0.0 - offset, 0.0); // 왼쪽 아래 꼭짓점
    texGroundArray[1] = vec2(1.0 - offset, 0.0); // 오른쪽 아래 꼭짓점
    texGroundArray[2] = vec2(1.0 - offset, 1.0); // 오른쪽 위 꼭짓점
    texGroundArray[3] = vec2(0.0 - offset, 1.0); // 왼쪽 위 꼭짓점
    texGroundArray[4] = vec2(0.0 - offset, 0.0); // 왼쪽 아래 꼭짓점
    texGroundArray[5] = vec2(1.0 - offset, 0.0); // 오른쪽 아래 꼭짓점
    texGroundArray[6] = vec2(1.0 - offset, 1.0); // 오른쪽 위 꼭짓점
    texGroundArray[7] = vec2(0.0 - offset, 1.0); // 왼쪽 위 꼭짓점
    
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texGroundArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
    // 이후 uvCoords를 이용해서 텍스처를 적용합니다.
}

function setTexture(image){
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
}

function setTexture2(image){
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
}

function disableTexture() {
    gl.bindTexture(gl.TEXTURE_2D, null);
}

  function motionPlus(index){
    dg += 0.005;
    theta[index] = 15*Math.sin(dg);
  }
  function motionMinus(index){
    dg += 0.005;
    theta[index] = -15*Math.sin(dg);
  }
  var flag = 150;

var render1_tirano = function() { //dino
    if(stopRendering) return;
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    if(dinoNum == 0){
      setTexture(dinoTexture);
        traverse(torsoId);
        dinoRun();
    }
    else{
      setTexture(brachioTexture);
        motionLegPlus(brachio_brachio_flLeg1Id);
        motionLegPlus(brachio_brachio_flLeg2Id);
        motionLegPlus(brachio_brachio_flLeg3Id);

        motionLegPlus(brachio_brachio_blLeg1Id);
        motionLegPlus(brachio_brachio_blLeg2Id);
        motionLegPlus(brachio_brachio_blLeg3Id);

        motionLegMinus(brachio_brachio_frLeg1Id);
        motionLegMinus(brachio_brachio_frLeg2Id);
        motionLegMinus(brachio_brachio_frLeg3Id);

        motionLegMinus(brachio_brachio_brLeg1Id);
        motionLegMinus(brachio_brachio_brLeg2Id);
        motionLegMinus(brachio_brachio_brLeg3Id);

        motionTail(brachio_brachio_tail1Id);
        motionTail(brachio_brachio_tail2Id);
        motionTail(brachio_brachio_tail3Id);
        motionTail(brachio_brachio_tail4Id);
        motionTail(brachio_brachio_tail5Id);
        motionTail(brachio_brachio_tail6Id);
        motionTail(brachio_tail7Id);
        motionTail(brachio_brachio_tail8Id);
        motionTail(brachio_brachio_tail9Id);
        motionTail(brachio_brachio_tail10Id);
        motionTail(brachio_brachio_tail11Id);
        motionTail(brachio_brachio_tail12Id);
        motionTail(brachio_brachio_tail13Id);
        motionTail(brachio_brachio_tail14Id);
        motionTail(brachio_brachio_tail15Id);

        motionNeck(brachio_brachio_neck1Id);
        motionNeck(brachio_brachio_neck2Id);
        motionNeck(brachio_brachio_neck3Id);
        motionNeck(brachio_brachio_neck4Id);
        motionNeck(brachio_brachio_neck5Id);
        motionNeck(brachio_brachio_head1Id);

        for(i=dinoNodes+moleNodes+birdNodes; i<dinoNodes+moleNodes+birdNodes+brachioNodes; i++) initNodes(i);

        traverse(brachio_torsoId);
    }
    requestAnimFrame(render1_tirano);
}

var render2 = function() {  //mole
  setTexture(groundTexture);
    if(stopRendering) return;
    traverse(mole_head1Id);
    moleRun();
    requestAnimationFrame(render2);
}

var render3 = function() { //ground
  setTexture(groundTexture);
    if(stopRendering) return;
    traverse(groundId);
    moveGround();
    requestAnimationFrame(render3);
}

var render4 = function() { //bird
    if(stopRendering) return;
    traverse(bird_torsoId);
    birdRun();
    motionPlus(bird_leftWing1Id);
    motionPlus(bird_leftWing2Id);
    motionPlus(bird_leftWing3Id);
    motionPlus(bird_leftWing4Id);
  
  
    motionMinus(bird_rightWing1Id);
    motionMinus(bird_rightWing2Id);
    motionMinus(bird_rightWing3Id);
    motionMinus(bird_rightWing4Id);
    
    for(var i=dinoNodes+moleNodes; i<dinoNodes+moleNodes+birdNodes; i++){
      initNodes(i);
    }
    
    requestAnimFrame(render4);
  };

  async function dinoJump(){
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
  }

  function motionLegPlus(index){
    dg += 0.005;
    theta[index] = 15*Math.sin(dg);
  }
  function motionLegMinus(index){
    dg += 0.004;
    theta[index] = -15*Math.sin(dg);
  }
  function motionTail(index){
    dg += 0.0005;
    theta[index] = 10*Math.sin(dg);
  }
  function motionNeck(index){
    dg += 0.00005;
    theta[index] = 3*Math.sin(dg);
  }


function dinoRun(){
    if(stopRendering) return;
    if(!jumpevent){
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
    }
}

function dinoSit(){
    torsoSit = 1;

    initNodes(neck2Id);
    initNodes(neckId);
    initNodes(mouthId);
}

function dinoStand(){
    torsoSit = 0;

    initNodes(neck2Id);
    initNodes(neckId);
    initNodes(mouthId);
}
function moleRun(){
    initNodes(mole_head1Id);
    if(mole_x > -50) mole_x -= 0.3;
    else molelock = true;
}

function birdRun(){
    initNodes(bird_head1Id);
    if(bird_x > -50) bird_x -= 0.3;
    else birdlock = true;
}

async function brachio_Jump(){
    if(!brachio_jumpevent){
        brachio_jumpevent = true;
        var i = 0;
        while(true){
            var jumpvalue = Math.sin(i);
            if(jumpvalue < 0) {
                //theta[brachio_torsoId] = 0;
                brachio_torsoJump = 0;
  
                initNodes(brachio_torsoId);
                break;
            }
            brachio_torsoJump = jumpvalue*5;
            initNodes(brachio_torsoId);
  
            await sleep(16);
            i += 0.07;
        }
        brachio_jumpevent = false;
    }
  }

  function brachio_Sit(){
    brachio_torsoSit = 1;
  
    initNodes(brachio_brachio_body1Id);
    initNodes(brachio_brachio_neck1Id);
    initNodes(brachio_brachio_neck2Id);
    initNodes(brachio_brachio_neck3Id);
    initNodes(brachio_brachio_neck4Id);
    initNodes(brachio_brachio_neck5Id);
    initNodes(brachio_brachio_head1Id);
  }
  
  function brachio_Stand(){
    brachio_torsoSit = 0;
    initNodes(brachio_brachio_body1Id);
    initNodes(brachio_brachio_neck1Id);
    initNodes(brachio_brachio_neck2Id);
    initNodes(brachio_brachio_neck3Id);
    initNodes(brachio_brachio_neck4Id);
    initNodes(brachio_brachio_neck5Id);
    initNodes(brachio_brachio_head1Id);
  }

  function pauseInterval() {
    clearInterval(intervalId);
  }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  } 