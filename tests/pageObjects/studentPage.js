/**
 * Created by sayalidhumal on 10/11/17.
 */
var homepage = {
    redirect: function (login,studentProps,student) {
        this.api.pause(1000);
        return login
            .login(login,studentProps.StudentID,studentProps.StudentPassword)
        student
            .waitForElementVisible('@courseCardButton', 1000)
            .assert.visible('@courseCardButton')
        student
            .waitForElementVisible('@studentrecommendationPath', 1000)
            .assert.visible('@studentrecommendationPath')
    }
}
module.exports = {
    commands:[homepage],
    elements:{
        courseCardButton:{
            selector: '#StudentCourseDetails'
        },
        studentrecommendationPath:{
            selector:'#studentrecommendationPath'
        }
    },

    props:{
        StudentID: '005291464',
        StudentPassword: 'karrolla',
        StudentURL:'http://localhost:3000/#!/student/5291464'
    }
}
