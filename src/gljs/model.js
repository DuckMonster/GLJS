function Model() {
	this.mesh = new Mesh();
	this.vboPosition = new VBO(3);
	this.vboUV = new VBO(2);
	this.vboColor = new VBO(3);
	this.vboNormal = new VBO(3);
	
	this.mesh.addAttribute(this.vboPosition, "a_vertexPosition");
	this.mesh.addAttribute(this.vboUV, "a_vertexUV");
	this.mesh.addAttribute(this.vboColor, "a_vertexColor");
	this.mesh.addAttribute(this.vboNormal, "a_vertexNormal");
}

Model.prototype = {
	mesh: null,
	vboPosition: null,
	vboUV: null,
	vboColor: null,
	vboNormal: null,
	texture: null,
	
	position: $V([0, 0, 0]),
	scale: $V([1, 1, 1]),
	rotation: $V([0, 0, 0]),
	
	setVertices: function (data) {
		this.vboPosition.setData(data);
	},
	setUVs: function (data) {
		this.vboUV.setData(data);
	},
	setColors: function (data) {
		this.vboColor.setData(data);
	},
	setNormals: function (data) {
		this.vboNormal.setData(data);
	},
	
	setUniforms: function (program) {
		var modelUni = program.getUniform("u_model");
		var normalUni = program.getUniform("u_normal");
		
		var mat = Matrix.I(4);
		var nor = Matrix.I(4);
		
		if (this.position.length() > 0) {
			mat = mat.x(Matrix.Translation(this.position));
		}
		
		if (this.rotation.e(3) != 0) {
			mat = mat.x(Matrix.RotationZ(this.rotation.e(3)).ensure4x4());
			nor = nor.x(Matrix.RotationZ(this.rotation.e(3)).ensure4x4());
		}
		if (this.rotation.e(2) != 0) {
			mat = mat.x(Matrix.RotationY(this.rotation.e(2)).ensure4x4());
			nor = nor.x(Matrix.RotationY(this.rotation.e(2)).ensure4x4());
		}
		if (this.rotation.e(1) != 0) {
			mat = mat.x(Matrix.RotationX(this.rotation.e(1)).ensure4x4());
			nor = nor.x(Matrix.RotationX(this.rotation.e(1)).ensure4x4());
		}
		
		if (this.scale.e(0) != 1 || this.scale.e(1) != 1 || this.scale.e(2) != 1) {
			mat = mat.x(Matrix.Scale(this.scale));
		}
		
		gl.uniformMatrix4fv(modelUni, false, mat.flatten());
		gl.uniformMatrix4fv(normalUni, false, nor.flatten());
		
		//TEXTURE
		gl.uniform1i(program.getUniform("usingTexture"), this.texture == null ? 0 : 1);
		
		if (this.texture != null) {
			this.texture.bind();
		}
	},
	
	draw: function () {
		this.setUniforms(this.mesh.program);
		this.mesh.draw();
	}
}