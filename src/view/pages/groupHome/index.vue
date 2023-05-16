<template>
  <div class="chatHome">
    <div class="chatLeft">
      <div class="title">
        <h1>Chat</h1>
      </div>
      <div class="online-person">
        <span class="onlin-text">频道列表</span>
        <div class="person-cards-wrapper">
          <div
            class="personList"
            v-for="group in groupList"
            :key="group.id"
            @click="clickGroup(group)"
          >
            <GroupCard
              :groupInfo="group"
              :pcCurrent="pcCurrent"
            ></GroupCard>
          </div>
        </div>
      </div>
    </div>
    <div class="chatRight">
      <!-- <router-view></router-view> -->
      <div v-if="showChatWindow">
        <ChatWindow
          :groupInfo="selectedGroup"
          @groupCardSort="groupCardSort"
        ></ChatWindow>
      </div>
      <div class="showIcon" v-else>
        <span class="iconfont icon-snapchat"></span>
      </div>
    </div>
    <!-- <el-col :span="4"><div class="grid-content bg-purple"></div></el-col> -->
  </div>
</template>

<script>
import GroupCard from "@/components/GroupCard.vue";
import ChatWindow from "./chatwindow.vue";

import { fetchMyGroups } from "@/api/getData";
export default {
  name: "App",
  components: {
    GroupCard,
    ChatWindow,
  },
  data() {
    return {
      pcCurrent: "",         // 当前选中的频道g_id
      groupList: [],         // 频道列表
      showChatWindow: false, // 是否加载聊天消息
      selectedGroup: {},     // 选中的频道Object
      uId: 0,
    };
  },
  mounted() {
    // 加载当前登录用户id
    this.uId = parseInt(window.sessionStorage.getItem('token'));
    // 获取当前登录用户的好友列表
    fetchMyGroups(this.uId).then((res) => {
      this.groupList = res;
    });
  },
  methods: {
    clickGroup(group) {
      this.showChatWindow = true;
      this.selectedGroup = group;
      console.log("当前选中的频道", this.selectedGroup);
      console.log("当前选中的频道id",this.selectedGroup.g_id);
      this.pcCurrent = group.g_id;
    },
    groupCardSort(gId) {
      console.log("已刷新频道聊天序列: 当前置顶g_id", id);
      if (gId !== this.groupList[0].g_id) {
        console.log(gId);
        let nowGroupInfo;
        for (let i = 0; i < this.groupList.length; i++) {
          if (this.groupList[i].g_id == gId) {
            nowGroupInfo = this.groupList[i];
            this.groupList.splice(i, 1);
            break;
          }
        }
        this.groupList.unshift(nowGroupInfo);
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