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
      @click.stop="drawer = !drawer"
      title="点击打开 Gittree">
      Gitree
    </v-btn>
    <!-- <div style="width: 960px;height: 2000px;background-color: #ddd;margin: 0 auto;">
      <p v-for="i in 200" :key="i" style="text-align: center;">
        {{ i }}
      </p>
    </div> -->

    <v-navigation-drawer v-model="drawer" fixed stateless
      @click.native.stop
      style="z-index: 2002;">
      <template #prepend>
        <v-list-item>
          <!-- <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
          </v-list-item-avatar> -->

          <v-list-item-content>
            <v-list-item-title>{{ ownerRepo }}</v-list-item-title>
            <v-list-item-subtitle>{{ branch }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon
              :class="{
                'tree-pin-icon': true,
                'tree-pin-icon--pined': pin
              }"
              :title="pin ? '点击取消固定' : '点击固定'"
              :color="pin ? 'primary' : ''"
              @click="togglePin">
              <v-icon>{{ pin ? 'mdi-pin' : 'mdi-pin-outline' }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider />
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

      <RepoTree />
      <template #append>
        <v-divider />
        <v-btn block @click.stop="drawer = false">Collapse</v-btn>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { getOwnerAndRepo } from '@/utils'
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
      ownerRepo: '', // userName / projectName
      branch: 'master'
    }
  },
  created () {
    document.addEventListener('click', this.listenOuterClick, false)
    this.$on('hook:beforeDestroy', () => {
      document.removeEventListener('click', this.listenOuterClick)
    })
  },
  mounted () {
    // TODO: 测试数据
    this.ownerRepo = getOwnerAndRepo().join(' / ') || 'test / repo'
  },
  methods: {
    onDrawerClick () {
      console.log('onDrawerClick')
    },
    listenOuterClick () {
      console.log('clicked')
      if (this.pin) return
      this.drawer = false
    },
    togglePin () {
      this.pin = !this.pin
      // TODO: 写入缓存
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
    transform: translateY(-50%);

    .v-btn__content {
      writing-mode: vertical-lr;
    }
  }

  .tree-pin-icon {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) 0s;
    transform: rotate(45deg);

    &--pined {
      transform: rotate(0);
    }
  }
}
</style>
