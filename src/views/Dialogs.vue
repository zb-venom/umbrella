<template>
  <div class="content" v-if="inRoom">
    <Chats />
    <Dialog
      v-if="activeDialog"
      v-bind:activeDialog="activeDialog"
      v-bind:messages="messages"
    />
    <div class="select-chat" v-else>
      <span>Select a chat to start messaging</span>
    </div>
  </div>
  <div class="content" v-else>
    <div class="bg-box">
      <span class="fas fa-sync loading"></span>
    </div>
  </div>
</template>

<style lang="scss">
$input-bg-color: rgb(0, 0, 0, 0.05);
$border-color: rgb(0, 0, 0, 0.05);
$border-color-input: rgb(0, 0, 0, 0.2);
$scroll-color: rgba(175, 175, 175, 0.767);
$light-grey: rgb(240, 240, 240);
// $main-acent-color: rgb(63, 184, 63);
$main-acent-color: rgb(88, 137, 228);
$text-color-secondary: rgb(0, 0, 0, 0.5);

$noise: url(data:image/png;base64,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);

.content {
  margin-top: 20px;
  display: flex;
  height: 100%;
  flex-direction: row;
  flex-wrap: nowrap;
  background: $main-acent-color;
  background-image: $noise;
  position: relative;

  .select-chat {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      display: block;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 1.2rem;
      color: white;
      background: rgba(0, 0, 0, 0.6);
    }
  }

  .bg-box {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;

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
}
</style>

<script>
import Chats from "../components/Chats";
import Dialog from "../components/Dialog";
import RightMenu from "../components/RightMenu";
import axios from "axios";
import Peer from "simple-peer";
import io from "socket.io-client";
const fs = require("fs");
import fsu from "../libs/scripts/fsu";

const crypto = require("crypto");
const GCM = require("../libs/kuznechik/GCM");
const gcm = new GCM();

// const socket = io("http://localhost:3000");
const socket = io("https://authdiplom.herokuapp.com/");

// axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.baseURL = "https://authdiplom.herokuapp.com/";
axios.defaults.headers.common["Authorization"] = localStorage.jwt;

import SimplePeerFiles from "simple-peer-files";
const spf = new SimplePeerFiles();
const ogs = require("open-graph-scraper");

const Datastore = require("nedb"),
  dbDialogs = new Datastore({ filename: "dialogs.db", autoload: true }),
  dbMessages = new Datastore({ filename: "messages.db", autoload: true });
import db from "../db/db";

export default {
  data: function() {
    return {
      activeDialog: false,
      dialogs: [],
      messages: [],
      inRoom: false,
      audio: null,
      resend: Date.now() - 30000,
    };
  },
  components: {
    Chats,
    Dialog,
    RightMenu,
  },
  methods: {
    selectDialog: function(dialog_id) {
      this.activeDialog = this.dialogs.find(
        (dialog) => dialog._id === dialog_id
      );
      this.messages = this.activeDialog.messages;
      this.getMessages();
      setTimeout(() => {
        document.getElementById("dialog-scroll").scrollTop =
          document.getElementById("dialog-scroll").scrollHeight + 10000;
      }, 100);

      try {
        document.getElementById("message").focus();
      } catch (e) {}
    },
    updateDialogs: function() {
      dbDialogs
        .find({
          owner: localStorage._id,
        })
        .sort({ datetime: -1 })
        .exec((err, data) => {
          if (!!err) console.error(err);
          this.dialogs = data;
          data.forEach((dialog) => {
            dbMessages.count(
              {
                dialog_id: dialog._id,
                isRead: false,
                sender_id: dialog.global_id,
              },
              (err, c) => (dialog.isReadCount = c)
            );
            dbMessages
              .find({ dialog_id: dialog._id })
              .sort({ createAt: -1 })
              .limit(20)
              .exec((err, data) => {
                dialog.messages = data.sort((a, b) => a.createAt - b.createAt);
              });
          });
        });
    },
    sendMessage: function(message, child) {
      gcm.setKeys(Buffer.from(this.activeDialog.sharedKey, "hex"));
      const enc_message = gcm.Encrypt(Buffer.from(message)).toString("base64");

      dbMessages.insert(
        {
          dialog_id: this.activeDialog._id,
          sender_id: localStorage._id,
          message,
          createAt: new Date(),
          isRead: false,
        },
        async (err, data) => {
          if (!!err) console.error(err);
          let count = null;
          await dbMessages.count(
            {
              dialog_id: data.dialog_id,
              isRead: false,
              sender_id: this.activeDialog.global_id,
            },
            (err, c) => (count = count)
          );

          let dialog = this.dialogs.find(
            (dialog) => dialog._id == data.dialog_id
          );
          dialog.lastMessage = data.message;
          dialog.sender_id = data.sender_id;
          dialog.datetime = data.createAt;
          dialog.isRead = data.isRead;
          dialog.isReadCount = null;

          dialog.peer.send(JSON.stringify({ message: enc_message }));

          dbMessages.update(
            {
              dialog_id: dialog._id,
              isRead: false,
              sender_id: dialog.global_id,
            },
            { $set: { isRead: true } },
            { multi: true },
            (err, count) => {
              if (!!err) console.error(err);
            }
          );
          this.activeDialog.peer.send(JSON.stringify({ isRead: true }));
          dbDialogs.update(
            { _id: data.dialog_id },
            {
              $set: {
                lastMessage: data.message,
                sender_id: data.sender_id,
                datetime: data.createAt,
                isRead: data.isRead,
                isReadCount: null,
              },
            },
            {},
            () => {
              this.getMessages();
            }
          );

          setTimeout(() => {
            document.getElementById("dialog-scroll").scrollTop =
              document.getElementById("dialog-scroll").scrollHeight + 10000;
          }, 300);
        }
      );
    },
    sendMessageLink: function(message, child) {
      gcm.setKeys(Buffer.from(this.activeDialog.sharedKey, "hex"));
      const enc_message = gcm.Encrypt(Buffer.from(message)).toString("base64");
      let linkImg = "";
      let linkTitle = "";
      let linkSiteName = "";
      ogs({ url: message }, (error, results, response) => {
        if (results && results.ogTitle && results.ogImage) {
          if (results.ogImage.url || results.ogImage[0].url) {
            linkImg = results.ogImage.url || results.ogImage[0].url;
            linkTitle = results.ogTitle;
            linkSiteName = results.ogSiteName || results.ogTitle;
          }
        }
        dbMessages.insert(
          {
            dialog_id: this.activeDialog._id,
            sender_id: localStorage._id,
            isLink: true,
            linkImg,
            linkTitle,
            linkSiteName,
            message,
            createAt: new Date(),
            isRead: false,
          },
          async (err, data) => {
            if (!!err) console.error(err);
            let count = null;
            await dbMessages.count(
              {
                dialog_id: data.dialog_id,
                isRead: false,
                sender_id: this.activeDialog.global_id,
              },
              (err, c) => (count = count)
            );

            let dialog = this.dialogs.find(
              (dialog) => dialog._id == data.dialog_id
            );
            dialog.lastMessage = data.message;
            dialog.sender_id = data.sender_id;
            dialog.datetime = data.createAt;
            dialog.isRead = data.isRead;
            dialog.isReadCount = null;

            dialog.peer.send(JSON.stringify({ message: enc_message }));

            dbMessages.update(
              {
                dialog_id: dialog._id,
                isRead: false,
                sender_id: dialog.global_id,
              },
              { $set: { isRead: true } },
              { multi: true },
              (err, count) => {
                if (!!err) console.error(err);
              }
            );
            this.activeDialog.peer.send(JSON.stringify({ isRead: true }));
            dbDialogs.update(
              { _id: data.dialog_id },
              {
                $set: {
                  lastMessage: data.message,
                  sender_id: data.sender_id,
                  datetime: data.createAt,
                  isRead: data.isRead,
                  isReadCount: null,
                },
              },
              {},
              () => {
                this.getMessages();
              }
            );

            setTimeout(() => {
              document.getElementById("dialog-scroll").scrollTop =
                document.getElementById("dialog-scroll").scrollHeight + 10000;
            }, 300);
          }
        );
      });
    },
    getMessages: function() {
      try {
        dbMessages
          .find({ dialog_id: this.activeDialog._id })
          .sort({ createAt: 1 })
          .exec((err, data) => {
            if (!!err) console.error(err);
            this.messages = data;
            this.dialogs.find(
              (dialog) => dialog._id === this.activeDialog._id
            ).messages = data;
          });
      } catch (e) {}
    },
    deleteMessage: function(message_id) {
      dbMessages.remove({ _id: message_id });
      dbMessages
        .findOne({ dialog_id: this.activeDialog._id })
        .sort({ createAt: -1 })
        .exec((err, data) => {
          if (!data) {
            let d = this.dialogs.find(
              (dialog) => dialog._id == this.activeDialog._id
            );
            d.lastMessage = "";
            d.sender_id = "";
            d.datetime = new Date().getTime();
            d.isRead = true;
            d.isReadCount = null;
            dbDialogs.update(
              { _id: this.activeDialog._id },
              {
                $set: {
                  lastMessage: "",
                  sender_id: "",
                  datetime: new Date().getTime(),
                  isRead: true,
                  isReadCount: null,
                },
              },
              {},
              () => {
                this.getMessages();
              }
            );
          } else {
            let d = this.dialogs.find(
              (dialog) => dialog._id == this.activeDialog._id
            );
            dbMessages.count(
              { dialog_id: data.dialog_id, isRead: false },
              (err, count) => {
                if (!!err) console.error(err);
                this.dialogs.find((dialog) => dialog._id == data.dialog_id);
                d.lastMessage = data.message;
                d.sender_id = data.sender_id;
                d.datetime = data.createAt;
                d.isRead = data.isRead;
                d.isReadCount = count;
                dbDialogs.update(
                  { _id: data.dialog_id },
                  {
                    $set: {
                      lastMessage: data.message,
                      sender_id: data.sender_id,
                      datetime: data.createAt,
                      isRead: data.isRead,
                      isReadCount: count,
                    },
                  },
                  {},
                  () => {
                    this.getMessages();
                  }
                );
              }
            );
          }
        });
      this.getMessages();
    },
    deleteDialog: function(dialog_id) {
      dbDialogs.remove({ _id: dialog_id });
      this.dialogs.find((dialog) => dialog._id === dialog_id).peer.destroy();
      this.dialogs.splice(
        this.dialogs.indexOf(
          this.dialogs.find((dialog) => dialog._id == dialog_id)
        ),
        1
      );
      dbMessages.remove({ dialog_id }, { multi: true });
      if (this.activeDialog._id == dialog_id) this.activeDialog = null;
    },
    addDialog: function(username, child) {
      axios
        .get("/api/users?username=" + username)
        .then((res) => {
          if (res.data.user._id) {
            dbDialogs.insert(
              {
                owner: localStorage._id,
                username: res.data.user.username,
                global_id: res.data.user._id,
                datetime: new Date().getTime(),
              },
              (err, data) => {
                this.dialogs.push({
                  _id: data._id,
                  username: data.username,
                  global_id: data.global_id,
                  datetime: data.datetime,
                  peer: {
                    connected: false,
                  },
                });
                child.openModel = false;
                this.$forceUpdate();
                this.updatePeers();
              }
            );
          }
        })
        .catch((err) => {
          console.log(err);
          document.getElementById("add-dialog-input").classList.add("error");
          setTimeout(() => {
            try {
              document
                .getElementById("add-dialog-input")
                .classList.remove("error");
            } catch (e) {}
          }, 2000);
        });
      this.updateDialogs();
    },
    alert: function() {
      alert("опа опа эта чееееееееееееееееееееее");
    },
    timeOut: function() {
      setInterval(() => {
        if (!this.inRoom) socket.emit("join", { jwt: localStorage.jwt });
        this.updatePeers();
      }, 300000);
    },
    checkDialogById: function(global_id) {
      if (!this.dialogs.find((dialog) => dialog.global_id === global_id)) {
        axios
          .get("/api/users?_id=" + global_id)
          .then((res) => {
            if (res.data.user._id) {
              dbDialogs.insert(
                {
                  owner: localStorage._id,
                  username: res.data.user.username,
                  global_id: res.data.user._id,
                  datetime: new Date().getTime(),
                },
                (err, data) => {
                  this.dialogs.push({
                    _id: data._id,
                    username: data.username,
                    global_id: data.global_id,
                    datetime: data.datetime,
                    peer: {
                      connected: false,
                    },
                  });
                  return true;
                }
              );
            }
          })
          .catch((err) => {
            console.log(err);
            return true;
          });
      }
      return true;
    },
    updatePeers: function() {
      this.dialogs.forEach((dialog) => {
        let newpeer = true;

        try {
          newpeer = !dialog.peer.connected;
        } catch (e) {}

        if (newpeer) {
          dialog.peer = new Peer({ initiator: true, trickle: false });
          const keys = crypto.createECDH("prime256v1");
          dialog.crypto = keys.generateKeys();
          dialog.public = keys.getPublicKey().toString("base64");

          dialog.peer.on("signal", (data) => {
            console.log("send offer");
            socket.emit("offerData", localStorage._id, dialog.global_id, data);
          });

          dialog.peer.on("connect", () => {
            dialog.peer.send(JSON.stringify({ ok: true }));
            dialog.peer.send(JSON.stringify({ public: dialog.public }));
            dialog.connected = true;
            this.activeDialog = this.dialogs.find(
              (dialog) => dialog._id === this.activeDialog._id
            );
          });
          dialog.peer.on("error", (err) => {
            console.log("catch err: ", err);
            dialog.connected = false;
            this.activeDialog = this.dialogs.find(
              (dialog) => dialog._id === this.activeDialog._id
            );
            this.updatePeers();
          });
          dialog.peer.on("data", (data) => {
            let msg = JSON.parse(data.toString());
            if (msg.ok) console.log("from: " + dialog.username, msg);
            if (msg.message) {
              gcm.setKeys(Buffer.from(dialog.sharedKey, "hex"));
              let decrypted = gcm
                .Decrypt(Buffer.from(msg.message, "base64"))
                .toString();
              this.getRemoteMessages(dialog._id, dialog.global_id, decrypted);
            }
            if (msg.isRead) this.setMessageAsRead(dialog._id, dialog.global_id);
            if (msg.public)
              dialog.sharedKey = keys.computeSecret(
                msg.public,
                "base64",
                "hex"
              );
            if (msg.sendFile)
              spf.receive(dialog.peer, msg.fileId).then((transfer) => {
                let path = msg.fileId;
                this.getRemoteFile(dialog._id, dialog.global_id, msg.fileId);
                transfer.on("progress", (sentBytes) => {
                  this.progressSendFile(path, sentBytes);
                });
                transfer.on("done", async (file) => {
                  this.endGetRemoteFile(file, path);
                  fsu(file);
                });
                dialog.peer.send(
                  JSON.stringify({ readyToFile: true, fileId: msg.fileId })
                );
              });
          });
        }
      });
    },
    isLink: function(data) {
      var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?'\\\+&amp;%\$#\=~_\-]+))*$"
      );
      return urlregex.test(data);
    },
    getRemoteMessages: function(dialog_id, global_id, message) {
      if (this.isLink(message)) {
        let linkImg = "";
        let linkTitle = "";
        let linkSiteName = "";
        ogs({ url: message }, (error, results, response) => {
          if (
            results &&
            (results.ogImage.url || results.ogImage[0].url) &&
            results.ogTitle
          ) {
            linkImg = results.ogImage.url || results.ogImage[0].url;
            linkTitle = results.ogTitle;
            linkSiteName = results.ogSiteName || results.ogTitle;
          }
          dbMessages.insert(
            {
              dialog_id: dialog_id,
              sender_id: global_id,
              isLink: true,
              linkImg,
              linkTitle,
              linkSiteName,
              message,
              createAt: new Date(),
              isRead: false,
            },
            async (err, data) => {
              if (!!err) console.error(err);
              await dbMessages.count(
                {
                  dialog_id: data.dialog_id,
                  isRead: false,
                  sender_id: global_id,
                },
                (err, count) => {
                  if (!!err) console.error(err);
                  let dialog = this.dialogs;
                  dialog = dialog.find(
                    (dialog) => dialog._id == data.dialog_id
                  );
                  dialog.lastMessage = data.message;
                  dialog.sender_id = data.sender_id;
                  dialog.datetime = data.createAt;
                  dialog.isRead = data.isRead;
                  dialog.isReadCount = count;
                  this.audio.pause();
                  this.audio.currentTime = 0;
                  this.audio.play();
                  dbDialogs.update(
                    { _id: data.dialog_id },
                    {
                      $set: {
                        lastMessage: data.message,
                        sender_id: data.sender_id,
                        datetime: data.createAt,
                        isRead: data.isRead,
                        isReadCount: count,
                      },
                    },
                    {},
                    () => {
                      this.getMessages();
                      setTimeout(() => {
                        document.getElementById("dialog-scroll").scrollTop =
                          document.getElementById("dialog-scroll")
                            .scrollHeight + 10000;
                      }, 300);
                    }
                  );
                }
              );
            }
          );
        });
      } else
        dbMessages.insert(
          {
            dialog_id: dialog_id,
            sender_id: global_id,
            message,
            createAt: new Date(),
            isRead: false,
          },
          async (err, data) => {
            if (!!err) console.error(err);
            await dbMessages.count(
              {
                dialog_id: data.dialog_id,
                isRead: false,
                sender_id: global_id,
              },
              (err, count) => {
                if (!!err) console.error(err);
                let dialog = this.dialogs;
                dialog = dialog.find((dialog) => dialog._id == data.dialog_id);
                dialog.lastMessage = data.message;
                dialog.sender_id = data.sender_id;
                dialog.datetime = data.createAt;
                dialog.isRead = data.isRead;
                dialog.isReadCount = count;
                this.audio.pause();
                this.audio.currentTime = 0;
                this.audio.play();
                dbDialogs.update(
                  { _id: data.dialog_id },
                  {
                    $set: {
                      lastMessage: data.message,
                      sender_id: data.sender_id,
                      datetime: data.createAt,
                      isRead: data.isRead,
                      isReadCount: count,
                    },
                  },
                  {},
                  () => {
                    this.getMessages();
                    setTimeout(() => {
                      document.getElementById("dialog-scroll").scrollTop =
                        document.getElementById("dialog-scroll").scrollHeight +
                        10000;
                    }, 100);
                  }
                );
              }
            );
          }
        );
    },
    setMessageAsRead: function(dialog_id) {
      let dialog = this.dialogs.find((dialog) => dialog._id == dialog_id);
      dbMessages.update(
        { dialog_id, isRead: false, sender_id: localStorage._id },
        { $set: { isRead: true } },
        { multi: true },
        (err, count) => {
          if (!!err) console.error(err);
        }
      );
      if (dialog.sender_id === localStorage._id) dialog.isReadCount = null;
      try {
        this.getMessages();
      } catch (e) {}
    },
    sendFile: function(file, path) {
      dbMessages.insert(
        {
          dialog_id: this.activeDialog._id,
          sender_id: localStorage._id,
          file: {
            name: file.name,
            type: file.type,
            path: file.path,
            size: Math.floor((file.size / 1024 / 1024) * 100) / 100 + " MB",
          },
          fileHash: path,
          progress: 0,
          createAt: new Date(),
          isRead: false,
        },
        (err, data) => {
          if (!!err) console.error(err);
          this.getMessages();
        }
      );
      dbDialogs.update(
        { _id: this.activeDialog._id },
        {
          $set: {
            lastMessage: "file",
            sender_id: localStorage._id,
            datetime: new Date(),
            isRead: null,
            isReadCount: null,
          },
        },
        {},
        () => {}
      );
      let dialog = this.dialogs.find(
        (dialog) => dialog._id === this.activeDialog._id
      );
      dialog.lastMessage = "file";
      dialog.sender_id = localStorage._id;
      dialog.datetime = new Date();
      dialog.isRead = null;
    },
    getRemoteFile: function(dialog_id, global_id, path) {
      dbMessages.insert(
        {
          dialog_id: dialog_id,
          sender_id: global_id,
          file: {
            name: path,
            type: null,
            path: null,
          },
          fileHash: path,
          progress: 0,
          createAt: new Date(),
          isRead: false,
        },
        (err, data) => {
          if (!!err) console.error(err);
          this.getMessages();
          setTimeout(() => {
            document.getElementById("dialog-scroll").scrollTop =
              document.getElementById("dialog-scroll").scrollHeight + 10000;
          }, 300);
        }
      );
      let dialog = this.dialogs.find((dialog) => dialog._id === dialog_id);
      dialog.lastMessage = "file";
      dialog.sender_id = global_id;
      dialog.datetime = new Date();
      dialog.isRead = null;
    },
    endGetRemoteFile: function(file, path) {
      dbMessages.update(
        { fileHash: path },
        {
          $set: {
            file: {
              name: file.name,
              type: file.type,
              path: path,
              size: Math.floor((file.size / 1024 / 1024) * 100) / 100 + " MB",
            },
            progress: 100 + "%",
          },
        },
        {},
        (err, data) => {
          if (!!err) console.error(err);
          this.getMessages();
        }
      );
    },
    progressSendFile: function(path, progress) {
      try {
        document.getElementById(path).style.width = progress + "%";
        document.getElementById(path + "per").innerHTML =
          Math.floor(progress) + "%";
      } catch (e) {}
    },
  },
  mounted() {
    socket.emit("join", { jwt: localStorage.jwt });
    // db.checkMessages();
    db.checkDialogs();
    // dbDialogs.remove({}, { multi: true });
    // dbMessages.remove({}, { multi: true });
    this.audio = new Audio(require("../assets/sounds/msg.mp3"));
    this.audio.autoplay = true;

    this.timeOut();
    this.updateDialogs();

    socket.on("jwt", (data) => {
      if (data.new) {
        localStorage.clear();
        this.$router.push({ path: "/login" });
      }
    });

    socket.on("inRoom", (data) => {
      console.log("inRoom", data);
      if (data.connect) {
        this.inRoom = true;
        this.updatePeers();
      }
    });

    socket.on("answerData", (sender_id, data) => {
      console.log("get answer");

      let dialog = this.dialogs.find(
        (dialog) => dialog.global_id === sender_id
      );

      dialog.peer.signal(data);
    });

    socket.on("offerData", (sender_id, data) => {
      console.log("get offer");
      // console.log("get offer", sender_id, data);
      this.checkDialogById(sender_id);

      setTimeout(() => {
        let dialog = this.dialogs.find(
          (dialog) => dialog.global_id === sender_id
        );

        let newpeer = true;

        try {
          newpeer = !dialog.peer.connected;
        } catch (e) {}

        if (newpeer) {
          dialog.peer = new Peer({ trickle: false });
          const keys = crypto.createECDH("prime256v1");
          dialog.crypto = keys.generateKeys();
          dialog.public = keys.getPublicKey().toString("base64");

          dialog.peer.signal(data);

          dialog.peer.on("signal", (data) => {
            console.log("send answer");
            socket.emit("answerData", localStorage._id, sender_id, data);
          });

          dialog.peer.on("connect", () => {
            dialog.peer.send(JSON.stringify({ ok: true }));
            dialog.connected = true;
            dialog.peer.send(JSON.stringify({ public: dialog.public }));
            dialog.connected = true;
            this.activeDialog = this.dialogs.find(
              (dialog) => dialog._id === this.activeDialog._id
            );
          });
          dialog.peer.on("error", (err) => {
            console.log("catch err: ", err);
            dialog.connected = false;
            this.activeDialog = this.dialogs.find(
              (dialog) => dialog._id === this.activeDialog._id
            );
            this.updatePeers();
          });
          dialog.peer.on("data", (data) => {
            let msg = JSON.parse(data.toString());
            if (msg.ok) console.log("from: " + dialog.username, msg);
            if (msg.message) {
              gcm.setKeys(Buffer.from(dialog.sharedKey, "hex"));
              let decrypted = gcm
                .Decrypt(Buffer.from(msg.message, "base64"))
                .toString();
              this.getRemoteMessages(dialog._id, dialog.global_id, decrypted);
            }
            if (msg.isRead) this.setMessageAsRead(dialog._id, dialog.global_id);
            if (msg.public) {
              dialog.sharedKey = keys.computeSecret(
                msg.public,
                "base64",
                "hex"
              );
            }
            if (msg.sendFile) {
              spf.receive(dialog.peer, msg.fileId).then((transfer) => {
                let path = msg.fileId;
                this.getRemoteFile(dialog._id, dialog.global_id, msg.fileId);
                transfer.on("progress", (sentBytes) => {
                  this.progressSendFile(path, sentBytes);
                });
                transfer.on("done", async (file) => {
                  this.endGetRemoteFile(file, path);
                  fsu(file);
                });
                dialog.peer.send(
                  JSON.stringify({ readyToFile: true, fileId: msg.fileId })
                );
              });
            }
          });
        }
      }, 1000);
    });
  },
  watch: {
    dialogs: {
      handler(val) {
        this.dialogs.sort((a, b) => b.datetime - a.datetime);
      },
      deep: true,
    },
    activeDialog: {
      handler(val) {
        if (this.activeDialog && Date.now() - this.resend >= 5000) {
          try {
            if (this.activeDialog.peer.connected)
              this.activeDialog.peer.send(JSON.stringify({ isRead: true }));
          } catch (e) {}

          let d = this.dialogs.find(
            (dialog) => dialog._id == this.activeDialog._id
          );
          d.isRead = true;
          d.isReadCount = null;

          dbMessages.update(
            {
              dialog_id: this.activeDialog._id,
              isRead: false,
              sender_id: this.activeDialog.global_id,
            },
            { $set: { isRead: true } },
            { multi: true },
            (err, count) => {
              if (!!err) console.error(err);
            }
          );

          dbDialogs.update(
            { _id: d._id },
            {
              $set: {
                isRead: true,
                isReadCount: null,
              },
            },
            { upsert: true },
            (err) => {
              if (!!err) console.error(err);
            }
          );
          this.resend = Date.now();
        }
      },
      deep: true,
    },
  },
};
</script>
