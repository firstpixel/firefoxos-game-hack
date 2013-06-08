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

	// The Backdrop image for the game, subclassed from ig.Image
	// because it needs to be drawn in it's natural, unscaled size,
	FullsizeBackground = ig.Image.extend({
		resize: function(){ /* Do Nothing */ },
		draw: function() {
			if( !this.loaded ) { return; }
			ig.system.context.drawImage( this.data, 0, 0 );
		}
	}),

	GameLoader = ig.Loader.extend({
		draw: function() {
			// Add your drawing code here

			// This one clears the screen and draws the
			// percentage loaded as text
			var w = ig.system.realWidth;
			var h = ig.system.realHeight;
			ig.system.context.fillStyle = '#000000';
			ig.system.context.fillRect( 0, 0, w, h );

			var percentage = (this.status * 100).round() + '%';
			ig.system.context.fillStyle = '#ffffff';
			ig.system.context.fillText( percentage, w/2,  h/2 );
		}
	});

	StickSk8rGame = ig.Game.extend({
		// Load a font
		clearColor: '#FFFFFF',
		font: new ig.Font( 'media/04b03.font.png' ),
		// background1: new FullsizeBackground( 'images/background1.png' ),
		// background2: new FullsizeBackground( 'images/background2.png' ),
		player: new FullsizeBackground( 'images/background2.png' ),
		gravity: 240,
		player: null,
		map: [],
		speed: 1,
		parallax: null,

		init: function() {
			// Initialize your game here; bind keys etc.
			this.parallax = new Parallax();

			this.parallax.add('images/background1.png', {distance: 50, y: 0});
			this.parallax.add('images/cloud.png', {distance: 20, y: 0});
		},

		update: function() {
			this.parallax.move(5000);

			// Update all entities and backgroundMaps
			this.parent();

			// Add your own, additional update code here
		},

		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			this.parallax.draw();

			// Add your own drawing code here
			var x = ig.system.width/2,
					y = ig.system.height/2;

			//this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
			// this.background1.draw();
			// this.background2.draw();
		}
	});

	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	var w = window.innerWidth,
			h = window.innerHeight;

	new ig.Image('images/background1.png');
	new ig.Image('images/cloud.png');

	// width and height are inverted
	// for forcing landscape gaming
	ig.main( '#canvas', StickSk8rGame, 60, w, h, 1, GameLoader);
});

