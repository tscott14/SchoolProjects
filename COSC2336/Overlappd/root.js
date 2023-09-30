const { builtinModules } = require('module')
const Path = require('path')

module.exports.getFromRootDirectory = (tail) => {
	return Path.join(__dirname, tail || '')
}

module.exports.getFromBuildDirectory = (tail) => {
	return Path.join(__dirname, 'client', 'build', tail || '')
}

module.exports.getFromPublicDirectory = (tail) => {
	return Path.join(__dirname, 'client', 'public', tail || '')
}
