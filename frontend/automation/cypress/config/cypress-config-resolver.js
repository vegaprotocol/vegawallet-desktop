const path = require('path')
const deepmerge = require('deepmerge')

const cypressConfigResolver = config => {
  let configJson = require(config.configFile)
  if (configJson.extends) {
    const baseConfigFilename = path.join(config.projectRoot, configJson.extends)
    const baseConfig = require(baseConfigFilename)
    console.log('merging %s with %s', baseConfigFilename, config.configFile)
    configJson = deepmerge(baseConfig, configJson)
  }

  return deepmerge(config, configJson)
}

module.exports.cypressConfigResolver = cypressConfigResolver
