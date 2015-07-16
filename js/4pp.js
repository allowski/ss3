var init = 0;
var count = 0;
var onSearch = 0;
var searchInput;
var lastList;
var wHash;


wHash = window.location.hash.replace("#", "").split("/");


function isConnected(){
	var onln = true;
	return onln;
}

function a4pp_ping(){
	
	var ping = new Date;
	
	if(isConnected()){

		$.ajax({ type: "POST",
			url: window.app.update_url,
			data: {"action":"ping", "api_key":window.app.appUser.appToken},
			cache:false,
			success: function(output){ 

				ping = new Date - ping;
				
				alert("Ping: "+ping);

			}
		});
		
	}
		
}

function getNodeIndex(node) {
    var index = 0;
    while ( (node = node.previousSibling) ) {
        if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
            index++;
        }
    }
    return index;
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function a4pp_logout(){
	if(confirm("Desea cerrar su sesi&oacute;n?")){
		delete window.localStorage['data'];
		$(".content:not(:first)").remove();
		init = 0;
		main();
	}
}

function i($pt, $es, $en){

	if(typeof window.app.lang == "undefined"){
		return $es;
	}

	switch(window.app.lang){
		case "pt":
			return $pt;
		break;
		case "es":
			return $es;
		break;
		case "en":
			return $en;
		break;
	}

	return $es;

}


function toast(text, type, timeout){
	
	if(timeout==0){
		timeout = 15000;
	}

	var dv = document.createElement("div");

	dv.classList.add("alert");

	dv.classList.add("alert-"+type);

	dv.classList.add("toast");

	dv.innerHTML = text;

	var dvid = Math.random();
	
	dv.id = dvid;

	document.documentElement.appendChild(dv);

	$("body").addClass("has-toast");

	setTimeout(function(){
		$(".toast.opened").addClass("out");
		dv.classList.add("opened");
	}, 250);

	if((timeout>0)&&(typeof timeout != "undefined")){

		setTimeout(function(){
			$("body").removeClass("has-toast");
			dv.classList.add("out");
			eval("setTimeout(function(){\
				var lz = document.getElementById('"+dvid+"');\
				if(lz !== undefined){\
				lz.parentNode.removeChild(lz);}\
			},700);");
		}, timeout);

	}
}

function a4pp_login_form(){

	a4pp({"model":"login", "title":"Login", "items":[], "menu":[]});

}

function a4pp_register_form(){

	a4pp({"model":"register", "title":i("Entrar", "Entrar", "Login"), "items":[], "menu":[]});

}

function a4pp_async(path){
	toast("Cargando contenido..", "success", 0);
	$.post(window.app.update_url, {'api_key':window.app.token,'action':'path','path':path}, function(r){
		var jsn = JSON.parse(r);
		toast("Contenido OK", "success", 3000);
		a4pp(jsn);
	}).error(a4pp_conn_error);
}


function a4pp_register(that){

	if(isConnected()==false){
		return;
	}

	var lod = $(".loading-login");

	var ff = $(".form-form");

	lod.attr("class", "spinner loading-login glyphicon glyphicon-refresh");

	toast(i("Conectando..", "Conectado..", "Connecting.."), "success", 0);

	ff.addClass("opacity50");

	$.post(window.app.domain, $(that).serialize(), function(r){
		lod.removeClass("spinner");
		setTimeout(function(){
			ff.removeClass("opacity50");
			lod.addClass("hidden");
		}, 1000);
		if(r.logged == true){
			lod.removeClass("glyphicon-refresh").addClass("glyphicon-ok");
			window.localStorage['data'] = JSON.stringify(r);
			$(".content:not(:first)").remove();
			$(".toast").remove();
			main();
		}else{
			lod.removeClass("glyphicon-refresh").addClass("glyphicon-remove");
			toast(r.errmsg, "danger", 5000);
		}
	}).error(a4pp_conn_error);

	return false;

}

function a4pp_login(that){

	if(isConnected()==false){
		return;
	}

	var lod = $(".loading-login");

	var ff = $(".form-form");

	lod.attr("class", "spinner loading-login glyphicon glyphicon-refresh");

	toast(i("Conectando..", "Conectando..", "Connecting.."), "success", 0);

	ff.addClass("hidden");

	$.post(window.app.domain, $(that).serialize(), function(r){
		lod.removeClass("spinner");
		setTimeout(function(){
			ff.removeClass("hidden");
			lod.addClass("hidden");
		}, 2000);
		if(r.logged == true){
			lod.removeClass("glyphicon-refresh").addClass("glyphicon-ok");
			window.localStorage['data'] = JSON.stringify(r);
			$(".content:not(:first)").remove();
			$(".toast").remove();
			main();
		}else{
			lod.removeClass("glyphicon-refresh").addClass("glyphicon-remove");
			toast(r.errmsg, "danger", 5000);
		}
	}).error(a4pp_conn_error);

	return false;

}

function a4pp_conn_error(jqXHR, textStatus, errorThrown){

	if(isConnected()==false){
		return;
	}

	var spinners = document.getElementsByClassName("spinner");

	var error = JSON.parse(jqXHR.responseText);

	switch(jqXHR.status){
		case 500:
			toast("Error en el servidor", "danger", 9000);
		break;
		case 500:
			toast("Error en el servidor", "danger", 9000);
		break;
		case 404:
			toast("<b>Error "+error.details.type+":</b><br>"+error.details.description, "danger", 9000);
		break;
		case 0:
			toast("No se pudo conectar al servidor", "danger", 4000);
		break;
	}
	for(var i=0;i<spinners.length;i++){
		spinners[i].classList.remove("spinner");
	}

}

function a4pp_build(){
	toast('<span class=\'glyphicon glyphicon-cog spinner pull-left\'></span> Building app..', 'success', 0);
	$.get(window.app.domain+'/app.php?apx=build', function(){
		toast('<span class=\'glyphicon glyphicon-ok pull-left \'></span> Build completed', 'info', 0);
		setTimeout(function(){ 
			toast('<span class=\'glyphicon glyphicon-cog spinner pull-left \'></span> Reloading...', 'info', 0);
			window.location.reload(true);
		},500);
	});
}


function a4pp_update(){

	if(isConnected()==false){
		return;
	}

	$("#updateIcon").addClass("spinner");

	toast("<span class='glyphicon glyphicon-refresh spinner pull-left'></span>"+i("Conectando..", "Conectando..", "Connecting.."), "success", 0);

	var postRequest = $.post(window.app.update_url, {"api_key":window.app.token, "action":"update"}, function(r){

		r = JSON.parse(r);

		if((window.localStorage['md5'] != r.md5)||(typeof window.localStorage['md5'] == "undefined")){

			toast("<span class='glyphicon glyphicon-refresh spinner pull-left'></span>"+i("Atualiza&ccedil;&atilde;o disponivel", "Actualizaci&oacute;n disponible", "Update available"), "warning", 1500);

			setTimeout(function(){

				toast("<span class='glyphicon glyphicon-cog spinner pull-left'></span>"+i("Baixando atualiza&ccedil;&atilde;o..", "Descargando la actualizaci&oacute;n..", "Downloading update.."), "success", 0);

				window.localStorage['md5'] = r.md5;
				window.localStorage['last_update'] = r.date;

					//console.log(r);
					var request = $.getJSON(r.download_url, function(resp){
						if(resp.logged == true){
							//console.log(resp);
							window.localStorage['data'] = JSON.stringify(resp);
							$("#updateIcon").removeClass("spinner");
							toast("<span class='glyphicon glyphicon-ok pull-right'></span>"+i("Atualizado com exito", "Actualizado exitosamente", "Update success"), "success", 2000);
							$(".content").css("opacity", "0.0");
							setTimeout(function(){
								toast("<span class='glyphicon glyphicon-cog spinner pull-left'></span>"+i("Recarregando dados", "Recargando datos", "Refreshing data"), "warning", 650);
								window.localStorage['dt'] = 1;
								setTimeout(function(){
									$(".content:not(:first)").remove();
									main();
								}, 700)
							},2000);
						}else{
							$(".content:not(:first)").remove();
							toast(resp.errmsg, "danger", 5000);
							$("#updateIcon").removeClass("spinner");
							delete window.localStorage['data'];
							main();
						}
					});

					request.error(a4pp_conn_error);

			}, 1500);
		}else{

			toast(i("Não ha atualizaçōes", "No hay actualizaciones", "No updates available"), "warning", 2000);

			$(".content").css("opacity", "1.0");
			
			$("#updateIcon").removeClass("spinner");

		}
	});

	postRequest.error(a4pp_conn_error);

	return false;

}

function goTo(whereToGo){
	var lst = whereToGo.replace("#", "").split("/");
	console.log(lst);
	var i = 0;
	var interval = setInterval(function(){
		if(typeof lst[i] == "undefined"){
			clearInterval(interval);
			return;
		}else{
			console.log("Set inter");
			if(triggerClickElement(lst[i])==1){
				clearInterval(interval);
			}
			i++;
			if(i>lst.length){
				clearInterval(interval);
			}
		}
	}, 1000);
}





function bindClick(element, that){
	element.addEventListener("click", function(){
		console.log("Clicked item");
		var id = getNodeIndex(element);
		if(typeof that.callback != "undefined"){
			var result = new Function(that.callback)();
			if(result === false){
				return false;
			}
		}
		a4pp(that);
	});
}

function goHome(){
	return triggerGoTo(null);
}

function triggerGoTo(whereToGo){
	
	whereToGo = whereToGo || "";
	
	var arr = whereToGo.split("/");
	
	if(arr.length===null){
		main();
		return 1;
	}
	
	var $item = window.app.items;
	
	var litem = window.app;
	
	for(var i=0;i<arr.length;i++){
		
		if($item[arr[i]] !== undefined){
			
			litem = $item[arr[i]];
			
			$item = $item[arr[i]].items;
			
		}
		
	}
	
	if(litem !== undefined){
	
		a4pp(litem);
	
		return 1;
	
	}
	
	return -1;
	
}

function triggerClickElement(indexof){

	console.log("triggered click:"+indexof);
	
	console.log(".content:last li:eq("+indexof+")");

	var elementx = $(".content:last li:eq("+indexof+")")[0];
	
	console.log(elementx);
	
	var clickEvent = new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancelable': true
	});
	 
	elementx.dispatchEvent(clickEvent);

}




var updBtn, btnMenu, appTitle, exitBtn;

//function bindings(){

	btnMenu = document.getElementById("btnMenu");

	appTitle = document.getElementById("appTitle");

	updBtn = document.getElementById("update");

	searchInput = document.getElementById("searchBox");

	btnMenu.addEventListener('click', function(){
		var ele = $(".content:last #dMenu .dropdown-menu");
		if(ele.is(":visible")){
			ele.css("display", "none");
		}else{
			ele.css("display", "inline-block");
		}
	});

	window.addEventListener("popstate", function(){

		var lista = document.querySelectorAll(".content");

		if(lista.length > 2){
			var remv = lista[lista.length-1];
			
			remv.parentNode.removeChild(remv);

			var act = lista[lista.length-2];

			if(hasClass(act, "has-menu")){

				btnMenu.style.display = "inline-block";

			}
			
		}else{
			return false;
		}
	});

	searchInput.onkeyup = function () {
	    var filter = searchInput.value.toUpperCase();
	    var lis = lastList.getElementsByTagName('li');
	    for (var i = 0; i < lis.length; i++) {
	        var name = lis[i].innerHTML;
	       //console.log(name.toUpperCase()+"!="+filter);
	        if (name.toUpperCase().indexOf(filter) > -1) 
	            lis[i].style.display = 'list-item';
	        else
	            lis[i].style.display = 'none';
	    }
	}

	appTitle.removeEventListener("mouseup");
	appTitle.addEventListener("mouseup", function(){
		history.back();
	});

	updBtn.addEventListener("click", function(){
		a4pp_update();
	});


document.addEventListener("deviceready", function(){
	document.addEventListener("backbutton", function(){
		if($(".content .dropdown-menu:last").is(":visible")){
			$(".content .dropdown-menu:last").hide();
			//alert("Fadeout dm");
			return false;
		}
		history.back();
		//alert("Not visible menu");
	});
	document.addEventListener("menubutton", function(){
		if($("#btnMenu").is(":visible")){
			//alert("Click btnMenu");
			btnMenu.click();
			return false;
		}else{
			if($(".content").length == 2){
				navigator.exitApp();
			}
		}
	});
	
	window.plugins.webintent.startActivity({
		action: window.plugins.webintent.ACTION_VIEW,
		url: 'geo:0,0?q=ciudad'},
		function() {},
		function() {alert('Failed to open URL via Android Intent')}
	);
}, true);


window.a4pp = function(data, auto){

	/* Variable declarations */

	var thatx = this;

	var title_less = ["login", "register"];

	var baseContent = document.getElementsByClassName("content")[0];

	var documentBody = document.getElementsByTagName("body")[0];

	var btnGoSearch = document.getElementById("goSearch");

	var search = document.getElementById("searchForm");

	var body = document.createElement("div");

	var iconSearch = document.getElementById("iconSearch");

	if(window.app.logged==true){
		updBtn.style.display = "inline-block";
	}else{
		updBtn.style.display = "none";
	}

	body.className = "content";

	body.classList.add("container");

	body.innerHTML = baseContent.innerHTML;

	search.style.display = "none";

	appTitle.style.display = "inline-block";

	searchInput.addEventListener("blur", function(){

		search.style.display = "none";

		appTitle.style.display = "inline-block";

	});

	iconSearch.className = "glyphicon glyphicon-search";

	document.title=data.title;

	btnGoSearch.removeEventListener('click');

	btnGoSearch.addEventListener('click', function(){
		if(onSearch==0){ 
			//body.className = body.className + " onSearch";
			search.style.display = "inline-block";
			iconSearch.className = "glyphicon glyphicon-remove";
			searchBox.focus();
			appTitle.style.display = "none";
			onSearch = 1;
		}else{
			//body.className = body.className.replace("onSearch", "");
			search.style.display = "none";
			appTitle.style.display = "inline-block";
			iconSearch.className = "glyphicon glyphicon-search";
			onSearch = 0;
		}
		return false;
	});

	if(init == 0){

		init = 1;

		var custom = document.createElement("style");

		var lcustom = document.getElementById("custom-style");

		if(typeof lcustom!= "undefined"){

			if(lcustom!=null){

				lcustom.parentNode.removeChild(lcustom);

			}

		}


		custom.id = "custom-style";

		custom.innerHTML = data.addCss;

		document.documentElement.appendChild(custom);

		var appTitleText = document.createElement("span");

		appTitleText.innerHTML = data.title;

		var rt = document.getElementsByClassName("rtitle");
		//console.log(rt);
		if(rt.length>0){
			for(var i =0; i<rt.length; i++){
				rt[i].parentNode.removeChild(rt[i]);	
			}
		}

		appTitleText.classList.add("rtitle");

		appTitle.appendChild(appTitleText);

		//setTimeout(function(){goTo("2/0");}, 500);

	
	}else{

		if(title_less.indexOf(data.model)===-1){

			var titlex = document.createTextNode(data.title);

			var h4 = document.createElement("h4");

			h4.appendChild(titlex);

			body.appendChild(h4);

		}
	
	}

	if(auto!="1"){
		history.pushState(data, data.title, "#"+data.xpath);
		count = Math.random();
	}

	switch(data.model){
		case "link":
			window.open(data.details, "_system");
			return false;
		break;
		case "listview":
		case "list":
			if(data.search==1){
				btnGoSearch.style.display = "inline-block";
			}else{
				btnGoSearch.style.display = "none";
			}
			if((data.model=="list")&&(typeof data.items != "undefined")){

				var list = document.createElement("ul");

				list.className = "model-list "+data.model;

				if(data.details!=""){
					var superior = document.createElement("div");
					superior.className="superior";
					superior.innerHTML = data.details;
					body.appendChild(superior);
				}

				if(data.items !== null){

					var items = data.items;
				
					for(var that=0;that<items.length;that++){
						var text;
						var item;
						var img;
						var currItem = items[that];
						item = document.createElement("li");
						text = document.createElement("span");
						text.innerHTML = currItem.title;
						if(currItem.model=='heading'){
							item.classList.add("heading");
						}
						item.classList.add("model-list-item");
						if(currItem.icon != null){
							//console.log(data.items[that].icon);
							img = document.createElement("img");
							img.src = currItem.icon;
							img.classList.add("icon");
							item.appendChild(img);
						}
						if((currItem.glyphicon != "none")&&(typeof currItem.glyphicon != "undefined")){
							dvicn = document.createElement("div");
							dvicn.classList.add("glyph");
							dvicn.style.backgroundColor = currItem.color;
							icn = document.createElement("span");
							icn.classList.add("glyphicon");
							icn.classList.add("glyphicon-"+currItem.glyphicon);
							dvicn.appendChild(icn);
							item.appendChild(dvicn);
						}
						if(currItem.hidden == true){
							item.classList.add("hidden");
						}
						item.appendChild(text);
						list.appendChild(item);
						//console.log(that);
						bindClick(item, currItem);
					}
				}
				//console.log(documentBody);
				body.appendChild(list);
				lastList = list;
			}
		break;
		case "login":

			var login_form = document.getElementById("login-form");

			body.innerHTML= body.innerHTML+login_form.innerHTML;
			body.classList.add("details");


		break;

		case "register":

			var login_form = document.getElementById("register-form");

			body.innerHTML= body.innerHTML+login_form.innerHTML;
			body.classList.add("details");


		break;

		case "details":
			iconSearch.style.display = "none";
			body.innerHTML= data.details;
			body.classList.add("details");
		break;
		
	}

	documentBody.appendChild(body);

	/**
	 *	App Menu
	 */
	 
	 if(data.menu === undefined){
		 data.menu = window.app.menu;
	 }


	if(data.menu.length == 0){
		data.menu = window.app.menu;
	}

	if(data.menu.length > 0){

		btnMenu.style.display = "inline-block";

		body.classList.add("has-menu");

		//console.log(data.menu);

		for(var c = 0; c<data.menu.length; c++){


			var x = document.createElement("li");
			var sf = document.createElement("a");

			sf.innerHTML = data.menu[c].title;

			sf.onclick = new Function(data.menu[c].onclick+"btnMenu.click();");

			x.appendChild(sf);

			body.id = Math.random();

			document.getElementById(body.id).getElementsByClassName("dropdown-menu")[0].appendChild(x);

		}

	}else{

		btnMenu.style.display = "none";

	}

}
function a4pp_close(){
	if(confirm(i("Deseja sair do aplicativo?", "Desea salir de la aplicacion?", "Do you want to quit the app?"))){
		navigator.app.exitApp();
	}
}

function addItem(data, title, type){
	var new_item = {"title":title, "model": type, "details":"http://google.com.br"};
	data.items.push(new_item);
}



var jquery = document.createElement("script");

jquery.id = "jquery";

jquery.src="js/jquery.min.js";

document.getElementsByTagName("head")[0].appendChild(jquery);

if(typeof window.app!="undefined"){
	var nl = new Function(window.app.runJS)();
}

