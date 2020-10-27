<template>
  <div id="gitree_container" class="v-application">
    <v-btn
      :class="{
        'gitree-toggle': true,
        'd-none': drawer
      }"
      @mouseover.stop="drawer = true">
      Gitree
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <v-navigation-drawer v-model="drawer" fixed stateless
      @mouseleave.native="onMouseLeaveDrawer"
      :style="{ zIndex }">
      <template #prepend>
        <v-list-item class="drawer-header">
          <v-list-item-content>
            <template v-if="activePane === 'settings'">
              <v-list-item-title>设 置</v-list-item-title>
            </template>
            <template v-else>
              <v-list-item-title>
                <v-icon class="mr-1">mdi-book</v-icon>
                {{ repoData.owner }} / {{ repoData.repo }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-icon class="mr-1">mdi-source-branch</v-icon>
                {{ repoData.activeBranch }}
              </v-list-item-subtitle>
            </template>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon small
              :color="activePane === 'settings' ? giteeOrange : '#935323'"
              @click="onSettingsBtnClick">
              <v-icon>mdi-cogs</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon small
              :color="giteeOrange"
              :class="{
                'tree-pin-icon': true,
                'tree-pin-icon--pined': pin
              }"
              :title="pin ? '点击取消固定' : '点击固定'"
              @click="togglePin">
              <v-icon>{{ pin ? 'mdi-pin' : 'mdi-pin-outline' }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>

      <Settings v-show="activePane === 'settings'" />
      <RepoTree v-show="activePane === 'tree'" />

      <template #append>
        <v-divider />
        <v-btn block @click.stop="drawer = false">Collapse</v-btn>
      </template>

      <v-snackbar v-model="appSnackbar.show" timeout="3000">
        {{ appSnackbar.text }}

        <template #action="{ attrs }">
          <v-btn color="pink" icon v-bind="attrs" @click="hideAppSnackbar">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <v-overlay :value="drawerLoading">
        <v-progress-circular indeterminate size="50" />
      </v-overlay>
    </v-navigation-drawer>

    <v-overlay :value="fullscreenLoading" :z-index="zIndex + 1">
      <v-progress-circular indeterminate size="50" />
    </v-overlay>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { setCache, getCache, getCachedToken } from '@/utils/cache'
import { getOwnerRepo, getRepoBranches } from '@/api/gitee'
import RepoTree from '@/components/repo-tree/RepoTree'
import Settings from '@/components/Settings'

export default {
  name: 'App',
  components: {
    RepoTree,
    Settings
  },
  data () {
    return {
      drawer: false,
      zIndex: 2020,
      pin: false, // 是否固定显示侧边栏
      pinKey: 'gitree_pin',
      giteeOrange: '#fe7300'
    }
  },
  computed: {
    ...mapState([
      'activePane',
      'drawerLoading',
      'fullscreenLoading',
      'appSnackbar',
      'repoData'
    ])
  },
  watch: {
    pin: {
      immediate: true,
      handler (val) {
        console.log(val)
        // 使得网页的内容部分居中
        if (val) {
          document.querySelectorAll('.ui.container').forEach(v => {
            v.classList.add('translate-for-pin')
          })
        } else {
          document.querySelectorAll('.ui.container').forEach(v => {
            v.classList.remove('translate-for-pin')
          })
        }
      }
    },
    repoData ({ owner, repo }) {
      if (!owner || !repo) return

      // 当有仓库数据时, 才判断是否要展开 drawer
      getCache(this.pinKey).then(res => {
        const pin = res === 'true'
        this.pin = pin
        if (pin) {
          this.drawer = true
        }
      }).catch(() => {
        console.log('读取 pin 失败！')
      })
    }
  },
  mounted () {
    getCachedToken().then(res => {
      console.log(res)
      this.setToken(res)
      console.log('从缓存中获取 Token 成功')

      let owner = ''
      let repo = ''

      // pathname: /owner/repo[/branch]
      const pathnames = window.location.pathname.split('/')
      // branch 中可能含有 '/', 这里只取前两层
      owner = pathnames[1]
      repo = pathnames[2]

      if (process.env.NODE_ENV === 'development') {
        // 开发环境使用测试数据
        owner = 'mirrors'
        repo = 'axios'
      }

      // 此时的页面应该不是仓库页面
      if (!repo) return

      // 可能是仓库页面, 则查询仓库相关信息
      this.getBaseData(owner, repo)
    }).catch(e => {
      console.log('从缓存中获取 Token 失败')
    })
  },
  methods: {
    ...mapMutations([
      'setActivePane',
      'setToken',
      'setDrawerLoading',
      'hideAppSnackbar',
      'setRepoData'
    ]),
    onMouseLeaveDrawer () {
      if (this.pin) return
      this.drawer = false
    },
    onSettingsBtnClick () {
      if (this.activePane === 'settings') {
        this.setActivePane('tree')
      } else {
        this.setActivePane('settings')
      }
    },
    togglePin () {
      this.pin = !this.pin
      // 将存储的内容同步到所有登录了同一账号的 chrome 浏览器中
      setCache(this.pinKey, this.pin.toString())
        .then(() => {})
        .catch(() => {
          console.log('写入 pin 失败！')
        })
    },
    async getBaseData (owner, repo) {
      try {
        this.setDrawerLoading(true)
        const [res1, res2] = await Promise.all([
          getOwnerRepo({ owner, repo }), // 当前仓库的基本信息(默认分支)
          getRepoBranches({ owner, repo }) // 当前仓库的所有分支
        ])

        const defaultBranch = res1.default_branch
        const branches = res2 || []

        if (!defaultBranch) return

        // 获取当前 url 的 pathname(某些情况下, 当 branch 中含有 / 时可能会被编码)
        const decodedPathname = window.decodeURIComponent(window.location.pathname)
        // 当前激活的分支默认使用默认分支
        let activeBranch = defaultBranch
        let branchName
        for (let i = branches.length - 1; i >= 0; i--) {
          branchName = branches[i].name
          // branchName: feat/1.0.0
          // branchName: docs/i18n
          // branchName: fix/aa-bb
          if (decodedPathname.indexOf(`/${branchName}/`) !== -1 ||
              decodedPathname.endsWith(branchName)) {
            // 如果当前分支名在 pathname 中, 则这个分支(可能)为活动分支
            activeBranch = branchName
            break
          }
        }

        this.setRepoData({
          owner,
          repo,
          defaultBranch,
          activeBranch,
          branches
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.setDrawerLoading(false)
      }
    }
  }
}
</script>

<style lang="scss">
#gitree_container {
  font-size: 16px;
  background-color: rgb(250, 251, 252);

  .gitree-toggle {
    width: 24px;
    min-width: 24px;
    font-size: 13px;
    height: auto;
    padding: 10px 4px;
    text-transform: none;
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-100%) rotate(180deg);
    box-shadow: -1px -1px 5px #aaa;

    .v-btn__content {
      writing-mode: vertical-lr;
    }
  }

  .drawer-header {
    height: 46px;
    min-height: 46px;
    background-color: #303643 !important;
    color: #fff !important;
    padding: 0 8px;

    .v-list-item__title {
      font-size: 14px !important;
      line-height: 14px !important;
      display: flex;
      align-items: center;
      .v-icon {
        color: #fff !important;
        // font-size: 1rem !important;
        font-size: 14px !important;
      }
    }

    .v-list-item__subtitle {
      color: rgba(255, 255, 255, 0.9) !important;
      font-size: 12px !important;
      line-height: 12px !important;
      display: flex;
      align-items: center;

      .v-icon {
        color: rgba(255, 255, 255, 0.8) !important;
        font-size: 0.875rem !important;
        font-size: 12px !important;
      }
    }
  }

  .tree-pin-icon {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) 0s;
    transform: rotate(45deg);

    &--pined {
      transform: rotate(0);
    }
  }

  .v-snack__wrapper {
    width: 240px;
    min-width: 240px;
    max-width: 240px;
  }
}
</style>
