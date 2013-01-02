function tilify (tile, tileMap, map, except) {

    function leftOf(x, y, tiles) {
        if(x > 0) {
            return (map[x -1][y] == tiles[0] ||
                    map[x -1][y] == tiles[1]);
        }
        return true;
    }
    function rightOf(x, y, tiles) {
        if(x < map.length - 1) {
            return (map[x  + 1][y] == tiles[0] ||
                    map[x  + 1][y] == tiles[1]);
        }
        return true;
    }
    function above(x, y, tiles) {
        if(y > 0) {
            return (map[x][y - 1] == tiles[0] ||
                    map[x][y - 1] == tiles[1]);
        }
        return true;
    }
    function below(x, y, tiles) {
        if(y < map[0].length -1) {
            return (map[x][y + 1] == tiles[0] ||
                    map[x][y + 1] == tiles[1]);
        }
        return true;
    }
    function aboveRight(x, y, tiles) {
        if(x < map.length -1 && y > 0) {
            return (map[x + 1][y - 1] == tiles[0] ||
                    map[x + 1][y - 1] == tiles[1]);
        }
        return true;
    }
    function aboveLeft(x, y, tiles) {
        if(x > 0 && y > 0) {
            return (map[x - 1][y - 1] == tiles[0] ||
                    map[x - 1][y - 1] == tiles[1]);
        }
        return true;
    }
    function belowRight(x, y, tiles) {
        if(x < map.length -1 && y < map[0].length -1) {
            return (map[x + 1][y + 1] == tiles[0] ||
                    map[x + 1][y + 1] == tiles[1]);
        }
        return true;
    }
    function belowLeft(x, y, tiles) {
        if(x > 0 && y < map[0].length -1) {
            return (map[x - 1][y + 1] == tiles[0] ||
                    map[x - 1][y + 1] == tiles[1]);
        }
        return true;
    }
    var baseTile = tile * 14;
    for(var tx = 0; tx < map.length; tx++) {
        if(!tileMap[tx]) {
            tileMap[tx] = [];
        }
        for(var ty = 0; ty < map[0].length; ty++) {
            //tileMap[tx][ty] = tile;
            if(tile === map[tx][ty]) {
                tileMap[tx][ty] = baseTile + 4;
                if (!rightOf(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 5;
                }
                if (!leftOf(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 3;
                }
                if (!above(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 1;
                }
                if (!below(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 7;
                }
                if (!rightOf(tx, ty, [tile, except]) &&
                    !above(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 2;
                }
                if (!leftOf(tx, ty, [tile, except]) &&
                    !below(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 6;
                }
                if (!rightOf(tx, ty, [tile, except]) &&
                    !below(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 8;
                }
                if (!leftOf(tx, ty, [tile, except]) &&
                    !above(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile;
                }
                if (leftOf(tx, ty, [tile, except]) &&
                    above(tx, ty, [tile, except]) &&
                    !aboveLeft(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 9;
                }
                if (rightOf(tx, ty, [tile, except]) &&
                    above(tx, ty, [tile, except]) &&
                    !aboveRight(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 10;
                }
                if (rightOf(tx, ty, [tile, except]) &&
                    below(tx, ty, [tile, except]) &&
                    !belowRight(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 12;
                }
                if (leftOf(tx, ty, [tile, except]) &&
                    below(tx, ty, [tile, except]) &&
                    !belowLeft(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 11;
                }
            } else {
                if(!tileMap[tx][ty]) {
                    tileMap[tx][ty] = baseTile;
                }
            }
        }
    }
    return tileMap;
}

var Button = function(text, image, pos, ogam) {
    var context = ogam.context;
    context.font = "30px Arial";
    var size = context.measureText(text);
    var realPos = {X: pos.X - image.width / 2, Y: pos.Y - image.height / 2};
    var hovering = false;
    function over() {
        return (ogam.mouse.X > realPos.X &&
                ogam.mouse.X < realPos.X + image.width &&
                ogam.mouse.Y > realPos.Y &&
                ogam.mouse.Y < realPos.Y + image.height);
    }
    var button = {
        draw: function() {
            context.save();
            var h = over();
            if(h) {
                button.fire("hover");
            }
            if(h && !hovering) {
                button.fire("over");
            }
            if(!h && hovering) {
                button.fire("out");
            }
            hovering = h;
            if(!hovering) {
                context.globalAlpha = 0.5;
            }
            context.font = "30px Arial";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.drawImage(image, pos.X - image.width / 2, pos.Y - image.height / 2);
            context.fillText(text, pos.X, pos.Y);
            context.restore();
        },
        clear: function() {
            //remove event listeners
            ogam.remove("click", clicked);
        }
    };
    function clicked() {
        if(over()) {
            button.fire("click");
        }
    }
    ogam.on("click", clicked);
    ogam.events.attach(button);
    return button;
};

window.addEventListener("load", function() {
	var ogam = Ogam(),
		game = {
            init: function(){},
            clear: function(){},
            run: function() {
                for(var x = 0; x < 25; x++) {
                    for(var y = 0; y < 18; y++) {
                        var pos = ogam.pixel(x, y);
                        ogam.context.drawImage.apply(ogam.context, ogam.tileArgs(game.tileMap[x][y], ogam.images.terrain, {X: x, Y: y}));
                    }
                }
            }
		},
        menu = {
            init: function(){
                var x = 450,
                    y = 250;
                menu.items = [
                    Button("play", ogam.images.button, {X: x, Y: y}, ogam).on("click", function() { ogam.state = game; }),
                    Button("credits", ogam.images.button, {X: x, Y: y + 70}, ogam).on("click", function() { ogam.state = credits;})
                ];
            },
            clear: function(){
                for(var i = 0; i < menu.items.length; i++) {
                    menu.items[i].clear();
                }
                delete menu.items;
            },
            run: function() {
                ogam.context.drawImage(ogam.images.background, 0, 0);
                for(var i = 0; i < menu.items.length; i++) {
                    menu.items[i].draw();
                }
            }
        },
        credits = {
            back: function() {
                ogam.state = menu;
            },
            init: function() {
                ogam.on("click", credits.back);
            },
            clear: function() {
                ogam.remove("click", credits.back);
            },
            run: function() {
                ogam.context.drawImage(ogam.images.background, 0, 0);
                ogam.context.font = "20px Arial";
                ogam.context.fillStyle = "black";
                ogam.context.textAlign = "center";
                ogam.context.textBaseline = "middle";
                ogam.context.fillText("A #1GAM Game by @Armen138", 450, 250);
                ogam.context.fillText("Terrain tiles from lostgarden.com", 450, 300);
            }
        };
	ogam.loader.on("load", function() {
		game.map = ogam.noiseMap(25, 18, 20, 4);
		game.tileMap = [];
        tilify(3, game.tileMap, game.map, 2);
        tilify(2, game.tileMap, game.map, 1);
        tilify(1, game.tileMap, game.map, 0);
        tilify(0, game.tileMap, game.map, 0);
        ogam.state = menu;
	});
	ogam.loader.load({  "terrain" : "images/winterwonderland.png",
                        "background": "images/menu.png",
                        "button": "images/button.png" });
});