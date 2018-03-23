var isPageCando = 0; //定义手机是否在屏幕滑动 0:无滑动
var slide_ = function(option) {
    var defaults = {
        container: '',
        next: function() {}
    }
    var start,
        end,
        length,
        isLock = false, //是否锁定整个操作
        isCanDo = false, //是否移动滑块
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad;
    var obj = document.querySelector(option.container);
    console.dir(obj)
    var loading = obj.firstElementChild;
    var offset = loading.clientHeight;
    var objparent = obj.parentElement;

    var fn = {
        //移动容器
        translate: function(diff) {
            obj.style.webkitTransform = 'translate3d(0,' + diff + 'px,0)';
            obj.style.transform = 'translate3d(0,' + diff + 'px,0)';
        },
        //设置效果时间
        setTransition: function(time) {
            obj.style.webkitTransition = 'all ' + time + 's';
            obj.style.transition = 'all ' + time + 's';
        },
        //返回到初始位置
        back: function() {
            fn.translate(0 - offset);
            //标识操作完成
            isLock = false;
        },
        addEvent: function(element, event_name, event_fn) {
            if(element.addEventListener) {
                element.addEventListener(event_name, event_fn, false);
            } else if(element.attachEvent) {
                element.attachEvent('on' + event_name, event_fn);
            } else {
                element['on' + event_name] = event_fn;
            }
        }
    };

    fn.translate(0 - offset);
    fn.addEvent(obj, 'touchmove', move); //当手指在屏幕上滑动的时候连续地触发。在这个事件发生期间，调用preventDefault()事件可以阻止滚动。
    fn.addEvent(obj, 'touchstart', start); //当手指触摸屏幕时候触发，即使已经有一个手指放在屏幕上也会触发
    fn.addEvent(obj, 'touchend', end); //当手指从屏幕上离开的时候触发
//  fn.addEvent(obj, 'mousedown', start) //，隐藏或显示元素：
    // fn.addEvent(obj, 'mousemove', move) //获得鼠标指针在页面中的位置
    // fn.addEvent(obj, 'mouseup', end) //隐藏或显示元素：

    //滑动开始
    function start(e) {
        //当前滚动条距离顶部的距离：$(".pull_down").scrollTop()
        console.log(document.querySelector('.pull_down').scrollTop)
        if(document.querySelector('.pull_down').scrollTop <= 0 && !isLock) {
            //标识操作进行中
            isLock = true;
            isCanDo = true;
            var even = typeof event == "undefined" ? e : event;
            //保存当前鼠标Y坐标
            start = hasTouch ? even.touches[0].pageY : even.pageY;
            //消除滑块动画时间
            fn.setTransition(0);
            loading.innerHTML = '下拉刷新数据';
        }
        return false;
    }

    //滑动中
    function move(e) {
        console.dir(objparent)
        if(objparent.scrollTop <= 0 && isCanDo) {
            isPageCando++;
            var even = typeof event == "undefined" ? e : event;

            if(isLock) {
                end = hasTouch ? even.touches[0].pageY : even.pageY;
            }
             console.log(end)
            if(start < end) { //结束指针位置 大于 开始指针位置
                even.preventDefault();
                //消除滑块动画时间
//              fn.setTransition(0);
                //移动滑块
                if((end - start - offset) / 2 <= 150) {
                    length = (end - start - offset) / 2;
                    fn.translate(length);
                } else {
                    length += 0.3;
                    fn.translate(length);
                }
            }
        }

    }
    //滑动结束
    function end(e) {
        if(isCanDo) {
            if(isPageCando > 0) {
                //判断滑动距离大小
                if(end - start >= offset) {
                    //设置滑块回弹时间
                    fn.setTransition(1);
                    //保留提示部分
                    fn.translate(1);
                    loading.innerHTML = '正在刷新数据...';
                    if(typeof option.next == "function") {
                        option.next.call(fn, e);
                    }
                } else {
                    //返回初始状态
                    fn.back();
                }

            }else {
                fn.back();
            }

            isPageCando = 0;
            isCanDo = false;

        }
    }
 }