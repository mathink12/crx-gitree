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
    fileType () {
      // 文件扩展名, 不含 .
      return getFileType(this.filename)
    },
    gitreefontClass () {
      const { filename, fileType } = this

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
      const { filename, fileType } = this

      if (['package.json', 'package-lock.json'].includes(filename)) {
        return 'mdi-npm-variant-outline'
      }

      if (['babel.config.js'].includes(filename)) return 'mdi-babel'

      if (['readme.md'].includes(filename.toLowerCase())) {
        return 'mdi-book-open-outline'
      }

      if (/^\.env\.*/.test(filename)) return 'mdi-cogs'

      return mdiIcons[fileType] || 'mdi-file-outline'
    }
  }
}
</script>
