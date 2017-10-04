<template>
  <div class="vhe-popup-box" v-if="show">
    <div class="vhe-popup-box-inner">
        <i class="iconfont icon-arrows_remove" @click="$emit('update:show', false)"></i>
        <div class="vhe-popup-box-header">
          <i-tab :activeTab="activeTab" :tabs="tabs" @active-change="activeChange"></i-tab>
        </div>
        <div class="vhe-popup-box-content">
          <div v-if="currentView === 'selectImg'" class="popup-img-selector">
            <div @click="currentImg = currentImg !== -1 && currentImg === index  ? -1 : index" v-for="(img,index) in imgs" class="vhe-img-wp">
              <img :src="img.url">
              <i :class="currentImg !== index ? '' : 'selected'" class="iconfont icon-gou"></i>
              <div class="vhe-popup-img-meta"></div>
            </div>
          </div>
        </div>
        <div class="vhe-popup-box-btns">
          <button @click="finishSelect" :disabled="currentImg === -1" :class="currentImg === -1 ? 'disabled' : ''" class="vhe-popup-box-btn">选择该图片</button>
          <button :disabled="currentImg === -1" :class="currentImg === -1 ? 'disabled' : ''" class="vhe-popup-box-btn">编辑该图片</button>
        </div>
    </div>
  </div>
</template>
<script>
import ITab from './ITab'
import './../../static/font/iconfont.css'
export default {
  props: {
    show: Boolean
  },
  data () {
    return {
      activeTab: '0',
      currentView: 'selectImg',
      currentImg: -1,
      tabs: [
        {
          id: '0',
          label: '选择图片',
          view: 'selectImg'
        },
        {
          id: '1',
          label: '上传图片',
          view: 'uploadImg'
        },
        {
          id: '2',
          label: '裁剪图片',
          view: 'editImg'
        }
      ],
      imgs: [
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-7-13/84217600.jpg'
        },
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-7-13/25440190.jpg'
        },
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-9-19/40861607.jpg'
        },
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-7-12/12910508.jpg'
        },
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-7-12/67706257.jpg'
        },
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-7-12/2165555.jpg'
        },
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-7-13/84217600.jpg'
        },
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-7-13/25440190.jpg'
        },
        {
          url: 'http://ostjp7jb4.bkt.clouddn.com/17-9-19/40861607.jpg'
        }
      ]
    }
  },
  components: {
    ITab
  },
  methods: {
    activeChange (tab) {
      this.currentView = tab.view
    },
    finishSelect () {
      this.$emit('update:show', false)
      this.$emit('finish-select-img', this.imgs[this.currentImg].url)
      this.currentImg = -1
    }
  }
}
</script>
<style scoped>
.vhe-popup-box{
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5)
}
.vhe-popup-box-inner{
  position: fixed;
  top: calc(50% - 240px);
  left: calc(50% - 450px);
  width: 900px;
  height: 480px;
  background-color: #fff;
  border-radius: 5px;
}
.vhe-popup-box-content{
  height: calc(100% - 100px);
  width: 100%;
  background-color: #E5E9F2;
}
.popup-img-selector{
  height: 100%;
  width: 100%;
  overflow: auto;
}
.vhe-img-wp{
  height: 180px;
  width: 200px;
  float: left;
  margin: 10px;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  position: relative;
}
.vhe-img-wp img{
  height: 150px;
  width: 100%;
  margin-top: 10px;
}
.vhe-img-wp:hover .icon-gou{
  display: block;
}
.vhe-popup-img-meta{
  height: 20px;
  width: 100%;
}
.vhe-popup-box-header{
  height: 40px;
  padding-top: 10px;
  width: 100%;
}
.vhe-popup-box-btns{
  height: 50px;
  text-align: right;
}
.vhe-popup-box-btn{
  height: 36px;
  background-color: #20A0FF;
  border: thin solid #20A0FF;
  border-radius: 4px;
  color: #fff;
  margin: 7px 10px;
  outline: none;
}
.vhe-popup-box-btn.disabled{
  background-color: #eef1f6 !important;
  color: #bfcbd9;
  cursor: not-allowed;
  border: thin solid #d1dbe5;
}
.vhe-popup-box-btn:hover{
  background-color:#58B7FF;
}
.vhe-popup-box-btn:active{
  background-color: #1D8CE0;
}
.icon-gou{
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 36px;
  display: none;
  color: #D3DCE6;
}
.icon-gou.selected{
  color: #20A0FF;
  display: block;
}
.icon-arrows_remove{
  position: absolute;
  height: 34px;
  right: 0px;
  top: 0px;
  font-size: 36px;
  cursor: pointer;
  z-index: 1;
  transition: transform .5s;
}
.icon-arrows_remove:hover{
  transform: rotate(180deg)
}
</style>