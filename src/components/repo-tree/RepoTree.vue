<template>
  <v-treeview class="repo-tree"
    activatable
    open-on-click
    dense hoverable
    item-key="sha"
    item-text="path"
    transition
    return-object
    :active.sync="active"
    :items="treeData"
    :load-children="loadTree"
    :open.sync="open"
    @update:active="onActive">
    <template #prepend="{ item, open }">
      <v-icon v-if="item.type === 'tree'" class="mx-1 colored">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else class="mx-1 colored">
        {{ calcIcon(item.path) }}
      </v-icon>
    </template>
  </v-treeview>
</template>

<script>
import { concat, sortBy } from 'lodash'
import { mapState } from 'vuex'
import { treeData } from '@/mock'
import { getFileType } from '@/utils'
import { getRepoTree, getDomRender } from '@/api/gitee'
import { fileIcons } from './config'

export default {
  name: 'RepoTree',
  data () {
    return {
      loading: false,
      active: [],
      open: [],
      treeData: []
    }
  },
  computed: {
    ...mapState(['ownerAndRepo'])
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      let trees = []
      let blobs = []
      treeData.forEach(v => {
        v.treePath = v.path
        if (v.type === 'tree') {
          v.children = []
          trees.push(v)
        } else {
          blobs.push(v)
        }
      })
      trees = sortBy(trees, 'path')
      blobs = sortBy(blobs, 'path')
      this.treeData = concat(trees, blobs)
    } else {
      this.getRepoTree()
    }
  },
  methods: {
    onActive (actives) {
      const className = 'gitree-async-script'
      document.querySelectorAll(`.${className}`).forEach(v => {
        v.parentNode.removeChild(v)
      })

      console.log(actives)
      console.log(this.treeData)
      const [owner, repo] = this.ownerAndRepo
      getDomRender({
        owner,
        repo,
        branch: 'master',
        treePath: actives[0].treePath
      }).then(res => {
        console.log(res)
        const script = document.createElement('script')
        script.classList.add(className)
        const code = document.createTextNode(res)
        script.appendChild(code)
        document.body.appendChild(script)
      })
    },
    async loadTree (item) {
      if (process.env.NODE_ENV === 'development') {
        const json = [{
          // v.treePath = treePath ? `${treePath}/${v.path}` : `/${v.path}`
          treePath: item.treePath ? `${item.treePath}/package.json` : 'package.json',
          path: 'package.json',
          mode: '1006a44',
          type: 'blob',
          sha: Math.random().toString(),
          size: 1631
        }]

        if (Array.isArray(item.children)) {
          item.children.push(...json)
        } else {
          item.children = json
        }
        return
      }

      return this.getRepoTree(item.sha, item)
    },
    async getRepoTree (sha = 'master', item) {
      const [owner, repo] = this.ownerAndRepo

      this.loading = true
      const res = await getRepoTree({
        owner,
        repo,
        sha
      })
      this.loading = false

      console.log('=========================================================')
      console.log(res)
      const tree = this.combTree(res.tree, item?.treePath)
      if (item) {
        if (Array.isArray(item.children)) {
          item.children.push(...tree)
        } else {
          item.children = tree
        }
      } else {
        this.treeData = tree
      }
      console.log(this.treeData)
    },
    calcIcon (filename) {
      if (['package.json', 'package-lock.json'].includes(filename)) {
        return 'mdi-npm-variant-outline'
      }

      if (['babel.config.js'].includes(filename)) return 'mdi-babel'

      if (['readme.md'].includes(filename.toLowerCase())) {
        return 'mdi-book-open-outline'
      }

      if (/^\.env\.*/.test(filename)) return 'mdi-cogs'

      return fileIcons[getFileType(filename)] || 'mdi-file-outline'
    },
    // treePath: 'src/main.js'
    combTree (tree, treePath) {
      if (!Array.isArray(tree)) return []

      let trees = []
      let blobs = []
      tree.forEach(v => {
        v.treePath = treePath ? `${treePath}/${v.path}` : `${v.path}`
        if (v.type === 'tree') {
          v.children = []
          trees.push(v)
        } else {
          blobs.push(v)
        }
      })
      trees = sortBy(trees, 'path')
      blobs = sortBy(blobs, 'path')

      return concat(trees, blobs)
    }
  }
}
</script>

<style lang="scss">
.repo-tree {
  // 树结构的图标
  .v-treeview-node__toggle {
    transform: rotate(-90deg);

    &--open {
      transform: none !important;
    }
  }
}
</style>
