import mongoose from "mongoose"

// Conexión a la base de datos
export const conexionDbPrincipal = async () => {
    const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/jaol_basedatos"
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Base de datos conectada, consultar docker-compose.yml")
    } catch (error) {
        console.log(error)
    }
}

export const desconectarDbPrincipal = async () => {
    await mongoose.disconnect()
    console.log("Base de datos desconectada")
}