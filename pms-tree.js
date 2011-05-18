Raphael.fn.action = function( x, y ) {
	return this.circle( x, y, 20 ).attr( {fill: 'red'} );
}

Raphael.fn.connection = function( action1, action2 ) {
	//var bb1 = action1.getBBox();
	//var bb2 = action2.getBBox();

	//var x1 = bb1.x + bb1.width / 2;
	//var y1 = bb1.y + bb1.height / 2;
//
	//var x2 = bb2.x + bb2.width / 2;
	//var y2 = bb2.y + bb2.height / 2;

	var x1 = action1.attr( 'cx' );
	var y1 = action1.attr( 'cy' );

	var x2 = action2.attr( 'cx' );
	var y2 = action2.attr( 'cy' );


	//return this.path( 'M' + action1.x + ' ' + action1.y + 'L' + action2.x + ' ' + action2.y ).attr( {stroke: 'black', stroke-width: 3} );
	var pathString = 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2;
	//alert( pathString );
	return this.path( pathString ).attr( {stroke: 'black', 'stroke-width': 3} );
}



window.onload = function() {
	var paperWidth = 400;
	var paperHeight = 500;
	var paper = Raphael( 'holder', paperWidth, paperHeight );

	var a1 = paper.action( 50, 30 );
	var a2 = paper.action( 100, 100 );
	//paper.circle( 50, 50, 20 ).attr( {fill: 'blue'} );
	
	var c1 = paper.connection( a1, a2 );
	c1.toBack();


}
