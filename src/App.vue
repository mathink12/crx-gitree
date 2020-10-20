<template>
  <div id="gitee_tree_container" class="v-application">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <button>Toggle</button> -->
    <v-btn color="pink" dark @click.stop="drawer = !drawer">
      Toggle
    </v-btn>
    <!-- <div style="width: 960px;height: 2000px;background-color: #ddd;margin: 0 auto;">
      <p v-for="i in 200" :key="i" style="text-align: center;">
        {{ i }}
      </p>
    </div> -->

    <v-navigation-drawer v-model="drawer" fixed stateless
      @click.stop
      style="z-index: 2002;">
      <v-list-item>
        <!-- <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar> -->

        <v-list-item-content>
          <v-list-item-title>{{ ownerRepo }}</v-list-item-title>
          <v-list-item-subtitle>{{ branch }}</v-list-item-subtitle>
        </v-list-item-content>

      </v-list-item>

      <v-divider></v-divider>

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
      drawer: true,
      ownerRepo: '', // userName / projectName
      branch: 'master'
    }
  },
  created () {
    // document.addEventListener('click', this.hideDrawer, false)
  },
  mounted () {
    // TODO: 测试数据
    this.ownerRepo = getOwnerAndRepo().join(' / ') || 'test / repo'
  },
  beforeDestroy () {
    // document.removeEventListener('click', this.hideDrawer)
  },
  methods: {
    hideDrawer () {
      console.log('clicked')
      this.drawer = false
    }
  }
}
</script>

<style lang="scss">
#gitee_tree_container {
  font-size: 16px;
  background-color: rgb(250, 251, 252);
}
</style>
