import mongoose, { Schema, Document } from 'mongoose';

export interface IActionableImprovement {
  area: string;
  suggestion: string;
  expectedBenefit: string;
}

export interface IMentorReview extends Document {
  id: string;
  userId: string;
  projectTitle: string;
  originalPitch: string;
  strengths: string[];
  weaknesses: string[];
  missingFeatures: string[];
  technicalPitfalls: string[];
  feasibilityScore: number;
  complexityScore: number;
  actionableImprovements: IActionableImprovement[];
  differentiationAdvice: string;
  futureScopeIdeas: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MentorReviewSchema = new Schema<IMentorReview>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },
    originalPitch: {
      type: String,
      required: true,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    missingFeatures: {
      type: [String],
      default: [],
    },
    technicalPitfalls: {
      type: [String],
      default: [],
    },
    feasibilityScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 75,
    },
    complexityScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 65,
    },
    actionableImprovements: [
      {
        area: { type: String, required: true },
        suggestion: { type: String, required: true },
        expectedBenefit: { type: String, required: true },
      },
    ],
    differentiationAdvice: {
      type: String,
      required: true,
    },
    futureScopeIdeas: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

MentorReviewSchema.index({ userId: 1, createdAt: -1 });

export const MentorReview = mongoose.model<IMentorReview>('MentorReview', MentorReviewSchema);
