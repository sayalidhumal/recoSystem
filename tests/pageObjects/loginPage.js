/**
 * Created by sayalidhumal on 10/11/17.
 */

var login = {
    login: function (login,id,password) {
        this.api.pause(1000);
        return login.navigate()
            .waitForElementVisible('@Header', 1000)
            .click('@CoyoteID')
            .setValue('@CoyoteID',id)
            .click('@Password')
            .setValue('@Password',password)
            .waitForElementVisible('@LoginButton',1000)
            .assert.visible('@LoginButton')
            .click('@LoginButton')
    }
}


module.exports = {
    url: 'http://localhost:3000/#!/login',
    commands:[login],
    elements:{
        Header:{
            selector: '#loginHeader'
        },
        CoyoteID:{
            selector:'#coyoteID'
        },
        Password:{
            selector:'#password'
        },
        LoginButton:{
            selector:'#loginButton'
        }
    },

    props:{
        StudentID: '005291464',
        Studentpassword: 'sanjay',
        StudentURL:'http://localhost:3000/#!/student/5291464',

        AdvisorID: '6578463',
        Advisorpassword: 'mendoza',
        AdvisorURL:'http://localhost:3000/#!/advisor/6578463',

        AdminID: '005393605',
        Adminpassword: 'sayali',
        AdminURL:'http://localhost:3000/#!/administrator/5393605'
    }
}

