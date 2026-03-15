import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    alumno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    titulo: {
      type: String,
      required: true
    },

    nota: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    }
  },
  {
    timestamps: true
  }
);

export const Grade = mongoose.model("Grade", gradeSchema);