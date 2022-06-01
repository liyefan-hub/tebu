class Login {
    constructor() {
        // 给登录按钮绑定事件
        // 箭头函数 作为元素事件的回调函数时,this 也指向宿主  ,不会指向节点对象
        this.$('.over').addEventListener('click', this.islogin);
        // console.log(location.search.split('='));
        // 判断当前是否有回跳页面
        let search = location.search;
        if(search){
            this.url = search.split('=')[1];
        }

    }

    /* *******实现登录******** */
    islogin = () => {
        // console.log(this); //指向实例化对象
        let form = document.querySelector('.verifyform')
        // console.log(form)
        let username = form.txtName.value.trim();
        let password = form.password.value.trim();
        // console.log(username,password);
        // 非空验证
        if (!username || !password) throw new Error('用户名或密码不能为空');
        // console.log(username,password);

        // 发送axios 请求,实现登录
        // 属性名和变量名一样时,可以只写一个
        // axios 默认以json 的形式请求和编码参数
        // key=val&key=val
        let param = `username=${username}&password=${password}`;
        axios.post(' http://localhost:8888/users/login', param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            // console.log(res);
            if (res.status == 200 && res.data.code == 1) {
                // 将token和user保存local
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user_id', res.data.user.id);
                // 如果有回跳地址则跳转
                if(this.url){
                    location.href = this.url;
                }else{
                    location.assign('./index.html')
                }
            }
        })

    }





    // 封装节点
    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }


}
new Login;