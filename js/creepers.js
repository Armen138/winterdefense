define(["../particlus/ParticleSystem", "astar", "effects"], function(PS, astar, effects){
var definitions = {
    "small": {
        hp: 100,
        salvage: 1,
        image: "snowmanhop",
        scale: 0.5,
        speed: 500,
        delay: 400
    },
    "big": {
        hp: 300,
        salvage: 3,
        image: "snowmanhop",
        scale: 0.7,
        speed: 900,
        delay: 1000        
    },
    "boss": {
        hp: 3000,
        salvage: 10,
        image: "snowmanhop",
        scale: 1.2,
        speed: 1400,
        delay: 2000
    }
}

var level = {
    in: {X: 0, Y: 4},
    out: {X: 12, Y: 4}
};

function Creeper(ogam, game, def) {
    var angle = 0,
        lastUpdate = 0,
        dead = false,
        frameWidth = 64,
        msPerTile = def.speed,//500,
        image = ogam.images[def.image],
        path = astar.path(game.collisionMap, level.in, level.out),
        position = ogam.pixel(level.in),
        tile = level.in,
        loopDirection = 1,
        maxFrame = (image.width / frameWidth) - 1,
        frame = 0,
        lastFrame = 0,
        hp = def.hp,
        creep = {
        get position() {
            return position;
        },
        get dead() {
            return dead;
        },            distance: function(pos) {
            var xdiff = Math.abs(pos.X - tile.X),
                ydiff = Math.abs(pos.Y - tile.Y);
            return Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
        },
        angle: function(pos) {
            return Math.atan2((position.X - pos.X), (pos.Y - position.Y));
        },
        draw: function() {            
            ogam.context.drawImage(image, 0 + (frame * frameWidth), 0, frameWidth, image.height, position.X - (frameWidth * def.scale) / 2, position.Y - ((image.height * def.scale) / 2), frameWidth * def.scale, image.height * def.scale);
        },
        hit: function(damage) {
            hp -= damage;
        },
        kill: function() {
            hp = -1;
        },
        update: function() {
            var now = Date.now(),
                diff = now - lastUpdate;
            if(diff > msPerTile && path.length > 0) {
                lastUpdate = now;
                tile = path.shift();
                if(path.length > 0 && game.collisionMap[path[0].X][path[0].Y] < 0) {
                    path = astar.path(game.collisionMap, tile, level.out);
                }
                position = ogam.pixel(tile);
            } else {
                if(path.length > 0) {
                    var xd = path[0].X - tile.X,
                        yd = path[0].Y - tile.Y,
                        frac = diff / msPerTile;
                    position = ogam.pixel(tile);
                    position.X += xd * 64 * frac;
                    position.Y += yd * 64 * frac;

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
                game.credits += def.salvage;
                game.play("explosion");
                creep.fire("death");
                game.particles.add(new PS.ParticleSystem(effects("explosion")), creep.position);
                dead = true;
            }
            if(now - lastFrame > 200) {
                if(frame + loopDirection > maxFrame || frame + loopDirection < 0) {
                    loopDirection = -loopDirection;
                }                
                frame += loopDirection;    
                lastFrame = now;
            }
            
            return !dead;
        }
    };
    if(path.length === 0) {
        console.warn("creeper has no path...");
    }
    ogam.events.attach(creep);
    return creep;
}

return {
        Creeper: Creeper,
        definitions: definitions
    };
});
