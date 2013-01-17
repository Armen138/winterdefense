define(["projectile", "context"], function(Projectile, Context){
    var definitions = {
        snowtower: {
            image: "snowtower",
            hp: 100,
            loadTime: 400,
            range: 4,
            ammo: "snowball",
            speed: 1,
            cost: 70
        },
        freezetower: {
            image: "snowtower",
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
            image = ogam.images[def.image],
            frameWidth = image.width / frameCount,
            position = ogam.pixel(tile),
            context = Context(ogam.canvas, 0, "", position),
            setTooltip = function() {                
                context.tooltip = "Snowball thrower|level " + level+"|Next level: damage: " + (damage + ((level + 1) * 20));
                context.tooltip += "|range: " + (range + 1);
                context.tooltip += "|reload time: " + (loadTime - ((level + 1) * 10)) + "ms";
                console.log("tooltip: " + context.tooltip);
            },
            tower = {
            cost: cost * 2, //upgrade is twice the price
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
                setTooltip();
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
                        context.open();
                        return true;
                    }                    
                } else {
                    return true;
                }
                return false;
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
                var s = 16 + level * 16;
                ogam.context.drawImage(image, 0, 0, image.width, image.height, -(s / 2), -(s /2), s, s);
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
        setTooltip();
        return tower;
    }
    return {
        Tower: Tower,
        definitions: definitions
    }
});
