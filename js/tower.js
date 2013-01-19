define(["projectile", "context"], function(Projectile, Context){
    var definitions = {
        snowtower: {
            images: ["snowtower1", "snowtower2", "snowtower3"],
            hp: 100,
            loadTime: 400,
            range: 4,
            ammo: "snowball",
            speed: 1,
            cost: 70
        },
        freezetower: {
            images: ["snowtower1", "snowtower2", "snowtower3"],
            loadTime: 2000,
            range: 4,
            ammo: "snowball",
            speed: 15,
            cost: 100
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
            context = Context(ogam.hud, [{ label: "upgrade 199", icon: ogam.images.button_square, action: function() { tower.levelUp(); } }, { label: "sell 35", icon: ogam.images.restart }], "", position),
            tower = {
            cost: cost * 2, //upgrade is twice the price
            getTooltip: function() {                
                var tooltip = "Snowball thrower|level " + level+"|Next level:|damage: " + (damage + ((level + 1) * 20));
                tooltip += "|range: " + (range + 1);
                tooltip += "|reload time: " + (loadTime - ((level + 1) * 10)) + "ms";
                /*if(level === 3) {
                    context.menu[0].disabled = true;    
                } */               
                //console.log("tooltip: " + context.tooltip);
                return tooltip;
            },            
            levelUp: function() {
                if(level > 2) {
                    return;
                }
                level++;
                cost *= 2;
                range += level;
                loadTime -= level * 10;
                hp += level * 10;
                damage += level * 20;                
                //setTooltip();
            },
            click: function(mouse) {
                var s = (16 + (level * 16)) / 2;
                if(!context.click(mouse)) {
                    if (mouse.X > position.X - s &&
                        mouse.X < position.X + s &&
                        mouse.Y > position.Y - s &&
                        mouse.Y < position.Y + s) {                 
                        //tower.levelUp();
                        tower.fire("click");
                        //game.killContexts();
                        //context.open();
                        return true;
                    }                    
                } else {
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
                //frame = 0;
                /*
                var deg = angle * (180 / Math.PI);
                deg += 90;
                if(deg < 0) { deg += 360; }
                if(deg > 360) { deg -= 360; }
                var fullCircle = 360;
                var fraction = fullCircle / frameCount;
                var frame = (deg / fraction | 0);
                */
                ogam.context.save();
                ogam.context.translate(position.X, position.Y);
                //console.log(frame);
                ogam.context.rotate(angle);
                //ogam.context.drawImage(image, frame * frameWidth, 0, frameWidth, image.height, -32, -26, frameWidth, image.height);
                //ogam.context.drawImage(image, -16, -16);
                var s = 64;//16 + level * 16;
                ogam.context.drawImage(images[level-1], 0, 0, images[level-1].width, images[level-1].height, -(s / 2), -(s /2), s, s);
                ogam.context.restore();
                context.run();
            },
            update: function() {
                var now = Date.now(),
                    diff = now - lastUpdate;
                //take aim
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
                        //fire snowball
                        console.log("fire");
                        //console.log(position);

                    }
                }
                return !dead;
            }
        };
        game.collisionMap[tile.X][tile.Y] = -1;
        ogam.events.attach(tower);
        //setTooltip();
        return tower;
    }
    return {
        Tower: Tower,
        definitions: definitions
    }
});
