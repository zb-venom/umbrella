<template>
  <div class="chats">
    <div class="search">
      <div class="burger-box">
        <span class="burger">&#9776;</span>
      </div>
      <input
        type="text"
        class="search-input"
        v-model="search"
        placeholder="Search"
      />

      <div class="create-dialog" @click="openModalAddDialog">
        <span class="add-ico">&#43;</span>
      </div>
    </div>
    <div
      class="chats-list"
      @scroll="onScroll($event.target)"
      @mouseenter="onScroll($event.target)"
      v-dragscroll
    >
      <div
        class="chats-list-element"
        @click="selectDialog($event.target, dialog._id)"
        v-for="dialog in search ? dialogs : $parent.dialogs"
        v-bind:key="dialog._id"
        @contextmenu="contextMenu($event, dialog._id)"
      >
        <div class="chats-list-element-avatar">
          <span v-if="!dialog.img">{{ dialog.username.substring(0, 1) }}</span>
          <span class="status" v-if="dialog.connected"></span>
        </div>
        <div class="chats-list-element-body">
          <div class="username">{{ dialog.username }}</div>
          <div class="message">
            <span v-if="dialog.sender_id == myId">You: </span>
            {{ dialog.lastMessage ? dialog.lastMessage : "Start chatting now" }}
          </div>
        </div>
        <div class="chats-list-element-date-and-status">
          <span class="time">{{
            new Date().getTime() - 86400000 > dialog.datetime
              ? new Date(dialog.datetime).toLocaleDateString()
              : new Date(dialog.datetime).toLocaleTimeString().substring(0, 5)
          }}</span>
          <div
            class="is-read-status"
            v-if="!dialog.isRead && dialog.sender_id != myId"
          >
            <span>{{ dialog.isReadCount > 99 ? "" : dialog.isReadCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll" id="resize">
      <div class="scroll-main">
        <div class="scroll-btn" id="scroll-btn"></div>
      </div>
    </div>
  </div>
  <div
    class="model"
    @click="closeModalAddDialog($event.target)"
    v-if="openModel"
  >
    <div class="model-box" v-if="!modelLoading">
      <div class="model-box-header">Add contact</div>
      <div
        class="model-box-close"
        id="close-btn"
        @click="closeModalAddDialog($event.target)"
      >
        <span>&#10005;</span>
      </div>
      <div class="model-box-body">
        <form onsubmit="event.preventDefault();" class="model-form-input">
          <div class="block-inline">
            <label for="add-dialog-input">
              <span class="far fa-user"></span>
            </label>
            <input
              type="text"
              class="add-dialog-input"
              id="add-dialog-input"
              v-model="addUsername"
              placeholder="Enter username"
            />
          </div>

          <div class="model-form-input-info">
            Enter username to add new contact.
          </div>
          <button class="add-dialog-btn" @click="addDialod">Add contact</button>
        </form>
      </div>
    </div>
    <span class="fas fa-sync loading" v-else></span>
  </div>
  <div
    class="context-menu"
    id="context-menu-left"
    hidden
    @contextmenu="closeContextMenu()"
    @click="closeContextMenu()"
  >
    <div class="context-menu-body" id="context-menu-box-left">
      <div
        class="context-menu-element"
        @click="$parent.deleteDialog(activeContext)"
      >
        Delete dialog
      </div>
    </div>
  </div>
</template>

<script>
import { dialog } from "electron";
export default {
  data: function() {
    return {
      myId: localStorage._id,
      modelLoading: false,
      openModel: false,
      addUsername: "",
      activeContext: "",
      dialogs: this.$parent.dialogs,
      search: "",
    };
  },
  methods: {
    selectDialog: function(el, dialog_id) {
      if (
        el.parentNode.parentNode.parentNode.classList[0] == "chats-list-element"
      )
        el = el.parentNode.parentNode.parentNode;
      else if (el.parentNode.parentNode.classList[0] == "chats-list-element")
        el = el.parentNode.parentNode;
      else if (el.parentNode.classList[0] == "chats-list-element")
        el = el.parentNode;

      if (
        document.getElementsByClassName("chat-selected")[0] &&
        !el.classList[1]
      ) {
        document
          .getElementsByClassName("chat-selected")[0]
          .classList.toggle("chat-selected");
      }
      if (!el.classList[1]) {
        el.classList.toggle("chat-selected");
        this.$emit("select");
      }
      this.$parent.selectDialog(dialog_id);
    },
    onScroll: function(el) {
      let scrollHeight = Math.round(
        ((window.innerHeight - 81) / el.scrollHeight) *
          (window.innerHeight - 81)
      );

      if (scrollHeight == window.innerHeight - 81)
        document.getElementsByClassName("scroll-main")[0].style.visibility =
          "hidden";
      else
        document.getElementsByClassName("scroll-main")[0].style.visibility = "";
      document.getElementById("scroll-btn").style.height = scrollHeight + "px";

      let top =
        (Math.round(el.scrollTop) /
          Math.round(el.scrollHeight - window.innerHeight + 81)) *
        (window.innerHeight - 81 - scrollHeight);
      document.getElementById("scroll-btn").style.top = top + "px";
    },
    addDialod: function() {
      if (
        this.addUsername &&
        !this.$parent.dialogs.find(
          (dialog) =>
            dialog.username.toUpperCase() === this.addUsername.toUpperCase()
        )
      ) {
        this.$parent.addDialog(this.addUsername, this);
        this.addUsername = "";
      } else {
        document.getElementById("add-dialog-input").classList.add("error");
        setTimeout(() => {
          try {
            document
              .getElementById("add-dialog-input")
              .classList.remove("error");
          } catch (e) {}
        }, 1250);
      }
    },
    openModalAddDialog: function() {
      this.openModel = true;
      setTimeout(
        () => document.getElementById("add-dialog-input").focus(),
        300
      );
    },
    closeModalAddDialog: function(element) {
      if (
        (element.classList.contains("model") ||
          element.id == "close-btn" ||
          element.parentNode.id == "close-btn") &&
        !this.modelLoading
      )
        this.openModel = false;
    },
    contextMenu: function(event, _id) {
      let contextMenuBg = document.getElementById("context-menu-left");
      let contextMenu = document.getElementById("context-menu-box-left");
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
      let contextMenuBg = document.getElementById("context-menu-left");
      let contextMenu = document.getElementById("context-menu-left");
      contextMenuBg.hidden = true;
      contextMenu.style.inset = "auto";
    },
  },
  watch: {
    dialogs: {
      handler(val) {},
      deep: true,
    },
    search(val) {
      let re = new RegExp(val.toLowerCase());
      this.dialogs = this.$parent.dialogs.filter((d) =>
        re.test(d.username.toLowerCase())
      );
    },
  },
  mounted() {
    // setInterval(() => {
    //   this.$forceUpdate();
    // }, 1000);
    document.getElementById("resize").addEventListener(
      "mousedown",
      function(e) {
        document.addEventListener("mousemove", resize, false);
      },
      false
    );
    document.addEventListener(
      "mouseup",
      function() {
        document.removeEventListener("mousemove", resize, false);
      },
      false
    );
    function resize(e) {
      var panel = document.getElementsByClassName("chats")[0];
      panel.style.width = e.x + "px";
    }
  },
  updated() {},
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
// $main-acent-color: rgb(63, 184, 63);
$main-acent-color: rgb(88, 137, 228);
$text-color-secondary: rgb(85, 85, 85);

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

.model {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &-box {
    background: white;
    min-width: 350px;
    width: 350px;
    max-width: 500px;
    border-radius: 4px;
    position: relative;

    &-header {
      padding: 20px;
      padding-bottom: 10px;
      font-size: 20px;
      font-weight: 500;
    }

    &-body {
      padding: 10px 20px;

      .model-form-input {
        display: flex;
        flex-direction: column;

        .block-inline {
          display: flex;

          label {
            padding-top: 8px;
            padding-right: 15px;
            font-size: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: $text-color-secondary;
          }

          .add-dialog-input {
            margin-left: 10px;
            padding: 7px 0;
            font-size: 14px;
            border: none;
            outline: none;
            border-bottom: 2px solid $grey;
            width: 100%;
            font-weight: 600;

            &:hover,
            &:focus {
              font-weight: 600;
              color: $main-acent-color;
              border-bottom: 2px solid $main-acent-color;
            }
          }

          .error {
            color: red;
            border-bottom: 2px solid red;

            &::placeholder {
              color: red;
            }

            &:hover,
            &:focus {
              color: rgba(255, 0, 0, 0.5);
              border-bottom: 2px solid rgba(255, 0, 0, 0.5);

              &::placeholder {
                color: rgba(255, 0, 0, 0.5);
              }
            }
          }
        }

        &-info {
          font-weight: 300;
          font-size: 12px;
          padding: 20px;
          text-align: center;
        }

        .add-dialog-btn {
          padding: 10px;
          background: transparent;
          outline: none;
          border: 1px solid transparent;
          border-radius: 6px;
          font-size: 12px;
          align-self: flex-end;
          cursor: pointer;
          text-transform: uppercase;
          font-weight: 600;
          color: $main-acent-color;
          transition: all 100ms;

          &:hover {
            background: $light-grey;
          }

          &:active {
            color: white;
            background: $main-acent-color;
          }
        }
      }
    }

    &-close {
      position: absolute;
      top: 13px;
      right: 13px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        margin-top: -3px;
      }

      &:hover {
        background: $light-grey;
      }

      &:active {
        color: white;
        background: $main-acent-color;
      }
    }
  }

  .loading {
    font-size: 70px;
    color: white;
    animation: rotateLoading 1500ms linear infinite;

    @keyframes rotateLoading {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}

.chats {
  width: 300px;
  min-width: 300px;
  max-width: calc(100vw - 400px);
  height: calc(100vh - 20px);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  user-select: none;
  flex-shrink: 0;
  position: relative;

  .search {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid transparent;
    background: white;

    .burger-box {
      width: 0;
      padding: 10px 0;
      margin-top: -4px;
      overflow: hidden;
      transition: width 500ms;
      transition: padding 500ms;
      cursor: pointer;

      .burger {
        font-size: 2rem;
        color: $text-color-secondary;
      }

      &:hover {
        background: $light-grey;
      }
    }

    .create-dialog {
      padding: 5px 15px;
      margin-right: 10px;
      border-radius: 50%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-self: center;

      transition: all 300ms;

      .add-ico {
        font-size: 2rem;
        color: $text-color-secondary;
      }

      &:hover {
        background: $light-grey;
      }

      &:active {
        color: white;
        background: $main-acent-color;
      }
    }

    &-input {
      margin: 11px;
      padding: 10px;
      width: 100%;
      background: $input-bg-color;
      border: 1px solid transparent;
      border-radius: 4px;
      outline: none;
      overflow: hidden;

      &:hover,
      &:focus {
        border: 1px solid $border-color-input;
      }
    }
  }

  &-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: white;

    &-element {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      cursor: pointer;
      padding-right: 6px;

      &-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 10px;
        background: coral;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        position: relative;

        span {
          color: white;
          font-size: 26px;
          font-weight: 600;
        }

        .status {
          position: absolute;
          right: 5px;
          bottom: 0;
          background: $active;
          border: 1px solid $light-grey;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      }

      &-body {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        overflow: hidden;
        width: 100%;
        margin: 5px;

        .username {
          font-weight: 500;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .message {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: $text-color-secondary;
        }
      }

      &-date-and-status {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        flex-shrink: 0;
        margin: 5px;
        font-size: 12px;
        color: $text-color-secondary;

        .is-read-status {
          display: block;
          padding: 10px;
          border-radius: 50%;
          color: white;
          background: $main-acent-color;
          position: relative;

          * {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }

      &:hover {
        background: $light-grey;
      }
    }

    &::-webkit-scrollbar {
      width: 0px;
    }
  }

  .scroll {
    position: absolute;
    height: calc(100% - 63px);
    width: 5px;
    top: 61px;
    padding: 0 3px;
    right: 0px;
    border-radius: 6px;
    cursor: w-resize;

    &-main {
      width: 5px;
      height: 100%;
      border-radius: 6px;
      background: transparent;
      position: relative;
      transition: background 300ms;
    }

    &-btn {
      position: absolute;
      background: transparent;
      border-radius: 6px;
      width: 5px;
      transition: background 300ms;
      transition: top 100ms;
    }
  }

  &:hover {
    .scroll {
      &-main {
        background: rgba(143, 143, 143, 0.2);
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
      }

      &-btn {
        background: rgba(117, 117, 117, 0);
        box-shadow: inset 0 0 3px black;
      }
    }
  }

  .chat-selected {
    color: white;
    background: $main-acent-color;
    background-image: $noise;

    .message,
    .chats-list-element-date-and-status {
      color: $light-grey;
    }
  }
}

@media (max-width: 600px) {
  .chats {
    width: 75px !important;
    min-width: 75px;
    max-width: 75px;

    .search {
      width: 75px;
      padding: 0;
      border-bottom: none;

      .burger-box {
        min-width: 75px;
        margin-top: -3px;
        border-bottom: 1px solid transparent;

        .burger {
          margin-left: 22px;
        }
      }

      &-input {
        position: absolute;
        visibility: hidden;
        border-bottom: 1px solid transparent;
      }

      .create-dialog {
        visibility: hidden;
      }
    }
  }
}
</style>
