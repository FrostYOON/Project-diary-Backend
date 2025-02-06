import mongoose, { Schema } from 'mongoose';


const ProjectSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  description: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['준비', '진행중', '완료', '보류'],
    default: '준비',
    required: true
  },
  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }],
  author: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

export const Project = mongoose.model('Project', ProjectSchema);
export default ProjectSchema;
