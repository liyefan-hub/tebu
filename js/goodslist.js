class List {
    constructor() {
        this.getDate();
        this.bindEve();
        // 默认页码
        this.curentPage = 1;
        // 使用锁(节流防抖)
        this.lock = false;
    }
    // 绑定事件的方法
    bindEve() {
        // 给加入购物车按钮 绑定 点击事件, 
        // console.log(this.$('#listnav'));
        this.$('#listnav').addEventListener('click', this.chenkLogin.bind(this));
        // 滚动条事件
        window.addEventListener('scroll', this.lazyLoader);
        // 给图片和标题绑定点击事件
        // this.$('#listnav .top img').addEventListener('click',this.commodity.bind(this));
        // this.$('#listnav .bottom a').addEventListener('click',this.commodity.bind(this));
        // console.log(this.$('.clicka'));
        this.$('#listnav').addEventListener('click', this.commodity.bind(this));
        // console.log(this.$('#listnav'));
    }

    /* ********获取数据******* */
    async getDate(page = 1) {
        // 代表引入成功了
        // console.log(1111);

        // 1.发送axios请求,获取数据
        // await 等待后面的promise 解包完成,拿到最后的结果
        let { status, data } = await axios.get('http://localhost:8888/goods/list?current=' + page);
        // console.log(data);
        // console.log(goodsDate);
        // console.log(status,data); // 代表请求成功
        // 2.判断请求状态是否成功
        // status 是axios服务器请求成功
        // date.code 是接口返回数据正常
        if (status != 200 && data.code != 1) throw new Error('获取数据失败');

        // 3.循环渲染数据
        let html = '';
        data.list.forEach(goods => {
            // console.log(goods);
            html += `<li  data-id="${goods.goods_id}">
            <div class="top">
                <a href="#none">
                    <img src="${goods.img_big_logo}" alt="" class="clickimg" >
                </a>
                
            </div>
            <div class="bottom">
                <p><a href="#none" class="clicka">${goods.title}</a></p>
                <p>会员价：¥<span>${goods.current_price}</span></p>
                <p><span>${goods.sale_type}</span><img src="./assets/images/goodslist/goodsrightlist/ping.jpg" alt="">0条</p>
            </div>
            <a href="#none" class="sk_goods_buy">
                   立即抢购
            </a>
        </li>`
            // console.log(html);
        });

        // 4.将拼接好的html字符串追加到页面(ul)当中去
        // console.log(this.$('#listnav'));
        this.$('#listnav').innerHTML += html;
    }

    /* ***********点击图片和标题跳转到详情页面************** */
    commodity(eve) {
        // location.assign('../introduce.html');
        // let user_id = localStorage.getItem('user_id');
        // console.log(user_id);
        // console.log(eve.target);
        if (eve.target.nodeName != 'IMG' || eve.target.className != 'clickimg') return;

        // 1.判断用户是否登录,如果local中有token,表示登录,如果没有则表示没登陆
        let token = localStorage.getItem('token');
        // console.log(token)
        if (!token) location.assign('../login.html?ReturnUrl=../goodslist.html');
        let goodsId = eve.target.parentNode.parentNode.parentNode.dataset.id; // li 的自定义属性获取
        // console.log(goodsId);
        // let user_id = localStorage.getItem('user_id');
        // console.log(user_id);
        let user_id = sessionStorage.getItem('user_id')
        const AUTH_TOKEN = sessionStorage.getItem('token')
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let param=`id=${goodsId}&goodsId=${user_id}`
        axios.get('http://localhost:8888/goods/item',param).then(({data,status}) => {
            // console.log(111);
            console.log(status,data);
            if(status == 200 && data.code == 1) location.assign('../introduce.html')
        })
    }


    /* *****加入购物车******* */
    chenkLogin(eve) {
        // console.log(this); //指向实例化对象
        // 获取事件源,判断点击的是否为span标签
        // console.log(eve.target.classList);
        if (eve.target.nodeName != 'A' || eve.target.className != 'sk_goods_buy') return;
        // console.log(eve.target);

        // 1.判断用户是否登录,如果local中有token,表示登录,如果没有则表示没登陆
        let token = localStorage.getItem('token');
        // console.log(token); null 表示没登陆
        // 没有token 表示没有登录,跳转到登录页面去
        if (!token) location.assign('../login.html?ReturnUrl=../goodslist.html');

        // 2.如果用户已经登录,此时就需要将商品加入购物车
        let goodsId = eve.target.parentNode.dataset.id; // li 的自定义属性获取
        // console.log(goodsId);
        let user_id = localStorage.getItem('user_id');

        this.addCartGoods(goodsId, user_id)

    }
    addCartGoods(gId, uId) {
        // console.log(gId,uId);
        /* 
        给请求添加购物车接口,发送请求
        调用购物车接口,后台要验证是否为登录状态,需要传递token
        */
        const AUTH_TOKEN = localStorage.getItem('token')
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        // axios.defaults.headers.Content-Type='application/x-www-form-urlencoded'
        // headers['Content-Type']  也是 给 headers 对象中添加属性,只是. 语法不支持 Content-Type
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let param = `id=${uId}&goodsId=${gId}`
        axios.post(' http://localhost:8888/cart/add', param).then(({ data, status }) => {
            // console.log(res);
            // console.log(data, status);
            // 判断添加购物车是否成功
            if (status == 200 && data.code == 1) {
                layer.open({
                    title: '商品添加成功'
                    , content: '进购物车看看吗?'
                    , btn: ['留下', '去吧']
                    , btn2: function (index, layero) {
                        // console.log('去购物车了...');
                        location.assign('./shoppingcar.html')
                    }
                })
            } else if (status == 200 && data.code == 401) {
                // 如果登陆过期 则重新登陆
                // 清除local 中的token 和user
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                // 跳转到登录页面
                location.assign('./login.html ?ReturnUrl=./goodslist.html')
            } else {
                layer.open({
                    title: '失败提示框'
                    , content: '你走措地了'
                    , time: 3000
                });
            }

        })

    }

    /* **********懒加载********** */
    // 当前需要的内容的高度===滚动条距离顶部的高度 + 可视区的高度
    // 需要获取新的数据   当前实际内容的高度< 滚动条距离顶部的高度 + 可视区的高度
    lazyLoader = () => {
        // 需要滚动条高度,可视区高度,实际内容高度
        let top = document.documentElement.scrollTop; // 滚动条高度
        let cliH = document.documentElement.clientHeight;  // 可视区高度
        let conH = this.$('#alllistbox').offsetHeight;
        // console.log(conH);
        if (top + cliH > (conH + 400)) {
            // console.log(111);
            // 满足条件是一瞬间的事,会不停的触发数据加载,使用节流和防抖
            // 如果是锁着的,就结束代码执行
            if (this.lock) return;
            this.lock = true;
            // 指定时间开锁
            setTimeout(() => {
                this.lock = false;
            }, 1000)
            this.getDate(++this.curentPage);
        }
    }



    // 封装获取节点的方法
    $(ele) {
        let res = document.querySelectorAll(ele);
        // r如果获取到的是单个节点集合,就返回单个节点,如果是多个节点集合就返回多个节点结合
        return res.length == 1 ? res[0] : res;
    }



}

new List;