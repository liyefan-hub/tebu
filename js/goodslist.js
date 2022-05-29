class List {
    constructor() {
        this.getDate();
    }

    /* ********获取数据******* */
    async getDate() {
        // 代表引入成功了
        // console.log(1111);

        // 1.发送axios请求,获取数据
        // await 等待后面的promise 解包完成,拿到最后的结果
        let { status, data } = await axios.get('http://localhost:8888/goods/list');
        // console.log(goodsDate);
        // console.log(status,data); // 代表请求成功
        // 2.判断请求状态是否成功
        // status 是axios服务器请求成功
        // date.code 是接口返回数据正常
        if (status != 200 && data.code != 1) throw new Error('获取数据失败');

        // 3.循环渲染数据
        let html = '';
        data.list.forEach(goods => {
            html += `<li>
            <div class="top">
                <a href="javascript:;">
                    <img src="${goods.img_big_logo}" alt="">
                </a>
                
            </div>
            <div class="bottom">
                <p><a href="javascript:;">${goods.title}</a></p>
                <p>会员价：¥<span>${goods.current_price}</span></p>
                <p><span>${goods.sale_type}</span><img src="./assets/images/goodslist/goodsrightlist/ping.jpg" alt="">0条</p>
            </div>
        </li>`
            // console.log(html);
        });

        // 4.将拼接好的html字符串追加到页面(ul)当中去
        // console.log(this.$('#listnav'));
        this.$('#listnav').innerHTML += html;

    }


    // 封装获取节点的方法
    $(ele) {
        let res = document.querySelectorAll(ele);
        // r如果获取到的是单个节点集合,就返回单个节点,如果是多个节点集合就返回多个节点结合
        return res.length == 1 ? res[0] : res;
    }



}

new List;