require(["ogam", "astar", "audio", "effects", "creepers", "tower", "paused", "../particlus/ParticleSystem"], function(ogam, astar, racket, effects, creeps, towers, Paused, PS) {
    var makeWaves = function() {
        return [
            [ 
                "small", "small","small", "small","small", "small","small", "small","small", "small","small", "small","small", "small","small", "small"
            ],
            [
                "big", "big", "big", "big", "big", "big", "big"
            ],
            [
                "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", 
                "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small", "small",             
                "small", "small", "small", "big", "big", "big"
            ],
            [
                "big", "big", "big", "boss", "boss"
            ]
        ];
    };

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
                //ogam.remove("click", clicked);
            },
            click: function(mouse) {
                return click();
            }
        };
        function click() {
            if(over()) {
                button.fire("click");
                return true;
            }
            return false;
        }
        //ogam.on("click", clicked);
        ogam.events.attach(button);
        return button;
    };

    var level = {
        in: {X: 0, Y: 9},
        out: {X: 24, Y: 9}
    };


    var Menus = function() {
        var home =  {
                        label: "Menu",
                        icon: ogam.images.snowflake,
                        action: function() {
                            game.restart();
                            ogam.state = game.menus.menu;
                        }
                    },
            mute = { 
                        label: "Mute", 
                        icon: ogam.images.sound,
                        action: function() {
                            game.mute();
                            if(mute.label === "Mute") {
                                mute.label = "Unmute";    
                            } else {
                                mute.label = "Mute";
                            }
                            
                        }
                    };

        return {
            paused: Paused(ogam.canvas, [
                    {
                        label: "Resume",
                        icon: ogam.images.button_square,
                        action: function() {
                            ogam.state = game;
                        }
                    },
                    {
                        label: "Restart",
                        icon: ogam.images.restart,
                        action: function() {
                            game.restart();
                            ogam.state = game;
                        }
                    },
                    home,
                    mute,
                ]),
            gameover: Paused(ogam.canvas, [
                {
                    label: "Restart",
                    icon: ogam.images.restart,
                    action: function() {
                        game.restart();
                        ogam.state = game;
                        console.log(ogam.images.restart);
                    }
                },
                home
            ], ogam.images.gameover),        
            menu: Paused(ogam.canvas, [
                {
                    label: "Play",
                    icon: ogam.images.button_square,
                    action: function() {
                        ogam.state = game;
                    }
                },                     
                {
                    label: "Credits",
                    icon: ogam.images.scroll,
                    action: function() {
                        ogam.state = credits;
                    }
                }
            ], ogam.images.title)          
        };
    }
    var game = {
            explosions: [],
            lives: 10,
            creepers: [],
            towers: [],
            projectiles: [],
            credits: 200,
            lastSpawn: 0,
            creeperDelay: 5000,
            tower: -1,
            wave: 0,
            waves: makeWaves(),
            muted: localStorage.mute ? localStorage.mute === "1" : false,
            play: function(name) {
                if(!game.muted) {
                    game.sound[name].play();
                }
            },
            mute: function() {
                game.muted = !game.muted;
                localStorage.mute = game.muted ? "1" : "0";
            },
            restart: function() {
                game.projectiles = [];
                game.creepers = [];
                game.credits = 200;
                game.lastSpawn = Date.now();
                game.towers = [];
                game.lives = 10;
                game.explosions = [];
                game.wave = 0;
                game.waves = makeWaves();
            },
            spawner: function() {
                if(game.wave > game.waves.length -1) { return ; }
                if(game.waves[game.wave].length === 0 && game.creepers.length !== 0) {
                    game.creeperDelay = 100;
                    return;
                }
                if(game.waves[game.wave].length > 0) {
                    var current = game.waves[game.wave].shift();
                    var c = creeps.Creeper(ogam, game, creeps.definitions[current]);//(ogam, ogam.images.snowmanhop, game.collisionMap, 100, game);
                    game.creeperDelay = creeps.definitions[current].delay;
                    c.on("escape", function() {
                        game.lives--;
                        game.killCreeper(c);
                    });
                    game.creepers.push(c);                    
                }
                if(game.waves[game.wave].length === 0 && game.creepers.length === 0) {
                    game.wave++;
                    game.creeperDelay = 5000;
                }                
            },
            click: function(mouse) {
                var clicked = false;
                for(var i = 0; i < game.towerbuttons.length; i++) {
                    clicked = game.towerbuttons[i].click(mouse);
                    if(clicked) break;
                }
                if(!clicked) {
                    for(var i = 0; i < game.towers.length; i++) {
                        clicked = game.towers[i].click(mouse);
                        if(clicked) break;
                    }                    
                }
                if(!clicked) {
                    game.build(mouse);
                }                
            },
            build: function(mouse) {                
                var mouseTile = ogam.tile(ogam.mouse);
                if ((game.credits < 75) ||
                    (game.tower === -1) ||
                    (mouseTile.X < 25 && mouseTile.Y < 18 && mouseTile.X > 0 && mouseTile.Y > 0 && game.collisionMap[mouseTile.X][mouseTile.Y] !== 0)) {
                    game.play("error");
                  return;  
                } 
                var current = game.tower
                var t = towers.Tower(ogam, game, mouseTile, towers.definitions[current]);
                var path = astar.path(game.collisionMap, level.in, level.out);
                if(path.length > 0) {
                    game.towers.push(t);
                    game.credits -= 75;
                    t.on("click", function() {
                        t.levelUp();
                    });
                } else {
                    t.kill();
                }
                game.tower = -1;
            },
            init: function(){
                if(game.menus.paused.time > 0) {
                    game.lastSpawn += game.menus.paused.time;
                    game.menus.paused.time = 0;
                } else {
                    game.lastSpawn = Date.now();
                }
                game.towerbuttons = [
                    Button("", ogam.images.button_settings, {X: 42, Y: 540}, ogam).on("click", function() { ogam.state = game.menus.paused; }).on("over", function() { game.play("select"); }),
                    Button("1", ogam.images.button_square, {X: 94, Y: 540}, ogam).on("click", function() { game.tower = "snowtower" }).on("over", function() { game.play("select"); }),
                    Button("2", ogam.images.button_square, {X: 146, Y: 540}, ogam).on("click", function() { game.tower = "freezetower" }).on("over", function() { game.play("select"); }),
                    Button("3", ogam.images.button_square, {X: 198, Y: 540}, ogam).on("click", function() { game.tower = "snowtower" }).on("over", function() { game.play("select"); })
                ];                
            },
            killCreeper: function(creeper) {
                for(var i = game.creepers.length -1; i >= 0; --i) {
                    if(game.creepers[i] === creeper) {
                        return game.creepers.splice(i, 1);
                    }
                }
            },
            clear: function(cb){
                cb();
            },
            run: function() {
                var now = Date.now();
                game.map.draw();


                for(var i = game.creepers.length -1; i >= 0; --i) {
                    if(game.creepers[i].update()) {
                        game.creepers[i].draw();
                    } else {
                        game.creepers.splice(i, 1);
                    }
                }
                for(var i = game.projectiles.length -1; i >= 0; --i) {
                    if(game.projectiles[i].update()) {
                        game.projectiles[i].draw();
                    } else {
                        game.projectiles.splice(i, 1);
                    }
                }    
                for(var i = game.towers.length -1; i >= 0; --i) {
                    if(game.towers[i].update()) {
                        game.towers[i].draw();
                    }
                }                
                ogam.context.lineWidth = 2;   
                ogam.context.font = "35px Arial";
                ogam.context.fillStyle = "red";
                ogam.context.strokeStyle = "black";
                for(i = 0; i < game.lives; i++) {
                    ogam.context.fillText("❤", 10 + i * 30, 30);
                    ogam.context.strokeText("❤", 10 + i * 30, 30);
                }
                ogam.context.lineWidth = 5;   
                ogam.context.font = "22px Arial";
                ogam.context.fillStyle = "white";
                ogam.context.strokeText("$ " + game.credits, 700, 30);
                ogam.context.fillText("$ " + game.credits, 700, 30);
                
                ogam.context.textAlign = "center";
                ogam.context.strokeText("wave " + (game.wave + 1), 400, 30);
                ogam.context.fillText("wave " + (game.wave + 1), 400, 30);

                game.particles.draw();

                var mouseTile = ogam.tile(ogam.mouse);
                if(game.tower !== -1 && mouseTile.X < 25 && mouseTile.Y < 18 && mouseTile.X > 0 && mouseTile.Y > 0 && game.collisionMap[mouseTile.X][mouseTile.Y] !== 0) {
                    var tile = ogam.pixel(mouseTile);
                    ogam.context.fillStyle = "rgba(255, 0, 0, 0.4)";
                    ogam.context.fillRect(tile.X - 16, tile.Y - 16, 32, 32);
                } else {
                    if(game.tower !== -1 && mouseTile.X < 25 && mouseTile.Y < 18 && mouseTile.X > 0 && mouseTile.Y > 0) {
                        var tile = ogam.pixel(mouseTile);
                        ogam.context.fillStyle = "rgba(0, 255, 0, 0.4)";
                        ogam.context.fillRect(tile.X - 16, tile.Y - 16, 32, 32);                        
                    }
                }

                for(var i = 0; i < game.towerbuttons.length; i++) {
                    game.towerbuttons[i].draw();
                }
                if(now - game.lastSpawn > game.creeperDelay) {
                    game.spawner();
                    game.lastSpawn = now;
                }
                if(game.lives < 0) {
                    ogam.state = game.menus.gameover;
                }
            }
        },

        settings = {
            init: function(){
                var x = 450,
                    y = 250;
                var muteLabel = game.muted ? "unmute sounds" : "mute sounds";
                settings.items = [
                    Button(muteLabel, ogam.images.button, {X: x, Y: y}, ogam).on("click", function() { game.mute(); ogam.state = game; }).on("over", function() { game.play("select"); }),
                    Button("credits", ogam.images.button, {X: x, Y: y + 70}, ogam).on("click", function() { ogam.state = credits;}).on("over", function() { game.play("select"); })
                ];
            },
            clear: function(cb){
                for(var i = 0; i < settings.items.length; i++) {
                    settings.items[i].clear();
                }
                delete settings.items;
                cb();
            },
            run: function() {
                ogam.context.drawImage(ogam.images.background, 0, 0);
                for(var i = 0; i < settings.items.length; i++) {
                    settings.items[i].draw();
                }
            }
        },        
        credits = {
            text: [
                "A #1GAM game by @Armen138",
                "Terrain tiles from lostgarden.com",
                "Game icons from game-icons.net"
            ],
            back: function() {
                ogam.state = menu;
            },
            init: function() {
                ogam.on("click", credits.back);
            },
            clear: function(cb) {
                ogam.remove("click", credits.back);
                cb();
            },
            run: function() {
                ogam.context.drawImage(ogam.images.background, 0, 0);
                ogam.context.font = "20px Arial";
                ogam.context.fillStyle = "white";
                ogam.context.strokeStyle = "black";
                ogam.context.shadowColor = "black";
                ogam.context.shadowOffsetX = 0;
                ogam.context.shadowOffsetY = 0;
                ogam.context.shadowBlur = 4;
                ogam.context.textAlign = "center";
                ogam.context.textBaseline = "middle";
                for(var i = 0; i < credits.text.length; i++) {
                    ogam.context.strokeText(credits.text[i], 450, 200 + (i * 40));
                    ogam.context.fillText(credits.text[i], 450, 200 + (i * 40));    
                }                
            }
        };
    ogam.loader.on("load", function() {
        var map, valid = false;
        function generateMap(callback) {
            map = ogam.noiseMap(25, 18, 20, 4);
            game.menus = Menus();
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
                callback();
            } else {
                console.log("invalid map, regenerating...");
                setTimeout(function() {
                    generateMap(callback);    
                }, 1);                
            }                        
        }
        generateMap(function() {
            game.map = TileMap(map, ogam);
            ogam.context.drawImage(ogam.images.background, 0, 0);
            ogam.state = game.menus.menu;            
        });
    });
    game.particles = (function() {
        var systems = [],
            particleCanvas = document.createElement("canvas"),
            particles = {
            add: function(system, position) {
                systems.push({
                    position: {X: position.X, Y: position.Y},
                    system: system
                });
                return systems[systems.length -1];
            },
            draw: function() {
                particleCanvas.width = particleCanvas.width;
                for(var i = systems.length -1; i >= 0; --i) {
                    systems[i].system.draw(particleCanvas, systems[i].position.X, systems[i].position.Y, 17);
                    if(systems[i].system.isDone()) {
                        systems.splice(i, 1);
                    }
                }
                ogam.context.drawImage(particleCanvas, 0, 0);
            }
        };
        particleCanvas.width = ogam.canvas.width;
        particleCanvas.height = ogam.canvas.height;
        return particles;
    }());
    game.sound = {
        "select": racket.create("audio/select.wav"),
        "explosion": racket.create("audio/explosion.wav"),
        "rapidfire": racket.create("audio/rapidfire.wav"),
        "shoot": racket.create("audio/shoot.wav"),
        "error": racket.create("audio/error.wav")
    };
    ogam.loader.load({  "terrain" : "images/winterwonderland.png",
                        "background": "images/invasion.png",
                        "button": "images/button.png",
                        "button_square": "images/button_tower.png",
                        "button_settings": "images/button_settings.png",
                        "snowman": "images/snowman.png",
                        "snowmanhop": "images/snowman_animated2.png",
                        "snowball": "images/snowball32.png",
                        "snowtower": "images/snowtower.png",
                        "restart": "images/restart.png",
                        "title": "images/title.png",
                        "snowflake": "images/snowflake.png",
                        "scroll": "images/scroll.png",
                        "sound": "images/bugle-call.png",
                        "gameover": "images/gameover.png" });

    window.addEventListener("blur", function() {
        if(ogam.state == game) {
            ogam.state = game.menus.paused;            
        }
    });
    ogam.on("click", function(mouse) {
        if(ogam.state.click) {
            ogam.state.click(mouse);
        }
    });
    window.addEventListener("keyup", function(e) {
        if(e.keyCode === 27 || e.keyCode === 19) {
            if(ogam.state !== game.menus.paused) {
                ogam.state = game.menus.paused;    
            }            
        } else {
            //console.log("key: " + e.keyCode);
        }
    })
});
