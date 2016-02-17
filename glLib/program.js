function ShaderProgram(vertexID, fragmentID) {	
	var vertexShader = getShaderFromDOM(vertexID);
	var fragmentShader = getShaderFromDOM(fragmentID);

	this.handle = gl.createProgram();
	gl.attachShader(this.handle, vertexShader);
	gl.attachShader(this.handle, fragmentShader);

	gl.linkProgram(this.handle);

	if (!gl.getProgramParameter(this.handle, gl.LINK_STATUS)) {
		alert("Error linking program.");
	}
}

ShaderProgram.prototype = {
	handle: -1,

	use: function () {
		gl.useProgram(this.handle);
	},

	getAttribute: function (name) {
		return gl.getAttribLocation(this.handle, name);
	},

	getUniform: function (name) {
		return gl.getUniformLocation(this.handle, name);
	}
}

function getShaderFromDOM(id) {
	var shaderScript = document.getElementById(id);

	var source = "";
	var currentChild = shaderScript.firstChild;
	
	//Get the source!
	while (currentChild) {
		if (currentChild.nodeType == 3) {
			source += currentChild.textContent;
		}

		currentChild = currentChild.nextSibling;
	}
	//
	
	var shader;

	if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
	}

	return shader;
}