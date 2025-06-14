import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  skills: string[];

  @Prop({ type: Object, default: null })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop()
  location: string;

  @Prop()
  salary: number;

  @Prop()
  quantity: number;

  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  isActive: boolean;

  @Prop({ type: Object, default: null })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object, default: null })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object, default: null })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const JobDocument = SchemaFactory.createForClass(Job);
