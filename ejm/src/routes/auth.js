"use strict";

const boom = require("boom");

module.exports.register = async server => {
    // login route
    server.route({
        method: "GET",
        path: "/login",
        options: {
            //auth: "session",
            handler: async request => {
                return `Hello, FULANITO! .../login`;
                //    return `Hello, ${ request.auth.credentials.profile.email }!`;
            }
        }
    });

    // OIDC callback
    server.route({
        method: "GET",
        path: "/callback",
        options: {
            //auth: "okta",
            handler: (request, h) => {

                // console.log();
                return `my server host is: ${request.info.host}, your server host is ${request.info.remoteAddress}`;
                // return h.redirect("/");
            }
        }
    });

    // Logout
    server.route({
        method: "GET",
        path: "/logout",
        options: {
            // auth: {
            //     strategy: "session",
            //     mode: "try"
            // },
            handler: (request, h) => {
                try {
                    // if (request.auth.isAuthenticated) {
                    //     // const idToken = encodeURI( request.auth.credentials.token );

                    //     // clear the local session
                    //     request.cookieAuth.clear();
                    //     // redirect to the Okta logout to completely clear the session
                    //     // const oktaLogout = `${ process.env.OKTA_ORG_URL }/oauth2/default/v1/logout?id_token_hint=${ idToken }&post_logout_redirect_uri=${ process.env.HOST_URL }`;
                    //     // return h.redirect( oktaLogout );
                    // }

                    return h.redirect("/");
                } catch (err) {
                    request.log(["error", "logout"], err);
                }
            }
        }
    });
};