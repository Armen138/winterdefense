define(["easing"], function(easing) {
	var menuSize = {W: 200, H: 200},
		duration = 500;

	return function(canvas, menu, tooltip, position) {		
		var width = 0,
			height = 0,
			start = 0,
			context = canvas.getContext("2d"),
			target = menuSize,
			active = false,
			box = {
			tooltip: tooltip,
			click: function(mouse) {
				if(active && width > 0 && height > 0) {
					if (mouse.X > position.X - width / 2 &&
						mouse.X < position.X + width / 2 &&
						mouse.Y > position.Y - height / 2 &&
						mouse.Y < position.Y + height / 2) {
						//hit
						return true;
					} else {
						box.close();
					}
					return false;
				}
			},
			run: function() {
				if(!active && width === 0) return;
				
				var now = Date.now() - start;
				if(now < duration) {
					width = easing(now, source.W, target.W, duration) | 0;
					height = easing(now, source.H, target.H, duration) | 0;					
				} else {
					width = source.W + target.W;
					height = source.H + target.H;
				}
				context.save();
				context.fillStyle = "rgba(0, 0, 0, 0.7)";
				context.strokeStyle = "black";
				context.font = "12px Arial";
				context.fillRect(position.X - width / 2, position.Y - height / 2, width, height);
				context.strokeRect(position.X - width / 2, position.Y - height / 2, width, height);
				if(box.tooltip) {
					context.fillStyle = "white";
					context.textBaseline = "hanging";
					tooltips = box.tooltip.split("|");					
					for(var i = 0; i < tooltips.length; i++) {
						context.fillText(tooltips[i], position.X - width /2 + 10, position.Y - height / 2 + 10 + i * 16);	
					}					
				}
				context.restore();
			},
			open: function() {
				width = 0;
				height = 0;
				start = Date.now();
				source = {W: 0, H: 0};
				target = menuSize;
				active = true;
			},
			close: function() {
				console.log("box close");
				width = menuSize.W;
				height = menuSize.H;
				start = Date.now();
				source = menuSize;
				target = {W: -menuSize.W, H: -menuSize.H};
				active = false;
			}
		};
		return box;
	};
});