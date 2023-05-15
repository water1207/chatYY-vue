<template>
  <div class="chat-window">
    <div class="top">
      <div class="head-pic">
        <HeadPortrait :imgUrl="friendInfo.head_img"></HeadPortrait>
      </div>
      <div class="info-detail">
        <div class="name">{{ friendInfo.name }}</div>
        <div class="detail">{{ friendInfo.detail }}</div>
      </div>
    </div>
    <div class="botoom">
      <div class="chat-content" ref="chatContent">
        <div class="chat-wrapper" v-for="item in messageList" :key="item.id">
          <!-- 好友的聊天消息 -->
          <div class="chat-friend" v-if="item.from !== parseInt(uId) ">
            <!-- 聊天内容 -->
            <div class="chat-text">
              {{ item.content  }}
            </div>
            <div class="info-time">
              <img :src="getImgUrl(friendInfo.head_img)" alt="" />
              <span>{{ friendInfo.name }}</span>
              <span>{{ item.time }}</span>
            </div>
          </div>
          <!-- 自己的聊天消息 -->
          <div class="chat-me" v-else>
            <div class="chat-text">
              {{ item.content }}
            </div>
            <div class="info-time">
              <span>{{ myInfo.name }}</span>
              <span>{{ item.time }}</span>
              <img :src="getImgUrl(myInfo.head_img)" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="chatInputs">
        <input class="inputs" v-model="inputMsg" @keyup.enter="sendText" />
        <div class="send boxinput" @click="sendText">
          <img src="@/assets/img/emoji/rocket.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { animation } from "@/util/util";
import { getUserInfo, loadPersonalMessage } from "@/api/getData";

import HeadPortrait from "@/components/HeadPortrait";
import Emoji from "@/components/Emoji";
import FileCard from "@/components/FileCard.vue";

import SockJS from  'sockjs-client';
import Stomp from 'stompjs';

export default {
  components: {
    HeadPortrait,
    Emoji,
    FileCard,
  },
  props: {
    friendInfo: Object,
    default() {
      return {};
    },
  },
  watch: {
    friendInfo() {
      this.getFriendChatMsg();
    },
  },
  data() {
    return {
      messageList: [],
      inputMsg: "",
      showEmoji: false,
      myInfo: {},
      srcImgList: [],
      uId: "",
      stompClient: {},
      socket: {}
    };
  },
  mounted() {
    this.uId = window.sessionStorage.getItem('token');
    getUserInfo(parseInt(this.uId)).then(res => {
      this.myInfo = res;
    });
    console.log("myInfo", this.myInfo);
    this.getFriendChatMsg();
    this.connect(this.uId);
  },
  methods: {
    getImgUrl(src) {
            return require('@/assets/img/' + src);
        },
    connect(gId) {
        let that = this;
        that.socket = new SockJS('http://localhost:8088' + '/ws');
        that.stompClient = Stomp.over(this.socket);
        console.log("stompClient", this.stompClient);
        that.stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            that.stompClient.subscribe('/topic/messages/' + gId , function (res) {
                let data = JSON.parse(res.body);
                console.log("接收到的消息", data);
                // LC注意
                if(data.from == that.friendInfo.u_id){
                  that.messageList.push(data);
                }
                console.log("messageList", that.messageList);
            });
        })
    },
    //获取聊天信息
    getFriendChatMsg() {
      var that = this;
      loadPersonalMessage(parseInt(this.uId), parseInt(this.friendInfo.u_id)).then((res) => {
        console.log("聊天信息", res);
        this.messageList = res;
        this.scrollBottom();
      });
    },
    //获取窗口高度并滚动至最底层
    scrollBottom() {
      this.$nextTick(() => {
        const scrollDom = this.$refs.chatContent;
        animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight);
      });
    },
    sendMessage(msg){
      this.stompClient.send("/app/chat/personal", {}, JSON.stringify({
          from: msg.from,
          to: msg.to,
          content : msg.content
      }));
      this.messageList.push(msg);
      this.scrollBottom();
    },
    //发送文字信息
    sendText() {
      if (this.inputMsg) {
        let chatMsg = {
          from: parseInt(this.uId),
          to: parseInt(this.friendInfo.u_id),
          content: this.inputMsg,
        };

        // this.sendMsg(chatMsg);
        this.sendMessage(chatMsg);
        // 将刚聊天过的联系人上移置顶
        console.log("niuniuniu", this.friendInfo.u_id);
        this.$emit('personCardSort', this.friendInfo.u_id)
        this.inputMsg = "";
      } else {
        this.$message({
          message: "消息不能为空哦~",
          type: "warning",
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.chat-window {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  position: relative;

  .top {
    margin-bottom: 50px;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .head-pic {
      float: left;
    }
    .info-detail {
      float: left;
      margin: 5px 20px 0;
      .name {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }
      .detail {
        color: #9e9e9e;
        font-size: 12px;
        margin-top: 2px;
      }
    }
    .other-fun {
      float: right;
      margin-top: 20px;
      span {
        margin-left: 30px;
        cursor: pointer;
      }
      // .icon-tupian {

      // }
      input {
        display: none;
      }
    }
  }
  .botoom {
    width: 100%;
    height: 70vh;
    background-color: rgb(50, 54, 68);
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    .chat-content {
      width: 100%;
      height: 85%;
      overflow-y: scroll;
      padding: 20px;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 0; /* Safari,Chrome 隐藏滚动条 */
        height: 0; /* Safari,Chrome 隐藏滚动条 */
        display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
      }
      .chat-wrapper {
        position: relative;
        word-break: break-all;
        .chat-friend {
          width: 100%;
          float: left;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .chat-text {
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 20px 20px 5px;
            background-color: rgb(56, 60, 75);
            color: #fff;
            &:hover {
              background-color: rgb(39, 42, 55);
            }
          }
          .chat-img {
            img {
              width: 100px;
              height: 100px;
            }
          }
          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;
            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 10px;
            }
            span:last-child {
              color: rgb(101, 104, 115);
              margin-left: 10px;
              vertical-align: middle;
            }
          }
        }
        .chat-me {
          width: 100%;
          float: right;
          margin-bottom: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;
          .chat-text {
            float: right;
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 20px 5px 20px;
            background-color: rgb(29, 144, 245);
            color: #fff;
            &:hover {
              background-color: rgb(26, 129, 219);
            }
          }
          .chat-img {
            img {
              max-width: 300px;
              max-height: 200px;
              border-radius: 10px;
            }
          }
          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;
            display: flex;
            justify-content: flex-end;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-left: 10px;
            }
            span {
              line-height: 30px;
            }
            span:first-child {
              color: rgb(101, 104, 115);
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .chatInputs {
      width: 90%;
      position: absolute;
      bottom: 0;
      margin: 3%;
      display: flex;
      .boxinput {
        width: 50px;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 1px solid rgb(80, 85, 103);
        position: relative;
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .emoji {
        transition: 0.3s;
        &:hover {
          background-color: rgb(46, 49, 61);
          border: 1px solid rgb(71, 73, 82);
        }
      }

      .inputs {
        width: 90%;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 2px solid rgb(34, 135, 225);
        padding: 10px;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 20px;
        color: #fff;
        font-weight: 100;
        margin: 0 20px;
        &:focus {
          outline: none;
        }
      }
      .send {
        background-color: rgb(29, 144, 245);
        border: 0;
        transition: 0.3s;
        box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);
        &:hover {
          box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
        }
      }
    }
  }
}
</style>