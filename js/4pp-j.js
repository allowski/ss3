var init = 0;
var count = 0;
var onSearch = 0;

jQuery.expr[":"].xcontains = jQuery.expr.createPseudo(function(arg) {
    return function( elem ) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

$.fn.a4pp = function(data, auto){
	var thatx = this;

	var body = $("<div>").addClass('content');

	document.title=data.title;

	if(init == 0){
		init = 1;
		$("#goHome").on("click", function(e){
			e.preventDefault();
			$(this).a4pp(data);
		});
		$("#goSearch").on("click", function(e){
			e.preventDefault();
			if(onSearch==0){
				$("#searchForm").show();
				$(".content").addClass("onSearch");
				$("#searchBox").focus();
				onSearch = 1;
			}else{
				$("#searchForm").hide();
				$(".content").removeClass("onSearch");
				onSearch = 0;
			}
		});
		$("#searchBox").on("keydown", function(){
			$("body").find(".model-list-item").show();
			$("body").find(".model-list-item:not(:xcontains("+$(this).val()+"))").hide();
		});
		$("#backButton").on("click", function(){
			if($(".content").length > 2){
				history.back();
			}
			var that = this;
			$(this).addClass("hover");
			setTimeout(function(){
				$(that).removeClass("hover");
			}, 300);
		});
		$(window).on("popstate", function(e){
			if($(".content").length > 2){
				$(".content:last").remove();
			}else{
				e.preventDefault();
			}
		});


		$("#appTitle").text(data.title);
	
	}else{

		body.append("<h4 class='list-title'>"+data.title+"</h4>");
	
	}

	if(auto!="1"){
		history.pushState(data, data.title, "#test"+count);
		console.log("pushState: "+ data.title);
		count = Math.random();
	}

	$("#goSearch,#searchForm").hide();

	switch(data.model){
		case "list":
			$("#goSearch").show();
			if((data.model=="list")&&(typeof data.items != "undefined")){
				var list = $("<ul>").addClass("model-list");
				var item;
				list.appendTo(body);
				$.each(data.items, function(k, v){
					var that = this;
					item = $("<li>").addClass("model-list-item").text(this.title);
					if(typeof that.icon != "undefined"){
						item.prepend("<img src='"+that.icon+"'>");
					}
					item.appendTo(list);
					item.on("click", function(){
						$(thatx).a4pp(that);
					});
				});
			}
		break;
		case "details":
			if(data.model=="details"){
				body.append(data.details);
			}
		break;
		case "listview":
			if((data.model=="listview")&&(typeof data.items != "undefined")){
				var listOuter = $("<div>").addClass("model-listview");
				var list = $("<div>").addClass("model-listview-inner");
				var item;

				listOuter.appendTo(body);
				list.appendTo(listOuter);
				$.each(data.items, function(k, v){
					var that = this;
					var itemInner = $("<div>").addClass("model-listview-item-inner");
					item = $("<div>").addClass("model-listview-item");
					itemInner.text(this.title);
					if(typeof that.icon != "undefined"){
						itemInner.prepend("<div class='icon'><img src='"+that.icon+"'></div>");
					}
					itemInner.appendTo(item);
					item.appendTo(list);
					item.on("click", function(){
						$(this).off("click");
						$(thatx).a4pp(that);
					});
				});

			}
		break;
	}

	body.appendTo("body");

	if(typeof data.callback != "undefined"){
		eval(data.callback);
		//var inpt = $("<input>").val(data.callback).appendTo(".content");

		//eval(inpt.val());
	}
}
