<template>
  <p v-if="!repoData.owner || !repoData.repo" class="py-10 text-center">
    当前可能在非仓库页面
  </p>
  <v-treeview v-else-if="Array.isArray(treeData) && treeData.length > 0"
    class="repo-tree"
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
  <div v-else class="pa-3">
    <p>
      <span v-if="token">当前用户授权码已过期，</span>
      Gitree 暂未能获取数据，您可以按以下方法重试：
    </p>
    <ul class="gitree-error-suggestion">
      <li>
        <v-btn color="primary" small @click="onSetToken">添加授权码</v-btn>
        <span class="gitree-tip--secondary">，添加有效的授权码后，Gitree 可以获取公开仓库和私有仓库数据</span>
      </li>
      <li v-if="token" class="mt-2">
        <v-btn small @click="onRemoveToken">删除授权码</v-btn>
        <span class="gitree-tip--secondary">，删除后 Gitree 只能获取公开仓库数据</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { concat, sortBy } from 'lodash'
import { mapState, mapMutations } from 'vuex'
import { treeData } from '@/mock'
import { removeCachedToken } from '@/utils/cache'
import { getRepoTree, getDomRender } from '@/api/gitee'
import FileIcon from '@/components/file-icon/FileIcon'
console.log(treeData)

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
    ...mapState(['repoData', 'token'])
  },
  watch: {
    repoData () {
      // this.getRepoTree()
    }
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      this.setDrawerLoading(true)
      setTimeout(() => {
        this.setDrawerLoading(false)
        this.showAppSnackbar('加载成功')
      }, 3 * 1000)
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
      this.treeData = []
    } else {
      this.getRepoTree()
    }
  },
  methods: {
    ...mapMutations([
      'setActivePane',
      'setDrawerLoading',
      'setFullscreenLoading',
      'showAppSnackbar'
    ]),
    onSetToken () {
      this.setActivePane('settings')
    },
    onRemoveToken () {
      removeCachedToken().then(() => {
        this.getRepoTree()
      })
    },
    onActive (actives) {
      const className = 'gitree-async-script'
      document.querySelectorAll(`.${className}`).forEach(v => {
        v.parentNode.removeChild(v)
      })

      console.log(actives)
      console.log(this.treeData)
      const { owner, repo, activeBranch: branch } = this.repoData
      const { treePath } = actives[0]

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
    async getRepoTree (sha, item) {
      const { owner, repo, activeBranch } = this.repoData
      if (!owner || !repo) return

      this.setDrawerLoading(true)
      const res = await getRepoTree({
        owner,
        repo,
        sha: sha || activeBranch
      })
      this.setDrawerLoading(false)

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

.gitree-error-suggestion {
  & > li {
    line-height: 1.6;
  }

  .gitree-tip--secondary {
    color: rgba(0, 0, 0, .7);
  }
}
</style>
