;(function(global){
	var isUndefined=function(value){
		return !!(typeof value ==='undefined');
	}
	var isObject=function(value){
		return value !== null && typeof value === 'object';
	}
	var isFunction=function(value){
		return !!(typeof value ==='function');
	}
	var isArray=function(value){
		if(!Array.isArray){
			return Array.isArray(value);
		}else{
			return Object.prototype.toString.call(value)==='[object Array]';
		}
	}
	function eshake(options){
		this.isSupport=!!global.DeviceMotionEvent;
		this._hasListener=false;
		this._lastTime=this._lastX=this._lastY=this._lastZ=null;
		this._callBacks=[];
		this.options = {
			needPassed: 100,
			needPower: 15
		};
		if (isObject(options)) {
			for (var i in options) {
				if (this.options.hasOwnProperty(i)) {
					this.options[i] = options[i];
				}
			}
		}
	}
	eshake.prototype.reset=function(){
		this._lastTime=this._lastX=this._lastY=this._lastZ=null;
		return this;
	}
	eshake.prototype.addEvent=function(){
		if(!this._hasListener&&this.isSupport){
			this._hasListener=true;
			global.addEventListener('devicemotion', this, false);
		}
		return this;
	}
	eshake.prototype.removeEvent=function(){
		if(this._hasListener){
			this._hasListener=false;
			global.removeEventListener('devicemotion', this, false);
		}
		return this;
	}
	eshake.prototype.addCallbacks=function(callback){
		if(isArray(callback)){
			for(var i in callback){
				var _callback=callback[i];
				this._addCallback(_callback);
			}
		}else if(isFunction(callback)){
			this._addCallback(callback);
		}
		return this;
	}
	eshake.prototype.removeCallbacks=function(callback){
		if(isArray(callback)){
			for(var i in callback){
				var _callback=callback[i];
				this._removeCallback(_callback);
			}
		}else if(isFunction(callback)){
			this._removeCallback(callback);
		}else if(isUndefined(callback)){
			this._callBacks.length=0;
		}
		return this;
	}
	eshake.prototype.destroy=function(){
		return this.removeEvent().removeCallbacks().reset();
	}
	eshake.prototype._addCallback=function(callback){
		if(isFunction(callback)){
			if(!~this._callBacks.indexOf(callback)){
				this._callBacks.push(callback);
			}
		}
		return this;
	}
	eshake.prototype._removeCallback=function(callback){
		if(isFunction(callback)){
			var _index=this._callBacks.indexOf(callback);
			if(!!~_index)this._callBacks.splice(_index,1);
		}
		return this;
	}
	eshake.prototype._devicemotion=function(evt){
		var current = evt.accelerationIncludingGravity;
		if(this._lastTime===null||this._lastX===null||this._lastY===null||this._lastZ===null){
			this._lastTime=+new Date;
		}else{
			var currentTime = +new Date;
			var passed = currentTime - this._lastTime;
			if(this.options.needPassed<passed){
				this._lastTime=currentTime;
				var power=Math.abs(this._lastX - current.x)+Math.abs(this._lastY - current.y)+Math.abs(this._lastZ - current.z);
				if(this.options.needPower<power){
					for(var i in this._callBacks){
						var _callback=this._callBacks[i];
						_callback&&_callback(power,passed);
					}
				}
			}
		}
		this._lastX = current.x;
		this._lastY = current.y;
		this._lastZ = current.z;
	}
	eshake.prototype.handleEvent=function(evt){
		if(isFunction(this['_'+evt.type])){
			this['_'+evt.type](evt);
		}
	}
	/*exports the module*/
	if(typeof define === 'function' && define.amd){
		define(function(){return eshake;});
	}else if(typeof module !== 'undefined' && module.exports){
		module.exports = eshake;
	}else{
		global.eshake = eshake;
	}
})(window);