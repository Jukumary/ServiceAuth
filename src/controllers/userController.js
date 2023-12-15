const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
            role
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

        const {email, password} = req.body

        let user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({error: "Usuario no encontrado"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({error: 'Contraseña incorrecta'})
        }

        const payload = { user: {id:user.id} }
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if(err) throw err
                res.json({token})
            }
        )

    }catch(err){
        console.error(err.message)
        res.status(500).send('Error en el servidor')
    }
}