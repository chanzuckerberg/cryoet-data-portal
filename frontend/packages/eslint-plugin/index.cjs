module.exports = {
  rules: {
    'no-root-mui-import': {
      meta: {
        fixable: 'code',
      },

      create(context) {
        return {
          ImportDeclaration(node) {
            const value = node.source.value || ''

            if (typeof value === 'string' && /@mui\/(\w+)$/.exec(value)) {
              context.report({
                node,

                message:
                  "Don't use root `@mui/*` imports for better build performance.",

                fix(fixer) {
                  const importNames = node.specifiers
                    .filter((spec) => spec.type === 'ImportSpecifier')
                    .map((spec) => spec.local.name)

                  return fixer.replaceText(
                    node,
                    importNames
                      .map((mod) => `import ${mod} from '${value}/${mod}';`)
                      .join('\n'),
                  )
                },
              })
            }
          },
        }
      },
    },

    'prefer-lodash-es': {
      meta: {
        fixable: 'code',
      },

      create(context) {
        return {
          ImportDeclaration(node) {
            const value = node.source.value || ''

            if (typeof value === 'string' && value === 'lodash') {
              context.report({
                node,
                message: "Don't use lodash, prefer lodash-es.",

                fix(fixer) {
                  return fixer.replaceText(node.source, "'lodash-es'")
                },
              })
            }
          },
        }
      },
    },
  },
}
