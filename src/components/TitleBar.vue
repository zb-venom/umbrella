<template>
  <div id="title-bar">
    <div id="title"></div>
    <div id="title-bar-btns">
      <div id="minimize" class="title-bar-btn"><span>&#128469;</span></div>
      <div id="maximize" class="title-bar-btn">
        <span id="maxIco">&#128470;</span>
      </div>
      <div id="quit" class="title-bar-btn"><span>&#128473;</span></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$gray-5: rgb(0, 0, 0, 0.05);
$gray-10: rgb(0, 0, 0, 0.1);
$lightred: rgba(255, 0, 0, 0.7);
$main-acent-color: rgb(88, 137, 228, 0.3);

#title-bar {
  display: block;
  // background: $gray-5;
  background: $main-acent-color;
  width: 100%;
  z-index: 100000;

  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;

  -webkit-app-region: drag;

  #title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #title-bar-btns {
    display: flex;

    -webkit-app-region: no-drag;
    user-select: none;

    .title-bar-btn {
      font-size: 0.9rem;
      margin-top: -6px;
      padding: 3px 5px;
      cursor: default;

      &:hover {
        background: $gray-10;
      }
    }

    #quit:hover {
      color: white;
      background: red;
    }
  }
}
</style>

<script>
export default {
  mounted: function() {
    const win = require("electron").remote.getCurrentWindow();

    document.querySelector("#minimize").addEventListener("click", () => {
      win.minimize();
    });

    document.querySelector("#maximize").addEventListener("click", () => {
      if (win.isMaximized()) {
        win.unmaximize();
        document.getElementById("maxIco").innerHTML = "&#128470;";
      } else {
        win.maximize();
        document.getElementById("maxIco").innerHTML = "&#128471;";
      }
    });

    document.querySelector("#quit").addEventListener("click", () => {
      win.close();
    });

    if (win.isMaximized()) {
      document.getElementById("maxIco").innerHTML = "&#128471;";
    } else {
      document.getElementById("maxIco").innerHTML = "&#128470;";
    }
  },
};
</script>
