import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: string;
  skills: string[];
  interests: string[];
  preferredDomain: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availableWeeks: number;
  hoursPerWeek: number;
  preferredTech: string[];
  projectConstraints: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
    interests: {
      type: [String],
      required: true,
      default: [],
    },
    preferredDomain: {
      type: String,
      required: true,
      default: 'Artificial Intelligence & Machine Learning',
    },
    difficultyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
      default: 'Intermediate',
    },
    availableWeeks: {
      type: Number,
      required: true,
      min: 2,
      max: 52,
      default: 12,
    },
    hoursPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 80,
      default: 15,
    },
    preferredTech: {
      type: [String],
      default: [],
    },
    projectConstraints: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
