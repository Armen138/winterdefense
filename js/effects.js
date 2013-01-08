(function() {
	var effects = {
		explosion: {
           "emitterStartLocation":{
              "x":0,
              "y":0
           },
           "emitterStopLocation":{
              "x":0,
              "y":0
           },
           "systemLifeSpan":10,
           "particleSpawnArea":{
              "x":10,
              "y":10
           },
           "maxParticles":100,
           "averageLifeSpan":1,
           "lifeSpanVariance":1,
           "startColor":{
              "red":246,
              "green": 255,
              "blue": 0,
              "alpha":1.0
           },
           "stopColor":{
              "red":0,
              "green":0,
              "blue":0,
              "alpha":0.4
           },
           "averageVelocity":{
              "x":0,
              "y":0
           },
           "velocityVariance":{
              "x":0.3,
              "y":0.3
           },
           "minParticleSize":1,
           "maxParticleSize":15,
           "particleFadeTime":1.0,
           "renderType":"spriteSheet"
        },
        smoke: {
		   "emitterStartLocation":{
		      "x":0,
		      "y":0
		   },
		   "emitterStopLocation":{
		      "x":0,
		      "y":0
		   },
		   "systemLifeSpan":0,
		   "particleSpawnArea":{
		      "x":0,
		      "y":0
		   },
		   "maxParticles":100,
		   "averageLifeSpan":3,
		   "lifeSpanVariance":1,
		   "startColor":{
		      "red":155,
		      "green":155,
		      "blue":155,
		      "alpha":0.5
		   },
		   "stopColor":{
		      "red":0,
		      "green":0,
		      "blue":0,
		      "alpha":0
		   },
		   "averageVelocity":{
		      "x":0,
		      "y":-0.5
		   },
		   "velocityVariance":{
		      "x":0.1,
		      "y":0.1
		   },
		   "minParticleSize":1,
		   "maxParticleSize":4,
		   "particleFadeTime":0.8
		}
	};

	if(typeof define !== "undefined") {
		define(effects);
	} else {
		window.effects = effects;
	}	
}());