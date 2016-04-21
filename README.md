#eshake.js

一个简单的手机摇一摇JS工具

##安装方式

可以通过`npm`或者`bower`进行安装

###npm

```shell
npm install eshake --save
```

###bower

```shell
bower install eshake --save
```

##引用方式

####普通引用

```html
<script src="eshake.js"></script>
```
####CMD引用

```js
var eshake=require("eshake");
```

####AMD引用

```js
define(['eshake'],function(eshake){
	console.log(eshake);
});
```

##基本用法

```js
var shake=new eshake({
	needPassed: 100,
	needPower: 15
});
shake.addCallbacks(function(power,passed){
	alert('power:'+power.toFixed(2)+'===passed:'+passed+'ms');
}).addEvent();
```