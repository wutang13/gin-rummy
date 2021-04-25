(this["webpackJsonpgin-rummy"]=this["webpackJsonpgin-rummy"]||[]).push([[0],{37:function(e,t,n){},38:function(e,t,n){},44:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(11),u=n.n(a),o=(n(37),n(15)),i=(n(38),n(39),n(6)),s=["S","C","H","D"],d=["A","2","3","4","5","6","7","8","9","10","J","Q","K"],l={userHand:{sets:[],runs:[],deadwood:[]},computerHand:{sets:[],runs:[],deadwood:[]},deck:[],discard:[],currentStage:"",userGameScore:0,computerGameScore:0,discardMemory:10,playerPickup:[],ginBonus:25,undercutBonus:25},m=n(1);function p(e){var t=e.gameState,n=e.setGameState,r=e.onCardSelect,c=e.hand,a=e.faceUp;return Object(m.jsxs)("div",{children:[Object(m.jsx)("div",{children:j(e.hand).map((function(e){return Object(m.jsx)("img",{onClick:function(){return r&&n?n(Object(i.a)({},r(e,t))):console.log("You cannot discard an opponent's card")},src:a?"".concat("/gin-rummy","/cards/").concat(g(e),".jpg"):"".concat("/gin-rummy","/cards/blue_back.jpg"),alt:g(e),style:{maxHeight:180,margin:10}},g(e))}))}),a?Object(m.jsxs)("p",{className:"game-text",style:{marginLeft:"20px"},children:["Score: ",f(c.deadwood)]}):void 0]})}function f(e){var t=0;return e.forEach((function(e){var n=d.indexOf(e.value)+1;t+=n>9?10:n})),t}function j(e){return e.sets.flat().concat(e.runs.flat(),e.deadwood)}function v(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=d[d.indexOf(e.value)+t];return n?{value:n,suit:e.suit}:null}function g(e){return"".concat(e.value).concat(e.suit)}function x(e){return"".concat(function(){switch(e.value){case"A":return"Ace";case"K":return"King";case"Q":return"Queen";case"J":return"Jack";default:return e.value}}()," of ").concat(function(){switch(e.suit){case"H":return"Hearts";case"D":return"Diamonds";case"S":return"Spades";default:return"Clubs"}}())}var h=n(31),b=n.n(h),O=n(32),y=n(18),S=n(23),k=n(22);function w(e){var t,n,c=Object(r.useState)(l),a=Object(o.a)(c,2),u=a[0],s=a[1];Object(r.useEffect)((function(){u.deck.length<3&&"No one"!==u.winner?s(Object(i.a)(Object(i.a)({},u),{},{winner:"No one",currentStage:"endround"})):"computer"===u.currentStage&&s(Object(i.a)({},function(e){var t=function(e){if(e.discard.length>0){var t=e.discard[e.discard.length-1],n=e.computerHand.sets.some((function(e){return e[0].value===t.value})),r=e.computerHand.deadwood.filter((function(e){return e.value===t.value})).length>1,c=e.computerHand.runs.some((function(e){return v(e[e.length-1],1)===t||v(e[0],-1)===t}));if(r||n||c||E(e.computerHand.deadwood,t))return!1}return!0}(e),n=[];t?n.push("Computer drew from deck"):n.push("Computer drew from discard");var r=t?e.deck.pop():e.discard.pop(),c=j(e.computerHand);r&&(c.push(r),e.computerHand=H(c));var a=function(e){var t,n=B(e.computerHand.deadwood),r=n[10]+n.J+n.Q+n.K;if(e.deck.length<20&&r>0){var c=e.computerHand.deadwood.sort((function(e,t){return d.indexOf(e.value)-d.indexOf(t.value)})).pop();return c||"knock"}var a=M(e),u=null===(t=a.pop())||void 0===t?void 0:t.card;return u||"knock"}(e),u="string"===typeof a&&r?r:a;if("string"!=typeof u){n.push("Opponent discarded the ".concat(x(u)));var o=c.indexOf(u);if(o>-1){var i=c.splice(o,1);e.discard.push(i[0])}}if(e.computerHand=H(c),function(e){var t=f(e.computerHand.deadwood);if(t<3)return!0;if(t<7&&e.deck.length>18)return!0;if(t<=10&&e.deck.length>25)return!0;return!1}(e))return D(e,!1);return e.currentStage="pickup",e.computerMoves=n,e}(u)))}),[u]),Object(r.useEffect)((function(){return s(Object(i.a)({},C(e.discardMemory,e.ginBonus,e.undercutBonus)))}),[e.discardMemory,e.ginBonus,e.undercutBonus]);var h=u.userGameScore>=e.gameScoreLimit||u.computerGameScore>=e.gameScoreLimit;return Object(m.jsxs)("div",{style:{margin:"30px"},children:[Object(m.jsx)(S.a,{show:h,backdrop:"static",size:"lg",centered:!0,children:Object(m.jsxs)(S.a.Dialog,{children:[Object(m.jsxs)(S.a.Body,{children:[Object(m.jsx)("p",{className:"game-text",children:"".concat(null!==(t=u.winner)&&void 0!==t?t:""," won the game")}),Object(m.jsx)("p",{className:"game-text",children:"Do you want to play again?"})]}),Object(m.jsxs)(S.a.Footer,{children:[Object(m.jsx)(k.a,{variant:"primary",onClick:function(){return s(C(e.discardMemory,e.ginBonus,e.undercutBonus))},children:"Yes"}),Object(m.jsx)(k.a,{variant:"secondary",onClick:function(){return e.onExit(!1)},children:"No"})]})]})}),Object(m.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[Object(m.jsx)("div",{}),Object(m.jsx)(p,{hand:u.computerHand,gameState:u,faceUp:!!u.winner}),Object(m.jsxs)(y.a,{children:[Object(m.jsx)(y.a.Toggle,{variant:"outline-primary",children:Object(m.jsx)(b.a,{path:O.a,size:2,color:"gray"})}),Object(m.jsxs)(y.a.Menu,{children:[Object(m.jsx)(y.a.Item,{onClick:function(){return s(C(e.discardMemory,e.ginBonus,e.undercutBonus))},children:"Reset Game"}),Object(m.jsx)(y.a.Item,{onClick:function(){return e.onExit(!1)},children:"Exit Game"})]})]})]}),Object(m.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center"},children:[Object(m.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-evenly"},children:[Object(m.jsx)("p",{className:"game-text",children:"Discard Pile"}),u.discard.length>0?Object(m.jsx)("img",{src:"".concat("/gin-rummy","/cards/").concat(g(u.discard[u.discard.length-1]),".jpg"),onClick:function(){return s(Object(i.a)({},N(!0,u)))},alt:g(u.discard[u.discard.length-1]),style:{maxHeight:180,margin:10}}):Object(m.jsx)("p",{style:{margin:20},children:"Empty"})]}),Object(m.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-evenly",margin:"10px 100px 10px 100px"},children:["pickup"===u.currentStage&&u.computerMoves?u.computerMoves.map((function(e){return Object(m.jsx)("p",{className:"game-text",children:e})})):void 0,Object(m.jsx)("p",{className:"game-text",children:function(){switch(u.currentStage){case"discard":return"Click on the card you want to discard";case"pickup":return"Click on the card you want to pick up";case"knock":return"Do you want to knock?";default:return""}}()}),"knock"===u.currentStage?Object(m.jsxs)("div",{children:[Object(m.jsx)("button",{className:"game-button",onClick:function(){return s(Object(i.a)({},D(u,!0)))},children:"Knock"}),Object(m.jsx)("button",{className:"game-button",onClick:function(){return s(Object(i.a)(Object(i.a)({},u),{},{currentStage:"computer"}))},children:"End Turn"})]}):void 0,"endround"===u.currentStage?Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)("p",{className:"game-text",children:"".concat(null!==(n=u.winner)&&void 0!==n?n:""," won that round")}),Object(m.jsx)("button",{className:"game-button",onClick:function(){return s(Object(i.a)({},function(e){var t=e.userGameScore,n=e.computerGameScore,r="You"===e.winner?"pickup":"computer";return Object(i.a)(Object(i.a)({},C(e.discardMemory,e.ginBonus,e.undercutBonus,r)),{},{computerGameScore:n,userGameScore:t})}(u)))},children:"End Round"})]}):void 0]}),Object(m.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-evenly"},children:[Object(m.jsx)("p",{className:"game-text",children:"Deck"}),Object(m.jsx)("p",{className:"game-text",style:{fontSize:"20px"},children:"Cards Left: ".concat(u.deck.length)}),u.deck.length>0?Object(m.jsx)("img",{src:"".concat("/gin-rummy","/cards/blue_back.jpg"),onClick:function(){return s(Object(i.a)({},N(!1,u)))},alt:g(u.deck[u.deck.length-1]),style:{maxHeight:180,margin:10}}):Object(m.jsx)("p",{style:{margin:20},children:"Empty"})]})]}),Object(m.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:Object(m.jsx)(p,{hand:u.userHand,onCardSelect:G,gameState:u,setGameState:s,faceUp:!0})}),Object(m.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"space-around",marginTop:"40px"},children:[Object(m.jsx)("p",{className:"game-text",children:"Player Game Score: ".concat(u.userGameScore)}),Object(m.jsx)("p",{className:"game-text",children:"Computer Game Score: ".concat(u.computerGameScore)})]}),"discard"===u.currentStage&&Object(m.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:Object(m.jsx)("button",{className:"game-button",onClick:function(){return alert("Suggested Discard: ".concat(function(e){var t=M(e).pop();if(!t)return"No suggestion at this time";return x(t.card)}(u)))},children:"Hint"})})]})}function C(e,t,n,r){var c=[];s.forEach((function(e){d.forEach((function(t){c.push({value:t,suit:e})}))}));var a=c.sort((function(){return Math.random()-Math.random()})).slice(0,10),u=(c=c.filter((function(e){return!a.includes(e)}))).sort((function(){return Math.random()-Math.random()})).slice(0,10),o=[(c=c.filter((function(e){return!u.includes(e)})))[0]];c=c.slice(1),console.log(r);var i=null!==r&&void 0!==r?r:Math.random()>.5?"computer":"pickup";console.log(i);var l=H(a),m=H(u);return console.log({userHand:l,computerHand:m,deck:c,discard:o,currentStage:i,userGameScore:0,computerGameScore:0}),{userHand:l,computerHand:m,deck:c,discard:o,currentStage:i,userGameScore:0,computerGameScore:0,discardMemory:e,ginBonus:t,undercutBonus:n,playerPickup:[]}}function H(e){for(var t=e.sort((function(e,t){var n=13*s.indexOf(e.suit),r=13*s.indexOf(t.suit);return n+d.indexOf(e.value)-(r+d.indexOf(t.value))})),n=[],r=0;r<t.length-2;r++){var c=[];E(t,t[r])&&function(){c.push(t[r]);for(var e=v(t[r],1);e&&t.some((function(t){var n,r;return t.value==(null===(n=e)||void 0===n?void 0:n.value)&&t.suit==(null===(r=e)||void 0===r?void 0:r.suit)}))&&r<t.length;)c.push(e),r++,e=v(t[r],1)}(),c.length>2&&n.push(c)}var a=e.filter((function(e){return!n.flat().some((function(t){return e.value===(null===t||void 0===t?void 0:t.value)&&e.suit===(null===t||void 0===t?void 0:t.suit)}))})),u=[];d.forEach((function(e){var t=[];s.forEach((function(n){a.some((function(t){return t.suit===n&&t.value===e}))&&t.push({suit:n,value:e})})),t.length>2&&u.push(t)}));var o=a.filter((function(e){return!u.flat().some((function(t){return e.value===(null===t||void 0===t?void 0:t.value)&&e.suit===(null===t||void 0===t?void 0:t.suit)}))}));return{sets:u,runs:n,deadwood:o}}function G(e,t){if("discard"===t.currentStage){var n=H(j(t.userHand).filter((function(t){return t.value!==e.value||t.suit!==e.suit})));t.discard.push(e),t.userHand=n,t.currentStage=f(t.userHand.deadwood)>10?"computer":"knock"}return t}function N(e,t){if("pickup"===t.currentStage){var n=e?t.discard.pop():t.deck.pop();if(n){var r=j(t.userHand);r.push(n);var c=H(r);t.userHand=c,t.currentStage="discard",t.playerPickup.push(n)}}return t}function B(e){var t={A:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,J:0,Q:0,K:0};return e.forEach((function(e){e.value in t&&(t[e.value]+=1)})),t}function E(e,t){if("A"!==t.value&&"2"!==t.value){var n=v(t,-1),r=v(t,-2);if(n&&r&&e.some((function(e){return g(e)===g(n)}))&&e.some((function(e){return g(e)===g(r)})))return!0}if("K"!==t.value&&"Q"!==t.value){var c=v(t,1),a=v(t,2);if(c&&a&&e.some((function(e){return g(e)===g(c)}))&&e.some((function(e){return g(e)===g(a)})))return!0}var u=v(t,-1),o=v(t,1);return!!(u&&o&&e.some((function(e){return g(e)===g(u)}))&&e.some((function(e){return g(e)===g(o)})))}function M(e){var t=e.computerHand,n=e.playerPickup,r=e.discardMemory,c="computer"!==e.currentStage?e.userHand.deadwood:t.deadwood,a=B(c),u=e.discard.length>=r?e.discard.slice(e.discard.length-r):[];return c.map((function(t){var r=0,o=!1,i=!1;a[t.value]>1&&(r+=8.6,o=!0);var s=v(t,1),l=v(t,-1);return(s&&c.some((function(e){return g(e)===g(s)}))||l&&c.some((function(e){return g(e)===g(l)})))&&(r+=8.2,i=!0),i&&o&&(r+=5.8),"computer"===e.currentStage&&(u.forEach((function(e){var n,c;e.value===t.value?r-=6.8:e.suit!==t.suit||(null===(n=v(t,1))||void 0===n?void 0:n.value)!==e.value&&(null===(c=v(t,-1))||void 0===c?void 0:c.value)!==e.value||(r-=6.8)})),n.forEach((function(e){var n,c;e.value===t.value?r-=3.5:e.suit!==t.suit||(null===(n=v(t,1))||void 0===n?void 0:n.value)!==e.value&&(null===(c=v(t,-1))||void 0===c?void 0:c.value)!==e.value||(r-=3.5)}))),r-=(d.indexOf(t.value)+1)/1.6,{card:t,score:r}})).sort((function(e,t){return t.score-e.score}))}function D(e,t){e.currentStage="endround";var n=f(e.userHand.deadwood),r=f(e.computerHand.deadwood);if(t&&0===n)return Object(i.a)(Object(i.a)({},e),{},{userGameScore:e.userGameScore+r+e.ginBonus,winner:"You"});if(!t&&0===r)return Object(i.a)(Object(i.a)({},e),{},{computerGameScore:e.computerGameScore+n+e.ginBonus,winner:"Your Opponent"});var c=function(e,t){if(t){var n=e.computerHand.deadwood.filter((function(t){var n=e.userHand.sets.some((function(e){return e[0].value===t.value})),r=e.userHand.runs.some((function(e){return E(e,t)}));return!n&&!r}));return{updatedPlayerScore:f(e.userHand.deadwood),updatedComputerScore:f(n)}}return{updatedPlayerScore:f(e.userHand.deadwood.filter((function(t){var n=e.computerHand.sets.some((function(e){return e[0].value===t.value})),r=e.computerHand.runs.some((function(e){return E(e,t)}));return!n&&!r}))),updatedComputerScore:f(e.computerHand.deadwood)}}(e,t),a=c.updatedPlayerScore,u=c.updatedComputerScore;return t&&a<u?Object(i.a)(Object(i.a)({},e),{},{userGameScore:e.userGameScore+u-a,winner:"You"}):t&&a>u?Object(i.a)(Object(i.a)({},e),{},{computerGameScore:e.computerGameScore+a-u+e.undercutBonus,winner:"Your Opponent"}):!t&&a<u?Object(i.a)(Object(i.a)({},e),{},{userGameScore:e.userGameScore+u-a+e.undercutBonus,winner:"You"}):Object(i.a)(Object(i.a)({},e),{},{computerGameScore:e.computerGameScore+a-u,winner:"Your Opponent"})}var P=function(){var e=Object(r.useState)(!1),t=Object(o.a)(e,2),n=t[0],c=t[1],a=Object(r.useState)(10),u=Object(o.a)(a,2),i=u[0],s=u[1],d=Object(r.useState)(100),l=Object(o.a)(d,2),p=l[0],f=l[1],j=Object(r.useState)(25),v=Object(o.a)(j,2),g=v[0],x=v[1],h=Object(r.useState)(25),b=Object(o.a)(h,2),O=b[0],y=b[1];return Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)("h1",{style:{fontFamily:"Lato",fontSize:"80px",color:"#F1FAEE",backgroundColor:"#457B9D",margin:"0",textAlign:"center",padding:"20px"},children:"Gin Rummy"}),n?Object(m.jsx)(w,{onExit:c,discardMemory:i,gameScoreLimit:p,undercutBonus:O,ginBonus:g}):Object(m.jsxs)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",minHeight:"500px"},children:[Object(m.jsx)("button",{className:"game-button",onClick:function(){return c(!0)},children:"Start Game"}),Object(m.jsxs)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"start",marginTop:"20px"},children:[Object(m.jsxs)("div",{className:"settings-item",children:[Object(m.jsx)("label",{className:"game-text",style:{fontSize:"16px",marginRight:"10px"},children:"Computer Discard Memory:"}),Object(m.jsx)("input",{type:"number",style:{maxWidth:"50px"},value:i,onChange:function(e){return s(e.target.value)}})]}),Object(m.jsxs)("div",{className:"settings-item",children:[Object(m.jsx)("label",{className:"game-text",style:{fontSize:"16px",marginRight:"10px"},children:"Game Score Limit:"}),Object(m.jsx)("input",{type:"number",style:{maxWidth:"50px"},value:p,onChange:function(e){return f(e.target.value)}})]}),Object(m.jsxs)("div",{className:"settings-item",children:[Object(m.jsx)("label",{className:"game-text",style:{fontSize:"16px",marginRight:"10px"},children:"Gin Bonus:"}),Object(m.jsx)("input",{type:"number",style:{maxWidth:"50px"},value:g,onChange:function(e){return x(e.target.value)}})]}),Object(m.jsxs)("div",{className:"settings-item",children:[Object(m.jsx)("label",{className:"game-text",style:{fontSize:"16px",marginRight:"10px"},children:"Undercut Bonus:"}),Object(m.jsx)("input",{type:"number",style:{maxWidth:"50px"},value:O,onChange:function(e){return y(e.target.value)}})]})]})]})]})},F=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,49)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,a=t.getLCP,u=t.getTTFB;n(e),r(e),c(e),a(e),u(e)}))};u.a.render(Object(m.jsx)(c.a.StrictMode,{children:Object(m.jsx)(P,{})}),document.getElementById("root")),F()}},[[44,1,2]]]);
//# sourceMappingURL=main.79941c99.chunk.js.map