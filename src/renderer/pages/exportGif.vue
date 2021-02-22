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
* @FileName: exportGif.vue
* @ClassName exportGif
* @Description: TODO
*
* @Version: V1.0
* @Author: UpYou
* @CreateTime: 2021-02-20 21:31
*/
<template>
  <div>s</div>
</template>
<script>
import {ipcRenderer, remote} from 'electron'
import exportGif from "../mixins/exportGif";
import image from "../mixins/image";

export default {
  name: 'exportGif',
  mixins: [exportGif, image],
  data: () => ({
    data: [],
    hero: {},
    path: ''
  }),
  methods: {
    async export() {
      try {
        if (this.data.length > 0 && '{}' !== JSON.stringify(this.hero)) {
          const data = []
          for (const datum of this.data) {
            data.push(await this.image(datum))
          }
          await this.exportGifTo({
            data: data,
            delay: 80,
            path: this.path + '/' + this.hero.keystring.en + '.gif',
            size: {
              width: data[0].width,
              height: data[0].height,
            }
          }, i => {
            console.log(this.path + '/' + this.hero.keystring.en + '.gif', i)
          })
          this.send(Number('11111'))
        } else {
          // 0000 代表无数据
          this.send(Number('00000'))
        }
      } catch (e) {
        // 99999 代表异常
        console.log(e)
        this.send(Number('99999'))
      }
    },
    /**
     * 发送隐藏线程状态
     * @param code 状态吗
     */
    send(code = Number('00000')) {
      ipcRenderer.send('processing-complete-export-gif', Number(code))
      remote.getCurrentWindow().close()
    }
  },
  created() {
    // 隐藏线程加载完毕，通知相关线程发送数据
    remote.ipcMain.once('export-gif-hidden-thread-export-gif', (event, args) => {
      if (args.data !== void 0 && args.hero !== void 0) {
        this.data = args.data
        this.hero = args.hero
        this.path = args.path
        this.export()
      }
    })
    ipcRenderer.send('export-gif-hidden-thread-loaded')
    remote.ipcMain.on('are-u-there-export-gif-thread-' + this.hero.id, () => {
      ipcRenderer.send('export-gif-thread-exist-' + this.hero.id, true)
    })
  }
}
</script>
<style></style>


