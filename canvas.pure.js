function Container(){
	this.x = 0;
	this.y = 0;
	this.width  = PIXI.width;
	this.height = PIXI.height;
	this.children = [];

	this.anchor = {
		x : 0,
		y : 0,
		set : function(x, y){
			this.x = x;
			this.y = y;
		}
	};

	this.mask = false;

	this.scale = {
		x : 1,
		y : 1,
		set : function(x, y){
			this.x = x;

			if(!y){
				this.y = x;
			}else{
				this.y = y;
			}
		}
	};

	this.addChild = function(object){
		this.children.push(object);
	};

	this.$update = function(){
		PIXI.context.save();
		PIXI.context.globalAlpha = this.alpha;
		/*
		var $x = PIXI.calculatePosition(this.width, this.anchor.x);
		var $y = PIXI.calculatePosition(this.height, this.anchor.y);

		PIXI.context.translate($x, $y);
		PIXI.context.scale(this.scale.x, this.scale.y);
		*/
		PIXI.context.scale(this.scale.x, this.scale.y);
		PIXI.context.translate(this.x, this.y);

		var i = 0;
		while(i<this.children.length){
			var object = this.children[i];

			if(this.children[i+1] == this.mask){
				this.mask.$clip();
				object.$update(true);
				i+=2;
			}else{
				object.$update();
				i++;
			}
		}

		PIXI.context.restore();
	};

	return this;
};

function _Sprite(image){
	this.image = image;

	this.anchor = {
		x : 0,
		y : 0,
		set : function(x, y){
			this.x = x;
			this.y = y;
		}
	};

	this.scale = {
		x : 1,
		y : 1,
		set : function(x, y){
			this.x = x;

			if(!y){
				this.y = x;
			}else{
				this.y = y;
			}
		}
	}

	this.x = 0;
	this.y = 0;
	this.width  = this.image.width;
	this.height = this.image.height;
	this.children = [];
	this.alpha = 1;

	this.$update = function(clip){
		if(clip){
			PIXI.context.globalCompositeOperation = "source-over";
		}else{
			PIXI.context.save();
		}

		PIXI.context.globalAlpha = this.alpha;
		PIXI.context.translate(this.x, this.y);

		var $x = PIXI.calculatePosition(this.image.width, this.anchor.x);
		var $y = PIXI.calculatePosition(this.image.height, this.anchor.y);

		//PIXI.context.translate($x, $y);
		PIXI.context.scale(this.scale.x, this.scale.y);

		if(this.image.naturalWidth === 0){
		}else{
			PIXI.context.drawImage(this.image, -$x, -$y);	
		}
		
		PIXI.context.restore();
	};

	return this;
};

function Graphics(){
	this.x = 0;
	this.y = 0;
	this.width  = 0;
	this.height = 0;
	this.alpha  = 1;
	this.children = [];

	this.addChild = function(object){
		this.children.push(object);
	};

	this.beginFill = function(color){
		this.color = color ? color : 'black';
	};

	this.endFill = function(color){
		
	};

	this.drawRect = function(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width  = width;
		this.height = height;
	};

	this.scale = {
		x : 1,
		y : 1,
		set : function(x, y){
			this.x = x;
			this.y = y;
		}
	};

	this.$clip = function(){
		PIXI.context.save();
		PIXI.context.scale(this.scale.x, this.scale.y);

		PIXI.context.globalAlpha = this.alpha;
		PIXI.context.beginPath();

		PIXI.context.rect(this.x, this.y, this.width, this.height);
		/*
		PIXI.context.fillStyle = this.color;
		PIXI.context.fill();
		*/

		PIXI.context.globalCompositeOperation = "destination-over";
		PIXI.context.clip();
		//PIXI.context.restore();
	}

	this.$update = function(){
		PIXI.context.save();
		PIXI.context.scale(this.scale.x, this.scale.y);

		PIXI.context.globalAlpha = this.alpha;
		PIXI.context.beginPath();

		PIXI.context.rect(this.x, this.y, this.width, this.height);
		PIXI.context.fillStyle = this.color;
		PIXI.context.fill();
		PIXI.context.restore();
	};

	return this;
};

var PIXI = {
	width  : 0,
	height : 0,
	view   : null,
	context : null,
	Application : function(options){
		this.width  = options.width;
		this.height = options.height;

		this.view = document.createElement('canvas');
		this.context = this.view.getContext('2d');
		PIXI.context = this.context;

		this.timestamp = 0;
		this.nodes = [];
		this.ticker = {
			callback : function(){},
			add : function(callback){
				this.callback = callback;
			}
		};

		this.render = function(){
			if(this.context){
				this.context.clearRect(0, 0, this.width, this.height);	
				this.$update();
			}

			window.requestAnimationFrame(this.render.bind(this));
		};

		this.$update = function(){
			this.timestamp++;
			this.ticker.callback();

			for(var nodeIndex in this.nodes){
				var node = this.nodes[nodeIndex];

				node.$update();
			}
		}

		this.view.width  = this.width;
		this.view.height = this.height;

		this.stage = new PIXI.Container();
		this.nodes.push(this.stage);

		this.render();

		return this;
	},
	Sprite : {
		fromImage : function(src){
			var image = new Image();
			image.src = src;
			image.onload = function(){

			}

			return new _Sprite(image);
		}
	},
	calculatePosition : function(value, anchor){
		return anchor * value;
	},
	Container : Container,
	Graphics : Graphics,
}