var gl;

function initWebGL(canvas) {
	gl = canvas.getContext("experimental-webgl");
	if (!gl) {
		alert("Failure initializing webgl");
	}
}

//Matrix extensions
