<template>
  <svg class="gitreefont" aria-hidden="true">
    <use :xlink:href="`#${fontName}`"></use>
  </svg>
</template>

<script>
import { gitreeIcons } from './config'
import { getFileType } from '@/utils'

export default {
  name: 'FileIcon',
  props: {
    filename: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // mdi: true,
      // fontName: ''
    }
  },
  computed: {
    // 文件扩展名(已转小写), 不含 .
    fileType () {
      return getFileType(this.filename)
    },
    // iconfont
    fontName () {
      const filename = this.filename.toLowerCase()

      // npm
      if (['package.json', 'package-lock.json', '.npmignore'].includes(filename)) {
        return 'gitree-npm'
      }

      // babel
      if (['babel.config.js'].includes(filename)) return 'gitree-babel'

      // webpack
      if (/\bwebpack\b.{0,}\.(js|ts)$/.test(filename)) return 'gitree-webpack'

      // eslint
      if (['.eslintrc.js'].includes(filename)) return 'gitree-eslint'

      // readme
      if (['readme.md'].includes(filename)) return 'gitree-book'

      // postcss
      if (['postcss.config.js'].includes(filename)) return 'gitree-postcss'

      // grunt
      if (['gruntfile.js'].includes(filename)) return 'gitree-grunt'

      // gulp
      if (['gulpfile.js'].includes(filename)) return 'gitree-gulp'

      // prettier
      if (['prettier.config.js'].includes(filename)) return 'gitree-prettier'

      // travis
      if (['.travis.yml'].includes(filename)) return 'gitree-travis'

      // yarn
      if (['yarn.lock', '.yarnrc'].includes(filename)) return 'gitree-yarn'

      // browserslist
      if (['.browserslistrc'].includes(filename)) return 'gitree-browserslist'

      // editorconfig
      if (['.editorconfig'].includes(filename)) return 'gitree-editorconfig'

      // jest
      if (['jest.config.js'].includes(filename)) return 'gitree-jest'

      // bower
      if (['bower.json'].includes(filename)) return 'gitree-bower'

      // karma
      if (/\bkarma\b.{0,}\.(js|ts)$/.test(filename)) return 'gitree-karma'

      // makefile
      if (['makefile'].includes(filename)) return 'gitree-makefile'

      // license
      if (['license'].includes(filename)) return 'gitree-license'

      // env
      if (/^\.env\.*/.test(filename)) return 'gitree-env'

      return gitreeIcons[this.fileType] || 'gitree-file'
    }
  }
}
</script>

<style lang="scss">
.gitreefont {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
