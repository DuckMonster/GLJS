//VBOs
function VBO(dimensions) {
	this.handle = gl.createBuffer();
	this.dimensions = dimensions;
	this.data = [];
}

VBO.prototype = {
	handle: 0,
	data: [],
	dimensions: 3,
	shaderHandle: null,

	bind: function (shaderHandle) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
		VBO.activeVBO = this;
	},

	bindShader: function (shaderHandle) {
		this.bind();
		gl.enableVertexAttribArray(shaderHandle);
		gl.vertexAttribPointer(shaderHandle, this.dimensions, gl.FLOAT, false, 0, 0);
	},

	getVertexCount: function () {
		return this.data.length / this.dimensions;
	},

	setVertexCount: function (len) {
		if (this.getVertexCount() == len) { return; }

		var data = this.data;

		while (this.getVertexCount() < len) {
			data.push(1);
		}
		if (this.getVertexCount() > len) {
			data = data.splice(len);
		}

		this.setData(data);
	},

	setData: function (data) {
		this.data = data;
		this.bind();

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.DYNAMIC_DRAW);

		releaseVBO();
	}
}

VBO.activeVBO = null;
function releaseVBO() {
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	VBO.activeVBO = null;
}
////