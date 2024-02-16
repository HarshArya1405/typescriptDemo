interface Auth0Config {
    Auth0:{
        authRequired?: boolean ,
        auth0Logout?: boolean ,
        baseURL?: string ,
        clientID?: string ,
        issuerBaseURL?: string ,
        secret?: string
    }
}
const auth0Config : Auth0Config = {
    Auth0: {
        authRequired: false,
        auth0Logout: true,
        baseURL: process.env.BASE_APP_URL,
        clientID: process.env.CLIENT_ID,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        secret: process.env.SECRET
    }
};
export default auth0Config;