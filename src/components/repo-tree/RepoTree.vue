<template>
  <v-treeview class="repo-tree"
    :active.sync="active"
    activatable
    open-on-click
    dense hoverable
    item-key="sha"
    item-text="path"
    :items="treeData"
    :load-children="loadTree"
    :open.sync="open"
    transition>
    <template #prepend="{ item, open }">
      <v-icon v-if="item.type === 'tree'" class="mx-2 colored">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else class="mx-2 colored">
        {{ calcIcon(item.path) }}
      </v-icon>
    </template>
  </v-treeview>
</template>

<script>
import { concat, sortBy } from 'lodash'
import { treeData } from '@/mock'
import { getFileType, getOwnerAndRepo } from '@/utils'
import { getRepoTree } from '@/api/gitee'
import { fileIcons } from './config'

let trees = []
let blobs = []
treeData.forEach(v => {
  if (v.type === 'tree') {
    v.children = []
    trees.push(v)
  } else {
    blobs.push(v)
  }
})
trees = sortBy(trees, 'path')
blobs = sortBy(blobs, 'path')

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  name: 'RepoTree',
  data () {
    return {
      loading: false,
      active: [],
      open: [],
      treeData: concat(trees, blobs)
      // treeData: []
    }
  },
  mounted () {
    // this.getRepoTree()
  },
  methods: {
    async loadTree (item) {
      await pause(5 * 1000)

      const json = [{
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
    },
    async getRepoTree () {
      const [owner, repo] = getOwnerAndRepo()

      this.loading = true
      const res = await getRepoTree({
        owner: owner || 'szkp-fe-report',
        repo: repo || 'report-print',
        sha: 'master'
      })
      this.loading = false

      console.log('=========================================================')
      this.treeData = this.combTree(res.tree)
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
    combTree (tree) {
      let trees = []
      let blobs = []
      tree.forEach(v => {
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
