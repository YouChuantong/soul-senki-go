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
* @FileName: preview.vue
* @ClassName preview
* @Description: TODO
*
* @Version: V1.0
* @Author: UpYou
* @CreateTime: 2021-02-19 02:26
*/

<template>
  <div class="preview" v-if="show">
    <div style="position: fixed; top: 5px; left: 5px;display: flex">
      <div class="btn close" @click="close">关闭</div>
      <div class="btn close" @click="exportImage">导出</div>
    </div>
    <div class="content center-box">
      <div class="center-box preview-img-box">
        <div class="btn left-btn" v-if="!load" @click="back">上一张</div>
        <img class="load" style="width: 100px;" src="../assets/Loading.gif" v-if="load">
        <img class="preview-img" :src="showImageByIndex" v-else/>

        <div class="btn right-btn" @click="next" v-if="!load">下一张</div>
      </div>
      <div class="hero-name" v-if="!load">{{ heroName }}</div>
      <div class="style-cover scrollbar" v-if="!load">
        <div
          class="style-cover-box"
          v-for="(item, index) in list"
          :class="{sele: url[0] === index}"
          @click="diyCheck(index)">
          <img :src="item[0]" class="style-cover-img"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import image from "../mixins/image";
import {remote, ipcRenderer} from "electron";

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#`
  : `file://${__dirname}/#`
export default {
  name: 'preview',
  mixins: [image],
  data: () => ({
    src: 'https://angel-s.alphagame.hk/common/hero/lihui/maedayuuko_lihui_baoyi_0_2.png',
    url: [0, 0],
    heroName: '',
    show: false,
    list: [],
    load: true,
    exporting: false,
    metaData: null
  }),
  computed: {
    showImageByIndex() {
      let x = this.url[0]
      let y = this.url[1]
      if (this.list[x]) {
        return this.list[x][y]
      }
    },
  },
  methods: {
    close() {
      if (this.load) return;
      this.show = false
    },
    exportImage() {
      const directory = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        title: 'select path',
        activate: true,
        properties: ['openDirectory', 'promptToCreate', 'treatPackageAsDirectory']
      })
      if (directory) {
        const newWin = new remote.BrowserWindow({
          show: false,
          parent: remote.getCurrentWindow()
        })
        newWin.loadURL(`${winURL}/export-image-thread-page`)
        remote.ipcMain.once('export-image-thread-page-loaded', () => {
          this.load = true
          alert('开始导出~~')
          ipcRenderer.send('export-image-thread-page-load-data', {
            path: directory[0] + '/' + this.metaData.keystring.en,
            name: this.metaData.name
          })
          remote.ipcMain.once('processing-complete-export-image', (event, arg) => {
            this.load = false
            if (arg === Number('11111')) {
              alert('导出「'+ this.metaData.keystring.en +'」成功～～')
            } else {
              alert('导出失败')
            }
          })
        })
      }
      //  /export-image-thread-page
    },
    diyCheck(i) {
      this.url = [i, 0]
    },
    open(data) {
      this.load = true
      this.show = true
      this.getBaoyiImages(data.name)
        .then(img => {
          this.list = img.map(el => el.map(item => {
            return item.src;
          }));
          this.load = false
        }).catch(_ => this.load = true)
      this.heroName = data.keystring.en
      this.metaData = data
    },
    next() {
      let x = this.url[0]
      let y = this.url[1]
      let le1 = this.list.length
      if (le1 === 0) {
        return;
      }
      y++

      if (x > le1 - 1) {
        x = 0
      } else if (y > this.list[x].length - 1) {
        y = 0
        x++
        if (x > le1 - 1) {
          x = 0
        }
      }
      this.$set(this.url, '0', x)
      this.$set(this.url, '1', y)
    },
    back() {
      let x = this.url[0]
      let y = this.url[1]
      let le1 = this.list.length
      if (le1 === 0) {
        return;
      }
      y--;

      if (x < 0) {
        x = le1 - 1
      } else if (y < 0) {
        y = this.list[x].length - 1
        x--
        if (x < 0) {
          x = le1 - 1
        }
      }
      this.$set(this.url, '0', x)
      this.$set(this.url, '1', y)
    }
  },
  watch: {
    show: {
      handler(val) {
        this.$emit('change', val)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.sele {
  border: 3px solid #fff !important;
}

.btn {
  padding: 5px 20px;
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &.left-btn {
    left: 0;
    position: absolute;
  }

  &.right-btn {
    position: absolute;
    right: 0;
  }

}

.close {
  top: 5px;
  left: 5px;
}

.hero-name {
  padding: 20px 0;
  color: #fff;
  font-weight: 600;
  font-family: Courier;
}

.preview {
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

.preview-img-box {
  flex: 1;
  position: relative;
  width: -webkit-fill-available;
}

.content {
  height: 80vh;
  width: 80vw;
  margin: auto;
  //justify-content: space-between;
}

.center-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.preview-img {
  height: -webkit-fill-available;
}

.style-cover {
  height: 15vh;
  padding: 10px 0;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  align-items: center;
  overflow-y: scroll;
  border: 0px solid;
  transition: all .5s;
  justify-content: center;
}

.style-cover-box {
  height: 100%;
  padding: 0 50px;
  background-color: #fff;
  border-radius: 10px;
  margin-right: 10px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }

  .style-cover-img {
    height: inherit;
  }
}

.scrollbar::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}

.scrollbar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
  );
}

.scrollbar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}

@media screen and (min-width: 1250px) {
  .content {
    width: 55vw;
  }
}
</style>
