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
      <v-icon v-if="item.type === 'tree'" class="mr-1 colored">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <FileIcon v-else class="mr-1 colored" :filename="item.path" />
    </template>
  </v-treeview>
</template>

<script>
import { concat, sortBy } from 'lodash'
import { mapState } from 'vuex'
import { treeData } from '@/mock'
import { getRepoTree, getDomRender } from '@/api/gitee'
import FileIcon from '@/components/file-icon/FileIcon'

export default {
  name: 'RepoTree',
  components: {
    FileIcon
  },
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
      const branch = 'master'
      const { treePath } = actives[0]
      getDomRender({ owner, repo, branch, treePath }).then(res => {
        console.log(res)
        const script = document.createElement('script')
        script.classList.add(className)
        const code = document.createTextNode(res)
        script.appendChild(code)
        document.body.appendChild(script)

        // TODO: 路由跳转
        // TODO: 返回后
        window.history.pushState({}, '', `/${owner}/${repo}/blob/${branch}/${treePath}`)
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
  font-size: 14px !important;

  .v-icon {
    font-size: 20px !important;
  }

  .v-treeview-node__level {
    width: 20px;
  }

  .v-treeview-node__root {
    min-height: 30px !important;
  }

  // 树结构的图标
  .v-treeview-node__toggle {
    transform: rotate(-90deg);

    &--open {
      transform: none !important;
    }
  }

  .v-treeview-node__toggle {
    width: 20px;
  }

  .v-treeview-node__root {
    padding-left: 4px;
    padding-right: 4px;
  }

  .gitreefont {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.54);
  }
}
</style>
