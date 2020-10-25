<template>
  <i v-if="gitreefontClass"
    class="gitreefont"
    :class="gitreefontClass">
  </i>
  <v-icon v-else>
    {{ mdiIconName }}
  </v-icon>
</template>

<script>
import { getFileType } from '@/utils'
import { mdiIcons } from './config'

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
      // gitreefontClass: ''
    }
  },
  computed: {
    // 文件扩展名(已转小写), 不含 .
    fileType () {
      return getFileType(this.filename)
    },
    // iconfont
    gitreefontClass () {
      let { filename, fileType } = this
      filename = filename.toLowerCase()

      // postcss
      if (['postcss.config.js'].includes(filename)) return 'gitreepostcss'

      // grunt
      if (['gruntfile.js'].includes(filename)) return 'gitreegrunt'

      // gulp
      if (['gulpfile.js'].includes(filename)) return 'gitreegulp'

      // prettier
      if (['prettier.config.js'].includes(filename)) return 'gitreeprettier'

      // ci
      // travis

      // shell
      if (fileType === 'sh') return 'gitreeshell'

      // ini
      if (fileType === 'ini') return 'gitreeini'

      // jsx
      if (fileType === 'jsx') return 'gitreejsx'

      // yml, yaml
      if (['yml', 'yaml'].includes(fileType)) return 'gitreeyaml'

      if (['sass', 'scss'].includes(fileType)) return 'gitreesass'

      if (['ttf', 'woff', 'woff2'].includes(fileType)) return 'gitreefontfile'

      // yarn
      if (['yarn.lock', '.yarnrc'].includes(filename)) return 'gitreeyarn'

      // browserslist
      if (['.browserslistrc'].includes(filename)) return 'gitreebrowserslist'

      // editorconfig
      if (['.editorconfig'].includes(filename)) return 'gitreeeditorconfig'

      // jest
      if (['jest.config.js'].includes(filename)) return 'gitreejest'

      return ''
    },
    mdiIconName () {
      let { filename, fileType } = this
      filename = filename.toLowerCase()

      // npm
      if (['package.json', 'package-lock.json'].includes(filename)) {
        return 'mdi-npm-variant-outline'
      }

      // babel
      if (['babel.config.js', '.babelrc'].includes(filename)) return 'mdi-babel'

      // readme
      if (['readme.md'].includes(filename)) {
        return 'mdi-book-open-outline'
      }

      // env
      if (/^\.env\.*/.test(filename)) return 'mdi-cogs'

      return mdiIcons[fileType] || 'mdi-file-outline'
    }
  }
}
</script>
