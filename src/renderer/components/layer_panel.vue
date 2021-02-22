/**
*
*   █████▒█    ██  ▄████▄   ██ ▄█▀       ██████╗ ██╗   ██╗ ██████╗
* ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
* ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
* ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
* ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
*  ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
*  ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
*  ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
*           ░     ░ ░      ░  ░
*
* Copyright Copyright 2020 UpYou.
* @FileName: alert.vue
* @ClassName alert
* @Description: TODO
*
* @Version: V1.0
* @Author: UpYou
* @CreateTime: 2021-02-19 02:07
*/

<template>
  <div class="alert" @click.stop="close" v-show="state">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: {
    show: Boolean
  },
  data: () => ({
    state: false
  }),
  methods: {
    close() {
      this.state = !this.state
      this.$emit('update:close', this.state)
    }
  },
  watch: {
    show: {
      handler(val) {
        this.state = val
          this.$emit('change', this.state)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .2);
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
