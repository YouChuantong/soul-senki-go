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
* @FileName: exportImage.vue
* @ClassName exportImage
* @Description: TODO
*
* @Version: V1.0
* @Author: UpYou
* @CreateTime: 2021-02-21 01:32
*/

<template>
  <div class="exportImage"></div>
</template>

<script>
import image from "../mixins/image";
import * as fs from "fs";
import {createCanvas} from 'canvas'
import {remote, ipcRenderer} from'electron'

export default {
  name: 'exportImage',
  data: () => ({}),
  mixins: [image],
  methods: {
    async exportImage(name, path) {
      try {
        const baoYiImages = await this.getBaoyiImages(name);
        let i = 0;
        for (const style of baoYiImages) {
          let y = 0;
          for (const item of style) {
            let {width, height} = item;
            let lastName = item.src.slice(item.src.lastIndexOf('.'))
            const canvas = createCanvas(width, height)
            const ctx = canvas.getContext('2d')
            ctx.drawImage(item, 0, 0, width, height)
            const base64 = canvas.toDataURL()
            let base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            let dataBuffer = new Buffer(base64Data, 'base64');
            fs.writeFileSync(`${path}-${i}-${y}${lastName}`, dataBuffer)
            y++;
          }
          i++
        }
        this.send('11111')
      }catch (e) {
        this.send('99999')
      }
    },
    /**
     * 发送隐藏线程状态
     * @param code 状态吗
     */
    send(code = Number('00000')) {
      ipcRenderer.send('processing-complete-export-image', Number(code))
      remote.getCurrentWindow().close()
    }
  },
  mounted() {
    remote.ipcMain.once('export-image-thread-page-load-data' ,(event, arg) => {
      this.exportImage(arg.name, arg.path)
    })
    ipcRenderer.send('export-image-thread-page-loaded')
  }
}
</script>

<style lang="scss" scoped>
.exportImage {
}
</style>
