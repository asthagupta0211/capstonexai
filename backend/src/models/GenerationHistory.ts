import mongoose, { Schema, Document } from 'mongoose';

export interface IGenerationHistory extends Document {
  userId: string;
  actionType: 'GENERATE_IDEAS' | 'CREATE_PLAN' | 'MENTOR_REVIEW';
  profileSnapshot?: any;
  modelName: string;
  isFallback: boolean;
  latencyMs: number;
  createdAt: Date;
}

const GenerationHistorySchema = new Schema<IGenerationHistory>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: ['GENERATE_IDEAS', 'CREATE_PLAN', 'MENTOR_REVIEW'],
      required: true,
    },
    profileSnapshot: {
      type: Schema.Types.Mixed,
    },
    modelName: {
      type: String,
      required: true,
    },
    isFallback: {
      type: Boolean,
      default: false,
    },
    latencyMs: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const GenerationHistory = mongoose.model<IGenerationHistory>('GenerationHistory', GenerationHistorySchema);
