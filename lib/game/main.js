var ollie = false,
	isJumping = false,
	flip = false;


ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.collision-map',
	'impact.background-map',
	'impact.font',
	'game.system.eventChain',
	'plugins.parallax'
)
.defines(function(){
	EntityBox = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.FIXED,
		size: {x:92, y:29},
		offset: {x:-1, y:-1},
		animSheet: new ig.AnimationSheet( 'images/box.png', 92, 29 ),
		type: ig.Entity.TYPE.B,
		
	   // sound: new ig.Sound('media/coin.ogg'),
		
		init: function( x, y, settings ) {
		   this.addAnim( 'idle', 0.1, [0] );        
			this.parent( x, y, settings );
		},
		
		update: function() {
			this.parent();
			this.pos.x -= 4;
			if( this.pos.x - ig.game.screen.x < -32 ) {
				this.kill();
			}
		},
	});

	EntityPlayer = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.ACTIVE,
		type: ig.Entity.TYPE.A,
    	checkAgainst: ig.Entity.TYPE.B,
		animSheet: new ig.AnimationSheet( 'spritesheets/spritesheet.png', 150, 115 ),
		init: function ( x , y, settings ) {
			this.addAnim( 'idle', 0.1, [ 
				74, 74, 74, 74,74, 74, 74, 73,72, 71, 69, 68, 67, 66, 65, 64, 63, 62,74, 74, 74
			]);
			this.addAnim( 'flip', 0.1, [
				38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 
				25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14
			]);
			this.addAnim( 'ollie', 0.1, [
				// 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 
				56, 55, 54, 53, 52, 51, 50, 
				49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39
			]);
			this.addAnim( 'fall', 0.1, [
				13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
			]);

			this.chain = EventChain(this)
				.wait(.4)
				.then(function(){ 
					if(Math.random()*1 > .3){
						this.currentAnim = this.anims.ollie;
					} else {
						this.currentAnim = this.anims.flip;
					}
				})
				.then(function(){
					this.pos.y = 150;
				})
				.wait(1.6)
				.then(function(){ 
					this.pos.y = 192;
					ollie = false;
					this.currentAnim = this.anims.idle;
				})
				.repeat();

			this.parent( x, y, settings );
		},

		update: function () {
			if ( ollie === true ) {
				this.chain();
			}

			this.parent();
		},

		check: function( other ) {
			// The 'other' entity must be a coin, because we
			// only have two entity types (coins and the player)
			// other.pickup();
			console.log('colidiu');
			this.currentAnim = this.anims.fall;
		}
	});

	GameLoader = ig.Loader.extend({
		draw: function() {
			// This one clears the screen and draws the
			// percentage loaded as text
			var w = ig.system.realWidth,
				h = ig.system.realHeight;
			ig.system.context.fillStyle = '#000000';
			ig.system.context.fillRect( 0, 0, w, h );

			var percentage = (this.status * 100).round() + '%';
			ig.system.context.fillStyle = '#ffffff';
			ig.system.context.fillText( percentage, w/2,  h/2 );
		}
	});

	StickSk8rGame = ig.Game.extend({
		// Load a font
		font: new ig.Font( 'images/kartoon.font.png' ),
		fontRed: new ig.Font( 'images/kartoon.font.red.png' ),
		parallax: null,
		player: null,

		init: function() {
			// Initialize your game here; bind keys etc.
			this.parallax = new Parallax();
			this.parallax.add('images/background1.png', {distance: 100, y: 0});
			this.parallax.add('images/cloud.png', {distance: 90, y: 30});
			this.parallax.add('images/cloud2.png', {distance: 70, y: 90});
			this.parallax.add('images/buildings.png', {distance: 20, y: 120});
			this.timer = new ig.Timer();
			this.player = this.spawnEntity( EntityPlayer, 20, 192 );
			this.chain = EventChain(this)
				.wait(2)
				.then(function(){ 
					this.placeBox();
				})
				.repeat();
		},

		placeBox: function() {
			// Randomly find a free spot for the coin, max 12 tries
			var y = ig.system.height-45;
			var x = ig.system.width; //ig.system.realWidth;
			this.spawnEntity( EntityBox, x, y );
			  
		},
		update: function() {
			this.parallax.move(5000);
			this.chain();
			this.parent();

			if (this.timer.delta() > 0) {
				this.points = (this.timer.delta() / 1.8).toFixed(1);
			}
		},

		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			this.parallax.draw();
			
			for( var i = 0; i < this.entities.length; i++ ) {
				this.entities[i].draw();
			}
			// Add your own drawing code here
			var x = ig.system.width/2,
				y = ig.system.height/2;

			// this.font.draw( 'StIcK Sk8teR', x, y, ig.Font.ALIGN.CENTER );
			this.font.draw( 'Points:', 10, 9, ig.Font.ALIGN.LEFT );
			this.font.draw( this.points.replace(/^(-?)0+/,'$1').replace('.', ''), 120, 9, ig.Font.ALIGN.LEFT );
		}
	});

	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	var w = window.innerWidth,
		h = window.innerHeight;

	new ig.Image('images/background1.png');
	new ig.Image('images/buildings.png');
	new ig.Image('images/cloud.png');
	new ig.Image('images/cloud2.png');
	new ig.Image('images/icon128.png');

	// width and height are inverted
	// for forcing landscape gaming
	ig.main( '#canvas', StickSk8rGame, 60, w, h, 1, GameLoader);
});

document.addEventListener('DOMContentLoaded', function(){
	var btnPlayPause = document.getElementById('play_pause'),
			canvas = document.getElementById('canvas');

	btnPlayPause.addEventListener('click', function(e){
		e.preventDefault();
		if(this.className.indexOf('paused') === -1){
			ig.system.stopRunLoop.call(ig.system);
			ig.music.pause();
			this.className += ' paused';
		} else {
			ig.system.startRunLoop.call(ig.system);
			ig.music.play();
			this.className = this.className.replace('paused', '').replace(' ', '');
		}
	});

	canvas.addEventListener('click', function () {
		if ( ollie === false ) {
			ollie = true;
		} else {
			isJumping = true;
		}
	});
}, false);

