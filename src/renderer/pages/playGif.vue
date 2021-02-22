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
* @FileName: playGif.vue
* @ClassName playGif
* @Description: TODO
*
* @Version: V1.0
* @Author: UpYou
* @CreateTime: 2021-02-19 18:01
*/

<template>
  <div class="playGif">
    <div class="load" v-if="load">
      <img class="load-img" src="../assets/Loading.gif"/>
    </div>
    <div class="check-h" v-if="checkH">
      <div class="empty-cover" v-if="emptyCover">
        该角色可能没有那种内容哦～～
      </div>
      <div v-else class="h-cover-box" @click="ready(index)" v-for="(item, index) in coverUrl" :key="'h-cover-'+index">
        <div class="h-cover-box-layer"></div>
        <img class="h-cover" :src="item.src"/>
        <p>H {{ index + 1 }}</p>
      </div>
    </div>
    <div class="canvas-box" v-if="showCanvas">
      <div style="display: flex; position: fixed;margin: 10px">
        <div class="btn close" @click="back">后退</div>
        <div class="btn close" @click="exporting">导出</div>
      </div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import {screen, remote, ipcRenderer} from 'electron'
import image from "../mixins/image";
import exportGif from "../mixins/exportGif";
import callThread from "../mixins/callThread";

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#`
  : `file://${__dirname}/#`
export default {
  name: 'playGif',
  mixins: [image, exportGif, callThread],
  data: () => ({
    heroData: null,
    coverUrl: [],
    load: false,
    checkH: false,
    list: [],
    showCanvas: false,
    exported: false
  }),
  computed: {
    emptyCover() {
      return !(this.coverUrl.length > 0)
    }
  },
  methods: {
    back() {
      this.checkH = true
      this.showCanvas = false
      this.list = []
    },
    async exporting() {
      try {
        if (this.exported) {
          alert('已经在努力导出了哦~~~')
          return
        }
        this.exported = true
        const directory = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
          title: 'select path',
          activate: true,
          properties: ['openDirectory', 'promptToCreate', 'treatPackageAsDirectory']
        })
        if (directory) {
          // 使用隐藏线程
          remote.ipcMain.once('export-gif-hidden-thread-loaded', (event, arg) => {
            ipcRenderer.send('export-gif-hidden-thread-export-gif', {
              data: this.list.map(_ => _.src),
              hero: this.heroData,
              path: directory[0]
            })
            // 隐藏线程处理完成或失败
            remote.ipcMain.once('processing-complete-export-gif', (event, arg) => {
              if (arg === 11111) {
                alert('导出成功...')
              } else if (arg === Number('00000')) {
                alert('数据可能走丢了,请重新打开试试～～')
              } else {
                alert('系统异常，重新打开软件试试，不行别联系作者...')
              }
              this.exported = false
            })
          })
          // 打开隐藏线程
          let hiddenWin = new remote.BrowserWindow({
            show: false,
            parent: remote.getCurrentWindow()
          })
          // hiddenWin.webContents.closeDevTools()
          hiddenWin.loadURL(`${winURL}/export-gif-thread-page`)
          // 隐藏线程被关闭
          hiddenWin.on('closed', () => {
            hiddenWin = null
          })
        }
      } catch (e) {
        alert(e)
      }
    },
    async ready(i) {
      this.load = true
      const data = this.heroData
      const images = await this.getFuckingImageAll(data.id, i + 1)
      this.list = images
      this.load = false
      this.play(images).then()
    },
    async init() {
      this.load = true
      const data = this.heroData
      this.showCanvas = false
      this.coverUrl = await this.getRecapCover(data.id - 60000)
      this.load = false
      this.checkH = true
    },
    async play(images = [], callback) {
      this.showCanvas = true
      this.$nextTick(_ => {

        let time = 80;// 间隔时间
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d')
        const width = images[0].width
        const height = images[0].height
        const iLen = images.length
        canvas.width = width
        canvas.height = height
        this.checkH = false
        // 获取当前窗口
        const currentWin = remote.getCurrentWindow()
        const workArea = screen.getAllDisplays()[0].workArea;
        const size = screen.getAllDisplays()[0].size;
        // 设置窗口高度，调整为canvas大小
        currentWin.setSize(width, (height + (size.height - workArea.height)))
        currentWin.setSize(width, currentWin.getContentSize()[1])
        currentWin.setSize(width, currentWin.getContentSize()[1])
        // 开始播放
        let y = 0
        const go = _ => {
          ctx.drawImage(images[y], 0, 0, width, height)
          callback && callback()
          y++;
          if (y > iLen - 1) {
            y = 0
          }
          setTimeout(_ => {
            go()
          }, time)
        }
        go()
      })
    }
  },
  mounted() {
    // remote.ipcMain.once('export-gif-hidden-thread-export-gif', (event, args) => {
    //
    // })
    remote.ipcMain.once('play-gif-in-play-page', (event, arg) => {
      this.heroData = arg
      this.init()
      remote.ipcMain.on('call-exist-play-page-' + arg.id, () => {
        ipcRenderer.send('exist-play-page-' + arg.id, true)
        remote.getCurrentWindow().show()
      })
    })
    ipcRenderer.send('play-gif-page-loaded')

  }
}
</script>

<style lang="scss" scoped>

.empty-cover {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #233;
  font-size: 14px
}

.playGif {
  display: flex;
}


.load-img {
  width: 100px;
}

.load, .check-h {
  position: fixed;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.check-h {
  background-color: #fff !important;
  z-index: 998;
  display: flex;
  //max-width: 60vw;
  margin: auto;

  .h-cover-box {
    margin-right: 30px;
    overflow: hidden;
    border-radius: 15px;
    position: relative;

    p {
      position: absolute;
      top: 10px;
      left: 10px;
      color: #ffffff;
      font-size: 14px;
      font-family: Courier;
    }
  }

  .h-cover-box-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, .4);
  }
}

.btn {
  padding: 5px 20px;
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}
</style>
