import { Schema } from "mongoose";
import { IProject } from "../../types/project.types";

const ProjectSchema: Schema<IProject> = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String
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
    required: true,
    enum: ['준비', '진행중', '완료', '보류']
  },
  manager: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User"
  }],
  author: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }
}, {
  timestamps: true  // createdAt, updatedAt 자동 생성
});

export default ProjectSchema;
