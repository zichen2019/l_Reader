<template>
  <div class="r-viewer">
    <!-- 遮罩层 -->
    <div
      class="r-v-mask"
      :class="{'show-tool-menu-mask': showMenus || showContents || showProgress || showTools }"
      @click="onClick($event)" />
    <!-- 内容层 -->
    <div id="read"></div>
    <!-- 底部菜单栏 -->
    <footer>
      <div v-transfer-dom>
        <Popup v-model="showMenus" position="bottom" :show-mask="false">
          <div class="menu-contents">
            <span class="contents" @click="onClickMenus('contents')">目录</span>
            <span class="progress-bar" @click="onClickMenus('progress-bar')">进度</span>
            <span class='tools' @click="onClickMenus('tools')">设置</span>
          </div>
        </Popup>

        <Popup
          v-model="showContents"
          position="right"
          width="100%"
          :show-mask="false">
          <div class="contents">
            <header>
              <span class="back" @click="showContents = false">返回</span>
              <span class="title">{{ bookTitle }}</span>
              <span class="more">···</span>
            </header>

            <div class="contents-items" v-if="navigation && navigation.toc">
              <p
                class="item"
                v-for="chapter in navigation.toc"
                :key="chapter.id"
                @click="onToChapter(chapter.href)">
                {{chapter.label}}
              </p>
            </div>
          </div>
        </Popup>

        <Popup v-model="showTools" position="bottom" :show-mask="false">
          <div class="tools-contents">
            <div class="fonts">
              <p class="size add" @click="onfontAdd">A<span>+</span></p>
              <p class="size num" @click="onfontAdd">{{fontSize}}</p>
              <p class="size minus" @click="onfontMinus">A<span>-</span></p>
            </div>
            <div class="colors">
              <p
                v-for="color in themesList"
                class="color"
                :key="color.name"
                :class="color.name"
                @click="onSelectTheme(color.name)"
                >
                <x-icon
                  type="ios-checkmark-empty"
                  size="32"
                  class="not-select"
                  :class="{'selected': curFontColor == color.name}" />
              </p>
            </div>
          </div>
        </Popup>
      </div>
    </footer>
  </div>
</template>

<script>
import Epub from 'epubjs'
import { Popup, TransferDom } from 'vux'

export default {
  name: 'rViewer',
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  data () {
    return {
      showMenus: false, // 是否显示底部菜单栏
      showContents: false, // 是否显示目录
      showProgress: false, // 是否显示进度条
      showTools: false, // 是否显示设置菜单
      book: null, // 文本对象（即当前阅读的书籍所映射的对象
      bookTitle: null, // 书籍名称
      rendition: null, // 阅读器文本操作对象
      navigation: null, // 阅读器目录对象
      fontSize: 16,
      curFontColor: 'white', // 当前选择的背景色，默认为白色样式
      themesList: [
        {
          name: 'light-blue',
          style: {
            body: {
              'color': '#000',
              'background': '#eefaff'
            }
          }
        },
        {
          name: 'green',
          style: {
            body: {
              'color': '#000',
              'background': '#edf6d0'
            }
          }
        },
        {
          name: 'earth-yellow',
          style: {
            body: {
              'color': '#000',
              'background': '#f6f1e7'
            }
          }
        },
        {
          name: 'black',
          style: {
            body: {
              'color': '#fff',
              'background': '#222'
            }
          }
        },
        {
          name: 'white',
          style: {
            body: {
              'color': '#000',
              'background': '#f9f9f9'
            }
          }
        }
      ]
    }
  },
  mounted () {
    this.initReader()
  },
  methods: {
    initReader () {
      const vm = this
      // const url = 'https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf'
      const url = '/static/超级时间.epub'
      vm.book = new Epub(url)
      vm.rendition = vm.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight
      })
      vm.rendition.display()

      if (vm.rendition.themes) {
        vm.themesList && vm.themesList.forEach(item => {
          vm.rendition.themes.register(item.name, item.style)
        })

        vm.rendition.themes.select('white')
      }
    },
    nextPage () {
      let vm = this
      if (vm.rendition) {
        vm.rendition.next()
      }
    },
    prevPage () {
      let vm = this
      if (vm.rendition) {
        vm.rendition.prev()
      }
    },
    onClick (e) {
      let vm = this
      if (vm.showMenus) {
        vm.showMenus = false
        return
      }
      if (vm.showContents) {
        vm.showContents = false
        return
      }
      if (vm.showTools) {
        vm.showTools = false
        return
      }

      let clintWidth = document.body.clientWidth
      let unit = clintWidth / 8
      console.log('unit=', 3 * unit)
      if (e.offsetX < (3 * unit)) {
        vm.prevPage()
      } else if (e.offsetX > (5 * unit)) {
        vm.nextPage()
      } else {
        vm.showMenus = true
      }
    },
    onClickMenus (type) {
      let vm = this
      vm.showMenus = false
      switch (type) {
        case 'contents':
          vm.navigation = vm.book.navigation
          vm.showContents = true
          vm.bookTitle = vm.book.package.metadata.title
          console.log('vm.book=', vm.book)
          break
        case 'progress':
          vm.showProgress = true
          break
        case 'tools':
          vm.showTools = true
          break
        default:
          break
      }
    },
    onfontAdd () {
      let vm = this
      if (vm.fontSize >= 30) return false

      vm.fontSize += 2
      vm.rendition.themes.fontSize(vm.fontSize + 'px')
    },
    onfontMinus () {
      let vm = this
      if (vm.fontSize <= 13) return false

      vm.fontSize -= 2
      vm.rendition.themes.fontSize(vm.fontSize + 'px')
    },
    onSelectTheme (name) {
      let vm = this
      vm.curFontColor = name
      if (vm.rendition.themes) {
        vm.rendition.themes.select(name)
      }
    },
    onToChapter (href) {
      let vm = this
      if (vm.rendition) {
        console.log('href=', href)
        vm.rendition.display(href)
        vm.showContents = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.r-v-mask {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  opacity: 0;
  z-index: 1;
  &.show-tool-menu-mask {
    // background: #000;
    // opacity: 0.35;
  }
}

.tools-contents {
  background: #fff;
  .fonts, .colors {
    font-size: 18px;
    padding: 10px 20px;
    font-family:'Courier New', Courier, monospace;
    border-bottom: 1px solid #eee;
    display: flex;
  }
  .fonts {
    line-height: 25px;
    .size {
      flex: 0 0 40px;
      height: 25px;
      width: 30px;
      font-size: 28px;
      color: #03a9f4;
      text-align: left;
      margin: 0 10px;
      &.num {
        font-size: 16px;
        color: #999;
        margin: 0 10px;
        text-align: center;
      }
    }
  }
  .colors {
    line-height: 32px;
    .color {
      height: 32px;
      width: 32px;
      border: none;
      border-radius: 100%;
      margin:0 10px;
      position: relative;
      .not-select {
        display: none;
      }
      &::before {
        content: '';
        position: absolute;
        height: 36px;
        width: 36px;
        border: 1px solid #000;
        border-radius: 100%;
        top: -3px;
        left: -3px;
      }
      &.light-blue {
        background: #eefaff;
        .not-select { fill: #00bcd4; }
        &::before { border-color: rgba(#00bcd4, 0.5) }
      }
      &.green {
        background: #edf6d0;
        .not-select { fill: #8bc34a; }
        &::before { border-color: rgba(#8bc34a, 0.5) }
      }
      &.earth-yellow {
        background: #f6f1e7;
        .not-select { fill: #af8c46; }
        &::before { border-color: rgba(#af8c46, 0.5) }
      }
      &.black {
        color: #f9f9f9;
        background: #000;
        .not-select { fill: #fff; }
      }
      &.white {
        color: #000;
        background: #f9f9f9;
        .not-select { fill: #000; }
        &::before { border-color: #e5e5e5 }
      }
      .selected {
        display: block;
      }
    }
  }
}

.menu-contents {
  background: #fff;
  overflow: hidden;
  height: 52px;
  line-height: 52px;
  font-size: 14px;
  color: #333;
  border: 1px solid #f1f1f1;
  display: flex;
  span {
    flex: 1;
    text-align: center;
    padding-top: 13px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 5px;
      height: 20px;
      width: 20px;
      margin-left: -11px;
    }
    &.contents::before {
      height: 23px;
      width: 23px;
      background:url(../assets/images/contents.png) no-repeat;
      background-size: contain;
    }
    &.progress-bar::before {
      background:url(../assets/images/progress-bar.png) no-repeat;
      background-size: contain;
    }
    &.tools::before {
      background:url(../assets/images/tools.png) no-repeat;
      background-size: contain;
    }
  }
}

.contents {
  background: rgba(#fff, 0.95);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  header {
    height: 50px;
    line-height: 50px;
    border: 1px solid #e9e9e9;
    display: flex;
    .back {
      flex: 0 0 50px;
      text-align: center;
      margin-right: 10px;
    }
    .more {
      flex: 0 0 50px;
      text-align: center;
      margin-left: 10px;
    }
    .title {
      padding: 0 17%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .contents-items {
    color: #333;
    padding-left: 10px;
    height: 100%;
    width: calc(100% - 10px);
    overflow-y: scroll;
    .item {
      padding: 10px 0;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      border-bottom: 1px solid #e9e9e9;
    }
  }
}
</style>
