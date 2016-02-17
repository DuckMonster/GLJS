function Texture(imageSource) {	
	this.handle = gl.createTexture();
	this.image = new Image();
	
	var tex = this;
	
	this.image.onload = function () { tex.onLoaded(); };
	this.image.src = imageSource;
	
	this.loadTempData();
}

Texture.prototype = {
	handle: -1,
	image: null,
	
	loadTempData: function () {
		this.bind();

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
			new Uint8Array([
				255, 0, 0, 255
			]));

		releaseTexture();
	},
	
	onLoaded: function () {
		this.bind();

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		releaseTexture();
	},

	bind: function () {
		gl.bindTexture(gl.TEXTURE_2D, this.handle);
	}
}

function releaseTexture() {
	gl.bindTexture(gl.TEXTURE_2D, null);
}

function textureLoaded(texture, image) {
	texture.bind();

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

	releaseTexture();
}