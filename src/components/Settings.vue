<template>
  <div class="gitree-settings px-4">
    <v-text-field v-model="accessToken"
      type="password"
      label="personal access token"
      dense solo hide-details
      class="mt-4"
    />
    <div class="d-flex mt-2">
      <v-spacer />
      <v-btn text small color="primary"
        @click="onCreateToken">
        点击创建（新开窗口图标）
        <!-- <i></i> -->
      </v-btn>
    </div>

    <v-btn block class="mt-10" @click="onRemoveToken">
      清除缓存的私人令牌
    </v-btn>
    <v-btn color="success" block class="mt-4"
      @click="onSubmit">
      保存设置
    </v-btn>
    <!-- <p class="text-body-2 text--secondary text-right">将会保存在浏览器中</p> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { cacheToken, removeCachedToken } from '@/utils/cache'

export default {
  name: 'Settings',
  data () {
    return {
      accessToken: ''
    }
  },
  computed: {
    ...mapState(['token'])
  },
  created () {
    // this.accessToken = this.token
  },
  methods: {
    ...mapMutations(['setActivePane', 'setToken']),
    onCreateToken () {
      const newTab = window.open()
      newTab.opener = null
      newTab.location = 'https://gitee.com/profile/personal_access_tokens/new'
    },
    onRemoveToken () {
      removeCachedToken().then(() => {
        this.setToken()
        this.setActivePane('tree')
        this.$bus.$emit('repo-tree:refresh')
      })
    },
    onSubmit () {
      console.log(this.accessToken)
      cacheToken(this.accessToken).then(() => {
        console.log('保存成功！')
        this.setToken(this.accessToken)
        this.setActivePane('tree')
        this.$bus.$emit('repo-tree:refresh')
      }).catch(e => {
        console.log('保存失败！')
      })
    }
  }
}
</script>

<style lang="scss">
.gitree-settings {
  .v-input {
    input {
      border: 0;
    }
  }
}
</style>
