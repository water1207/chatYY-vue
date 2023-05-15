import VueRouter from 'vue-router'
 
import ChatHome from '../view/pages/chatHome/index.vue'
import GroupHome from '../view/pages/groupHome/index.vue'
import Login from '../view/pages/Login'
import Home from '../view/Home'
export default new VueRouter({
    routes: [
        {
            path: "/",
            redirect: "/Login",
        },
        {
            path: "/Login",
            name: "Login",
            component: Login,
        },
        {
            path: "/home",
            name: "Home",
            component: Home,
            children: [
                {
                    path: "/ChatHome",
                    name: "ChatHome",
                    component: ChatHome,
                },
                {
                    path:"/GroupHome",
                    name:"GroupHome",
                    component: GroupHome
                }
            ]
        }
        // {
        //     path: "/ChatHome",
        //     name: "ChatHome",
        //     component: ChatHome,
        // },    
        // {
        //     path: "/Video",
        //     name: "Video",
        //     component: Video
        // }, 
        // {
        //     path: "/Lingting",
        //     name: "Lingting",
        //     component: Lingting
        // },   
        // {
        //     path: "/Setting",
        //     name: "Setting",
        //     component: Setting
        // },    
    ]
})