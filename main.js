var canvas;
var program;
var perspectiveMatrix;
var viewMatrix;

var model;
var originModel;

var canvas2D;

function main() {
	canvas = document.getElementById("glcanvas");
	initWebGL(canvas);

	updateSize();

	initProgram();
	initBuffers();

	setInterval(drawScene, 1.0 / 60.0);
}

var rotation = 0.0;

function drawScene() {
	rotation += 0.2 / 60.0;
	model.position = $V([0, Math.sin(rotation), 0])

	gl.clearColor(0.1, 0.1, 0.1, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	viewMatrix = makeLookAt(
		3.0, -3.0, 3.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 1.0);

	var u_perspective = program.getUniform("u_projection");
	gl.uniformMatrix4fv(u_perspective, false, perspectiveMatrix.flatten());

	var u_view = program.getUniform("u_view");
	gl.uniformMatrix4fv(u_view, false, viewMatrix.flatten());
	
	//DRAW MODELS
	model.position = $V([-2, 0, 0]);
	model.rotation = $V([rotation, 0, 0]);
	model.draw();

	model.position = $V([0, 0, 0]);
	model.rotation = $V([0, 0, rotation]);
	model.draw();

	model.position = $V([2, 0, 0]);
	model.rotation = $V([0, 0, rotation]);
	model.draw();
	//
	
	//DRAW ORIGIN	
	gl.lineWidth(10.0);
	originModel.draw();
}

function updateSize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	gl.viewport(0, 0, canvas.width, canvas.height);
	perspectiveMatrix = makePerspective(45, canvas.width / canvas.height, 0.1, 100.0);
}

function initBuffers() {
	var addFace = function (arr, verts) {
		
		for (var j = 0; j < 3; j++) {
			for (var i = 0; i < 3; i++) {
				arr.push(verts[j][i]);
			}
		}
		for (var j = 1; j < 4; j++) {
			for (var i = 0; i < 3; i++) {
				arr.push(verts[j][i]);
			}
		}
	}
	
	var cube = [
		[0.5, 0.5, 0.5],
		[-0.5, 0.5, 0.5],
		[0.5, -0.5, 0.5],
		[-0.5, -0.5, 0.5],
			
		[0.5, 0.5, -0.5],
		[-0.5, 0.5, -0.5],
		[0.5, -0.5, -0.5],
		[-0.5, -0.5, -0.5]
	]
	
	var v = []
	addFace(v, [cube[0], cube[1], cube[2], cube[3]]);
	addFace(v, [cube[2], cube[3], cube[6], cube[7]]);
	addFace(v, [cube[0], cube[1], cube[4], cube[5]]);
	addFace(v, [cube[4], cube[5], cube[6], cube[7]]);
	addFace(v, [cube[5], cube[7], cube[1], cube[3]]);
	addFace(v, [cube[0], cube[2], cube[4], cube[6]]);
		
	var uvs = [
		1, 1,
		0, 1,
		1, 0,
		
		0, 1,
		1, 0,
		0, 0,
		
		1, 1,
		0, 1,
		1, 0,
		
		0, 1,
		1, 0,
		0, 0,
		
		1, 1,
		0, 1,
		1, 0,
		
		0, 1,
		1, 0,
		0, 0,
		
		1, 1,
		0, 1,
		1, 0,
		
		0, 1,
		1, 0,
		0, 0,
		
		1, 1,
		0, 1,
		1, 0,
		
		0, 1,
		1, 0,
		0, 0,
		
		1, 1,
		0, 1,
		1, 0,
		
		0, 1,
		1, 0,
		0, 0,
	]

	model = new Model();
	model.setVertices(v);
	model.setUVs(uvs);
	
	model.texture = new Texture("sample2.png");
	
	originModel = new Model();
	originModel.setVertices([
		0.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		
		0.0, 0.0, 0.0,
		0.0, 1.0, 0.0,
		
		0.0, 0.0, 0.0,
		0.0, 0.0, 1.0
	]);
	originModel.setColors([
		1, 0, 0,
		1, 0, 0,
		
		0, 1, 0,
		0, 1, 0,
		
		0, 0, 1,
		0, 0, 1,
	])
	
	originModel.mesh.vertexN = 200;
	originModel.mesh.drawMode = gl.LINES;
}

function initProgram() {
	program = new ShaderProgram("shader-vs", "shader-fs");
	program.use();
}