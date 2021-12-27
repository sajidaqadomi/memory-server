import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";

export const findEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
        try {
            const user = await User.findOne({ email })
            if (user) return res.status(201).json(true)
            return res.status(400).json(false)
        } catch (error) {
            return res.status(500).json(false)
        }


    }
    return res.json(false)
}

export const signin = async (req, res) => {
    const { emailAddress, password } = req.body;
    try {
        const user = await User.findOne({ email: emailAddress });

        if (!user) return res.status(404).json({ message: "The user not found" });

        if (user && (await bcrypt.compareSync(password, user.password))) {
            const secret = process.env.secret;
            const token = jwt.sign({ email: emailAddress, id: user._id }, secret, {
                expiresIn: "14d",
            });

            res.status(200).json({ token, user });
        } else {
            console.log('incorrpass')
            res.status(400).json({ message: "you have entered an invalid password.Please try other." });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error });
    }
};

export const signup = async (req, res) => {
    const { firstName, lastName, emailAddress, password, repeatPassword } =
        req.body;

    try {
        const oldUser = await User.findOne({ email: emailAddress });
        if (oldUser)
            return res.status(400).json({ message: "Email Address already exists" });

        const passwordHash = await bcrypt.hash(password, 12);

        let newUser = new User({
            email: emailAddress,
            password: passwordHash,
            name: `${firstName} ${lastName}`,
        });
        await newUser.save();
        if (!newUser)
            return res
                .status(500)
                .json({ message: "Somthings went wrong,Please Tray Again " });

        const secret = process.env.secret;
        const token = jwt.sign({ email: emailAddress, id: newUser._id }, secret, {
            expiresIn: "1d",
        });
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
