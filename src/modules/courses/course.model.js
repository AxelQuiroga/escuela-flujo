import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    division: {
      type: String,
      required: true
    },

    profesor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    alumnos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    cupoMaximo: {
      type: Number,
      required: true,
      default: 30
    },

    prerequisito: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null
    }

  },
  {
    timestamps: true
  }
);

export const Course = mongoose.model("Course", courseSchema);