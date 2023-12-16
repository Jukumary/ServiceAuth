const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { mongoose } = require('mongoose')
const Resend = require('resend')

//metodo para enviar correo
const sendEmailForgotPassword = async (email, resetToken) => {
    try{

        const resends = new Resend.Resend(process.env.API_KEY_EMAIL_RESEND);

        const resetLink = `http://localhost:3000/api/verifyResetToken?token=${resetToken}`;

        const htmlContent = `
            <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
            <a href="${resetLink}">${resetLink}</a>
        `;

        resends.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Recuperacion de Contraseña',
        html: htmlContent
        });

        console.log('Correo electrónico enviado');

    }catch(err){
        console.error('Fallo al enviar el Email ', err.message)
    }
}


exports.userRegister = async (req, res) => {
    try{

        const {
            name,
            lastname,
            email,
            password,
            dateofbirth,
            gender,
            role
        } = req.body

        let useremail = await User.findOne({email})
        if (useremail){
            return res.status(400).json({error: `El usuario ${email} ya existe`})
        }

        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)

        user = new User({
            name,
            lastname,
            email,
            password: hashedPassword,
            dateofbirth,
            gender,
            role,
            tenantId: new mongoose.Types.ObjectId
        })
        await user.save()
        
        res.json({ message: "registro existoso" })

    }catch(err){

        console.error(err.message)
        res.status(500).send('error en el servidor')

    }
}

exports.userLogin = async (req, res) => {
    try{

        const {email, password, tenantId} = req.body

        let user = await User.findOne({email, tenantId})
        if(!user) {
            return res.status(400).json({error: "Usuario no encontrado"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({error: 'Contraseña incorrecta'})
        }

        const payload = { user: { id: user.id, tenantId: user.tenantId } }
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if(err) throw err
                res.cookie("token", token)
                res.json({token: token, rol: user.role})
            }
        )

    }catch(err){
        console.error(err.message)
        res.status(500).send('Error en el servidor')
    }
}

exports.userLogOut = async (req, res) => {
    try{

        res.clearCookie("token","",{
            expires: new Date(Date.now()),
        });
        res.status(200).json({message: "logout"});

    }catch(err){

        console.error(err.message)
        res.status(500).send("Error en el servidor")

    }
}

exports.forgotPssword = async (req, res) => {
    try{

        const { email } = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({ error: 'Usuario no encontrado' })
        }

        //genera un token para verificar la cuenta
        const resetToken = jwt.sign(
            { userId: user.id },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: '1h'})
        
        user.resetToken = resetToken
        user.resetTokenExpiration = Date.now() + 3600000
        await user.save()

        sendEmailForgotPassword(user.email, resetToken)

        res.json({message: 'Se envió el correo con el enlace de recuperacion'})

    }catch(err){

        console.error(err.message)
        res.status(500).send('Error en el servidor')

    }
}

exports.verifyResetToken = async (req, res) => {
    try{

        const { token } = req.query

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now()  }
        })

        if(!user){
            return res.status(400).json({error: 'Token invalido'})
        }

        res.json({message: 'Token valido'})

    }catch(err){

        console.error(err.message)
        res.status(500).send('Error en el servidor')

    }
}

exports.resetPassword = async (req, res) => {
    try{

        const {token, newPassword} = req.body

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        })

        if(!user){
            res.status(400).json({error: 'Token Invalido'})
        }

        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword
        user.resetToken = null
        user.resetTokenExpiration = null

        await user.save()

        res.json({message: 'Contraseña cambiada correctamente'})

    }catch(err){
        
        console.error(err.message)
        res.status(500).send('Error en el servidor')

    }
}