_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[37],{"9fNV":function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/analytics",function(){return a("NFYf")}])},CwOF:function(e,t,a){e.exports={poppinsRegular:'"Poppins Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',poppinsMedium:'"Poppins Medium", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',poppinsLight:'"Poppins Light", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',robotoSlabRegular:'"RobotoSlab Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',robotoSlabLight:'"RobotoSlab Light", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',robotoSlabBold:'"RobotoSlab Bold", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',bodyBg:"#f9fafc",dbxBg:"#704C9F",navText:"#9094a5",secondaryText:"#8A96AF",divider:"rgba(48, 53, 63, 0.1)",assetBg:"#f0f0f0",optionsText:"#646E83",activeColor:"#297BFF",postBackground:"#8394E0",userActive:"#6E86E7",filterActive:"#73DB9B",filterIconBg:"#64C489",titleLightBlue:"#6e87f5",titleRed:"#EE6B6B",titleText:"#30353F",loaderWrapper:"_3d0GU",inline:"_2YCUz",content:"_2emF1",center:"_2ny11",assetListLoader:"_334HO"}},NFYf:function(e,t,a){"use strict";a.r(t);var o=a("nKUr"),n=a("o0o1"),s=a.n(n),i=a("HaE+"),r=a("1OyB"),c=a("vuIU"),l=a("JX7q"),p=a("Ji7U"),m=a("md7G"),u=a("foSv"),b=a("rePB"),d=a("q1tI"),j=a("/MKj"),g=a("ANjH"),f=a("9xET"),O=a.n(f),h=a("ZPTe"),S=a.n(h),y=a("wd/R"),v=a.n(y),x=a("TlR6"),_=a("9At1"),I=a("K4dc"),C=a("Zb9X"),B=a("WrOz"),w=a("fS1W"),D=a("PGnZ"),E=a.n(D),A=a("32PK"),N=a("XKlS"),U=a("7iAt"),F=a.n(U),P=a("mOvS"),R=a.n(P),k=R()().publicRuntimeConfig,M=function(e){switch(e){case"download":return Object(o.jsx)("img",{src:"".concat(k.asset,"/static/dist/images/icons/download.png"),alt:"Analytics icon",className:F.a.analyticsIcon});case"import":return Object(o.jsx)("img",{src:"".concat(k.asset,"/static/dist/images/icons/import.png"),alt:"Analytics icon",className:F.a.analyticsIcon});case"component":return Object(o.jsx)("img",{src:"".concat(k.asset,"/static/dist/images/icons/component.png"),alt:"Analytics icon",className:F.a.analyticsIcon});default:return Object(o.jsx)("img",{src:"".concat(k.asset,"/static/dist/images/icons/import.png"),alt:"Analytics icon",className:F.a.analyticsIcon})}},T=function(e){var t=e.title,a=e.count,n=e.icon,s=e.className;return Object(o.jsxs)(O.a,{className:"".concat(F.a.base," ").concat(s),children:[Object(o.jsxs)(S.a,{className:F.a.titleIcon,children:[Object(o.jsx)(S.a,{span:22,children:Object(o.jsx)("h2",{children:t})}),Object(o.jsx)(S.a,{span:2,children:M(n)})]}),Object(o.jsx)(S.a,{span:24,children:Object(o.jsx)("h3",{children:a})})]})};T.defaultProps={title:"",count:0,icon:""};var H=T,L=a("Zch0"),W=a.n(L),z=a("7Qib"),V=R()().publicRuntimeConfig,Z=function(e){var t=e.data,a=e.title,n=e.className;return Object(o.jsxs)(O.a,{className:"".concat(W.a.base," ").concat(n),children:[Object(o.jsx)(S.a,{className:W.a.title,children:Object(o.jsx)("h2",{children:"TOP 5"})}),Object(o.jsx)(S.a,{children:Object(o.jsx)("h2",{children:a})}),Object(o.jsx)(S.a,{span:24,className:W.a.wrapper,children:t&&t.length>0?t.map((function(e){return Object(o.jsxs)(O.a,{className:W.a.itemWrapper,children:[Object(o.jsx)(S.a,{span:16,children:Object(z.f)(e.title,30)}),Object(o.jsxs)(S.a,{span:4,children:[Object(o.jsx)("img",{src:"".concat(V.asset,"/static/dist/images/icons/like.svg"),alt:"icon",className:W.a.statsIcon}),e.likes]}),Object(o.jsxs)(S.a,{span:4,children:[Object(o.jsx)("img",{src:"".concat(V.asset,"/static/dist/images/icons/downloadBlue.png"),alt:"icon",className:W.a.statsIcon}),e.downloads]})]})})):"No Data found for current Selected Dates"})]})};Z.defaultProps={title:"",data:[]};var G=Z;function K(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function X(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,o=Object(u.a)(e);if(t){var n=Object(u.a)(this).constructor;a=Reflect.construct(o,arguments,n)}else a=o.apply(this,arguments);return Object(m.a)(this,a)}}var q=function(e){Object(p.a)(a,e);var t=X(a);function a(e){var n;Object(r.a)(this,a),n=t.call(this,e),Object(b.a)(Object(l.a)(n),"getData",function(){var e=Object(i.a)(s.a.mark((function e(t){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n.setState({loading:!0}),e.next=4,I.c.get("api/v1_0/marketplace/get_analytics_data_dashboard",{params:{from_date:t[0],to_date:t[1]}});case 4:a=e.sent,n.setState({loading:!1,data:a.data}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),n.setState({loading:!1,data:[]});case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t){return e.apply(this,arguments)}}()),Object(b.a)(Object(l.a)(n),"renderContent",(function(e){var t=n.state,a=t.loading,s=t.dates,i=t.momentDates,r=t.data;return e?a?Object(o.jsx)(w.a,{}):Object(o.jsxs)(d.Fragment,{children:[Object(o.jsxs)(O.a,{className:E.a.panelContainer,children:[Object(o.jsxs)(S.a,{span:12,className:E.a.datePanel,children:[Object(o.jsx)(N.a,{title:"Component Performance",type:"action",color:"blue",href:"/analytics/component",target:"_blank",className:E.a.componentPerformanceButton}),Object(o.jsx)(N.a,{title:"Search Analytics",type:"action",color:"blue",href:"/analytics/search",target:"_blank"})]}),Object(o.jsx)(S.a,{span:12,className:E.a.datePanel,children:Object(o.jsx)(B.a,{setDate:n.setDate,defaultDateValuesInMoment:i,defaultDateValues:s})})]}),Object(o.jsxs)(O.a,{children:[Object(o.jsxs)(O.a,{className:E.a.miniPanelContainer,children:[Object(o.jsx)(S.a,{span:8,children:Object(o.jsx)(H,{title:"Total Number Of Components",count:r.totalAssets,icon:"component",className:"totalComponentCount"})}),Object(o.jsx)(S.a,{span:8,children:Object(o.jsx)(H,{title:"Total Number Of Downloads",count:r.totalDownloads,icon:"download",className:"totalDownloadsCount"})}),Object(o.jsx)(S.a,{span:8,children:Object(o.jsx)(H,{title:"Total Number Of Imports to Viz Forms",count:r.totalVizImports,icon:"import",className:"totalVizFormsImportsCount"})})]}),Object(o.jsxs)(O.a,{children:[Object(o.jsx)(S.a,{span:12,children:Object(o.jsx)(G,{title:"Most Downloaded Components",data:r.topFiveDownloads,className:"topFiveDownloadsCount"})}),Object(o.jsx)(S.a,{span:12,children:Object(o.jsx)(G,{title:"Most Deployed Components",data:r.topFiveDeployments,className:"topFiveDeployedCount"})})]})]})]}):Object(o.jsx)(A.a,{})}));var c=a.getFormattedDate(new Date),p=a.getFormattedDate(new Date((new Date).getTime()-6048e5));return n.state={data:[],loading:!1,dates:[p,c],momentDates:[v()(p),v()(c)]},n.setDate=n.setDate.bind(Object(l.a)(n)),n.getData=n.getData.bind(Object(l.a)(n)),n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this.state.dates;this.getData(e)}},{key:"setDate",value:function(e,t){this.setState({dates:e,momentDates:t}),this.getData(e)}},{key:"render",value:function(){var e=this.props,t=e.marketplace,a=e.url,n=t.config,s=t.moderatorMenu;return Object(o.jsxs)(C.a,{config:n,url:a,children:[Object(o.jsx)(x.a,{placeholder:"Search for Marketplace Assets"}),Object(o.jsx)("div",{children:this.renderContent(s&&s.subMenu&&s.subMenu.length>0)})]})}}],[{key:"getFormattedDate",value:function(e){var t=e,a=String(t.getDate()).padStart(2,"0"),o=String(t.getMonth()+1).padStart(2,"0"),n=t.getFullYear();return"".concat(n,"-").concat(o,"-").concat(a)}},{key:"getInitialProps",value:function(){var e=Object(i.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(I.a)(t);case 2:return e.next=4,t.store.dispatch(_.b.getConfig(!0));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),a}(d.Component);t.default=Object(j.b)((function(e){return{marketplace:e.marketplace}}),(function(e){return Object(g.bindActionCreators)(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?K(Object(a),!0).forEach((function(t){Object(b.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):K(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},_.b),e)}))(q)},PGnZ:function(e,t,a){e.exports={poppinsRegular:'"Poppins Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',poppinsMedium:'"Poppins Medium", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',poppinsLight:'"Poppins Light", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',robotoSlabRegular:'"RobotoSlab Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',robotoSlabLight:'"RobotoSlab Light", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',robotoSlabBold:'"RobotoSlab Bold", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',bodyBg:"#f9fafc",dbxBg:"#704C9F",navText:"#9094a5",secondaryText:"#8A96AF",divider:"rgba(48, 53, 63, 0.1)",assetBg:"#f0f0f0",optionsText:"#646E83",activeColor:"#297BFF",postBackground:"#8394E0",userActive:"#6E86E7",filterActive:"#73DB9B",filterIconBg:"#64C489",titleLightBlue:"#6e87f5",titleRed:"#EE6B6B",titleText:"#30353F",hide:"_2lx70",switchWrapper:"_3dK4q",channels:"_1_fDn",generalButton:"_2h9jN",detailPageWrapper:"_1wlJH",mobileMetaWrapper:"_18sTW",hikeBody:"un9yd",toursDetailPreview:"_1wyb7",hikeContainer:"_4980",tourInfo:"_1sg5s",tourTitle:"_1zCBc",tourVersion:"_34gMg",tourBody:"RSpOC",tourThumb:"_1uuIs",tourContainer:"_3Z4gB",tourDesc:"_1DQZI",innerTabWrapper:"_14Op9",tourHeader:"_3f8tX",tourContent:"_2FiW3",tourDetails:"_8wI-z",tourTime:"_2GNWc",startBtn:"_3FjBe",noresult:"_1ZgnQ",assetsContainer:"_3POKL",skeletonWrapper:"_21ZUU",metaData:"vgCP3",datePanel:"_OfnV",filterTablePanel:"_2v7ht",tableHeading:"_3BG8h",componentPerformanceButton:"X9xGv",miniPanelContainer:"_1AvNV",panelContainer:"_1OM0t",RowContainer:"gkuiu",pageContainer:"_3brHz",generateContainer:"_3r9_H",pageContent:"_3HEcY",forms:"_3n0I_",formContainer:"_15mmt",zipEmpty:"D4gGS",zipValid:"QxijF",ckEditorContainer:"_1A38U",generateForm:"_1n1qG",previews:"_1o1qI",header:"_1BKOx",logo:"d8BYZ",cardPreview:"iZurp",previewContainer:"j2Rpp"}},fS1W:function(e,t,a){"use strict";var o=a("nKUr"),n=(a("q1tI"),a("CwOF")),s=a.n(n),i=a("mOvS"),r=a.n(i)()().publicRuntimeConfig,c=function(e){var t=e.inline,a=e.size,n=e.height,i=e.width,c=e.className,l=e.style;return Object(o.jsx)("div",{style:l,className:"".concat(s.a.loaderWrapper," ").concat(t?s.a.inline:null," ").concat(c),children:Object(o.jsx)("div",{className:s.a.content,children:Object(o.jsx)("div",{className:s.a.center,children:Object(o.jsx)("img",{src:"".concat(r.asset,"/static/dist/images/loader.svg"),alt:"Loader",height:n||a,width:i||a})})})})};c.defaultProps={inline:!1},t.a=c}},[["9fNV",1,2,6,9,11,14,0,3,4,5,8,10,12,13,15,22,23,7]]]);