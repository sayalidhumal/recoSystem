/**
 * Created by sayalidhumal on 10/11/17.
 */
module.exports = {
    'Does display all the cards': function (client) {
        var login = client.page.loginPage();
        var student = client.page.studentPage();
        var studentProps = student.props;
        student
            .redirect(login,studentProps,student);
    },
    'Does redirect to course Details Page': function (client) {
        var login = client.page.loginPage();
        var student = client.page.studentPage();
        var studentProps = student.props;
        student
            .redirect(login,studentProps,student);

    }
};
