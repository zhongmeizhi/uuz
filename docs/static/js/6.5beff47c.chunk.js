(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[6],{19:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),i=a(32),c=a(6);function o(t){return function(t){if(Array.isArray(t)){for(var e=0,a=new Array(t.length);e<t.length;e++)a[e]=t[e];return a}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var l=a(62),u=a(63),s=function(){function t(){Object(l.a)(this,t),this.data=void 0,this.colData=void 0,this.col=void 0,this.curIdx=void 0,this.data=[],this.colData=[],this.col=0,this.curIdx=0}return Object(u.a)(t,[{key:"getColData",value:function(){return this.colData}},{key:"getCurIdx",value:function(){return this.curIdx}},{key:"setCol",value:function(t){this.col=t}},{key:"setData",value:function(t){this.data=t}},{key:"addCurIdx",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.curIdx+=t}},{key:"setFirstRowData",value:function(){this.colData=this.data.slice(0,this.col).map((function(t){return[t]})),this.colData.length&&(this.curIdx=this.colData.length-1)}},{key:"_findLowCol",value:function(t){var e=t.map((function(t){return t.offsetTop})),a=Math.min.apply(Math,o(e));return e.indexOf(a)}},{key:"pushDataToLowCol",value:function(t){var e=this._findLowCol(t);this.addCurIdx(),this.colData[e].push(this.data[this.curIdx])}}]),t}();var f=function(t){var e=t.data,a=t.col,o=void 0===a?2:a,l=t.childRender,u=t.linkName,f=void 0===u?"url":u,d=[],h=e.length,m=Array(o).fill("col").map((function(){return[]})),p=Object(n.useState)(m),v=Object(i.a)(p,2),y=v[0],b=v[1],w=new s;w.setData(e),w.setCol(o);var g=Object(n.useState)(w),D=Object(i.a)(g,1)[0],j=Object(n.useState)(0),k=Object(i.a)(j,2),x=k[0],C=k[1];return Object(n.useEffect)((function(){if(x<h-1){x<o-1?(D.setFirstRowData(),b(D.getColData())):(D.pushDataToLowCol(d),b(D.getColData()));var t=D.getCurIdx();Object(c.d)(e[t][f],(function(){C(t)}))}}),[x]),r.a.createElement("div",{className:"zui-waterfall zui-clearfix"},y.map((function(t,e){return r.a.createElement("div",{key:e,className:"zui-waterfall-col",style:{width:100/o+"%"}},t.map((function(t,a){return r.a.createElement("div",{key:"".concat(e,"-").concat(a),className:"zui-waterfall-item"},"function"===typeof l?l(t):r.a.createElement("img",{className:"zui-waterfall-img",src:t[f],alt:"\u7011\u5e03\u6d41"}))})),r.a.createElement("div",{ref:function(t){return d[e]=t}}))})))},d=Array(21).fill("data").map((function(t,e){return{url:"https://zhongmeizhi.github.io/static/test/".concat(20-e,".jpg"),name:"\u7011\u5e03\u6d41",desc:"".concat(e)}}));function h(t){return r.a.createElement("div",null,r.a.createElement("img",{className:"test-waterfall-img",alt:"\u7011\u5e03\u6d41",src:t.url}),r.a.createElement("p",{className:"zui-waterfall-txt"},t.name),r.a.createElement("p",{className:"zui-waterfall-txt"},t.desc))}e.default=function(){return r.a.createElement("div",null,r.a.createElement(f,{data:d,col:3,childRender:h}))}},62:function(t,e,a){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}a.d(e,"a",(function(){return n}))},63:function(t,e,a){"use strict";function n(t,e){for(var a=0;a<e.length;a++){var n=e[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function r(t,e,a){return e&&n(t.prototype,e),a&&n(t,a),t}a.d(e,"a",(function(){return r}))}}]);
//# sourceMappingURL=6.5beff47c.chunk.js.map