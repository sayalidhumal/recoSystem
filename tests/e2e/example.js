
module.exports = {
    'Does not show the task list if there are no tasks': function(client) {
        client
            .url('http://todomvc.com/examples/angularjs/#/')
            .waitForElementVisible('#header h1', 1000)
            .assert.hidden('#main')
            .end();
    }
};
