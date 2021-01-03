## 项目介绍

本项目为移动编程课的课程设计，是一个基于uniapp实现的简单的安卓APP。主要为提供前端**初学者**进行学习，学习时请搭配[uniapp官方文档](https://uniapp.dcloud.io/)。

项目主要的核心功能为新闻浏览、试卷答题以及好友聊天。使用了爬虫对腾讯新闻进行了爬取作为新闻数据源；好友聊天功能是基于websocket的二次封装。

后端项目地址：

websocket项目地址：[https://github.com/Swaggerzhan/MyWebsocket](https://github.com/Swaggerzhan/MyWebsocket)

## 项目结构

```javascript
├─api // api
│  ├─article.js
│  ├─contacts.js
│  ├─questions.js
│  ├─upload.js
│  └─user.js
├─common
│  └─css 
│      ├─iconfont.css // 字体样式
│      └─index.css // 公共样式
├─components // 公共组件
│  ├─ArtilceCard
│  ├─CommentItem
│  ├─Refresh
│  ├─uni-section
│  ├─uni-swipe-action
│  └─uni-swipe-action-item
├─pages 
│  ├─about // 关于
│  ├─articles
│  │  ├─articleDetail // 文章详情
│  │  └─favoriteArticles // 收藏文章
│  ├─contacts
│  │  ├─add // 好友添加
│  │  ├─chat // 聊天
│  │  └─contacts.vue // 好友列表
│  ├─questions
│  │  ├─answerRecords // 答题记录
│  │  ├─questionDetail // 问卷
│  │  └─questionList // 问卷列表
│  ├─setting // 设置
│  ├─tabBar
│  │  ├─articles // 首页/文章
│  │  ├─me // 个人中心
│  │  └─questions // 答题
│  └─user
│      ├─changeUserInfo // 个人信息修改
│      ├─login // 登录
│      └─register // 注册
├─static
│  ├─icons // tabbar图标
│  └─imgs // 图片
├─unpackage
├─utils
│  ├─auth.js // 授权方法
│  └─index.js // 公共方法
├─App.vue // 页面入口
├─config.js // 配置文件
├─main.js // 程序入口
├─manifest.json // 应用配置
├─pages.json // 路由配置
└─uni.scss
```

## 项目运行

> 本项目运行前需要先对**后端**以及**websocket服务**进行部署，详见：[websocket服务](https://github.com/Swaggerzhan/MyWebsocket)

> 推荐使用**HbuiderX**编辑器进行项目运行

```
// 1.克隆到本地
git clone https://github.com/Refrain37/sudo_android_app.git

// 2.在IDE中导入项目

// 3.修改config.js文件

// 4.连接安卓手机/开启安卓模拟器

// 5.运行
```

## 注意项

- 运行本项目前**必须**要对后端和websocket服务进行部署方可正常运行
- 每个模块分别都有具体的功能介绍
- **本项目仅对安卓端进行了适配，其他平台可能存在bug以及差异**

## 项目截图
<center>
<img src="https://github.com/Refrain37/sudo_android_app/blob/master/screenshots/login.jpg" width="300"  /><img src="https://github.com/Refrain37/sudo_android_app/blob/master/screenshots/me.jpg" width="300"  />
</center>
<center>
<img src="https://github.com/Refrain37/sudo_android_app/blob/master/screenshots/chat.jpg" width="300"  /><img src="https://github.com/Refrain37/sudo_android_app/blob/master/screenshots/articles.jpg" width="300"  />
</center>

<img src="https://github.com/Refrain37/sudo_android_app/blob/master/screenshots/question.jpg" width="300"  />

## 总结

本项目为移动编程课的课程设计，因时间、精力有限，如有做的不好的地方请多多包含！