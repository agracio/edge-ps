var path = require('path');

exports.getCompiler = function () {
	return process.env.EDGE_PS_NATIVE || ( process.env.EDGE_USE_CORECLR ? path.join(__dirname, 'edge-ps-coreclr.dll') : path.join(__dirname, 'edge-ps.dll'));
};

exports.getBootstrapDependencyManifest = function() {
	return path.join(__dirname, 'edge-ps-coreclr.deps.json');
}
