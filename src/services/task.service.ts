import { Task } from "../models";
import { ITask } from "../types/task.types";
import { ApiResponse } from "../types/response.types";

class TaskService {
  // 태스크 생성
  async createTask(taskData: any): Promise<ApiResponse> {
    try {
      // 필수 필드 검증
      if (!taskData.title || !taskData.projectId) {
        return {
          success: false,
          message: '제목과 프로젝트 ID는 필수 항목입니다.',
          status: 400
        };
      }

      const task = await Task.create({
        ...taskData,
        project: taskData.projectId  // projectId를 project 필드로 매핑
      });
      
      const populatedTask = await Task.findById(task._id)
        .populate('author', 'name')
        .populate('project', 'title');

      return {
        success: true,
        message: '업무가 생성되었습니다.',
        data: { task: populatedTask }
      };
    } catch (error) {
      console.error('Task creation service error:', error);
      throw new Error('업무 생성 중 오류가 발생했습니다.');
    }
  }

  // 전체 업무 조회
  async getAllTasks(userId: string): Promise<ApiResponse> {
    try {
      const tasks = await Task.find({ author: userId })  // 작성자 기준으로 필터링
        .populate('project', 'title')
        .populate('author', 'name')
        .sort({ endDate: -1 });

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
  async updateTask(taskId: string, taskData: any): Promise<ApiResponse> {
    try {

      const task = await Task.findByIdAndUpdate(
        taskId,
        {
          ...taskData,
          project: taskData.projectId || taskData.project  // projectId나 project 둘 다 허용
        },
        { new: true }
      )
      .populate('author', 'name')
      .populate('project', 'title');

      if (!task) {
        return {
          success: false,
          message: '업무를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '업무가 수정되었습니다.',
        data: { task }
      };
    } catch (error) {
      console.error('Task update service error:', error);
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