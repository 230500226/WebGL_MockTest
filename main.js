function showError(error) { //trying to show error within the webpage
	console.error(error); //for redundancy
	const div = document.getElementById("error-box");
	const errorSpanp = document.createElement("p");
	errorSpanp.innerText = error;
	div.appendChild(errorSpanp);
}

function Point(){
	const canvas = document.getElementById("IDcanvas");
		if (!canvas) {
			showError("canvas not found");
		}
		gl = canvas.getContext('webgl2');
		if (!gl) {
			showError("webgl2 not found");
			console.log('error');
		}

	const vertexShaderSourceCode = `#version 300 es
	precision mediump float;
	in vec2 vertexPosition;
	
	void main(){
		gl_Position = vec4(vertexPosition, 0, 1);
		gl_PointSize = 30.0;
	}`;

	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderSourceCode);
	gl.compileShader(vertexShader);
	//error checking vertexShaderSourceCode showError gl.COMPILE_STATUS
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		showError('Vertex shader failed to compile: ' + gl.getShaderInfoLog(vertexShader));
	}
	
	const fragmentShaderSourceCode = `#version 300 es
	precision mediump float;
	out vec4 outPutColor;

	void main(){
		outPutColor = vec4(0.3,0.3,0.3,1);
	}`;
	
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
	gl.compileShader(fragmentShader);	
	//error checking fragmentShaderSourceCode showError gl.COMPILE_STATUS

	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		showError('Fragment shader failed to compile: ' + gl.getShaderInfoLog(fragmentShader));
	}

	const pointProgram = gl.createProgram();
	gl.attachShader(pointProgram, vertexShader);
	gl.attachShader(pointProgram, fragmentShader);
	gl.linkProgram(pointProgram);
	gl.useProgram(pointProgram);
	gl.clearColor(1.0, 0.4, 0.2, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//error checking the program with gl.getLinkstatus and gl.infolog
	
	const pointVerticies = [
		0.5,0.5 //Centre of first quad
	]

	const vertexCpuBuffer = new Float32Array(pointVerticies);
	const pointBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexCpuBuffer, gl.STATIC_DRAW);
	
 
	const position = gl.getAttribLocation(pointProgram, "vertexPosition"); //error checking for position 
	gl.enableVertexAttribArray(position);

	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.POINTS, 0, 1);
}

try {
	Point();	
}catch (error) {
	showError('Point function could not compile'+error);
}