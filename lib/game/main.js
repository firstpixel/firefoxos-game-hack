ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.collision-map',
	'impact.background-map',
	'impact.font',
	'plugins.parallax'
)
.defines(function(){

	EntityPlayer = ig.Entity.extend({

		animSheet: new ig.AnimationSheet( 'spritesheets/walk.png', 152, 115 ),

		init: function ( x , y, settings ) {
			this.addAnim( 'idle', 0.1, [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] );

			this.parent( x, y, settings );
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
		},

		update: function() {
			this.parallax.move(5000);

			// Update all entities and backgroundMaps
			this.parent();

			if (this.timer.delta() > 0) {
				this.points = (this.timer.delta() / 1.8).toFixed(1);
			}
		},

		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			this.parallax.draw();
			this.player.draw();

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
	var btnPlayPause = document.querySelector('#play_pause');

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
}, false);

