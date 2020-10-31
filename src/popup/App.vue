<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Gitree</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fill-height>
        <div style="margin-top: -20px;">
          <p v-if="activeQuote.author">{{ activeQuote.author }}</p>
          <blockquote v-if="activeQuote.content || activeQuote.contentZh">
            <p v-if="activeQuote.content">{{ activeQuote.content }}</p>
            <p v-if="activeQuote.contentZh">{{ activeQuote.contentZh }}</p>
          </blockquote>
        </div>
      </v-container>
    </v-main>

    <v-footer app>
      <v-spacer />
      <div>
        <span>反馈：</span>
        <v-btn icon target="_blank" rel="noopener noreferrer nofollow"
          href="https://gitee.com/mirrors/vue">
          <BaseIcon name="gitee-fill-round" />
        </v-btn>
        <v-btn icon target="_blank" rel="noopener noreferrer nofollow"
          href="https://gitee.com/mirrors/vue">
          <BaseIcon name="github" />
        </v-btn>
        <v-btn icon href="mailto:showmethecode@foxmail.com">
          <v-icon>mdi-email</v-icon>
        </v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      loading: false,
      quotes: [
        {
          author: 'Jeff Atwood(Atwood\'s Law)',
          content: 'Any application that can be written in JavaScript, will eventually be written in JavaScript.',
          contentZh: '凡是可以用 JavaScript 来写的应用，最终都将用 JavaScript 来写。'
        },
        {
          author: 'Andy and Bill\'s Law',
          content: 'Andy gives, Bill takes away.',
          contentZh: '安迪提供什么，比尔拿走什么。'
        },
        {
          author: 'Phil Karlton',
          content: 'There are only two hard things in Computer Science: cache invalidation and naming things.',
          contentZh: '计算机科学只存在两个难题：缓存失效和命名。'
        },
        {
          author: 'Bruce Eckel',
          content: 'Life is short, you need Python.',
          contentZh: '生命苦短，我用 Python。'
        },
        {
          author: 'Linus Torvalds',
          content: 'Bad programmers worry about the code. Good programmers worry about data structures and their relationships.',
          contentZh: '低水平程序员总在考虑代码，高水平程序员总在考虑数据结构及其之间的关系。'
        },
        {
          author: 'Linus Torvalds',
          content: 'Talk is cheap. Show me the code.',
          contentZh: '废话少说，放码过来。'
        },
        {
          author: 'Donald Knuth',
          content: 'premature optimization is the root of all evil.',
          contentZh: '过早的优化乃万恶之源。'
        },
        {
          author: '比尔·盖茨',
          contentZh: '用代码行数来衡量程序的开发进度，就好比用重量来衡量飞机的制造进度。'
        }
      ],
      activeQuote: {}
    }
  },
  created () {
    const { length } = this.quotes
    const index = Math.round(Math.random() * (length - 1))
    this.activeQuote = this.quotes[index]
  }
}
</script>

<style lang="scss">
:root,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;

  // .feedback-btn {
  //   font-size: 36px;
  // }

  blockquote {
    font-size: 1rem;
    color: #999;
    border-left: 0.2rem solid #dfe2e5;
    margin: 1rem 0;
    padding: 0.25rem 0 0.25rem 1rem;

    & > p {
      margin: 0;
    }
  }
}
</style>
