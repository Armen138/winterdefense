(function() {
	var effects = function(effect) {
		switch(effect) {
			case "explosion":
				//return {"emitterStartLocation":{"x":0,"y":0},"emitterStopLocation":{"x":0,"y":0},"systemLifeSpan":1,"particleSpawnArea":{"x":0,"y":0},"maxParticles":100,"averageLifeSpan":0.5,"lifeSpanVariance":0.1,"startColor":{"red":255,"green":151.84708522918388,"blue":42.17974589699552,"alpha":1},"stopColor":{"red":0,"green":0,"blue":0,"alpha":1},"averageVelocity":{"horizontal":0,"vertical":0},"velocityVariance":{"x":0.6,"y":0.6},"minParticleSize":3,"maxParticleSize":15,"particleFadeTime":0.8,"globalCompositeOperation":"lighter","renderType":"spriteSheet","type":"relative"};
				return {"emitterStartLocation":{"x":0,"y":0},"emitterStopLocation":{"x":0,"y":0},"systemLifeSpan":1,"particleSpawnArea":{"x":0,"y":0},"maxParticles":600,"averageLifeSpan":0.5,"lifeSpanVariance":0.1,"startColor":{"red":54,"green":255,"blue":255,"alpha":1},"stopColor":{"red":0,"green":0,"blue":0,"alpha":1},"averageVelocity":{"horizontal":0,"vertical":0},"velocityVariance":{"x":0.3,"y":0.3},"minParticleSize":1,"maxParticleSize":10,"particleFadeTime":0.8,"globalCompositeOperation":"lighter","renderType":"spriteSheet","type":"relative"};
			break;
			case "smoke":
				return {"emitterStartLocation":{"x":0,"y":0},"emitterStopLocation":{"x":0,"y":0},"systemLifeSpan":0,"particleSpawnArea":{"x":21.172578332609515,"y":10.86197378001061},"maxParticles":100,"averageLifeSpan":0.7,"lifeSpanVariance":0.5,"startColor":{"red":42.17974589699552,"green":44.99172895679522,"blue":44.99172895679522,"alpha":1},"stopColor":{"red":0,"green":0,"blue":0,"alpha":1},"averageVelocity":{"horizontal":0,"vertical":-1},"velocityVariance":{"x":0,"y":0.3},"minParticleSize":1,"maxParticleSize":15,"particleFadeTime":0.8,"globalCompositeOperation":"lighter"};
			break;
			default:
			case "freeze":
				return {"emitterStartLocation":{"x":0,"y":0},"emitterStopLocation":{"x":0,"y":0},"systemLifeSpan":0,"particleSpawnArea":{"x":0,"y":0},"maxParticles":60,"averageLifeSpan":0.5,"lifeSpanVariance":0.1,"startColor":{"red":54,"green":255,"blue":255,"alpha":1},"stopColor":{"red":0,"green":0,"blue":0,"alpha":1},"averageVelocity":{"horizontal":0,"vertical":-2},"velocityVariance":{"x":0.3,"y":0.3},"minParticleSize":8,"maxParticleSize":16,"particleFadeTime":0.4,"renderType":"image","image":"http://dev138.info/winterdefense/images/crystal.png","type":"relative"};
			break;
			case "rocket":
				//return {"emitterStartLocation":{"x":0,"y":0},"emitterStopLocation":{"x":0,"y":0},"systemLifeSpan":0,"particleSpawnArea":{"x":10,"y":10},"maxParticles":100,"averageLifeSpan":0.3,"lifeSpanVariance":0.1,"startColor":{"red":255,"green":151.84708522918388,"blue":42.17974589699552,"alpha":1},"stopColor":{"red":0,"green":0,"blue":0,"alpha":1},"averageVelocity":{"horizontal":0,"vertical":0},"velocityVariance":{"x":0.3,"y":0.3},"minParticleSize":1,"maxParticleSize":4,"particleFadeTime":0.3,"globalCompositeOperation":"lighter","renderType":"spriteSheet","type":"relative"};
				return {"emitterStartLocation":{"x":0,"y":0},"emitterStopLocation":{"x":0,"y":0},"systemLifeSpan":0,"particleSpawnArea":{"x":3,"y":3},"maxParticles":40,"averageLifeSpan":0.3,"lifeSpanVariance":0.1,"startColor":{"red":255,"green":151.84708522918388,"blue":42.17974589699552,"alpha":1},"stopColor":{"red":0,"green":0,"blue":0,"alpha":1},"averageVelocity":{"horizontal":0,"vertical":0},"velocityVariance":{"x":0,"y":0},"minParticleSize":1,"maxParticleSize":4,"particleFadeTime":0.3,"globalCompositeOperation":"lighter","renderType":"spriteSheet","type":"relative"};
			break;			
		}
	};

	if(typeof define !== "undefined") {
		define((function() { return effects; }));
	} else {
		window.effects = effects;
	}	
}());