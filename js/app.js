function main(){
	init = 0;
	if(typeof window.localStorage['data']!= "undefined"){
		window.app = JSON.parse(window.localStorage['data']);
	}else{
		window.app = appo;
	}
	window.a4pp(window.app);
}
setTimeout(function(){
	main();
	setTimeout(function(){
		if(window.app.logged==true){
			a4pp_update();
		}
	},1000);
}, 600);