const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    IdCategoria: {
        type: String,
        require: true
    },
    NombreCategoria: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema, "categorias");
