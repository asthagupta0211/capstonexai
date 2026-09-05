import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectIdea extends Document {
  id: string;
  userId: string;
  title: string;
  pitch: string;
  problem: string;
  solution: string;
  targetUsers: string[];
  whyItMatters: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  feasibilityScore: number;
  impactScore: number;
  noveltyScore: number;
  skillFitScore: number;
  demoValueScore: number;
  estimatedScopeWeeks: number;
  techStackSummary: string[];
  keyFeaturesSummary: string[];
  risks: string[];
  isSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectIdeaSchema = new Schema<IProjectIdea>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pitch: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    targetUsers: {
      type: [String],
      default: [],
    },
    whyItMatters: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    feasibilityScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    impactScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    noveltyScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    skillFitScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    demoValueScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    estimatedScopeWeeks: {
      type: Number,
      required: true,
      default: 12,
    },
    techStackSummary: {
      type: [String],
      default: [],
    },
    keyFeaturesSummary: {
      type: [String],
      default: [],
    },
    risks: {
      type: [String],
      default: [],
    },
    isSaved: {
      type: Boolean,
      default: false,
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

export const ProjectIdea = mongoose.model<IProjectIdea>('ProjectIdea', ProjectIdeaSchema);
