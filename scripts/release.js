import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const pkgPath = path.resolve('package.json')

// 校验包合法性
fs.accessSync(path.resolve('dist'), fs.constants.F_OK)
fs.accessSync(path.resolve('dist/canvas-editor.es.js'), fs.constants.F_OK)
fs.accessSync(path.resolve('dist/canvas-editor.umd.js'), fs.constants.F_OK)

// 缓存项目package.json
const sourcePkg = fs.readFileSync(pkgPath, 'utf-8')

// 删除无用属性
const targetPkg = JSON.parse(sourcePkg)
const version = targetPkg.version.split('.')
version[2] = `${new Date().getTime()}`

Reflect.deleteProperty(targetPkg, 'dependencies')
Reflect.deleteProperty(targetPkg.scripts, 'postinstall')

Reflect.set(targetPkg, 'version', version.join('.'))
Reflect.set(targetPkg, 'name', '@brickio/canvas-editor')
Reflect.set(targetPkg, 'author', 'zhouyantao <zhouyantao@karrytech.com>')
Reflect.set(targetPkg, 'publishConfig', {
  registry: 'http://npm.karrytech.com',
  access: 'public'
})

fs.writeFileSync(pkgPath, JSON.stringify(targetPkg, null, 2))

// 发布包
try {
  execSync('npm publish')
} catch (error) {
  throw new Error(error)
} finally {
  // 还原
  fs.writeFileSync(pkgPath, sourcePkg)
}
