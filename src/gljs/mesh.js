function Mesh() {
	this.setProgram(program);
	this.drawMode = gl.TRIANGLES;
	this.attributeList = [];
}

Mesh.prototype = {
	attributeList: [],
	program: null,
	drawMode: 0,
	vertexN: 6,
	
	addAttribute: function (vbo, name) {
		this.attributeList.push(new Mesh.Attribute(vbo, this.program, name));
	},
	
	getAttribute: function (name) {
		for (var i = 0; i < this.attributeList.length; i++) {
			if (this.attributeList[i].attributeName === name) {
				return this.attributeList[i];
			}
		}
		
		return null;
	},
	
	setAttributeData: function (name, data) {
		var attr = this.getAttribute(name);
		attr.vbo.setData(data);
	},
	
	getLongestAttribute: function () {
		var longest = this.attributeList[0].vbo;
		
		for (var i = 0; i < this.attributeList.lenght; i++) {
			if (this.attributeList[i].vbo.getVertexCount() > longest.getVertexCount()) {
				longest = this.attributeList[i].vbo;
			}
		}
		
		return longest;
	},
	
	normalizeVertexCount: function (len) {
		for (var i = 0; i < this.attributeList.length; i++) {
			this.attributeList[i].vbo.setVertexCount(len);
		}
		
		this.vertexN = len;
	},
	
	setProgram: function (program) {
		this.program = program;
	},
	
	bind: function () {		
		for (var i = 0; i < this.attributeList.length; i++) {
			this.attributeList[i].bind();
		}
	},
	
	draw: function () {
		this.bind();
		this.normalizeVertexCount(this.getLongestAttribute().getVertexCount());
		
		gl.drawArrays(this.drawMode, 0, this.vertexN);
	}
}

Mesh.Attribute = function(vbo, program, name) {
	this.vbo = vbo;
	this.attributeName = name;
	this.attribute = program.getAttribute(name);
}

Mesh.Attribute.prototype = {
	vbo: null,
	attributeName: "",
	attribute: null,
	
	bind: function () {
		this.vbo.bindShader(this.attribute);
	}
}