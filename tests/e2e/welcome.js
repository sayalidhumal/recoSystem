
module.exports = {
    'Redirects to the welcome page': function(client) {
        client
            .url('http://localhost:3000/#!/')
            .waitForElementVisible('#login', 1000)
            .assert.visible('#login')
    },
    'Redirects to login page': function(client) {
        client
            .click('#login')
            .waitForElementVisible('#loginHeader', 1000)
            .assert.urlEquals('http://localhost:3000/#!/login')

    },
    'Redirects to signup page': function(client) {
        client
            .url('http://localhost:3000/#!/')
            .waitForElementVisible('#signup', 1000)
            .click('#signup')
            .waitForElementVisible('#signupHeader', 1000)
            .assert.urlEquals('http://localhost:3000/#!/signup')
            .end()
    }
};
