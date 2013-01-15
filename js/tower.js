define(["projectile"], function(Projectile){
    var definitions = {
        snowtower: {
            image: "snowtower",
            hp: 100,
            loadTime: 400,
            range: 4,
            ammo: "snowball",
            speed: 1
        },
        freezetower: {
            image: "snowtower",
            loadTime: 2000,
            range: 4,
            ammo: "snowball",
            speed: 15
        }
    };

    function Tower(ogam, game, tile, def) {
        var angle = 0,            
            lastUpdate = 0,
            frameCount = 72,
            dead = false,
            loadTime = def.loadTime || 400,
            range = def.range || 4,
            target = null,
            hp = def.hp || 100,
            image = ogam.images[def.image],
            frameWidth = image.width / frameCount,
            position = ogam.pixel(tile),
            tower = {
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
                ogam.context.drawImage(image, -16, -16);
                ogam.context.restore();
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
                        game.projectiles.push(Projectile(ogam, game, ogam.images[def.ammo], position, target.position, 30, def.speed));
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
        return tower;
    }
    return {
        Tower: Tower,
        definitions: definitions
    }
});
