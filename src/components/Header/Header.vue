<template>
  <el-header style="height:64px;">
    <!-- type="flex" justify="space-between" align="middle"  -->
    <el-row type="flex" justify="space-between" align="middle" style="height:100%">
      <el-col :xs="24">
        <div class="time-weather-toggle">
          <div class="toggle" @click="$store.dispatch('app/toggleSideBar')">
            <span class="iconfont" :class="isCollapse ? 'icon-toggle-right' : 'icon-toggle-left'"></span>
          </div>
          <span>{{currentTime}}</span>
          <img :src="dayPictureUrl" alt="weather" />
          <span>{{weather}}</span>
        </div>
      </el-col>
      <el-col :xs="24">
        <div class="user">
          <div class="userinfo">
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout" @click="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>欢迎你，{{user.username}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
// import lei from '../../../public/static/images/weather/lei.gif'

import { mapState, mapGetters } from "vuex";
import { formateDate } from "../../utils/dateUtils";
import { reqWeather } from "../../api";
export default {
  computed: {
    ...mapGetters(["sidebar"]),
    ...mapState({
      user: state => state.adminUser.adminUser
      // isCollapse: state => state.isCollapseMenu
    }),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  data() {
    return {
      currentTime: formateDate(Date.now()),
      dayPictureUrl: "",
      weather: ""
    };
  },

  created() {
    this.getWeather();
    // 启动 循环定时器
    this.intervalId = setInterval(() => {
      // 将 currentTime 更新为当前时间值
      this.currentTime = formateDate(Date.now());
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    logout() {
      this.$confirm("确定退出登录吗?", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("logout");
          this.$store.dispatch("clearCache");
          this.$router.replace("/login");
        })
        .catch(() => {});
    },
    handleCommand(command) {
      if (command === "logout") {
        this.logout();
      }
    },
    /**
     * 获取天气信息显示
     */
    async getWeather() {
      const result = await reqWeather()
      const { wea_img, wea } = result
      this.dayPictureUrl = `/static/images/weather/${wea_img}.gif`
      this.weather = wea;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  // display: flex;
  // justify-content: space-between;
  padding-left: 0;
  // align-items: center;
  color: rgba(0, 0, 0, 0.65);
  font-size: 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .time-weather-toggle {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 0 20px;
    img {
      margin: 0 10px;
      width: 30px;
      height: 20px;
    }
    .toggle {
      cursor: pointer;
      margin-right: 10px;
      .icon-toggle-left,
      .icon-toggle-right {
        font-size: 22px;
      }
    }
  }
}
.header {
  display: flex;
  align-items: center;
  padding-left: 16px;
  > span {
    margin-left: 15px;
  }
  img {
    width: 50px;
    height: 50px;
  }
}
.user {
  .userinfo {
    display: flex;
    justify-content: flex-end;
    .el-dropdown {
      text-align: right;
      .el-icon-setting {
        cursor: pointer;
        margin-right: 10px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    > span {
      font-size: 14px;
    }
  }
}
</style>