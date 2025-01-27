import { Task } from "../models";
import { ITask } from "../types/task.types";
import { ApiResponse } from "../types/response.types";

class TaskService {
  // 태스크 생성
  async createTask(data: ITask): Promise<ApiResponse> {
    try {
      const task = await Task.create(data);
      return {
        success: true,
        message: '업무가 생성되었습니다.',
        data: { task }
      };
    } catch (error) {
      throw new Error('업무 생성 중 오류가 발생했습니다.');
    }
  }

  // 전체 업무 조회
  async getAllTasks(): Promise<ApiResponse> {
    try {
      const tasks = await Task.find()
        .populate('project', 'title')  // project의 title만
        .populate('author', 'name')
        .sort({ endDate: -1 });   // author의 name만
      
      return {
        success: true,
        message: '업무 목록 조회 성공',
        data: { tasks }
      };
    } catch (error) {
      throw new Error('업무 목록 조회 중 오류가 발생했습니다.');
    }
  }

  // 특정 업무 조회
  async getTaskById(taskId: string): Promise<ApiResponse> {
    try {
      const task = await Task.findById(taskId)
        .populate('project', 'title')  // project의 title만
        .populate('author', 'name');   // author의 name만

      if (!task) {
        return {
          success: false,
          message: '업무를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '업무 조회 성공',
        data: { task }
      };
    } catch (error) {
      throw new Error('업무 조회 중 오류가 발생했습니다.');
    }
  }

  // 업무 수정
  async updateTask(id: string, data: ITask): Promise<ApiResponse> {
    try {
      const task = await Task.findByIdAndUpdate(id, data, { new: true });
      if (!task) {
        return {
          success: false,
          message: '업무를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '업무 정보가 수정되었습니다.',
        data: { task }
      };
    } catch (error) {
      throw new Error('업무 수정 중 오류가 발생했습니다.');
    }
  }

  // 업무 삭제
  async deleteTask(id: string): Promise<ApiResponse> {
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return {
          success: false,
          message: '업무를 찾을 수 없습니다.',
          status: 404
        };
      }
      return {
        success: true,
        message: '업무가 삭제되었습니다.'
      };
    } catch (error) {
      throw new Error('업무 삭제 중 오류가 발생했습니다.');
    }
  }
}

export const taskService = new TaskService();