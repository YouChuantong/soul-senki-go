<!--
 * @Author: UpYou
 * @Date: 2021-02-08 17:00:10
 * @LastEditTime: 2021-02-21 14:04:37
 * @Description:
 *
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import electron from "electron";

const {dialog, getCurrentWindow, app} = electron.remote;

export default {
  name: "sousenki",
  mounted() {
    window.onclick = () => {
      // this.$store.dispatch("changeWinClick");
    };

  },
};
</script>

<style>
/* CSS */
* {
  user-select: none;
  -webkit-user-drag: none;
  padding: 0;
  margin: 0;
}
</style>
