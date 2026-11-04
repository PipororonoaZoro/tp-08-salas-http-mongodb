const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /@/,
    },
    sala: {
      type: String,
      required: true,
      enum: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
    },
    fecha: {
      type: String,
      required: true,
      trim: true,
    },
    turno: {
      type: String,
      required: true,
      enum: ["Mañana", "Tarde", "Noche"],
    },
    personas: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "El número de personas debe ser un entero.",
      },
      min: 1,
      max: 6,
    },
    estado: {
      type: String,
      required: true,
      enum: ["pendiente", "confirmada"],
      default: "pendiente",
    },
  },
  {
    collection: "reservas",
    timestamps: true,
    // Configuración para exponer el ID público textual y limpiar los metadatos internos en JSON
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        // Opcional: si prefieres mantener sólo `id` o ambos, aquí quedan disponibles
        delete ret.__v;
      },
    },
  }
);

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = Reserva;