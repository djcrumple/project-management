
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

	this.addTask = function( task ) {
		this.subTasks[ this.subTasks.length ] = task;
	}

	this.render = function() {
		for( var i = 0; i < this.subTasks.length; i++ ) {
			this.subTasks[i].render();
		}
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
		var curParent 		= this.rootTask;
		var prevTask 		= undefined;
		var prevDepth 		= 1;
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

	this.render = function( paper ) {
		this.rootTask.render();
	}
}


Raphael.fn.task = function( x, y ) {
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


