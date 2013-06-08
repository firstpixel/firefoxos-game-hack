ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'plugins.parallax'
)
.defines(function(){

	MyGame = ig.Game.extend({
		parallax: null,

		// Load a font
		font: new ig.Font( 'media/04b03.font.png' ),

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
			this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
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
	ig.main( '#canvas', MyGame, 60, w, h, 1);
});

