
!(function(window){
	// 通过将函数绑定到window上，那么只要是能够获取到window的地方都能够调用你这个方法
	window.cssHandle = {};
	cssHandle.css =function (node,type,val){
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
})(window)