<template>
  <div class="dialog">
    <div class="dialog-header">
      <div class="dialog-header-left">
        <div class="dialog-header-left-avatar">
          <span v-if="!activeDialog.img">{{
            activeDialog.username.substring(0, 1)
          }}</span>
        </div>
        <div class="dialog-header-left-body">
          <div class="username">
            {{ activeDialog.username }}
          </div>
          <div class="status online" v-if="activeDialog.connected">
            online
          </div>
          <div class="status" v-else>offline</div>
        </div>
      </div>
      <div class="dialog-header-right">
        <span class="burger">&#9776;</span>
      </div>
    </div>
    <div class="drop" id="dropTarget"><p>Drop file here</p></div>
    <div class="dialog-body" id="dialog-scroll" v-dragscroll.y>
      <div class="dialog-body-scroll">
        <div class="dialog-body-list">
          <div
            class="dialog-body-list-element"
            v-for="message in messages"
            v-bind:key="message"
            v-bind:class="{ me: message.sender_id == my_id }"
            @contextmenu="contextMenu($event, message._id)"
            data-no-dragscroll
          >
            <div class="message" v-if="!message.isLink">
              <div class="data" data-no-dragscroll v-if="message.message">
                {{ message.message }}
              </div>
              <div class="data" data-no-dragscroll v-if="message.file">
                <i
                  class="far"
                  v-bind:class="{
                    'fa-file-alt': true,
                    'fa-file-word': new RegExp('word').test(message.file.type),
                    'fa-file-image': new RegExp('image').test(
                      message.file.type
                    ),
                    'fa-file-audio': new RegExp('audio').test(
                      message.file.type
                    ),
                    'fa-file-video': new RegExp('video').test(
                      message.file.type
                    ),
                    'fa-file-excel': new RegExp('excel').test(
                      message.file.type
                    ),
                    'fa-file-powerpoint': new RegExp('presentation').test(
                      message.file.type
                    ),
                    'fa-file-pdf': new RegExp('pdf').test(message.file.type),
                    'fa-file-archive':
                      new RegExp('zip').test(message.file.type) ||
                      new RegExp('.zip').test(message.file.path) ||
                      new RegExp('.rar').test(message.file.path) ||
                      new RegExp('.tar').test(message.file.path),
                    'fa-file-code': new RegExp('code').test(message.file.type),
                  }"
                ></i>
                <div class="name-progress-size">
                  <div class="name">
                    <p>{{ message.file.name }}</p>
                  </div>
                  <div class="progress-bar" v-if="message.progress != '100%'">
                    <div
                      class="active-bar"
                      v-bind:id="message.fileHash"
                      v-bind:style="{ width: message.progress }"
                    ></div>
                  </div>
                  <div
                    class="size"
                    v-bind:id="message.fileHash + 'per'"
                    v-if="message.progress != '100%'"
                  >
                    0%
                  </div>
                  <div class="size" v-else>{{ message.file.size }}</div>
                </div>
              </div>
              <div class="info">
                <div class="datetime">
                  {{
                    new Date(message.createAt)
                      .toLocaleTimeString()
                      .substring(0, 5)
                  }}
                </div>
                <div
                  class="status"
                  v-bind:class="{
                    isRead: message.isRead,
                  }"
                >
                  <i
                    class="fas fa-check sent"
                    v-if="message.sender_id == my_id"
                  ></i>
                  <i
                    class="fas fa-check delivered"
                    v-if="message.sender_id == my_id"
                  ></i>
                </div>
              </div>
            </div>
            <div class="message" v-else @click="openBrowser(message.message)">
              <div class="link">
                <div class="url">{{ message.message }}</div>
                <div class="og" v-if="message.linkTitle">
                  <div class="og-data">
                    <p class="og-res">{{ message.linkSiteName }}</p>
                    <p class="og-title">{{ message.linkTitle }}</p>
                    <img class="og-img" v-bind:src="message.linkImg" />
                  </div>
                </div>
              </div>

              <div class="info">
                <div class="datetime">
                  {{
                    new Date(message.createAt)
                      .toLocaleTimeString()
                      .substring(0, 5)
                  }}
                </div>
                <div
                  class="status"
                  v-bind:class="{
                    isRead: message.isRead,
                  }"
                >
                  <i
                    class="fas fa-check sent"
                    v-if="message.sender_id == my_id"
                  ></i>
                  <i
                    class="fas fa-check delivered"
                    v-if="message.sender_id == my_id"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-input-form" v-if="$parent.activeDialog.connected">
      <div class="og-preview">
        <div class="og-preview-img" />
        <div class="og-preview-data">
          <p class="og-preview-res"></p>
          <p class="og-preview-title"></p>
        </div>
      </div>
      <form class="input-box" v-on:submit.prevent="sendMessage($event)">
        <input type="file" multiple @change="previewFiles" id="addFile" />
        <div
          class="add-file"
          id="addFileBtn"
          onclick="document.getElementById('addFile').click()"
        >
          <i class="fas fa-paperclip"></i>
        </div>
        <div class="preview-files" v-if="files.length != 0">
          <div class="file" v-for="file in files" v-bind:key="file">
            <i
              class="far"
              v-bind:class="{
                'fa-file-alt': true,
                'fa-file-word': new RegExp('word').test(file.type),
                'fa-file-image': new RegExp('image').test(file.type),
                'fa-file-audio': new RegExp('audio').test(file.type),
                'fa-file-video': new RegExp('video').test(file.type),
                'fa-file-excel': new RegExp('excel').test(file.type),
                'fa-file-powerpoint': new RegExp('presentation').test(
                  file.type
                ),
                'fa-file-pdf': new RegExp('pdf').test(file.type),
                'fa-file-archive':
                  new RegExp('zip').test(file.type) ||
                  new RegExp('.zip').test(file.path) ||
                  new RegExp('.rar').test(file.path) ||
                  new RegExp('.tar').test(file.path),
                'fa-file-code': new RegExp('code').test(file.type),
              }"
            ></i>
            <p>{{ file.name }}</p>
          </div>
        </div>
        <input
          type="text"
          class="message"
          id="message"
          placeholder="Write a message..."
          v-if="files.length == 0"
          @keydown="checkLink($event)"
          autofocus
        />
        <div class="send" @click="sendMessage($event)">
          <i class="material-icons">&#xe163;</i>
        </div>
      </form>
    </div>
  </div>
  <div
    class="context-menu"
    id="context-menu"
    hidden
    @contextmenu="closeContextMenu()"
    @click="closeContextMenu()"
  >
    <div class="context-menu-body" id="context-menu-box">
      <div
        class="context-menu-element"
        @click="$parent.deleteMessage(activeContext)"
      >
        Delete message
      </div>
    </div>
  </div>
</template>

<script>
import SimplePeerFiles from "simple-peer-files";
import transliterate from "../libs/scripts/transliterate";
const spf = new SimplePeerFiles();
const dragDrop = require("drag-drop");
var md5 = require("md5");
const ogs = require("open-graph-scraper");
const { shell } = require("electron");

export default {
  data: function() {
    return {
      my_id: localStorage._id,
      activeContext: "",
      connected: false,
      files: [],
    };
  },
  props: {
    activeDialog: {},
    messages: {},
  },
  methods: {
    openBrowser: function(url) {
      shell.openExternal(url);
    },
    checkLink: function(event) {
      if (
        this.isLink(event.target.value.replace(/^\s*/, "").replace(/\s*$/, ""))
      ) {
        ogs({ url: event.target.value }, (error, results, response) => {
          if (
            results &&
            (results.ogImage.url || results.ogImage[0].url) &&
            results.ogTitle
          ) {
            document.getElementsByClassName("og-preview")[0].style.visibility =
              "visible";
            let img = results.ogImage.url || results.ogImage[0].url;
            document.getElementsByClassName(
              "og-preview-img"
            )[0].style.backgroundImage = `url(${img})`;
            document.getElementsByClassName("og-preview-title")[0].innerHTML =
              results.ogTitle;
            document.getElementsByClassName("og-preview-res")[0].innerHTML =
              results.ogSiteName || results.ogTitle;
          } else
            document.getElementsByClassName("og-preview")[0].style.visibility =
              "hidden";
        });
      } else {
        document.getElementsByClassName("og-preview")[0].style.visibility =
          "hidden";
      }
    },
    isLink: function(data) {
      var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?'\\\+&amp;%\$#\=~_\-]+))*$"
      );
      return urlregex.test(data);
    },
    previewFiles: function(event) {
      if (this.files.length + event.target.files.length < 10)
        this.files = [...this.files, ...event.target.files];
    },
    sendMessage: function(event) {
      event.preventDefault();
      let message;
      if (this.files.length > 0) {
        for (var i = this.files.length - 1; i > -1; i--) {
          let file = this.files[i];
          let path = md5(transliterate(file.path) + Date.now());
          this.$parent.sendFile(file, path);
          this.$parent.activeDialog.peer.send(
            JSON.stringify({ sendFile: true, fileId: path })
          );
          spf
            .send(this.$parent.activeDialog.peer, path, file)
            .then((transfer) => {
              this.files.splice(i, 1);
              transfer.on("progress", (sentBytes) => {
                try {
                  document.getElementById(path).style.width = sentBytes + "%";
                  document.getElementById(path + "per").innerHTML =
                    Math.floor(sentBytes) + "%";
                } catch (e) {}
                // this.messages.find((m) => m.fileHash == btoa(path)).progress =
                //   sentBytes + "%";
              });
              transfer.on("done", async () => {
                this.$parent.endGetRemoteFile(file, path);
              });
              transfer.start();
            });
        }
      } else {
        message = document.getElementById("message").value;
        document.getElementById("message").value = "";
      }

      if (this.isLink(message.replace(/^\s*/, "").replace(/\s*$/, "")))
        this.$parent.sendMessageLink(
          message.replace(/^\s*/, "").replace(/\s*$/, ""),
          this
        );
      else if (message) this.$parent.sendMessage(message, this);
    },
    scrollToTop: function() {
      document.getElementById("dialog-scroll").scrollTop =
        document.getElementById("dialog-scroll").scrollHeight + 10000;
    },
    contextMenu: function(event, _id) {
      let contextMenuBg = document.getElementById("context-menu");
      let contextMenu = document.getElementById("context-menu-box");
      let width = parseInt(getComputedStyle(contextMenu).width);
      let height = parseInt(getComputedStyle(contextMenu).height);
      this.activeContext = _id;
      contextMenuBg.hidden = false;
      contextMenu.style.inset = "auto";
      if (event.x + width > window.innerWidth)
        contextMenu.style.right = window.innerWidth - event.x + "px";
      else contextMenu.style.left = event.x + "px";
      if (event.y + height > window.innerHeight)
        contextMenu.style.bottom = window.innerHeight - event.y + "px";
      else contextMenu.style.top = event.y + "px";
    },
    closeContextMenu: function() {
      let contextMenuBg = document.getElementById("context-menu");
      let contextMenu = document.getElementById("context-menu-box");
      contextMenuBg.hidden = true;
      contextMenu.style.inset = "auto";
    },
  },
  mounted() {
    let body = document.body;
    let targetDrop = document.getElementById("dropTarget");

    ["dragenter", "dragover"].forEach((eventName) => {
      body.addEventListener(
        eventName,
        () => (targetDrop.style.visibility = "visible"),
        false
      );
    });
    ["dragleave", "drop"].forEach((eventName) => {
      body.addEventListener(
        eventName,
        () => (targetDrop.style.visibility = "hidden"),
        false
      );
    });

    dragDrop("body", (files) => {
      if (this.files.length + files.length < 11)
        this.files = [...this.files, ...files];
    });
  },
  updated() {},
  watch: {},
};
</script>

<style lang="scss" scoped>
$input-bg-color: rgb(0, 0, 0, 0.05);
$border-color: rgb(0, 0, 0, 0.05);
$border-color-input: rgb(0, 0, 0, 0.2);
$scroll-color: rgba(175, 175, 175, 0.767);
$light-grey: rgb(240, 240, 240);
$grey: rgb(180, 180, 180);
$me-color: coral;
$active: rgb(22, 161, 22);
$main-acent-color: rgb(88, 137, 228);
$text-color-secondary: rgb(0, 0, 0, 0.5);

$noise: url(data:image/png;base64,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);

.context-menu {
  z-index: 900;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  &-body {
    position: absolute;
    width: 200px;
    background: $light-grey;
    padding: 10px 0;
  }

  &-element {
    padding: 10px;
    cursor: pointer;

    &:hover {
      color: white;
      background: $grey;
    }
  }
}

.dialog {
  display: flex;
  width: 100%;
  min-width: 300px;
  max-height: calc(100vh - 20px);
  flex-direction: column;
  position: relative;

  &-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid $light-grey;
    border-left: 1px solid $light-grey;
    border-right: 1px solid $light-grey;
    background: white;

    &-left {
      display: flex;
      overflow: hidden;

      &-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 10px;
        flex-shrink: 0;
        background: coral;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        span {
          color: white;
          font-size: 26px;
          font-weight: 600;
        }
      }

      &-body {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        overflow: hidden;
        margin: 5px;

        .username {
          font-weight: 500;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: $text-color-secondary;

          .online {
            color: $active;
          }
        }
      }
    }

    &-right {
      padding: 5px 10px;
      cursor: pointer;
      display: flex;
      margin-top: -4px;

      flex-direction: column;
      justify-content: center;

      .burger {
        font-size: 2rem;
        color: $text-color-secondary;
      }

      &:hover {
        .burger {
          color: black;
        }
      }
    }
  }

  &-body {
    display: flex;
    align-items: flex-end;
    overflow-y: auto;
    height: 100%;

    &-scroll {
      width: 100%;
      height: fit-content;
      max-height: 100%;
    }

    &-list {
      display: flex;
      flex-direction: column;
      align-self: flex-end;
      width: 100%;
      margin-bottom: 10px;

      &-element {
        display: flex;
        padding: 10px;
        width: fit-content;
        margin: 10px 20px;
        border-radius: 6px;
        color: white;
        background: $me-color;
        position: relative;
        z-index: 5;
        user-select: contain;

        font-size: 14px;

        .link {
          flex-direction: column;
          cursor: pointer;
        }

        .message {
          display: flex;
          justify-content: center;
          max-width: 400px;

          .url {
            flex-basis: 100%;
            width: 100%;
            text-decoration: underline;
            color: white;
          }

          .og {
            margin-top: 10px;
            margin-right: 10px;
            padding-left: 10px;
            display: flex;
            width: 100%;
            border-left: 2px solid white;

            &-res {
              font-weight: 700;
            }

            &-img {
              margin-top: 10px;
              max-width: calc(100% - 30px);
            }
          }

          .data {
            display: flex;
            align-items: center;
            margin-right: 10px;
            word-break: break-word;

            .svg-inline--fa {
              font-size: 20px;
              display: flex;
              width: 30px;
              height: 30px;
              justify-content: center;
              align-items: center;
              background: white;
              border-radius: 50%;
              padding: 10px;
              color: $me-color;
            }

            .name-progress-size {
              margin-left: 10px;
              display: flex;
              height: 100%;
              flex-direction: column;
              justify-content: space-evenly;
              position: relative;

              .name {
                display: flex;
                max-width: 200px;

                p {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }

              .progress-bar {
                display: block;
                position: relative;
                min-width: 100px;
                height: 10px;
                background: $me-color;
                border-radius: 2px;
                border: 1px solid white;

                .active-bar {
                  position: absolute;
                  width: 1%;
                  height: 100%;
                  background: white;
                }
              }

              .size {
                color: white;
                font-size: 13px;
                font-weight: 500;
                font-style: italic;
              }
            }
          }

          .info {
            display: flex;
            align-items: flex-end;
            position: relative;

            .datetime {
              font-size: 12px;
              margin-right: 5px;
            }

            .status {
              font-size: 12px;
              display: flex;
              justify-content: flex-end;
              color: $grey;

              .delivered {
                margin-left: -7px;
                margin-top: 1px;
                font-size: 11px;
              }
            }

            .isRead {
              color: $active;
            }
          }
        }

        &::before {
          content: " ";
          position: absolute;
          width: 0;
          height: 0;
          bottom: -10px;
          left: -1px;
          z-index: 1;
          transform: rotate(37deg);
          border: 10px solid;
          border-color: $me-color transparent transparent $me-color;
        }
      }

      .me {
        align-self: flex-end;
        color: black;
        background: white;

        .url {
          color: $me-color !important;
        }

        .og {
          border-left: 2px solid $me-color !important;
        }

        &::before {
          bottom: -10px;
          left: auto;
          right: -1px;
          z-index: 1;
          transform: rotate(53deg);
          border-color: white transparent transparent white;
        }

        .data {
          .svg-inline--fa {
            background: $me-color;
            color: white;
          }

          .size {
            color: rgba(0, 0, 0, 0.6) !important;
          }

          .progress-bar {
            display: block;
            position: relative;
            min-width: 100px;
            height: 10px;
            background: $light-grey !important;
            border-radius: 2px;
            border: 1px solid $me-color !important;

            .active-bar {
              position: absolute;
              width: 1%;
              height: 100%;
              background: $me-color !important;
            }
          }
        }
      }
    }

    &::-webkit-scrollbar-track {
      border-radius: 4px;
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &:hover::-webkit-scrollbar {
      background: $light-grey;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: transparent;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: $scroll-color;
    }
  }

  .drop {
    user-select: none;
    position: absolute;
    width: calc(100% - 20px);
    height: calc(100% - 81px);
    top: 61px;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    color: $active;
    font-weight: 600;
    font-size: 34px;
    border: 10px dashed $active;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;

    transition: all 300ms;
  }

  &-input-form {
    border-top: 1px solid $light-grey;
    border-left: 1px solid $light-grey;
    border-right: 1px solid $light-grey;
    background: white;
    flex: 0;

    .og-preview {
      visibility: hidden;
      position: absolute;
      left: 0;
      bottom: 53px;
      z-index: 9999;
      width: calc(100% - 2px);
      display: flex;
      background: white;
      border-top: 1px solid $light-grey;
      border-left: 1px solid $light-grey;
      border-right: 1px solid $light-grey;
      user-select: none;

      &-img {
        min-width: 50px;
        min-height: 50px;
        background-size: cover;
        background-position: center;
        margin: 10px;
        border: none;
      }

      &-data {
        display: flex;
        width: calc(100% - 40px);
        flex-direction: column;
        justify-content: space-evenly;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 10px 10px;
        font-size: 15px;

        p {
          font-size: 12px;

          &:first-child {
            font-weight: 700;
            color: $me-color;
            font-size: 15px;
          }
        }
      }
    }

    .input-box {
      display: flex;
      align-items: center;

      .add-file {
        width: 46px;
        height: 46px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        border-radius: 50%;
        margin: 3px;
        cursor: pointer;

        .fa-paperclip {
          transform: rotate(180deg);
        }
        &:hover {
          background: $light-grey;
        }
      }

      input[type="file"] {
        display: none;
      }

      .preview-files {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        min-height: 46px;

        .file {
          border: 1px solid $grey;
          margin: 5px;
          padding: 5px;
          user-select: none;
          display: flex;
          flex-wrap: nowrap;

          p {
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: 5px;
          }
        }
      }

      .message {
        outline: none;
        border: none;
        padding: 15px;
        width: 100%;
      }

      .send {
        width: 46px;
        height: 46px;
        background: transparent;
        cursor: pointer;
        border: none;
        outline: none;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 3px;
        flex: 0 0 40px;

        i {
          margin-left: 4px;
          font-size: 20px;
        }

        &:hover {
          background: $light-grey;
        }
      }
    }
  }
}
</style>
