import{S as U,i as V,s as J,e as $,c as E,a as M,d as w,b as d,g as S,n as F,k as W,t as A,x as Z,R as Q,m as P,h as I,y as X,T as Y,G as v,z as tt,j as H,r as et,p as nt,C as at}from"../../chunks/index-f9833ff1.js";import{b as rt}from"../../chunks/paths-396f020f.js";function ot(t){let e;return{c(){e=$("article"),this.h()},l(r){e=E(r,"ARTICLE",{class:!0});var s=M(e);s.forEach(w),this.h()},h(){d(e,"class","mt-5 svelte-1ej6xib")},m(r,s){S(r,e,s),e.innerHTML=t[0]},p(r,[s]){s&1&&(e.innerHTML=r[0])},i:F,o:F,d(r){r&&w(e)}}}function st(t,e,r){let{content:s}=e;return t.$$set=_=>{"content"in _&&r(0,s=_.content)},[s]}class it extends U{constructor(e){super(),V(this,e,st,ot,J,{content:0})}}var G=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};function lt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var K={};(function(t){/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */var e=G&&G.__assign||function(){return e=Object.assign||function(a){for(var n,o=1,p=arguments.length;o<p;o++){n=arguments[o];for(var l in n)Object.prototype.hasOwnProperty.call(n,l)&&(a[l]=n[l])}return a},e.apply(this,arguments)};t.__esModule=!0,t.readingTimeWithCount=t.countWords=void 0;function r(a,n){return n.some(function(o){var p=o[0],l=o[1];return p<=a&&a<=l})}var s=function(a){var n=a.charCodeAt(0);return r(n,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])},_=function(a){return` 
\r	`.includes(a)},u=function(a){var n=a.charCodeAt(0);return r(n,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])};function f(a,n){n===void 0&&(n={});for(var o=0,p=0,l=a.length-1,x=n.wordBound,m=x===void 0?_:x;m(a[p]);)p++;for(;m(a[l]);)l--;for(var h=a+`
`,c=p;c<=l;c++)if((s(h[c])||!m(h[c])&&(m(h[c+1])||s(h[c+1])))&&o++,s(h[c]))for(;c<=l&&(u(h[c+1])||m(h[c+1]));)c++;return{total:o}}t.countWords=f;function y(a,n){n===void 0&&(n={});var o=n.wordsPerMinute,p=o===void 0?200:o,l=a.total/p,x=Math.round(l*60*1e3),m=Math.ceil(parseFloat(l.toFixed(2)));return{minutes:m,time:x}}t.readingTimeWithCount=y;function j(a,n){n===void 0&&(n={});var o=f(a,n);return e(e({},y(o,n)),{words:o})}t.default=j})(K);var ct=lt(K);function ut(t){let e,r,s,_,u,f,y,j=t[0].title+"",a,n,o,p=t[1].minutes+"",l,x,m,h=new Date(t[0].updatedAt).toLocaleDateString("en-gb",{year:"numeric",month:"long",day:"numeric"})+"",c,R,C,O,g,k,T;return document.title=e=t[0].title,C=new it({props:{content:t[0].htmlContent}}),{c(){r=$("meta"),_=W(),u=$("div"),f=$("div"),y=$("h1"),a=A(j),n=W(),o=$("p"),l=A(p),x=A(` minutes read \u2022 Last updated
      `),m=$("b"),c=A(h),R=W(),Z(C.$$.fragment),O=W(),g=$("script"),this.h()},l(i){const b=Q('[data-svelte="svelte-1n0hy1j"]',document.head);r=E(b,"META",{name:!0,content:!0}),b.forEach(w),_=P(i),u=E(i,"DIV",{class:!0});var B=M(u);f=E(B,"DIV",{class:!0});var D=M(f);y=E(D,"H1",{class:!0});var q=M(y);a=I(q,j),q.forEach(w),n=P(D),o=E(D,"P",{class:!0});var L=M(o);l=I(L,p),x=I(L,` minutes read \u2022 Last updated
      `),m=E(L,"B",{});var z=M(m);c=I(z,h),z.forEach(w),L.forEach(w),R=P(D),X(C.$$.fragment,D),D.forEach(w),O=P(B),g=E(B,"SCRIPT",{src:!0,repo:!0,"issue-term":!0,label:!0,theme:!0,crossorigin:!0});var N=M(g);N.forEach(w),B.forEach(w),this.h()},h(){d(r,"name","description"),d(r,"content",s=t[0].description),d(y,"class","text-4xl font-bold leading-tight"),d(o,"class","mt-1 text-zinc-400"),d(f,"class","mb-10 sm:max-w-3xl 3xl:max-w-7xl"),Y(g.src,k="https://utteranc.es/client.js")||d(g,"src",k),d(g,"repo","RiwEZ/TanatBlog"),d(g,"issue-term","title"),d(g,"label","Comment"),d(g,"theme","icy-dark"),d(g,"crossorigin","anonymous"),g.async=!0,d(u,"class","mt-10")},m(i,b){v(document.head,r),S(i,_,b),S(i,u,b),v(u,f),v(f,y),v(y,a),v(f,n),v(f,o),v(o,l),v(o,x),v(o,m),v(m,c),v(f,R),tt(C,f,null),v(u,O),v(u,g),T=!0},p(i,[b]){(!T||b&1)&&e!==(e=i[0].title)&&(document.title=e),(!T||b&1&&s!==(s=i[0].description))&&d(r,"content",s),(!T||b&1)&&j!==(j=i[0].title+"")&&H(a,j),(!T||b&1)&&h!==(h=new Date(i[0].updatedAt).toLocaleDateString("en-gb",{year:"numeric",month:"long",day:"numeric"})+"")&&H(c,h);const B={};b&1&&(B.content=i[0].htmlContent),C.$set(B)},i(i){T||(et(C.$$.fragment,i),T=!0)},o(i){nt(C.$$.fragment,i),T=!1},d(i){w(r),i&&w(_),i&&w(u),at(C)}}}const ht=async({params:t,fetch:e})=>{const{slug:r}=t,s=`${rt}/api/posts/${r}.json`;return{props:{post:await(await e(s)).json()}}};function dt(t,e,r){let{post:s}=e,_=ct(s.content);return t.$$set=u=>{"post"in u&&r(0,s=u.post)},[s,_]}class vt extends U{constructor(e){super(),V(this,e,dt,ut,J,{post:0})}}export{vt as default,ht as load};
