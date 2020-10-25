<template>
  <div id="gitree_container" class="v-application">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <button>Toggle</button> -->
    <v-btn
      :class="{
        'gitree-toggle': true,
        'd-none': drawer
      }"
      @mouseover.stop="drawer = true">
      Gitree
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <!-- <div style="width: 960px;height: 2000px;background-color: #ddd;margin: 0 auto;">
      <p v-for="i in 200" :key="i" style="text-align: center;">
        {{ i }}
      </p>
    </div> -->

    <v-navigation-drawer v-model="drawer" fixed stateless
      @mouseleave.native="onMouseLeaveDrawer"
      style="z-index: 2002;">
      <template #prepend>
        <v-list-item class="drawer-header">
          <!-- <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
          </v-list-item-avatar> -->

          <v-list-item-content>
            <v-list-item-title>
              <v-icon class="mr-1">mdi-book</v-icon>
              {{ ownerAndRepo.join(' / ') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-icon class="mr-1">mdi-source-branch</v-icon>
              {{ branch }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon
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
        <!-- <v-divider /> -->
      </template>
      <!-- <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->

      <RepoTree v-if="ownerAndRepo.length === 2" />
      <template #append>
        <v-divider />
        <v-btn block @click.stop="drawer = false">Collapse</v-btn>
      </template>

      <v-overlay :value="appLoading" class="gitree-loading">
        <v-progress-circular indeterminate size="50" />
      </v-overlay>

      <v-snackbar v-model="appSnackbar.show" timeout="3000">
        {{ appSnackbar.text }}

        <template #action="{ attrs }">
          <v-btn color="pink" icon v-bind="attrs" @click="hideAppSnackbar">
            <!-- Close -->
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getOwnerAndRepo } from '@/utils'
import { setCache, getCache } from '@/utils/cache'
import RepoTree from '@/components/repo-tree/RepoTree'

export default {
  name: 'App',
  components: {
    RepoTree
  },
  data () {
    return {
      drawer: false,
      pin: false, // 是否固定显示侧边栏
      pinKey: 'gitree_pin',
      giteeOrange: '#fe7300'
    }
  },
  computed: {
    ...mapState(['appLoading', 'appSnackbar', 'ownerAndRepo', 'branch'])
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
    }
  },
  mounted () {
    let ownerAndRepo = getOwnerAndRepo()
    if (process.env.NODE_ENV === 'development') {
      ownerAndRepo = ['mathink', 'repo']
    }
    this.setOwnerAndRepo(ownerAndRepo)

    if (ownerAndRepo[0] && ownerAndRepo[1]) {
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
  methods: {
    ...mapMutations(['hideAppSnackbar', 'setOwnerAndRepo']),
    onMouseLeaveDrawer () {
      if (this.pin) return
      this.drawer = false
    },
    togglePin () {
      this.pin = !this.pin
      // 将存储的内容同步到所有登录了同一账号的 chrome 浏览器中
      setCache(this.pinKey, this.pin.toString())
        .then(() => {})
        .catch(() => {
          console.log('写入 pin 失败！')
        })
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
