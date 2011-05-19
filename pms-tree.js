
// Task types.
var TASK_TYPE_ACTION 	= 0;
var TASK_TYPE_STEP 		= 1;

function Task() {
	// Text assoicated with Task, this may be
	// a name or a description.
	this.text = '';

	// The only task that does not have a parent is the 
	// root task of a project. All other tasks are considered
	// sub tasks. 
	this.parent = undefined;

	// The list of tasks that must be completed in
	// order to complete this task. If this array is empty,
	// then this Task is a leaf node. In that case, this task
	// must be marked completed for it's  parents to become
	// completed.
	this.subTasks = new Array();

	// The sub tasks can either be 'actions' or 'steps'. Actions
	// can be completed in parrallel. Steps must be completed in
	// sequence.
	this.subTasksType = undefined;

	// The minumum amount of vertical space between two tasks.
	this.vertPadding = 30;

	// The amount of space between a parent and child.
	this.horzPadding = 50;

	this.x;
	this.y;

	this.addTask = function( task ) {
		this.subTasks[ this.subTasks.length ] = task;
	}

	this.render = function( paper, x, y ) {

		this.x = x;
		this.y = y;
		
		var img = paper.task( this );

		x += this.horzPadding;

		for( var i = 0; i < this.subTasks.length; i++ ) {
			var sibY = this.subTasks[i].render( paper, x, y );
			y = sibY + this.vertPadding;
		}


		// Only do the following stuff if this task had sub task.
		if( i > 0 ) {
			// Draw the connections. The lines drawn depend on the type of
			// subtasks.
			if( this.subTasksType == TASK_TYPE_ACTION ) {
				// Each action has a line to it's parent.
				for( var i = 0; i < this.subTasks.length; i++ ) {
					paper.connection( this, this.subTasks[i] );
				}
			} else if( this.subTasksType == TASK_TYPE_STEP ) {
				// Each step has a line to it's previous step. The
				// first step has a line to the parent.
				paper.connection( this, this.subTasks[0] );
				for( var i = 1; i < this.subTasks.length; i++ ) {
					paper.connection( this.subTasks[i-1], this.subTasks[i] );
				}
			} else {
				console.log( "Unkown sub task type: " + this.subTaskType );
				img.attr( {'fill': 'blue'} );
				//alert( "Uh oh" );
			}

			y -= this.vertPadding;
		}

		return y;

	}

}

function Project() {
	// All Tasks for the project must be added under
	// this root task.
	this.rootTask = new Task();

	// Parse the text representation of a task tree into
	// Task nodes.
	//
	// text uses wiki format:
	//   * First action
	//   *# step 1
	//   *# step 2
	//   * Second action
	//   *# step 1
	//   *# step 2
	this.parseTasks = function( text ) {
		var lines 			= text.split( "\n" );
		var curParent 		= undefined;
		var prevTask 		= this.rootTask;
		var prevDepth 		= 0;
		var curType 		= undefined;
		//alert( lines.length );

		for( var i = 0; i < lines.length; i++ ) {
			var line 	= lines[i];
			var depth 	= line.length;
			var task 	= new Task();

			console.log( line );
			console.log( depth );

			// If this depth has changed, we either need to descend or ascend 
			// the tree.
			if( depth > prevDepth ) {
				// Descend by making the previous task the new parent.
				curParent = prevTask;

				// Figure out the type of sub task.
				if( line[ line.length - 1 ] == '*' ) {
					curParent.subTasksType = TASK_TYPE_ACTION;
				} else if( line[ line.length - 1 ] == '#' ) {
					curParent.subTasksType = TASK_TYPE_STEP;
					console.log( "HERE" );
				} else {
					console.log( "Can't determine task type: " + line[ line.length - 1 ] );
				}

			} else if( depth < prevDepth ) {
				// Ascend by finding the corrent parent for the current depth.
				
				// This is the number of levels that we need to go
				// up in the tree.
				var rise = prevDepth - depth;

				for( var j = 0; j < rise; j++ ) {
					curParent = curParent.parent;
				}
			}

			curParent.addTask( task );
			task.parent = curParent;

			prevTask = task;
			prevDepth = depth;
			
		}
	}

	this.render = function( paper, x, y ) {
		this.rootTask.render( paper, x, y );
	}
}


//Raphael.fn.task = function( x, y ) {
	//return this.circle( x, y, 10 ).attr( {'fill': 'red', 'stroke-width': 3} );
//}
Raphael.fn.task = function( task ) {
	return this.circle( task.x, task.y, 10 ).attr( {'fill': 'red', 'stroke-width': 3} );
}

Raphael.fn.connection = function( task1, task2 ) {
	//var bb1 = action1.getBBox();
	//var bb2 = action2.getBBox();

	//var x1 = bb1.x + bb1.width / 2;
	//var y1 = bb1.y + bb1.height / 2;
//
	//var x2 = bb2.x + bb2.width / 2;
	//var y2 = bb2.y + bb2.height / 2;

	//var x1 = action1.attr( 'cx' );
	//var y1 = action1.attr( 'cy' );
//
	//var x2 = action2.attr( 'cx' );
	//var y2 = action2.attr( 'cy' );

	// Get the ends of the line.	
	var x1 = task1.x;
	var y1 = task1.y;

	var x4 = task2.x;
	var y4 = task2.y;

	if( x4 < x1 ) {
		var temp = x1;
		x1 = x4;
		x4 = temp;
	}
	if( y4 < y1 ) {
		var temp = y1;
		y1 = y4;
		y4 = temp;
	}


	var xDist = x4 - x1;
	var yDist = y4 - y1;

	var xStep = xDist * .7;
	var yStep = yDist * 0;

	var x2 = x1 + xStep;
	var y2 = y1 + yStep;

	var x3 = x4 - xStep;
	var y3 = y4 - yStep;

	x1.toFixed(3);
	x2.toFixed(3);
	x3.toFixed(3);
	x4.toFixed(3);

	y1.toFixed(3);
	y2.toFixed(3);
	y3.toFixed(3);
	y4.toFixed(3);


	//var pathString = 'M' + x1 + ' ' + y1 + 'L' + x4 + ' ' + y4;
	var pathString = 'M' + ' ' +
		x1 + ' ' + y1 + ' ' + 
		'C' + ' ' +
		x2 + ' ' + y2 + ' ' + 
		x3 + ' ' + y3 + ' ' + 
		x4 + ' ' + y4 + ' ' + 
		'';


	console.log( pathString );
	var p = this.path( pathString ).attr( {stroke: 'black', 'stroke-width': 3} );

	p.toBack();

	return p;
}


