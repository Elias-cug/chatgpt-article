import Login from '@/pages/login/index.vue'
import GenArticle from '@/pages/GenArticle/index.vue'

export const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: '登录',
    },
  },
  {
    name: 'gen-article',
    // path: '/gen-article',
    path: "/",
    component: GenArticle,
    meta: {
      title: '文章生成',
    },
  },
]