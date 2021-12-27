import jwt from "jsonwebtoken";
//import { OAuth2Client } from 'google-auth-library'

//const client = new OAuth2Client(process.env.CLIENT_ID)

export const auth = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];

        let decodeToken

        if (token) {
            decodeToken = jwt.decode(token)
            req.userId = decodeToken.id ? decodeToken.id : decodeToken.sub
        }

        next()

    } catch (error) {
        console.log(error)

    }


}