
var size = [0,0];

function update()
{
	if( this.patcher.wind.size[0] != size[0] || this.patcher.wind.size[1] != size[1])
	{
		size = this.patcher.wind.size;
		outlet(0, size);
	}
	arguments.callee.task.schedule(20);
}


var tsk;

function poll()
{
	tsk = new Task(update, this);
	tsk.execute();
}

function stop()
{
	tsk.cancel();
}
