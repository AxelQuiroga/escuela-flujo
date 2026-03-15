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
    ]
  },
  {
    timestamps: true
  }
);

export const Course = mongoose.model("Course", courseSchema);