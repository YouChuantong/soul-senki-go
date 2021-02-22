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
* @FileName: select_game.vue
* @ClassName select_game
* @Description: TODO
*
* @Version: V1.0
* @Author: UpYou
* @CreateTime: 2021-02-18 21:56
*/

<template>
  <div class="select_game" >
    <div class="content" :class="{blur: blur}">
      <div
        @click.stop="display(index)"
        class="hero-photo"
        v-for="(item, index) in heroList"
        :key="`hero-photo-key-${index}`"
        :title="heroName(index)">
        <img
          class="photo"
          :src="getHeaderUrl(item.imageHeader[0])"
          @error="err(index)"
        />
        <p class="hero-code">{{ heroName(index) }}</p>
      </div>
    </div>
    <layer-panel :show="layerPanelShow" :close.sync="layerPanelShow" @change="layerPanelClose">
      <div class="opt" @click.stop="stopEvent">
        <div class="opt-item" @click="enjoy(checkIndex)">
          欣赏
        </div>
        <div class="opt-item" @click="recap">
          回顾
        </div>
      </div>
    </layer-panel>
    <preview
      ref="preview-baoyi"
      :show="showPreviewBaoyi"
      :close.sync="showPreviewBaoyi"
      @change="showPreviewBaoyiChange">
    </preview>
    <layer-panel :show="recapLayerPanelShow" :close.sync="recapLayerPanelShow" @change="recapLayerPanelShowClose">
      <div class="opt" @click.stop="stopEvent">
        <div class="opt-item" @click="playGif(checkIndex)">
          GIF
        </div>
        <div class="opt-item" @click="recap">
          视频
        </div>
      </div>
    </layer-panel>
  </div>
</template>

<script>
import initApplication from "../mixins/initApplication";
import image from "../mixins/image";
import layerPanel from "../components/layer_panel"
import open from "../mixins/open";
import {app, BrowserWindow, remote} from 'electron'
import Preview from "./preview";

export default {
  name: 'select_game',
  components: {
    Preview,
    layerPanel
  },
  mixins: [initApplication, image, open],
  data: () => ({
    heroList: [],
    layerPanelShow: false,
    checkIndex: 0,
    showPreviewBaoyi: false,
    recapLayerPanelShow: false,
    blur: false,
  }),
  computed: {
    heroName() {
      return i => {
        return this.heroList[i].keystring.en;
      }
    }
  },
  methods: {
    layerPanelClose(s) {
      if (!s) {
        this.blur = false;
        this.layerPanelShow = false
      }
    },
    recapLayerPanelShowClose(s) {
      if (!s) {
        this.blur = false;
        this.showPreviewBaoyi = false
      } else {
        this.blur = true;
      }
    },
    showPreviewBaoyiChange(s) {
      if (!s) {
        this.blur = false;
        this.showPreviewBaoyi = false
      } else {
        this.blur = true;
      }
    },
    err(i) {
      // console.log(this.heroList[i].id)
    },
    enjoy(i) {
      const previewBaoyiRef = this.$refs['preview-baoyi'];
      const data = this.heroList[i];
      this.layerPanelShow = false;
      previewBaoyiRef.open(data)
    },
    recap() {
      this.layerPanelShow = false;
      this.recapLayerPanelShow = true

    },
    async display(i) {
      this.blur = true
      this.checkIndex = Number(i)
      this.layerPanelShow = true
    },
    playGif(i) {
      const data = this.heroList[i]
      this.openGifWin(`${data.name}-recap-H`, data)
    },
    stopEvent() {

    },
  },
  async mounted() {
      //本软件不得用于商业用途，仅做学习交流
    dialog.showMessageBox(
      {
        type: "info",
        title: "警告",
        message: "未满18岁请自觉离开！",
        buttons: ["我已满18岁", "离开"],
      },
      (index) => {
        if (index === 1) {
          app.exit()
          return;
        }
        dialog.showMessageBox(
          {
            type: "info",
            title: "警告",
            message: "本软件不得用于商业用途，仅做学习交流",
            buttons: ["我知道了"],
          }
        );
      }
    );
    this.simpleConf().then(config => {
      this.heroList = config;
    })
    // this.openPreview(remote.getCurrentWindow())
  }
}
</script>

<style lang="scss" scoped>
.blur {
  filter: blur(10px) !important;
  width: 100vw !important;
  height: 100vh !important;
  overflow: hidden;

}

.overflow {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.opt {
  width: 500px;
  height: 250px;
  background-color: #fff;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 5px;
}

.opt-item {
  border-radius: 5px;
  box-shadow: 0 0 10px #d8d8d8;
  padding: 10px 20px;
  transition: all .4s;
  cursor: pointer;

  &:hover {
    margin-bottom: 10px;
    transform: scale(1.02);
  }

  &:active {
    margin-bottom: 9px;
    transform: scale(1.01);
  }
}

.select_game {
  display: flex;
  justify-content: center;
}

.photo {
  width: 60px;
  height: 60px;
}

.content {
  min-width: 804px;
  max-width: 804px;
  display: flex;
  flex-wrap: wrap;
  padding-right: 10px;
  padding-bottom: 13px;
  transition: filter .2s;
  filter: blur(0);
}

.hero-code {
  display: inline-block;
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-photo {
  min-width: 60px;
  min-height: 80px;
  max-width: 60px;
  max-height: 80px;
  border-radius: 5px;
  margin-left: 13px;
  margin-top: 13px;
  cursor: pointer;

  &:before {
    content: "";
    display: block;
  }

  &:after {
    content: "";
    display: block;
  }
}
</style>
