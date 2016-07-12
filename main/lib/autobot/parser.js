function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

module.exports = {
    getDrawingInstructions: function (tasks) {
        var nestLevel = 0;
        var instructionCollector = [];
        var visitedTasks = [];

        // Dig into the task dependencies
        var dig = function (taskId) {
            if (contains(visitedTasks, taskId)) {
                return;
            }
            visitedTasks.push(taskId);

            var task = tasks[taskId];
            var taskDrawingInstruction = {
                padding: nestLevel,
                taskName: taskId
            };

            instructionCollector.push(taskDrawingInstruction);

            if (task.dependsOn.length > 0) {
                nestLevel++;
                for (var i = 0, l = task.dependsOn.length; i < l; i ++) {
                    dig(task.dependsOn[i]);
                }
                nestLevel--;
            }
        };

        for (var taskId in tasks) {
            dig(taskId);
        }

        return instructionCollector;
    }
};
