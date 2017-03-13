var pic = document.getElementById('vimage');
var start = document.getElementById('start');
var clear = document.getElementById('clear');
var bound = pic.getBoundingClientRect();
var intervalID = null;

var makeCircle = function(x,y,r){
	var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	dot.setAttribute("cx", x);
	dot.setAttribute("cy", y);
	dot.setAttribute("dx", 2);
	dot.setAttribute("dy", 2);
	dot.setAttribute("r", r);
	dot.setAttribute("fill", "blue");
	dot.setAttribute("stroke", "blue");
	dot.addEventListener("click", command);
	return dot;
};

var addCircle = function(e){
	x = event.clientX - 10;
	y = event.clientY - 10;
	var cir = makeCircle(x,y,20);
	pic.appendChild(cir);
}

var addCircleR = function(x,y,r){
	var cir = makeCircle(x,y,r);
	pic.appendChild(cir);
}

var command = function(e){
	var color = this.getAttribute("fill");

	if (color == "blue"){
		console.log("passed the color inspecction");
		this.setAttribute("fill", "green");
		this.setAttribute("stroke", "green");
	}

	else{
		this.parentNode.removeChild(this);
		var x,y;
		x = Math.random() * (bound.width - 30) + 15;
		y = Math.random() * (bound.height - 30) + 15;

		addCircleR(x,y,20);
	}
	e.stopPropagation();
};

var animate = function(e){
	window.clearInterval(intervalID);
	var c = pic.children;
	var line = Math.random() * 100 + 200; 
	var scramble = function(){
		for(var i = 0; i < c.length; i++){
			var cir = c[i];
			var x,y,dx,dy,r;
			x = parseInt(cir.getAttribute("cx"));
			y = parseInt(cir.getAttribute("cy"));

			dx = parseInt(cir.getAttribute("dx"));
			dy = parseInt(cir.getAttribute("dy"));

			r = parseInt(cir.getAttribute("r"));

			if (r < 2){
				pic.removeChild(cir);
			}

			if ((x <= 15) || (x >= bound.width - 15))
				dx *= -1;
			if ((y <= 15) || (y >= bound.height - 15))
				dy *= -1;

			x += dx;
			y += dy;

			cir.setAttribute("cx", x);
			cir.setAttribute("cy", y);
			cir.setAttribute("dx", dx);
			cir.setAttribute("dy", dy);

			//notes of reference for line:
			//dy > 0 down dir
			//dy < 0 up dir

			//the left top corner is x = 0, y = 0
			//as x increases, the dots move right
			//as y increases, the dots move down

			//line - (dy / 2) is the line (dy / 2) above the actual line
			//line + (dy / 2) is the line (dy / 2) below the actual line

			//it can be dy/# but 2 is more convenient. tried 4 and that only worked 80% of the time
			//as # increases, it gets harder and harder to hit the small bound bc dy is an integer and dy/# is not

			//the following if statement essentially sets a bound for the dot to split. if its within +- (dy / #) of the line then split and make new dot
			 if ((dy > 0 && y > line - (dy / 2) && y < line + (dy / 2)) || (dy < 0 && y < line - (dy / 2) && y > line + (dy / 2))){
				r = r/2;
				cir.setAttribute("r", r);

				var nc = makeCircle(x,y,r);
				nc.setAttribute("dy", dy * -1);
				pic.appendChild(nc);
			}
		}
	};
	intervalID = window.setInterval(scramble, 10);
};

var stopit = function(e){
	window.clearInterval(intervalID);
};

var blanc = function(e){
	//stopit(e);
	while (pic.childNodes.length > 0){
		pic.removeChild(pic.childNodes[0]);
	}
};
pic.addEventListener('click', addCircle);
clear.addEventListener('click', blanc)
start.addEventListener('click', animate)