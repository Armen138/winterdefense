define(["raf", "simplex"], function(raf, SimplexNoise) {
    var ogam = {
            images: {},
            tileSize: 32,
            pixel: function(pos, y) {
                return  typeof(pos) === "object" ? {X: pos.X * ogam.tileSize + ogam.tileSize / 2, Y: pos.Y * ogam.tileSize + ogam.tileSize / 2} : {X: pos * ogam.tileSize + ogam.tileSize / 2, Y: y * ogam.tileSize + ogam.tileSize / 2 };
            },
            pixel32: function(pos, y) {
                var tileSize = 32;
                return  typeof(pos) === "object" ? {X: pos.X * tileSize, Y: pos.Y * tileSize } : {X: pos * tileSize, Y: y * tileSize };
            },            
            tile: function(pos, y) {
                return typeof(pos) === "object" ? {X: (pos.X) / ogam.tileSize | 0, Y: (pos.Y) / ogam.tileSize | 0} : {X: pos / ogam.tileSize | 0, Y: y / ogam.tileSize | 0 };
            },
            tileArgs: function(index, image, pos) {
                var p = ogam.pixel(pos),
                    tilePos = ogam.pixel32({X: index % (image.width / 32), Y: index === 0 ? 0 : index / (image.width / 32) | 0 });

                return [
                    image,
                    tilePos.X,
                    tilePos.Y,
                    32,
                    32,
                    p.X - ogam.tileSize / 2,
                    p.Y - ogam.tileSize / 2,
                    ogam.tileSize,
                    ogam.tileSize
                ];
            },
            mouse: {X: 0, Y: 0}
        },
        state;


    Object.defineProperty(ogam, "state", {
        get: function() {
            return state;
        },
        set: function(newstate) {
            if(state) {
                state.clear(function() {
                    newstate.init();
                    state = newstate;                    
                });
            } else {
                newstate.init();
                state = newstate;                
            }
        }
    });

    ogam.events = {
        attach: function(obj) {
            var eventList = {},
                eventTarget = {
                    on: function(ev, f) {
                        if(!eventList[ev]) eventList[ev] = [];
                        eventList[ev].push(f);
                        return obj;
                    },
                    fire: function(ev, obj) {
                        if(eventList[ev]) {
                            for(var i = 0; i < eventList[ev].length; i++) {
                                if(eventList[ev][i](obj)) {
                                    return;
                                }
                            }
                        }
                    },
                    remove: function(ev, f) {
                        if(!eventList[ev]) {
                            return;
                        }
                        for(var i = 0; i < eventList[ev].length; i++) {
                            if(eventList[ev][i] === f) {
                                eventList[ev].splice(i, 1);
                                break;
                            }
                        }
                    }
                };
            for(var prop in eventTarget) {
                obj[prop] = eventTarget[prop];
            }
        }
    };


    ogam.loader = {
        total: 0,
        loaded: 0,
        images: {},
        load: function(files) {
            function loaded(file) {
                ogam.loader.loaded++;
                ogam.loader.fire("progress", file);
                if(ogam.loader.loaded === ogam.loader.total) {
                    ogam.loader.fire("load");
                }
            }
            for(var file in files) {
                ogam.loader.total++;
                var img = new Image();
                (function(img, file){
                    img.onload = function() {
                        loaded(file);
                    };
                    img.onerror = function() {
                        //fail silently.
                        console.log("failed to load: " + file);
                        loaded(file);
                    };
                }(img, file));
                img.src = files[file];
                ogam.images[file] = img;
            }
        }
    };

    ogam.events.attach(ogam.loader);

    ogam.run = function() {
        ogam.canvas.width = ogam.canvas.width;
        ogam.hud.width = ogam.hud.width;
        if(ogam.state) {
            ogam.state.run();
        }

        raf.requestAnimationFrame.call(window, ogam.run);
    };

    ogam.noiseMap = function(w, h, res, lvl) {
        var map = [];
            //noise = new SimplexNoise();
        SimplexNoise.reseed();
        for(var x = 0; x < w; x++) {
            map[x] = [];
            for(var y = 0; y < h; y++) {
                map[x][y] = parseInt((((SimplexNoise.noise(x / res, y / res) + 1 )/ 2)  * lvl), 10);
            }
        }
        return map;
    };
    var constructor = function(id) {
        ogam.canvas = id ? document.getElementById(id) : document.getElementsByTagName("canvas")[0];
        ogam.context = ogam.canvas.getContext("2d");
        ogam.canvas.width = 800;
        ogam.canvas.height = 567;

        ogam.hud = document.createElement("canvas");
        ogam.hud.width = ogam.canvas.width;
        ogam.hud.height = ogam.canvas.height;
        ogam.position = (function() {
            var x = 0,
                y = 0,
                parent = ogam.canvas;
            while(parent) {
                x += parent.offsetLeft;
                y += parent.offsetTop;
                parent = parent.parentElement;
            }
            return {X: x, Y: y};
        }()),
        ogam.events.attach(ogam);
        window.addEventListener("mousemove", function(e) {
            ogam.mouse.X = e.clientX - ogam.position.X,
            ogam.mouse.Y = e.clientY - ogam.position.Y;
            ogam.fire("mousemove", ogam.mouse);
        });

        window.addEventListener("click", function(e) {
            ogam.mouse.X = e.clientX - ogam.position.X,
            ogam.mouse.Y = e.clientY - ogam.position.Y;
            ogam.fire("click", ogam.mouse);
        });

        ogam.run();
        return ogam;
    };

    //window.Ogam = constructor;
    return constructor();
});