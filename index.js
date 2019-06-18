
const { getOptions, interpolateName } = require('loader-utils')
const babel = require('babel-core')
const types = require('babel-types')
const MATCH_AT_MOCK = /@mock\(([\w\W]+?)\)[\r\n\s]*(\w+)\s+([\w_]+)/g

module.exports = function(source) {
  const { mock, name, context, outputPath } = getOptions(this)

  const mockFns = {}
  if (MATCH_AT_MOCK.test(source)) {
    source = source.replace(MATCH_AT_MOCK, (_, mockData, declarate, funcName) => {
      if (mock) {
        mockFns[funcName] = {
          mock: new Function(`return ${mockData}`)(),
        }
      }
      return declarate + ' ' + funcName
    })
  }
  if (!mock) return this.callback(null, source, null)

  const compiled = babel.transform(source, {
    plugins: {
      visitor: {
        FunctionDeclaration(path) {
          let retValue
          const {
            id, params, body, generator, async,
          } = path.node
          
          if (retValue = mockFns[id.name]) {
            path.replaceWith(types.functionDeclaration(id, params,
              babel.template(`{return ${JSON.stringify(retValue)}}`)({}),
              generator, async)
            )
            delete mockFns[id.name]
          }
        },
        ArrowFunctionExpression(path) {
          let retValue
          if (path.parent.id && (retValue = mockFns[path.parent.id.name])) {
            const { params, async } = path.node
            path.replaceWith(types.arrowFunctionExpression(params,
              babel.template(`{return ${JSON.stringify(retValue)}}`)({}),
              async)
            )
            delete mockFns[path.parent.id.name]
          }
        }
      }
    }
  })
  source = compiled.code

  this.callback(null, source, null)
}