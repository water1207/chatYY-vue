<template>
    <div class="form-box">
        <form :model = "loginForm">
            <input type="text" placeholder="username" v-model="loginForm.uid"><br>
            <input type="password" placeholder="password" v-model="loginForm.pwd"><br>
            <button type="submit" @click="submitForm2('loginForm')">Login</button>
        </form>
    </div>
</template>
<script>
    export default {
        name: 'Login',
        data() {
            return {
                loginForm: {
                    uid: '1',
                    pwd: '123',
                },
            };
         },
        methods: {
            submitForm2(formName) {
                var that = this;
                if(that.loginForm.pwd == '123'){
                    alert('登录成功!');
                    // 将登录成功之后的token，保存到客户端的sessionStorage中
                    window.sessionStorage.setItem('token', parseInt(that.loginForm.uid));
                    // 通过编程式导航跳转到后台首页，路由地址是/home
                    that.$router.push('/home')
                }
                else{
                    alert('登录失败!');
                }
            }
        }
    }

</script>