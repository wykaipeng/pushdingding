<template>
  <div class="home">
    <div class='center'>
      <img alt="logo" v-if="!img_url" src="../assets/a.png">
      <img alt="logo" v-else :src="img_url">
      <van-field type="textarea" rows="3" autosize v-model="img_url" label-width="60">
        <template #button>
          <van-button size="mini" type="primary" @click="getimg">重新获取</van-button>
        </template>
      </van-field>
      <van-field name="switch" label-width="100" :label="`类型-(${type ? '每日进度' : '注意事项'})`">
        <template #right-icon>
          <van-switch v-model="type" size="20" />
        </template>
      </van-field>
      <van-field type="textarea" label="内容" rows="3" autosize v-model="message" label-width="60" />
      <van-field name="switch" label="是否@所有人">
        <template #right-icon>
          <van-switch v-model="all_item" size="20" />
        </template>
      </van-field>
      <div class="list" v-if="!all_item">
        <van-checkbox-group v-model="result" direction="horizontal">
          <van-checkbox :name="item.id" :disabled='item.disabled' v-for="item in list" clickable :key="item.id">
            {{ item.name }}</van-checkbox>
        </van-checkbox-group>
      </div>
      <van-button round block type="info" native-type="submit" :loading='loading' @click="pushdata">提交</van-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Home',
  data() {
    return {
      message: '石墨:项目进度 项目:git上传',
      img_url: '',//http://pushdingding.p2.qwangluo.net:92/a.png
      all_item: true,
      api: 'https://oapi.dingtalk.com/robot/send?access_token=2f56ed23786060a28dd64cd4226ecd7b426b9b2de65ac5abdf45de192991a183',
      loading: false,
      result: [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11],
      list: [
        {
          id: 0,
          name: '王凯鹏',
          tel: '15065627623'
        },
        {
          id: 1,
          name: '宫政',
          tel: '13563678626'
        },
        {
          id: 2,
          name: '徐飞',
          tel: '17853658764'
        },
        {
          id: 3,
          name: '许若松',
          tel: '17863542009'
        },
        {
          id: 4,
          name: '郑鹏扬',
          tel: '13186387623'
        },
        {
          id: 5,
          name: '魏俊艳',
          tel: '15333504219'
        },
        {
          id: 7,
          name: '王玉彤',
          tel: '15664491038'
        },
        {
          id: 8,
          name: '王立娇',
          tel: '13127175925'
        },
        {
          id: 9,
          name: '李彦宁',
          tel: '18263653689'
        },
        {
          id: 10,
          name: '王朋磊',
          tel: '15304773496'
        },
        {
          id: 11,
          name: '王勤彪',
          tel: '15318071629'
        },
        {
          id: 6,
          name: '杨丽芬',
          tel: '13730907164',
          disabled: true
        },
      ],
      type: true,
      work: '[石墨-工作进度](https://shimo.im/tables/dPkpK7pdrZIdaPqO?table=PHWRkqCN1rY&view=wruNFb4vXr5)',
      notes: '[石墨-注意事项](https://shimo.im/tables/dPkpK7pdrZIdaPqO?table=Zyg5AxxkLQw&view=q4D8UPL7kWw)',
    }
  },
  watch: {
    type(data) {
      if (data) {
        this.message = '石墨:项目进度 项目:git上传'
      } else {
        this.message = '石墨:注意事项已更新,查收！'
      }
    }
  },
  methods: {
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    pushdata() {
      this.loading = true
      let atMobiles = []
      let content = ''
      if (!this.all_item) {
        this.list.forEach(item => {
          this.result.forEach(val => {
            if (item.id == val) {
              atMobiles.push(item.tel)
              content += `@${item.tel} `
            }
          })
        })
      }
      let data = {
        msgtype: "markdown",
        markdown: {
          title: "每日进度",
          text: `### 每日任务\n ![screenshot](${this.img_url}) \n\n#### ${this.message}\n\n${!this.all_item ? content : ""} \n ###### ${this.type ? this.work : this.notes}\n ###### [GitLab链接](https://gitlab.qdunzi.com/)`
        },
        at: {
          atMobiles,
          isAtAll: this.all_item
        },
      }
      axios({
        url: process.env.NODE_ENV == 'development' ? '/api' : this.api,
        method: 'post',
        data,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        console.log(11, res);
        if (res.data.errmsg == 'ok') {
          this.$toast('推送成功')
          setTimeout(() => {
            this.loading = false
          }, 1400);
        } else {
          this.$toast(res.data.errmsg)
          setTimeout(() => {
            this.loading = false
          }, 1400);
        }
      }).catch(err => {
        this.$toast('推送失败')
        this.loading = false
      });
    },
    getimg() {
      axios({
        url: 'https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json',
        method: 'get',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.img_url = res.data.imgurl
        }
      }).catch(err => { });
    }
  },
  created() {
    this.getimg()
  }
}
</script>
<style scoped>
.home {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0 30px;
}
.center {
  width: 300px;
}
/deep/.van-cell {
  width: 100%;
  margin: 20px 0;
  border: 1px solid #eee;
  border-radius: 10px;
}
.list {
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 10px;
}
/deep/.van-checkbox {
  margin: 20px 10px;
}
img {
  width: 240px;
  height: 240px;
  object-fit: cover;
}
</style>
