!(function(window){
	// 通过将函数绑定到window上，那么只要是能够获取到window的地方都能够调用你这个方法
	window.cssHandle = {};
	cssHandle.css = function (node,type,val){
		if(typeof node === 'object' && typeof node["transform"] === 'undefined'){
			node["transform"] = {};
		}
		if(arguments.length >= 3){
			// 三个参数 设置transform样式
			var text = '';
			node['transform'][type] = val;
			for(var item in node['transform']){
				// 由于不同属性的单位不同，因此需要进行区分
				if(node['transform'].hasOwnProperty(item)){
					// in操作符能够循环出来原型链上的熟悉。我们其实只需要自身定义的属性
					switch(item){
						case 'translateX':
						// 这里不能把val给text。因为val只有一个，但是对象node['transform']
						// 有多个属性，需要进行拼接
							text += item + '('+ node['transform'][item] +'px)'
							break;
						case 'translateY':
							text += item +'('+ node['transform'][item] +'px)'
							break;
						case 'scale':
							text += item + '('+ node['transform'][item] +')'
							break;
						case 'rotate':
							text += item + '('+ node['transform'][item] +'deg)'
							break;
				    }
				}
				
			}
			// 将transform对象的所有属性进行拼接,得到复合的transform变换
			node.style.transfom = node.style.webkitTransform = text;
		}else if(arguments.length === 2){
			// 读取操作
			var result = node['transform'][type];
			if(typeof result === 'undefined'){
				if(type == 'scale'){
					return 1;
				}else{
					return 0;
				}
			}
			return result;
		}
	}
	cssHandle.carousel =function (arr){
			var carouselWrap = document.querySelector('.carousel-wrap');
			var pointsLength = arr.length;
			var needCarousel = carouselWrap.getAttribute('needCarousel');
			needCarousel = needCarousel ===null ?false:true;
			if(needCarousel){
				// 无缝的实现
			    arr = arr.concat(arr);
			}
			
			var len = arr.length; 
			if(carouselWrap){
				// 实现布局
				var oUl = document.createElement('ul');
				var oStyle = document.createElement('style');
				// 由于图片的数量不清楚，因此这里样式也需要动态设置。
				oStyle.innerHTML = ".carousel-wrap>.list>li{width:"+(1/len*100)+"%;}.carousel-wrap>.list{width:"+(len * 100)+"%;}"
				oUl.className = 'list';
	            for(var i = 0;i < arr.length;i++){
	            	oUl.innerHTML += "<li><a href = 'javascript:;'><img src='"+arr[i]+"'></a></li>";
	            }
				carouselWrap.appendChild(oUl);
				document.head.append(oStyle);
				// 手动设置滑屏的高度.滑屏的高度应该等任意一张图的高度
				var oImg = document.querySelector('.carousel-wrap>.list>li>a>img')
				setTimeout(() => {
					carouselWrap.style.height = oImg.offsetHeight+'px';
				},0)

				// 实现小圆点的添加
				var pointWrap = document.querySelector('.carousel-wrap>.point-wrap');
				if(pointWrap){
					for(var i = 0;i < pointsLength;i++){
						if(i === 0){
							 pointWrap.innerHTML += "<span class='active'></span>";
						}else{
							 pointWrap.innerHTML += "<span></span>";
						}
	            	 
	                }
	                var pointsSpan = document.querySelectorAll('.carousel-wrap>.point-wrap > span');

				}


				// 实现滑屏功能
				var startX = 0;
				var elementX = 0;
				var index = 0;
				var timer = null;
				// var translateX = 0;
				carouselWrap.addEventListener('touchstart',function(ev){
                  ev = ev || window.event;
                  oUl.style.transition = 'none';
                  // 清除自动轮播的定时器
                 
                  if(needCarousel){
	                  	    // 无缝的实现 通过两组相同的图片实现无缝
	                  // 点击第一组第一张时，马上调到第二组第一张。
	                  // 点击第二组的最后一张时，马上跳到第一组的最后一张

	                  // index代表index的位置。
	                 var index = cssHandle.css(oUl,'translateX') /document.documentElement.clientWidth;
	                 if(-index === 0){
	                 	index = -pointsLength;
	                 }else if( - index === (arr.length -1)){
	                 	index = - (pointsLength -1);
	                 }
	                 cssHandle.css(oUl,'translateX',index * (document.documentElement.clientWidth));
                  }
                  var touchC = ev.changedTouches[0];
                      startX = touchC.clientX;
                    // elementX = oUl.offsetLeft;
                      // elementX = translateX;
                      elementX = cssHandle.css(oUl,'translateX');
                      
                  clearInterval(timer);

				});

				carouselWrap.addEventListener('touchmove',function(ev){
					ev = ev || window.event;
					var touchC = ev.changedTouches[0];
					var nowX = touchC.clientX;
					var disX = nowX - startX;
					// oUl.style.left = elementX + disX + 'px';
					// translateX = elementX + disX;
					// oUl.style.transform ='translateX('+translateX+'px)';
					cssHandle.css(oUl,'translateX',elementX+disX);

				})
				
				carouselWrap.addEventListener('touchend',function(ev){
					ev = ev || window.event;
					// index用来判断图片，
					// var index = oUl.offsetLeft /document.documentElement.clientWidth;
	                
					// var index = translateX /document.documentElement.clientWidth;
					index = cssHandle.css(oUl,'translateX') /document.documentElement.clientWidth;
					// 对index四舍五入，如果小于0.5说明没有滑过一半
					index = Math.round(index);

					
					// 超出控制
					if(index > 0){
						index = 0;
					}else if(index < -(len-1)){
						index = -(len-1);
					}
					pointAutoPlay(index)
					// // 小圆点与index值相反
					// for(var i = 0;i < pointsSpan.length;i++){
					// 	pointsSpan[i].classList.remove('active');
					// }
					// pointsSpan[-index % pointsLength].classList.add('active');
					// 如果index为正，说明oUl.offsetLset为正，因此向右滑动，相反向左滑动
					// oUl.style.left = index * (document.documentElement.clientWidth) + 'px';

					// translateX = index * (document.documentElement.clientWidth)
					// oUl.style.transform ='translateX('+translateX+'px)';
					cssHandle.css(oUl,'translateX',index * (document.documentElement.clientWidth));

					oUl.style.transition = '1s transform';

					// 开启自动轮播
					if(needAutoPlay){
					// 无缝的实现
				    autoPlay()
				    }
				})
				var needAutoPlay = carouselWrap.getAttribute('needAutoPlay');
				needAutoPlay = needAutoPlay ===null ?false:true;
				if(needAutoPlay){
					// 无缝的实现
				    autoPlay()
				}
				
				
				function autoPlay(){
					
					clearInterval(timer)
					timer = setInterval(function(){
						index--;
						index = index % pointsLength;
						oUl.style.transition = '2s,transform';
						cssHandle.css(oUl,'translateX',index*document.documentElement.clientWidth);
					// 小圆点的自动变化
					pointAutoPlay(index);
					},2000)
				}
				function pointAutoPlay(index){
					if(!pointWrap){
						return ;
					}
					// 小圆点的自动变化
					for(var i = 0;i < pointsSpan.length;i++){
						pointsSpan[i].classList.remove('active');
					}
					pointsSpan[(-index) % pointsLength].classList.add('active');
				}				
			}
		}
})(window)