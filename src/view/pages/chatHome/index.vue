<template>
  <div class="chatHome">
    <div class="chatLeft">
      <div class="title">
        <h1>Chat</h1>
      </div>
      <div class="online-person">
        <span class="onlin-text">好友列表</span>
        <div class="person-cards-wrapper">
          <div
            class="personList"
            v-for="friend in friendList"
            :key="friend.u_id"
            @click="clickPerson(friend)"
          >
            <PersonCard
              :friendInfo="friend"
              :pcCurrent="pcCurrent"
            ></PersonCard>
          </div>
        </div>
      </div>
    </div>
    <div class="chatRight">
      <div v-if="showChatWindow">
        <ChatWindow
          :friendInfo="selectedFriend"
          @personCardSort="personCardSort"
        ></ChatWindow>
      </div>
      <div class="showIcon" v-else>
        <span class="iconfont icon-snapchat"></span>
      </div>
    </div>
  </div>
</template>

<script>
import PersonCard from "@/components/PersonCard.vue";
import ChatWindow from "./chatwindow.vue";

import { fetchMyFriends } from "@/api/getData";
export default {
  name: "App",
  components: {
    PersonCard,
    ChatWindow,
  },
  data() {
    return {
      // 当前选中的好友id
      pcCurrent: "",
      friendList: [],
      showChatWindow: false,
      chatWindowInfo: {},
      selectedFriend: {},
      uId: 0,
    };
  },
  mounted() {
    // 加载当前登录用户id
    this.uId = parseInt(window.sessionStorage.getItem('token'));
    // 获取当前登录用户的好友列表
    fetchMyFriends(this.uId).then((res) => {
      this.friendList = res;
    });
  },
  methods: {
    clickPerson(friend) {
      this.showChatWindow = true;
      this.selectedFriend = friend;
      console.log("当前选中的好友", this.selectedFriend);
      console.log("当前选中的id",this.selectedFriend.u_id);
      this.friendInfo = friend;
      this.pcCurrent = friend.u_id;
    },
    personCardSort(id) {
      console.log("已刷新聊天序列: 当前置顶u_id", id);
      if (id !== this.friendList[0].u_id) {
        console.log(id);
        let nowPersonInfo;
        for (let i = 0; i < this.friendList.length; i++) {
          if (this.friendList[i].u_id == id) {
            nowPersonInfo = this.friendList[i];
            this.friendList.splice(i, 1);
            break;
          }
        }
        this.friendList.unshift(nowPersonInfo);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chatHome {
  // margin-top: 20px;
  display: flex;
  .chatLeft {
    width: 280px;
    .title {
      color: #fff;
      padding-left: 10px;
    }
    .online-person {
      margin-top: 100px;
      .onlin-text {
        padding-left: 10px;
        color: rgb(176, 178, 189);
      }
      .person-cards-wrapper {
        padding-left: 10px;
        height: 65vh;
        margin-top: 20px;
        overflow: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 0; /* Safari,Chrome 隐藏滚动条 */
          height: 0; /* Safari,Chrome 隐藏滚动条 */
          display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
        }
      }
    }
  }

  .chatRight {
    flex: 1;
    padding-right: 30px;
    .showIcon {
      position: absolute;
      top: calc(50% - 150px); /*垂直居中 */
      left: calc(50% - 50px); /*水平居中 */
      .icon-snapchat {
        width: 300px;
        height: 300px;
        font-size: 300px;
        // color: rgb(28, 30, 44);
      }
    }
  }
}
</style>