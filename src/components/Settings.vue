<template>
  <div class="gitree-settings px-4">
    <v-text-field v-model="accessToken"
      label="Access Token"
      dense solo hide-details
      class="mt-4"
    />
    <div class="d-flex mt-2">
      <v-spacer />
      <v-btn text small color="primary"
        @click="onCreateToken">
        没有 token？点击创建
      </v-btn>
    </div>

    <v-btn color="success" block class="mt-10"
      @click="onSubmit">
      保存（在浏览器中）
    </v-btn>
    <!-- <p class="text-body-2 text--secondary text-right">将会保存在浏览器中</p> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { cacheToken } from '@/utils/cache'

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
    this.accessToken = this.token
  },
  methods: {
    ...mapMutations(['setActivePane', 'setToken']),
    onCreateToken () {
      window.location = 'https://gitee.com/profile/personal_access_tokens/new'
    },
    onSubmit () {
      console.log(this.accessToken)
      cacheToken(this.accessToken).then(() => {
        console.log('保存成功！')
        this.setToken(this.accessToken)
        this.setActivePane('tree')
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
