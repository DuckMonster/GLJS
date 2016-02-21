var canvas;
var program;
var perspectiveMatrix;
var viewMatrix;

var model;
var lightModel;
var originModel;
var texture;

var lightDistance = 1.0;
var lightRadius = 2.0;

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
	
	//UPDATE LIGHTS
	//Ambient
	gl.uniform1f(program.getUniform("u_ambient"), 0.3);
	
	//Point light
	gl.uniform1i(program.getUniform("u_lightN"), 1);
	gl.uniform3f(program.getUniform("u_lights[0].position"), Math.sin(rotation) * lightDistance, Math.cos(rotation) * lightDistance, 0.0);
	gl.uniform1f(program.getUniform("u_lights[0].radius"), lightRadius);
	
	//DRAW MODELS
	//Light
	lightModel.position = $V([Math.sin(rotation) * lightDistance, Math.cos(rotation) * lightDistance, 0.0])
	lightModel.draw();
	
	//Cubes
	model.position = $V([-2, 0, 0]);
	model.rotation = $V([0, 0, rotation]);
	model.draw();
	
	model.position = $V([0, 0, 0]);
	model.rotation = $V([0, 0, 0]);
	model.draw();
	
	model.position = $V([2, 0, 0]);
	model.rotation = $V([0, rotation, rotation]);
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
	texture = new Texture("res/sample2.png");

	OBJ.load("res/thingObj.obj", function (result) {
		model = new Model();
		model.setVertices(result.positions);
		model.setNormals(result.normals);
		model.setUVs(result.uvs);
		model.texture = texture;
	});
	
	OBJ.load("res/lightMesh.obj", function (result) {
		lightModel = new Model();
		lightModel.setVertices(result.positions);
		lightModel.setNormals(result.normals);
		lightModel.setUVs(result.uvs);
		
		lightModel.scale = $V([.2, .2, .2]);
	});

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

//Checkboxes
function distanceChanged() {
	gl.uniform1i(program.getUniform("u_expo_distance"), document.getElementById("distanceBox").checked ? 1 : 0);
}

function angleChanged() {
	gl.uniform1i(program.getUniform("u_expo_angle"), document.getElementById("angleBox").checked ? 1 : 0);
}

function radiusChanged() {
	lightRadius = parseFloat(document.getElementById("lightRadius").value);
}

function lightDistanceChanged() {
	lightDistance = parseFloat(document.getElementById("lightDistance").value);
}