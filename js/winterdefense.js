var TileMap = function(map, ogam) {
    var tileMap = [];
    function tilify (tile, map, except) {

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
    }

    function filter(map) {
        for(var x = 0; x < map.length; x++) {
            for(var y = 0; y < map[0].length; y++) {
                var l = -1, r = -1, t = -1, b = -1;
                if(x > 0) {
                    l = map[x - 1][y];
                }
                if(x < map.length -1) {
                    r = map[x + 1][y];
                }
                if(y > 0) {
                    t = map[x][y - 1];
                }
                if(y < map[0].length -1) {
                    b = map[x][y + 1];
                }
                if(l === r && l !== map[x][y]) {
                    map[x][y] = l;
                }
                if(t === b && t !== map[x][y]) {
                    map[x][y] = t;
                }
            }
        }
        return map;
    }
    map = filter(map);
    tilify(3, map, 2);
    tilify(2, map, 1);
    tilify(1, map, 0);
    tilify(0, map, 0);

    var cache = document.createElement("canvas"),
        cacheContext = cache.getContext("2d");

    cache.width = ogam.canvas.width;
    cache.height = ogam.canvas.height;
    for(var x = 0; x < 25; x++) {
        for(var y = 0; y < 18; y++) {
            var pos = ogam.pixel(x, y);
            cacheContext.drawImage.apply(cacheContext, ogam.tileArgs(tileMap[x][y], ogam.images.terrain, {X: x, Y: y}));
        }
    }

    var tMap = {
        draw: function() {
            ogam.context.drawImage(cache, 0, 0);
        }
    };

    return tMap;
};

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

var level = {
    in: {X: 0, Y: 9},
    out: {X: 24, Y: 9}
};

function Creeper(ogam, image, collisionMap, hp) {
    var angle = 0,
        lastUpdate = 0,
        dead = false,
        msPerTile = 500,
        path = astar.path(collisionMap, level.in, level.out),
        position = level.in,
        tile = ogam.pixel(level.in),
        creep = {
        distance: function(pos) {
            var xdiff = Math.abs(pos.X - tile.X),
                ydiff = Math.abs(pos.Y - tile.Y);
            return Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
        },
        angle: function(pos) {
            return Math.atan2((position.X - pos.X), (pos.Y - position.Y));
        },
        draw: function() {
            ogam.context.drawImage(image, position.X - 16, position.Y - (image.height - 16));
        },
        update: function() {
            var now = Date.now(),
                diff = now - lastUpdate;
            if(diff > msPerTile && path.length > 0) {
                lastUpdate = now;
                tile = path.shift();
                if(path.length > 0 && collisionMap[path[0].X][path[0].Y] < 0) {
                    path = astar.path(collisionMap, tile, level.out);
                }
                position = ogam.pixel(tile);
            } else {
                if(path.length > 0) {
                    var xd = path[0].X - tile.X,
                        yd = path[0].Y - tile.Y,
                        frac = diff / msPerTile;
                    position = ogam.pixel(tile);
                    position.X += xd * 32 * frac;
                    position.Y += yd * 32 * frac;

                }
            }
            if (tile.X === level.out.X &&
                tile.Y === level.out.Y &&
                !dead) {
                //score for the bad guys
                creep.fire("escape");
                dead = true;
            }

            if(hp < 0) {
                creep.fire("death");
                dead = true;
            }
            return !dead;
        }
    };
    ogam.events.attach(creep);
    return creep;
}

function Tower(ogam, image, tile, game, hp) {
    var angle = 0,
        lastUpdate = 0,
        dead = false,
        loadTime = 500,
        range = 4,
        target = null,
        position = ogam.pixel(tile),
        tower = {
        kill: function() {
            dead = true;
            game.collisionMap[tile.X][tile.Y] = 0;
        },
        draw: function() {
            ogam.context.save();
            ogam.context.translate(position.X, position.Y);
            ogam.context.rotate(angle);
            ogam.context.drawImage(image, -16, -16);
            ogam.context.restore();
        },
        update: function() {
            var now = Date.now(),
                diff = now - lastUpdate;
            if(diff > loadTime) {
                lastUpdate = now;
                //fire snowball
            }
            //take aim
            for(var i = 0; i < game.creepers.length; i++) {
                if(game.creepers[i].distance(tile) < range) {
                    target = game.creepers[i];
                }
            }
            if(target) {
                angle = target.angle(position);
            }
            return !dead;
        }
    };
    game.collisionMap[tile.X][tile.Y] = -1;
    ogam.events.attach(tower);
    return tower;
}

window.addEventListener("load", function() {
	var ogam = Ogam(),
		game = {
            lives: 10,
            creepers: [],
            towers: [],
            init: function(){
                game.creepers = [];
                setInterval(function(){
                    var c = Creeper(ogam, ogam.images.snowman, game.collisionMap, 10);
                    c.on("escape", function() {
                        game.lives--;
                        game.killCreeper(c);
                    });
                    game.creepers.push(c);

                }, 1000);
                ogam.on("click", function(mouse) {
                    var mouseTile = ogam.tile(mouse);
                    var t = Tower(ogam, ogam.images.snowtower, mouseTile, game, 100);
                    var path = astar.path(game.collisionMap, level.in, level.out);
                    if(path.length > 0) {
                        game.towers.push(t);
                    } else {
                        t.kill();
                    }

                });
            },
            killCreeper: function(creeper) {
                for(var i = game.creepers.length -1; i >= 0; --i) {
                    if(game.creepers[i] === creeper) {
                        return game.creepers.splice(i, 1);
                    }
                }
            },
            clear: function(){},
            run: function() {
                game.map.draw();

                for(var i = game.towers.length -1; i >= 0; --i) {
                    if(game.towers[i].update()) {
                        game.towers[i].draw();
                    }
                }
                for(var i = game.creepers.length -1; i >= 0; --i) {
                    if(game.creepers[i].update()) {
                        game.creepers[i].draw();
                    }
                }
                ogam.context.font = "35px Arial";
                ogam.context.fillStyle = "red";
                ogam.context.strokeStyle = "black";
                for(i = 0; i < game.lives; i++) {
                    ogam.context.fillText("❤", 10 + i * 30, 30);
                    ogam.context.strokeText("❤", 10 + i * 30, 30);
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
        var map, valid = false;
        while(!valid) {
            map = ogam.noiseMap(25, 18, 20, 4);
            game.collisionMap = (function() {
                var m = [];
                for(var x = 0; x < map.length; x++) {
                    m[x] = [];
                    for(var y = 0; y < map[0].length; y++) {
                        m[x][y] = map[x][y] === 0 ? -1 : 0;
                    }
                }
                return m;
            }());
            var path = astar.path(game.collisionMap, level.in, level.out);
            if(path.length > 0) {
                valid = true;
            }
        }
		game.map = TileMap(map, ogam);
        ogam.state = menu;
	});
	ogam.loader.load({  "terrain" : "images/winterwonderland.png",
                        "background": "images/menu.png",
                        "button": "images/button.png",
                        "snowman": "images/snowman.png",
                        "snowball": "images/snowball32.png",
                        "snowtower": "images/snowtower.png" });
});