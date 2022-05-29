// 轮播图
// 1.获取节点 
let olListObj = document.querySelectorAll('#banner ol li'); //获取 ol 下li的节点 
let ulListObj = document.querySelectorAll('#banner ul li') // 获取ol下边的节点
let prev = document.querySelector('#goPrev'); //获取左边箭头的节点
let next = document.querySelector('#goNext'); //获取右边箭头的节点
let banner = document.querySelector('#banner');
// console.log(olListObj);
// console.log(ulListObj);



// 2.点击轮播图中ol下的li 标签 ,
// 给ol 绑定点击事件
let lastIndex = 0;//隐藏图片索引
let index = 0;// 显示图片索引
olListObj.forEach((li, key) => {
    // console.log(li);
    // console.log(key);
    li.onclick = function () {
        // 设置隐藏和显示图片
        lastIndex = index;
        index = key;
        change();
    }
});

// 给左箭头设置点击事件
prev.onclick = function () {
    lastIndex = index;
    index--;
    if (index < 0) {
        index = ulListObj.length - 1;
    }
    change();
}

// 给右边箭头设置点击事件
next.onclick = function () {
    lastIndex = index;
    index++;
    if (ulListObj.length - 1 < index) index = 0;
    change();
}


// 设置自动播放
let times = '';
function autoplay(){
    times = setInterval(function(){
        next.onclick();
    },1000)
}
autoplay();
banner.onmouseover = function(){
    clearInterval(times);
}
banner.onmouseout = function(){
    autoplay();
}



// 设置操作显示对应图片的和按钮
function change() {
    // 隐藏上一张图片
    olListObj[lastIndex].className = '';
    ulListObj[lastIndex].className = '';

    // 显示下一张图片和按钮
    olListObj[index].className = 'ac';
    ulListObj[index].className = 'ac';
}