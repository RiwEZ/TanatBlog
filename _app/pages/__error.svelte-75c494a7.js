import{S as C,i as E,s as H,l as y,g as k,n as g,d as u,L as S,e as p,t as _,c as m,a as b,h as f,b as x,G as o,j as v}from"../chunks/index-f9833ff1.js";import{p as j}from"../chunks/stores-5a2e4d4b.js";function q(l){let t,r;return{c(){t=p("h1"),r=_(l[0]),this.h()},l(e){t=m(e,"H1",{class:!0});var s=b(t);r=f(s,l[0]),s.forEach(u),this.h()},h(){x(t,"class","mt-10 text-center text-2xl")},m(e,s){k(e,t,s),o(t,r)},p(e,s){s&1&&v(r,e[0])},d(e){e&&u(t)}}}function w(l){let t,r,e,s,a=l[1].params.slug+"",n,d;return{c(){t=p("h1"),r=_("Can't find this article "),e=p("b"),s=_('"'),n=_(a),d=_('"'),this.h()},l(c){t=m(c,"H1",{class:!0});var i=b(t);r=f(i,"Can't find this article "),e=m(i,"B",{class:!0});var h=b(e);s=f(h,'"'),n=f(h,a),d=f(h,'"'),h.forEach(u),i.forEach(u),this.h()},h(){x(e,"class","text-red-500"),x(t,"class","mt-10 text-center text-2xl")},m(c,i){k(c,t,i),o(t,r),o(t,e),o(e,s),o(e,n),o(e,d)},p(c,i){i&2&&a!==(a=c[1].params.slug+"")&&v(n,a)},d(c){c&&u(t)}}}function B(l){let t;function r(a,n){return a[2]?w:q}let s=r(l)(l);return{c(){s.c(),t=y()},l(a){s.l(a),t=y()},m(a,n){s.m(a,n),k(a,t,n)},p(a,[n]){s.p(a,n)},i:g,o:g,d(a){s.d(a),a&&u(t)}}}const A=({error:l,status:t})=>({props:{title:`${t}: ${l!==null?l.message:"unknown"}`}});function G(l,t,r){let e;S(l,j,n=>r(1,e=n));let{title:s}=t;const a=s==="500: Cannot read property 'slug' of undefined";return l.$$set=n=>{"title"in n&&r(0,s=n.title)},[s,e,a]}class D extends C{constructor(t){super(),E(this,t,G,B,H,{title:0})}}export{D as default,A as load};