
    function manhattan(pos1, pos2) {
        return Math.abs(pos1.X - pos2.X) + Math.abs(pos1.Y - pos2.Y);
    }

    function Projectile(ogam, game, image, start, end, damage, speedMultiplyer) {
        var position = { X: start.X, Y: start.Y },
            angle = 0,
            msPerTile = 10,
            airTime = manhattan(start, end) * speedMultiplyer,// * 15,
            startTime = Date.now(),
            distance = { X: end.X - start.X, Y: end.Y - start.Y },
            lastUpdate = 0,
            trail = null,
            projectile = {
                update: function() {
                    var now = Date.now(),
                        diff = now - startTime;
                    /*if(diff > (airTime / 3) && !trail) {
                        trail = game.particles.add(new PS.ParticleSystem(effects("rocket")), position);
                        trail.position = position;
                    }*/
                    position.X = start.X + (distance.X / airTime) * diff;
                    position.Y = start.Y + (distance.Y / airTime) * diff;
                    if(now > startTime + airTime) {
                        //trail.system.kill();

                        for(var i = 0; i < game.creepers.length; i++) {
                            if(game.creepers[i].distance(ogam.tile(position)) < 2) {
                                //game.creepers[i].kill();
                                game.creepers[i].hit(damage);                                
                            }
                        }                        
                    }
                    return now < startTime + airTime;
                },
                draw: function() {
                    ogam.context.save();                   
                    ogam.context.translate(position.X, position.Y);
                    ogam.context.rotate(angle);
                    ogam.context.drawImage(image, 0, 0, 32, 32, -4, -4, 8, 8);
                    ogam.context.restore();
                }
            }
            //trail.position = position;
        game.play("shoot");
        return projectile;
    }

define(function() {
    return Projectile;
});