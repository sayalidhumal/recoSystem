/**
 * Created by sayalidhumal on 10/11/17.
 */
module.exports = {
    'Does display all the cards': function (client) {
        var login = client.page.loginPage();
        var student = client.page.studentPage();
        var studentProps = student.props;
        login
            .login(login,studentProps.StudentID,studentProps.StudentPassword)
        student
            .waitForElementVisible('@courseCardButton', 1000)
            .assert.visible('@courseCardButton')
        student
            .waitForElementVisible('@studentrecommendationPath', 1000)
            .assert.visible('@studentrecommendationPath')
        client
            .end()
    }
};
