import{S as C,i as E,s as H,l as k,g as y,n as g,d as u,L as S,e as p,t as _,c as m,a as b,h as f,b as x,G as o,j as v}from"../chunks/index-f9833ff1.js";import{p as j}from"../chunks/stores-5a2e4d4b.js";function q(l){let t,n;return{c(){t=p("h1"),n=_(l[0]),this.h()},l(e){t=m(e,"H1",{class:!0});var s=b(t);n=f(s,l[0]),s.forEach(u),this.h()},h(){x(t,"class","mt-10 text-center text-2xl")},m(e,s){y(e,t,s),o(t,n)},p(e,s){s&1&&v(n,e[0])},d(e){e&&u(t)}}}function B(l){let t,n,e,s,a=l[1].params.slug+"",r,d;return{c(){t=p("h1"),n=_("Can't find this article "),e=p("b"),s=_('"'),r=_(a),d=_('"'),this.h()},l(i){t=m(i,"H1",{class:!0});var c=b(t);n=f(c,"Can't find this article "),e=m(c,"B",{class:!0});var h=b(e);s=f(h,'"'),r=f(h,a),d=f(h,'"'),h.forEach(u),c.forEach(u),this.h()},h(){x(e,"class","text-red-500"),x(t,"class","mt-10 text-center text-2xl")},m(i,c){y(i,t,c),o(t,n),o(t,e),o(e,s),o(e,r),o(e,d)},p(i,c){c&2&&a!==(a=i[1].params.slug+"")&&v(r,a)},d(i){i&&u(t)}}}function G(l){let t;function n(a,r){return a[2]?B:q}let s=n(l)(l);return{c(){s.c(),t=k()},l(a){s.l(a),t=k()},m(a,r){s.m(a,r),y(a,t,r)},p(a,[r]){s.p(a,r)},i:g,o:g,d(a){s.d(a),a&&u(t)}}}function A({error:l,status:t}){return{props:{title:`${t}: ${l.message}`}}}function L(l,t,n){let e;S(l,j,r=>n(1,e=r));let{title:s}=t;const a=s==="500: Cannot read property 'slug' of undefined";return l.$$set=r=>{"title"in r&&n(0,s=r.title)},[s,e,a]}class D extends C{constructor(t){super(),E(this,t,L,G,H,{title:0})}}export{D as default,A as load};
