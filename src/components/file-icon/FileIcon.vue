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
      if (['prettier.config.js', '.prettierrc.js', '.prettierrc.json'].includes(filename)) return 'gitree-prettier'

      // travis
      if (['.travis.yml'].includes(filename)) return 'gitree-travis-plain'

      // yarn
      if (['yarn.lock', '.yarnrc', 'yarnrc.yml'].includes(filename)) return 'gitree-yarn'

      // browserslist
      if (['.browserslistrc'].includes(filename)) return 'gitree-browserslist'

      // editorconfig
      if (['.editorconfig'].includes(filename)) return 'gitree-editorconfig'

      // jest
      if (['jest.config.js'].includes(filename)) return 'gitree-jest'

      // bower
      if (['bower.json'].includes(filename)) return 'gitree-bower'

      // apache
      if (['httpd.conf'].includes(filename)) return 'gitree-apache'

      // netlify
      if (['netlify.toml'].includes(filename)) return 'gitree-netlify'

      // ruby
      if (['Gemfile'].includes(filename)) return 'gitree-ruby'

      // jquery
      if (/\bjquery\b.{0,}\.(js|ts)$/.test(filename)) return 'gitree-jQuery'

      // jquery-ui
      if (/\bjquery(-|.)ui\b.{0,}\.(js|ts)$/.test(filename)) return 'gitree-jquery-ui'

      // karma
      if (/\bkarma\b.{0,}\.(js|ts|yml|yaml)$/.test(filename)) return 'gitree-karma'

      // mocha
      if (/\bmocha\b.{0,}\.(js|ts|yml|yaml)$/.test(filename)) return 'gitree-mocha'

      // codecov: codecov.yml
      if (/\bcodecov\b.{0,}\.(js|ts|yml|yaml)$/.test(filename)) return 'gitree-codecov'

      // protractor
      if (/\bprotractor\b.{0,}\.(js|ts|yml|yaml)$/.test(filename)) return 'gitree-protractor'

      // docker: Dockerfile, docker-compose.yaml
      if (/\bdocker\b.{0,}(\.(yml|yaml))?$/.test(filename)) return 'gitree-mocha'

      // makefile
      if (['makefile'].includes(filename)) return 'gitree-makefile'

      // license
      if (['license'].includes(filename)) return 'gitree-license'

      // env
      if (/^\.env\.*/.test(filename)) return 'gitree-env'

      return gitreeIcons[this.fileType] || 'gitree-file'
      // .csproj, .csproj.user
      // .dll,
      // font, svg 调小(.otf 字体文件)
      // .travis.yaml
      // tsconfig.dev.json, tsconfig.*.json
      // _gitignore, _eslintrc
      // .toml
      // bootstrap.js, react, angular
      // rollup, vite
      // .sketch,
      // image 区分颜色, font 区分颜色
      // .project
      // .liquid,
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
