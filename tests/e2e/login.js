/**
 * Created by sayalidhumal on 10/11/17.
 */
module.exports = {
    'Does redirect to login page': function (client) {
        var login = client.page.loginPage();
        login
            .navigate()
            .waitForElementVisible('@Header', 1000)
            .assert.visible('@CoyoteID')
    },

    'Does login successful and redirects to student home page': function (client) {
        var login = client.page.loginPage();
        var loginProps = login.props;

        login
            .click('@CoyoteID')
            .setValue('@CoyoteID', loginProps.StudentID)
            .click('@Password')
            .setValue('@Password', loginProps.Studentpassword)
            .waitForElementVisible('@LoginButton', 1000)
            .assert.visible('@LoginButton')
            .click('@LoginButton');
        client
            .pause(1000)
            .assert.urlEquals(loginProps.StudentURL)
    },

    'Does login successful and redirects to administrator home page': function (client) {
        var login = client.page.loginPage();
        var loginProps = login.props
        login
            .navigate()
            .waitForElementVisible('@Header', 1000)
            .click('@CoyoteID')
            .setValue('@CoyoteID',loginProps.AdminID)
            .click('@Password')
            .setValue('@Password',loginProps.Adminpassword)
            .waitForElementVisible('@LoginButton',1000)
            .assert.visible('@LoginButton')
            .click('@LoginButton')
        client
            .pause(1000)
            .assert.urlEquals(loginProps.AdminURL)
    },

    'Does login successful and redirects to advisor home page': function (client) {
        var login = client.page.loginPage();
        var loginProps = login.props
        login
            .navigate()
            .waitForElementVisible('@Header', 1000)
            .click('@CoyoteID')
            .setValue('@CoyoteID',loginProps.AdvisorID)
            .click('@Password')
            .setValue('@Password',loginProps.Advisorpassword)
            .waitForElementVisible('@LoginButton',1000)
            .assert.visible('@LoginButton')
            .click('@LoginButton')
        client
            .pause(1000)
            .assert.urlEquals(loginProps.AdvisorURL)
            .end()
    },

    'Does not login successfully': function (client) {
        var login = client.page.loginPage();
        var loginProps = login.props
        login
            .navigate()
            .waitForElementVisible('@Header', 1000)
            .click('@CoyoteID')
            .setValue('@CoyoteID',loginProps.AdvisorID)
            .click('@Password')
            .setValue('@Password',loginProps.Adminpassword)
            .waitForElementVisible('@LoginButton',1000)
            .assert.visible('@LoginButton')
            .click('@LoginButton')
        client
            .assert.visible('md-toast')
            .end()
    }
}