define(["easing"], function(easing) {
	var menuSize = {W: 150, H: 180},
		duration = 1000;

	return function(canvas, menu, tooltip, desiredPosition) {		
		var width = 0,
			position = {X: desiredPosition.X, Y: desiredPosition.Y},
			height = 0,
			start = 0,
			context = canvas.getContext("2d"),
			target = menuSize,
			active = false,
			hitButtons = function(mouse) {
				if(!box.menu) return;
				var relmouse = { X: mouse.X - (position.X - width / 2), Y: mouse.Y - (position.Y - height / 2) };
				for(var i = 0; i < box.menu.length; i++) {
					var top = menuSize.H - (box.menu.length * 30) + (i * 30);
					if (relmouse.X > 0 && relmouse.X < menuSize.W &&
						relmouse.Y > top && relmouse.Y < top + 30) {
						if(box.menu[i].action && !box.menu[i].disabled) {
							box.menu[i].action();
							box.close();
							return;
						}
					}
				}
			},
			box = {
			menu: menu,
			tooltip: tooltip,
			click: function(mouse) {
				if(active && width > 0 && height > 0) {
					if (mouse.X > position.X - width / 2 &&
						mouse.X < position.X + width / 2 &&
						mouse.Y > position.Y - height / 2 &&
						mouse.Y < position.Y + height / 2) {
						//hit
						hitButtons(mouse);
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
				context.font = "bold 12px Arial";
				context.translate(position.X - width / 2, position.Y - height / 2);
				context.fillRect(0, 0, width, height);
				context.strokeRect(0, 0, width, height);
				if(now > duration && target.W > 0) {
					if(box.tooltip) {
						context.fillStyle = "yellow";
						context.textBaseline = "hanging";
						tooltips = box.tooltip.split("|");					
						for(var i = 0; i < tooltips.length; i++) {
							context.fillText(tooltips[i], 10, 10 + i * 16);	
							context.fillStyle = "white";
							context.font = "12px Arial";
						}					
					}

					if(menu) {
						context.font = "18px Arial";						
						for(var i = 0; i < box.menu.length; i++) {
							context.fillStyle = "rgba(0, 0, 0, 0.3)";
							var top = menuSize.H - (box.menu.length * 30) + (i * 30);
							context.fillRect(0, top, menuSize.W, 30);
							context.strokeRect(0, top, menuSize.W, 30);
							if(box.menu[i].icon) {
								context.drawImage(box.menu[i].icon, 0, 0, box.menu[i].icon.width, box.menu[i].icon.height, 10, top + 6, 20, 20);
							}
							if(box.menu[i].label) {
								if(box.menu[i].disabled) {
									context.fillStyle = "red";
								} else {
									context.fillStyle = "white";
								}
								context.fillText(box.menu[i].label, 40, top + 6);
							}
						}
					}					
				}
				context.restore();
			},
			open: function() {
				if(active) return;
				width = 0;
				height = 0;
				start = Date.now();
				source = {W: 0, H: 0};
				target = menuSize;
				active = true;
				if(position.X - menuSize.W / 2 < 0) {
					position.X = menuSize.W / 2;
				}
				if(position.Y - menuSize.Y / 2 < 0) {
					position.Y = menuSize.H / 2;
				}
				if(position.X + menuSize.W / 2 > canvas.width) {
					position.X = canvas.width - menuSize.W / 2;
				}
				if(position.Y + menuSize.H / 2 > canvas.height) {
					position.Y = canvas.height - menuSize.H / 2;
				}
			},
			close: function() {
				if(!active) return;
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