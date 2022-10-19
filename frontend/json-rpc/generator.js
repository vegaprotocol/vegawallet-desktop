const path = require('path')
const log = require('loglevel')
const { readFile, writeFile } = require('fs-extra')
const { template, camelCase, toUpper } = require('lodash')
const { compile } = require('json-schema-to-typescript')
const { Command } = require('commander')
const fetch = require('node-fetch')

const COMPILE_OPTS = {
  additionalProperties: false,
  bannerComment: ''
}

log.setLevel('trace')
const logger = log.getLogger('JSON-RPC-Generator')

const pascalCase = str => camelCase(str).replace(/^(.)/, toUpper)

const getMethodName = method => {
  return pascalCase(method.name).replace('Admin', '')
}

const getMethodParamsType = method => {
  return `${getMethodName(method)}Params`
}

const getMethodResultType = method => {
  return `${getMethodName(method)}Result`
}

const getMethodParams = method => {
  if (method.paramStructure === 'by-name') {
    return 'params'
  }
  return `...params`
}

const withoutTitles = doc => {
  return JSON.parse(JSON.stringify(doc).replace(/"title":\s?"(.*?)",/, ''))
}

const withoutSchemas = doc => {
  return JSON.parse(
    JSON.stringify(doc).replace(/"schema":\s?"(.*?)",/, (a, match) => {
      console.log(a, match)
      console.log('\n')
      return ''
    })
  )
}

const normalizeDocument = doc => {
  if (doc && Array.isArray(doc)) {
    const pieces = []
    for (let index in doc) {
      pieces.push(normalizeDocument(doc[index]))
    }
    return pieces
  }

  if (doc && typeof doc === 'object') {
    if (doc.title) {
      // remove title props, which is a generated string. since we use it for type generation, we want human readable type names
      delete doc.title
    }

    if (doc.schema) {
      const schema = doc.schema
      // remove schema props, param types are wrapped into this, the json schema parser doesn't recognise it
      delete doc.schema
      Object.assign(doc, schema)
    }

    for (let key in doc) {
      Object.assign(doc, { [key]: normalizeDocument(doc[key]) })
    }
  }
  return doc
}

const getParamsSchemaByName = method =>
  method.params.reduce(
    (acc, param) => {
      const { name, required, ...rest } = param
      acc.properties[name] = rest
      if (required) {
        acc.required.push(name)
      }
      return acc
    },
    {
      title: `${getMethodName(method)}Params`,
      type: 'object',
      required: [],
      properties: {}
    }
  )

const getParamsSchemaByPosition = method => ({
  title: `${getMethodName(method)}Params`,
  type: 'array',
  items: method.params
})

const getResultSchema = method => {
  const result = method.result
  const { name, title, ...rest } = result

  return {
    ...rest,
    title: `${getMethodName(method)}Result`
  }
}

const getTsDefs = async openrpcDocument => {
  const normalizedDocument = normalizeDocument(
    JSON.parse(JSON.stringify(openrpcDocument))
  )

  const schema = normalizedDocument.methods.reduce(
    (acc, method) => {
      acc.properties[`${getMethodName(method)}Result`] = getResultSchema(method)
      acc.properties[`${getMethodName(method)}Params`] =
        method.paramStructure === 'by-name'
          ? getParamsSchemaByName(method)
          : getParamsSchemaByPosition(method)
      return acc
    },
    {
      title: 'Methods',
      type: 'object',
      properties: {},
      components: {
        schemas:  Object.keys(openrpcDocument.components.schemas).reduce(
          (acc, key) => {
            acc[key] = {
              ...openrpcDocument.components.schemas[key],
              title: pascalCase(key)
            }
            return acc
          },
          {}
        )
      }
    }
  )

  return compile(schema, '', COMPILE_OPTS)
}

const isUrl = path => {
  try {
    new URL(path)
    return true
  } catch (err) {
    return false
  }
}

const getRemoteFile = async filePath => {
  const res = await fetch(filePath)
  const json = await res.json()
  return json
}

const getJsonFileContent = async filePath => {
  if (isUrl(filePath)) {
    logger.info(`Fetching remote openrpc specs...`)
    return getRemoteFile(filePath)
  } else {
    logger.info(`Reading specs file content...`)
    return require(filePath)
  }
}

const createClient = () => {
  const program = new Command('jsonrpc')

  program
    .command('generate')
    .description('Generate JSONRPC client')
    .option('-d, --document <file>', 'The path to openrpc json file.')
    .option(
      '-o, --outFile <file>',
      'The path to the file where the client gets generated.'
    )
    .option(
      '-t, --template <file>',
      'The path to the template which is used to generate the client.'
    )
    .option(
      '-c, --config <file>',
      'The path to the codegen configuration file.'
    )
    .action(async ({ config, ...rest }) => {
      const configContent = config
        ? require(path.join(process.cwd(), config))
        : {}
      const {
        document,
        outFile,
        template: templateFile
      } = { ...configContent, ...rest }

      if (!document) {
        throw new Error('-d, --document: missing document path')
      }

      if (!document) {
        throw new Error('-o, --outFile: missing target path')
      }

      if (!document) {
        throw new Error('-t, --template: missing template path')
      }

      const [openrpcDocument, templateContent] = await Promise.all([
        getJsonFileContent(document),
        readFile(templateFile).then(buff => buff.toString())
      ])

      const types = await getTsDefs(openrpcDocument)

      const content = template(templateContent)({
        types,
        openrpcDocument,
        getMethodName,
        getMethodParamsType,
        getMethodResultType,
        getMethodParams
      })

      await writeFile(path.join(process.cwd(), outFile), content)
      logger.info(`Generated client to ${path.join(process.cwd(), outFile)}`)
    })

  program.parse(process.argv)
}

createClient()
