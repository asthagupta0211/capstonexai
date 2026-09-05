import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureItem {
  title: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
}

export interface ITechRecommendation {
  name: string;
  rationale: string;
}

export interface IRoadmapPhase {
  phaseNum: number;
  title: string;
  durationWeeks: number;
  tasks: string[];
  deliverables: string[];
}

export interface IProjectPlan extends Document {
  id: string;
  ideaId: string;
  mustHaveFeatures: IFeatureItem[];
  goodToHaveFeatures: IFeatureItem[];
  futureFeatures: IFeatureItem[];
  techStackDetailed: {
    frontend: ITechRecommendation[];
    backend: ITechRecommendation[];
    database: ITechRecommendation[];
    ai: ITechRecommendation[];
    apis: ITechRecommendation[];
    deployment: ITechRecommendation[];
    tools: ITechRecommendation[];
  };
  architectureSummary: string;
  roadmapPhases: IRoadmapPhase[];
  improvements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectPlanSchema = new Schema<IProjectPlan>(
  {
    ideaId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    mustHaveFeatures: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        complexity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
      },
    ],
    goodToHaveFeatures: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        complexity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
      },
    ],
    futureFeatures: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        complexity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'High' },
      },
    ],
    techStackDetailed: {
      frontend: [{ name: String, rationale: String }],
      backend: [{ name: String, rationale: String }],
      database: [{ name: String, rationale: String }],
      ai: [{ name: String, rationale: String }],
      apis: [{ name: String, rationale: String }],
      deployment: [{ name: String, rationale: String }],
      tools: [{ name: String, rationale: String }],
    },
    architectureSummary: {
      type: String,
      required: true,
    },
    roadmapPhases: [
      {
        phaseNum: { type: Number, required: true },
        title: { type: String, required: true },
        durationWeeks: { type: Number, required: true },
        tasks: { type: [String], default: [] },
        deliverables: { type: [String], default: [] },
      },
    ],
    improvements: {
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

export const ProjectPlan = mongoose.model<IProjectPlan>('ProjectPlan', ProjectPlanSchema);
