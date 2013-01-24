define(["projectile", "context"], function(Projectile, Context){
    var definitions = {
        snowtower: {
            name: "Snowball thrower",
            images: ["snowtower1", "snowtower2", "snowtower3"],
            hp: 100,
            loadTime: 400,
            range: 2,
            ammo: "snowball",
            damage: 30,
            speed: 1,
            cost: 70,
            description: "Standard issue snowballs"
        },
        freezetower: {
            name: "Freeze",
            images: ["snowtower1", "snowtower2", "snowtower3"],
            loadTime: 1000,
            range: 2,
            ammo: "snowball",
            speed: 3,
            damage: function(creep) { creep.slowDown(); },
            cost: 100,
            description: "Slows down enemy for 1sec"
        },
        icetower: {
            name: "Ice artillery",
            images: ["snowtower1", "snowtower2", "snowtower3"],
            hp: 100,
            loadTime: 600,
            range: 3,
            ammo: "snowball",
            damage: 50,
            speed: 1.5,
            cost: 120,
            description: "Hardened ice shells"
        },
        tooltip: function(def) {
            var tt = definitions[def].name;
            tt += "|cost: " + definitions[def].cost,
            tt += "|damage: " + definitions[def].damage;
            tt += "|range: " + definitions[def].range;
            tt += "|reload time: " + definitions[def].loadTime;
            tt += "|" + definitions[def].description;
            return tt;
        }
    };

    function Tower(ogam, game, tile, def) {
        var angle = 0,       
            level = 1,     
            lastUpdate = 0,
            frameCount = 72,
            dead = false,
            loadTime = def.loadTime || 400,
            range = def.range || 4,
            target = null,
            damage = def.damage || 30,
            cost = def.cost || 70,
            hp = def.hp || 100,            
            images = [ogam.images[def.images[0]],ogam.images[def.images[1]],ogam.images[def.images[2]]],
            frameWidth = images[0].width / frameCount,
            position = ogam.pixel(tile),
            //context = Context(ogam.hud, [{ label: "upgrade 199", icon: ogam.images.button_square, action: function() { tower.levelUp();} }, { actionlabel: "sell " + tower.cost / 2, icon: ogam.images.restart }], "", position),
            tower = {
            cost: cost * 2, //upgrade is twice the price
            getTooltip: function() {                
                var tooltip = "Snowball thrower|level " + level;
                if(level < 3) {
                    tooltip += "|Next level:|damage: " + (damage + ((level + 1) * 20));
                    tooltip += "|range: " + (range + 1);
                    tooltip += "|reload time: " + (loadTime - ((level + 1) * 10)) + "ms";                    
                } else {
                    tooltip += "|this tower cannot|be upgraded beyond|level 3";
                }
                /*if(level === 3) {
                    context.menu[0].disabled = true;    
                } */               
                //console.log("tooltip: " + context.tooltip);
                return tooltip;
            },           
            sell: function() {
                tower.kill();
                game.credits += tower.cost / 2;
            },
            levelUp: function() {
                if(level > 2 || game.credits < tower.cost) {
                    return;
                }           
                game.credits -= tower.cost;     
                level++;
                tower.cost *= 2;
                range += level;
                loadTime -= level * 10;
                hp += level * 10;
                damage += level * 20;                
                tower.level = level;
            },
            click: function(mouse) {
                var s = ogam.tileSize / 2;

                if (mouse.X > position.X - s &&
                    mouse.X < position.X + s &&
                    mouse.Y > position.Y - s &&
                    mouse.Y < position.Y + s) {                        
                    tower.fire("click");
                    return true;
                }                    

                return false;
            },
            killContext: function() {
                context.close();
            },
            kill: function() {
                dead = true;
                game.collisionMap[tile.X][tile.Y] = 0;
            },
            draw: function() {
                ogam.context.save();
                ogam.context.translate(position.X, position.Y);
                ogam.context.rotate(angle);
                var s = ogam.tileSize;
                ogam.context.drawImage(images[level-1], 0, 0, images[level-1].width, images[level-1].height, -(s / 2), -(s /2), s, s);
                ogam.context.restore();
            },
            update: function() {
                var now = Date.now(),
                    diff = now - lastUpdate;
                //take aim
                target = null;
                for(var i = 0; i < game.creepers.length; i++) {
                    if(game.creepers[i].distance(tile) < range) {
                        target = game.creepers[i];
                    }
                }
                if(target && !target.dead) {
                    angle = target.angle(position);
                    if(diff > loadTime) {
                        lastUpdate = now;
                        game.projectiles.push(Projectile(ogam, game, ogam.images[def.ammo], position, target.position, damage, def.speed));
                    }
                }
                return !dead;
            }
        };
        game.collisionMap[tile.X][tile.Y] = -1;
        ogam.events.attach(tower);
        return tower;
    }
    return {
        Tower: Tower,
        definitions: definitions
    }
});
