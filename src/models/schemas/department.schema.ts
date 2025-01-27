import { Schema } from "mongoose";
import { IDepartment, DEPARTMENTS } from "../../types/department.types";

const DepartmentSchema: Schema<IDepartment> = new Schema({
  name: { type: String, required: true, enum: DEPARTMENTS },
});

export default DepartmentSchema;