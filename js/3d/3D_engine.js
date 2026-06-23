/*
	THIS 3D ENGINE IS A MODIFIED VERSION OF 
	3DPROJ - PROTOTYPE 11
	MADE BY TROJANVOID/ADRYAN FOR USAGI ENGINE
	
	Copyright (c) 2026 TrojanVoid
	
	This code is not allowed to be used and/or modified  
	without TrojanVoid's knowlodge and permission, by 
	ETEC Darcy Pereira de Moraes or anyone else except
	TrojanVoid himself.
*/

const canvas = document.getElementById("3dproj");
canvas.width = 240;
canvas.height = 136;
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

//INPUT CODE
const keys = {};
const keyPr = {};

class Input {
	constructor(keybinds) {
		this.keylist = keybinds;
		this.left = false; this.down = false;
		this.up = false; this.right = false;
		
		this.a = false; this.b = false;
		this.x = false; this.y = false;
		
		this.start = false; this.select = false;
	}
	
	update(deltaTime) {
		this.right =
			keys[this.keylist.right] === undefined ||
			keys[this.keylist.right] ===false
			? false
			: true;
		this.left =
			keys[this.keylist.left] === undefined ||
			keys[this.keylist.left] ===false
			? false
			: true;
		this.up =
			keys[this.keylist.up] === undefined ||
			keys[this.keylist.up] ===false
			? false
			: true;
		this.down =
			keys[this.keylist.down] === undefined ||
			keys[this.keylist.down] ===false
			? false
			: true;
			
		this.a =
			keys[this.keylist.a] === undefined ||
			keys[this.keylist.a] ===false
			? false
			: true;
		this.b =
			keys[this.keylist.b] === undefined ||
			keys[this.keylist.b] ===false
			? false
			: true;
		this.x =
			keys[this.keylist.x] === undefined ||
			keys[this.keylist.x] ===false
			? false
			: true;
		this.y =
			keys[this.keylist.y] === undefined ||
			keys[this.keylist.y] ===false
			? false
			: true;
		
		this.select =
			keys[this.keylist.select] === undefined ||
			keys[this.keylist.select] ===false
			? false
			: true;
		this.start =
			keys[this.keylist.start] === undefined ||
			keys[this.keylist.start] ===false
			? false
			: true;
	}
}

//Classes

class Camera {
	constructor(x, y, z) {
		this.x = x; this.y = y; this.z = z;
		this.fov = 100; 
		this.angleX = 0; this.angleY = 0;
		this.mode = 0; this.renderDist = 100;
		this.turnSpeed = 1; this.walkSpeed = 1;
	}
}

class Cursor {
	constructor(x, y, z) {
		this.x = x; this.y = y; this.z = z;
		this.tempTri = {}; this.tempColor = colors["BLACK"];
		this.tempTriList = []; this.pointCount = 0;
		this.lastSavedPos = {};
	}
}

//Variables

let projectProp = {protNum:'11b', devMode:true};
let gameScreen = {
	width:canvas.width, height: canvas.height,
	OGWidth: 240, OGHeight: 136
};
let mode = 0;
let inputKeys = {
	up: "w",
	left: "a",
	down: "s",
	right: "d",
	a: "k",
	b: "j",
	x: "i",
	y: "u",
	select: "shift",
	start: "enter"
}
let input = new Input(inputKeys);
//0 - move, 1 - build

let mapChunks = {}; 
let triMap = {}; 
let renderMap = {};

let shpBluePrint = {
	cube : [
		[1,2,3], [4,3,1], [5,6,7],
		[8,7,5], [3,7,4], [7,8,4],
		[2,6,1], [6,1,5], [3,2,6],
		[3,7,6], [4,1,5], [4,8,5]
	],
	pyramid: [
		[1,2,3], [4,1,3], [2,5,3],
		[3,5,4], [4,5,1], [1,5,2]
	]
}
let angleBtnPressed = false;
let angleBtnMode = 1;
let changeBtnPressed = false;
let setBtnPressed = false;

let state = 0;
let colors = {
	BLACK:"#000000",DARK_BLUE:"#1D2B53",INDIGO:"#7E1B53",
	DARK_GREEN:"#008751",BROWN:"#AB5236",DARK_GRAY:"#5F574F",
	GRAY:"#C2C3C7",WHITE:"#FFF1E8",RED:"#FF004D",
	ORANGE:"#FFA300",YELLOW:"#FFEC27",GREEN:"#00E436",
	BLUE:"#29ADFF",CLAY:"#83769C",PINK:"#FF77A8",
	PEACH:"#FFCCAA"
}
let camera = {};
let cursor = {};

let lastTime = 0;

async function _init() {
	camera = new Camera(0, 0, 0);
	cursor = new Cursor(0, 0, 0);
	mapChunks = await loadJSON("./data/3dmodels/turtle.json");
}

function _update(deltaTime) {
	input.update();
	let radY = camera.angleY * (Math.PI/180);
	
	if (input.right) {
		switch(mode) {
			case 0:
				camera.angleY = camera.angleY<=0 ? camera.angleY+360 : camera.angleY-2;
				break;
			case 1:
				if (camera.angleY<270 && camera.angleY>90) {
					cursor.x -= 1;
				} else {
					cursor.x += 1;
				}
				break;
		}
	}
	if (input.left) {
		switch(mode) {
			case 0:
				camera.angleY = camera.angleY>=359 ? camera.angleY-360 : camera.angleY+2;
				break;
				
			case 1:
				if (camera.angleY<270 && camera.angleY>90) {
					cursor.x += 1;
				} else {
					cursor.x -= 1;
				}
				break;
		}
	}
	if (input.up) {
		switch(mode) {
			case 0:
				camera.x -= (Math.sin(radY) * camera.walkSpeed);
				camera.z += (Math.cos(radY) * camera.walkSpeed);
				break;
			case 1:
				if (camera.angleY<270 && camera.angleY>90) {
					cursor.z -=1;
				} else {
					cursor.z +=1;
				}
		}
	}
	if (input.down) {
		switch(mode) {
			case 0:
				camera.x += (Math.sin(radY) * camera.walkSpeed);
				camera.z -= (Math.cos(radY) * camera.walkSpeed);
				break;
			case 1:
				if (camera.angleY<270 && camera.angleY>90) {
					cursor.z +=1;
				} else {
					cursor.z -=1;
				}
		}
	}
	
	if (input.a) {
		switch(mode) {
			case 0:
				camera.y+=1;
				break;
			case 1:
				cursor.y+=1;
				break;
		}
	}
	if (input.b) {
		switch(mode) {
			case 0:
				camera.y-=1;
				break;
			case 1:
				cursor.y-=1;
				break;
		}
	}
	if (input.x) {
		switch(mode) {
			case 0:
				angleBtnPressed = true;
				//if (camera.angleX > -80) {
					camera.angleX += (2*angleBtnMode);
				//}
				break;
			case 1:
				if (!setBtnPressed) {
					switch(cursor.pointCount) {
						case 0:
							cursor.tempTri.x1 = cursor.x;
							cursor.tempTri.y1 = cursor.y;
							cursor.tempTri.z1 = cursor.z;
							break;
						case 1:
							cursor.tempTri.x2 = cursor.x;
							cursor.tempTri.y2 = cursor.y;
							cursor.tempTri.z2 = cursor.z;
							break;
						default:
							cursor.tempTri.x3 = cursor.x;
							cursor.tempTri.y3 = cursor.y;
							cursor.tempTri.z3 = cursor.z;
							cursor.tempTriList.push(cursor.tempTri);
							triMap = convShapes(cursor, mapChunks);
							cursor.pointCount=0;
							cursor.tempTri = {};
							break;
					}
					cursor.pointCount = (cursor.pointCount+1)%3;
					cursor.lastSavedPos = {
						x : cursor.x,
						y : cursor.y,
						z : cursor.z
					}
					setBtnPressed = true;
				}
				break;
		}
	} else if (!input.x && angleBtnPressed) {
		angleBtnPressed = false;
		angleBtnMode = -angleBtnMode;
	} else if (!input.x && mode==1 && setBtnPressed) {
		setBtnPressed = false;
	}
	if (input.y) {
		changeBtnPressed = true;
	} else if (!input.y && changeBtnPressed) {
		mode = (mode+1)%2;
		changeBtnPressed = false;
	}
	renderUpdate(camera, triMap, renderMap);
}

function _draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = colors["BLUE"];
	ctx.fillRect(0,0,gameScreen.width,gameScreen.height);
	ctx.fillStyle = "#FFFFFF";
	geminiFloor();
	drawTri(camera, renderMap);
	drawDot(camera);
	if (projectProp.devMode) {
		debugText();
	}
}

function debugText() {
	ctx.fillStyle = colors["WHITE"];
	ctx.fillText(`3D Thingy - Prototype ${projectProp.protNum}`,0,0);
	ctx.fillText(`Camera X: ${Math.round(camera.x)} Camera Y: ${Math.round(camera.y)} Camera Z: ${Math.round(camera.z)}`,0,8);
	ctx.fillText(`Camera Angle Y: ${camera.angleY} Camera Angle X: ${camera.angleX}`,0,16);
	ctx.fillText(`ABModd: ${angleBtnMode} CMPress: ${changeBtnPressed} ABPress: ${angleBtnMode}`,0,40);
	ctx.fillText(`Mode: ${mode} RendMapLen: ${renderMap.length} TriMapLen: ${triMap.length}`,0,48);
	ctx.fillText(`Cursor x: ${cursor.x} y: ${cursor.y} z: ${cursor.z}`,0,56);
	ctx.fillText(`LastSavedPos: ${cursor.lastSavedPos.x}, ${cursor.lastSavedPos.y}, ${cursor.lastSavedPos.z}`,0,64);
	ctx.fillText(`TempTriListLen: ${cursor.tempTriList.length}`,0,72);
	ctx.fillText(`Point Count: ${cursor.pointCount}`,0,80);
	ctx.fillStyle = "#FFFFFF";
}

_init().then(() => {
	triMap = convShapes(cursor, mapChunks);
	console.log(triMap.length);
	_loop();
});

function _loop() {
	const currentTime = performance.now();
	let deltaTime = currentTime - lastTime;
	lastTime = currentTime;
	fps = Math.round(1000/deltaTime);
	
	_update(deltaTime);
	_draw();
	
	requestAnimationFrame(_loop);	
}

//OTHER FUNCTIONS
async function loadJSON(jsonPath) {
	let path = jsonPath;
	if (jsonPath[0]+jsonPath[1]!=="./") {
		path = "./"+path;
	}
	const content = await fetch(path);
	if (!content) {console.error(`Error - failed to load ${jsonPath}`); return;}
	return await content.json();
}

function project3D(cam, relPos, relZ, scrnSize, isH) {
	relPos = relPos <= 0.01 ? 0.01 : relPos;
	let factor = isH ? gameScreen.height / gameScreen.OGHeight : gameScreen.width / gameScreen.OGWidth;
	return (relPos * (cam.fov * factor)) / relZ + (scrnSize / 2);
}

function tranfPoint(cam, x, y, z) {
	let tx = x - cam.x, ty = y - cam.y, tz = z - cam.z;
	let radY = -cam.angleY * (Math.PI / 180);
	let radX = -cam.angleX * (Math.PI / 180);
	
	let cosY = Math.cos(radY), sinY = Math.sin(radY);
	let cosX = Math.cos(radX), sinX = Math.sin(radX);
	
	let x2 = tx*cosY - tz*sinY;
	let z1 = tx*sinY + tz*cosY;
	let y2 = ty*cosX - z1*sinX;
	let z2 = ty*sinX + z1*cosX;
	
	return [x2, y2, z2];
}

function checkPos(tr) {
	return (tr.z1>0.01 || tr.z2>0.01 || tr.z3>0.01)
}

function renderUpdate(cam, tM, rM) {
	if (!rM) {rM=[];}
	for (let chk=0; chk<tM.length; chk++) {
		if (!rM[chk]) {rM[chk] = [];}
		for (let tri=0; tri<tM[chk].length; tri++) {
			if (!rM[chk]) {rM[chk] = {};}
			let tris = tM[chk][tri];
			let [x1,y1,z1] = tranfPoint(cam,tris.x1,tris.y1,tris.z1);
			let [x2,y2,z2] = tranfPoint(cam,tris.x2,tris.y2,tris.z2);
			let [x3,y3,z3] = tranfPoint(cam,tris.x3,tris.y3,tris.z3);
			let avgZ = (z1+z2+z3)*3;
			rM[chk][tri] = {
				x1:x1,y1:y1,z1:z1,
				x2:x2,y2:y2,z2:z2,
				x3:x3,y3:y3,z3:z3,
				avZ:avgZ,color:tM[chk][tri]
			}
		}
		rM[chk].sort((a,b) => {
			return a.avZ - b.avZ;
		});
	}
}

function convShapes(curs, map) {
	let render = {};
	for (let chk=0; chk<map.length; chk++) {
		render[chk] = [];
		for (let shp=0; shp<map[chk].map.length; shp++) {
			let shp2 = map[chk].map[shp];
			let points = shp2.points;
			function addTri(p1,p2,p3,col) {
				let colr = col ? col : shp2.colors[0];
				console.log(p1);
				if (p1.color) {colr=p1.color;}
				if (p2.color) {colr=p2.color;}
				if (p3.color) {colr=p3.color;}
				render[chk].push({
					x1:p1.x,y1:p1.y,z1:p1.z,
	  	  	   	    x2:p2.x,y2:p2.y,z2:p2.z,
	  	  	   	    x3:p3.x,y3:p3.y,z3:p3.z,
	  	  	   	    avZ:0, color:colr
				});
			} 
			switch(shp2.shape) {
				case "polygon":
					for (let i=0; i<Math.floor(points.length/3); i++) {
						addTri(points[(i*3)],points[1+(i*3)],points[2+(i*3)])
					}
					break;
				default:
					if (shpBluePrint[shp2.shape]) {
						for (let i=0; i<shpBluePrint[shp2.shape].length; i++) {
							let b = shpBluePrint[shp2.shape][i]
							addTri(points[b[0]-1], points[b[1]-1], points[b[2]-1]);
						}
					}
					break;
			}
			if (chk==1 && projectProp.devMode && curs.tempTriList.length>0) {
				for (let t=0; t<curs.tempTriList.length; t++) {
					let rawMap = curs.tempTriList[t];
					render[chk].push({
						x1:rawMap.x1, y1:rawMap.y1, z1:rawMap.z1,
		  	  	   		x2:rawMap.x2, y2:rawMap.y2, z2:rawMap.z2,
		  	  	   		x3:rawMap.x3, y3:rawMap.y3, z3:rawMap.z3,
		  	  	   		avZ:0, color:rawMap.color
					});
				}
			}
		}
	}
	console.log(render);
	return render;
}

function drawTri(cam, rM) {
	for (let i=0; i<rM.length; i++) {
		ctx.fillStyle="#FFFFFF";
		ctx.fillText(`renderList size: ${rM[i].length}`,0,32)
		ctx.fillStyle="#000000";
		for (let k=0; k<rM[i].length; k++) {
			let t = rM[i][k];
			if (checkPos(t)) {
				let projZ1 = Math.max(t.z1,0.01),projZ2 = Math.max(t.z2,0.01),projZ3 = Math.max(t.z3,0.01);
				
				let x1 = project3D(cam,t.x1,projZ1,gameScreen.width);
				let y1 = project3D(cam,t.y1,projZ1,gameScreen.height, true);
				let x2 = project3D(cam,t.x2,projZ2,gameScreen.width);
				let y2 = project3D(cam,t.y2,projZ2,gameScreen.height, true);
				let x3 = project3D(cam,t.x3,projZ3,gameScreen.width);
				let y3 = project3D(cam,t.y3,projZ3,gameScreen.height, true);
				
				drawFillTri(x1,y1,x2,y2,x3,y3,t.color);
			}
		}
	}
}

function drawDot(cam) {
	let [x, y, z] = tranfPoint(cam,cursor.x,cursor.y,cursor.z);
	if (z>=0.01) {
		let x_2 = project3D(cam,x,z,gameScreen.width);
		let y_2 = project3D(cam,y,z,gameScreen.height,true);
		drawFillCirc(x_2,y_2,3,"RED")
	}
}

function geminiFloor() {
	let size = 200, step = 20;
	for (let i=-size; i<size; i+=step) {
		let [x1, y1, z1] = tranfPoint(i,40,-size);
		let [x2, y2, z2] = tranfPoint(i,40,size);
		let [x3, y3, z3] = tranfPoint(-size,40,i);
		let [x4, y4, z4] = tranfPoint(size,40,i);
		
		if (z1>0 && z2>0) {
			drawLine(
				project3D(x1,z1,gameScreen.width),
				project3D(y1,z1,gameScreen.height,true),
				project3D(x2,z2,gameScreen.width),
				project3D(y2,z2,gameScreen.height,true),
				"GRAY"
			)
		}
		if (z3>0 && z4>0) {
			drawLine(
				project3D(x3,z3,gameScreen.width),
				project3D(y3,z3,gameScreen.height,true),
				project3D(x4,z4,gameScreen.width),
				project3D(y4,z4,gameScreen.height,true),
				"GRAY"
			)
		}
	}
}

function drawFillCirc(x,y,rad,col) {
	ctx.beginPath();
	ctx.fillStyle = colors[col] ? colors[col] : "#000000";
	ctx.ellipse(x,y,rad,rad);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "#FFFFFF";
}

function drawFillTri(x1,y1,x2,y2,x3,y3,col) {
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineTo(x3,y3);
	ctx.closePath();
	ctx.fillStyle = colors[col] ? colors[col] : "#000000";
	ctx.fill();
	ctx.fillStyle = "#FFFFFF";
}

function drawLine(x1,y1,x2,y2,col) {
	ctx.beginPath();
	ctx.fillStyle = colors[col] ? colors[col] : "#000000";
	ctx.setLineDash([]);
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
	ctx.fillStyle = "#FFFFFF";
}

//event listeners

document.addEventListener("keydown", function(event) {
	keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
	keys[event.key] = false;
});