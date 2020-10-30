<template>
  <p v-if="!repoData.owner || !repoData.repo"
    class="py-10 text-center repo-tree-no-data">
    当前可能在非仓库页面
  </p>
  <div v-else-if="!repoData.activeBranch"
    class="py-10 text-center repo-tree-no-data">
    <p>Gitree 获取数据失败</p>
    <v-btn class="mt-5"
      @click="$bus.$emit('branch:refresh', repoData.owner, repoData.repo)">
      点击重试
    </v-btn>
  </div>
  <v-treeview v-else-if="Array.isArray(treeData) && treeData.length > 0"
    class="repo-tree"
    activatable
    open-on-click
    dense hoverable
    item-key="sha"
    item-text="deepestPath"
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
  <div v-else class="pa-3 repo-tree-no-data">
    <p>
      <span v-if="token">当前用户授权码已过期，</span>
      Gitree 暂未能获取数据，您可以按以下方法重试：
    </p>
    <ul class="gitree-error-suggestion">
      <li>
        <v-btn color="primary" small @click="onSetToken">添加授权码</v-btn>
        <span class="gitree-tip--secondary">
          ，添加有效的授权码后，Gitree 可以获取公开仓库和私有仓库数据
        </span>
      </li>
      <li v-if="token" class="mt-2">
        <v-btn small @click="onRemoveToken">删除授权码</v-btn>
        <span class="gitree-tip--secondary">
          ，删除后 Gitree 只能获取公开仓库数据
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { concat, sortBy } from 'lodash'
import { mapState, mapMutations } from 'vuex'
import { removeCachedToken } from '@/utils/cache'
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
      treeData: [],
      lv2Ups: []
    }
  },
  computed: {
    ...mapState(['repoData', 'token'])
  },
  watch: {
    repoData () {
      this.getRepoTree()
    }
  },
  created () {
    this.$bus.$on('repo-tree:refresh', this.getRepoTree)
    this.$on('hook:beforeDestroy', () => {
      this.$bus.$off('repo-tree:refresh', this.getRepoTree)
    })
  },
  mounted () {
    this.getRepoTree()
  },
  methods: {
    ...mapMutations([
      'setActivePane',
      'setDrawerLoading',
      'setFullscreenLoading',
      'showAppSnackbar',
      'setToken'
    ]),
    onSetToken () {
      this.setActivePane('settings')
    },
    onRemoveToken () {
      removeCachedToken().then(() => {
        this.setToken()
        this.getRepoTree()
      })
    },
    onActive (actives) {
      const active = actives[0]
      if (!active) return

      const className = 'gitree-async-script'
      document.querySelectorAll(`.${className}`).forEach(v => {
        v.parentNode.removeChild(v)
      })

      console.log(actives)
      const { owner, repo, activeBranch: branch } = this.repoData
      const { path: treePath } = active
      console.log(treePath)

      this.setFullscreenLoading(true)
      getDomRender({ owner, repo, branch, treePath }).then(res => {
        console.log(res)
        if (res.__gitreeFailed) return

        const script = document.createElement('script')
        script.classList.add(className)
        const code = document.createTextNode(res)
        script.appendChild(code)
        document.body.appendChild(script)

        // TODO: 路由跳转
        // TODO: 返回后
        if (process.env.NODE_ENV === 'production') {
          window.history.pushState({}, '', `/${owner}/${repo}/blob/${branch}/${treePath}`)
        }
      }).catch(e => {

      }).finally(() => {
        this.setFullscreenLoading(false)
      })
    },
    loadTree (item) {
      console.log('loadTree')
      console.log(item)
      const { path, deep } = item
      const childrenDeep = deep + 1
      const children = this.lv2Ups.filter(v => {
        return v.path.startsWith(path + '/') && v.deep === childrenDeep
      })
      console.log(children)

      if (Array.isArray(item.children)) {
        item.children.push(...this.sortChildren(children))
      } else {
        item.children = this.sortChildren(children)
      }
    },
    async getRepoTree () {
      const { owner, repo, activeBranch } = this.repoData
      if (!owner || !repo || !activeBranch) return

      this.setDrawerLoading(true)
      const res = await getRepoTree({
        owner,
        repo,
        sha: activeBranch,
        recursive: 1 // 递归获取目录
      })
      this.setDrawerLoading(false)

      console.log('=========================================================')
      console.log(res)
      const { treeData, lv2Ups } = this.combTree(res.tree)
      this.treeData = treeData
      this.lv2Ups = lv2Ups
    },
    combTree (tree) {
      if (!Array.isArray(tree)) return []

      const lv2Ups = [] // 2 级(含)以上的目录或文件
      let trees = [] // 1 级目录
      let blobs = [] // 1 级文件
      let paths
      let deep
      tree.forEach(v => {
        paths = v.path.split('/')
        deep = paths.length
        v.deepestPath = paths[deep - 1]
        v.deep = deep

        if (v.type === 'tree') {
          v.children = []
          // 是目录, 'src', 'src/utils'
          if (v.path.includes('/')) { // 非一级目录
            lv2Ups.push(v)
          } else { // 一级目录
            trees.push(v)
          }
        } else { // 是文件
          if (v.path.includes('/')) { // 非一级文件
            lv2Ups.push(v)
          } else { // 一级文件
            blobs.push(v)
          }
        }
      })
      trees = sortBy(trees, 'deepestPath')
      blobs = sortBy(blobs, 'deepestPath')

      return {
        treeData: concat(trees, blobs),
        lv2Ups
      }
    },
    // 对目录结构进行排序: 目录在前, 文件在后
    sortChildren (data) {
      let trees = []
      let blobs = []
      data.forEach(v => {
        if (v.type === 'tree') {
          trees.push(v)
        } else {
          blobs.push(v)
        }
      })
      trees = sortBy(trees, 'deepestPath')
      blobs = sortBy(blobs, 'deepestPath')

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

.repo-tree-no-data {
  font-size: 16px;
}

.gitree-error-suggestion {
  & > li {
    line-height: 1.6;
  }

  .gitree-tip--secondary {
    color: rgba(0, 0, 0, .7);
  }
}
</style>
