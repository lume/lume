
let appName = "Infamous"

// check the user is logged in before all paths.
//FlowRouter.triggers.enter([checkLogin])

FlowRouter.route('/', {
    action: function() {
        Session.set('appTitle', titleTemplate("Home"))
        Session.set('layout', 'Home')
    },
});



function titleTemplate(description) {
    return `${appName} - ${description}`
}

// Checks if the user is logged in. If so, does nothing unless
// they've just logged in, in which case they are sent back to the page they
// were trying to visit.
let pathBeforeLogin = null
function checkLogin(context) {
    console.log('route context: ', context)
    let currentPathDef = context.route.pathDef

    if (!Meteor.userId() && !currentPathDef.match(/^\/login/g)) {
        pathBeforeLogin = context.path
        FlowRouter.go('/login')
    }

    else if (Meteor.userId()) {
        if (currentPathDef.match(/^\/login/g)) {
            FlowRouter.go('/')
        }
        else if (pathBeforeLogin) {
            FlowRouter.go(pathBeforeLogin)
        }

        pathBeforeLogin = null // reset for the next time.
    }
}
