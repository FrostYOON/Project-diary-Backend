import { Notification, User, Project } from '../models';
import { IProject } from '../types/project.types';
import moment from 'moment';
import { Types } from 'mongoose';

class NotificationService {
  // 알림 수신자 목록 조회
  private async getNotificationRecipients(project: IProject): Promise<Types.ObjectId[]> {
    // 해당 부서의 모든 사용자 조회
    const departmentUsers = await User.find({ 
      department: project.department 
    }).select('_id');

    // 작성자 ID와 부서 사용자 ID들을 합침
    const recipientIds = new Set([
      project.author.toString(),
      ...departmentUsers.map(user => user._id.toString())
    ]);

    return Array.from(recipientIds).map(id => new Types.ObjectId(id));
  }

  // 마감 임박 알림 체크 및 생성
  async checkDueSoonProjects() {
    try {
      const sevenDaysFromNow = moment().add(7, 'days').endOf('day').toDate();
      const today = moment().startOf('day').toDate();

      // 마감 7일 전인 프로젝트 조회
      const dueSoonProjects = await Project.find({
        endDate: {
          $gte: today,
          $lte: sevenDaysFromNow
        },
        status: { $ne: '완료' }  // 완료되지 않은 프로젝트만
      });

      for (const project of dueSoonProjects) {
        const recipients = await this.getNotificationRecipients(project);
        await Notification.create({
          title: '프로젝트 마감 임박',
          content: `프로젝트 "${project.title}"의 마감이 7일 남았습니다.`,
          type: 'PROJECT_DUE_SOON',
          project: project._id,
          recipients
        });
      }
    } catch (error) {
      console.error('마감 임박 알림 체크 중 오류:', error);
    }
  }

  // 마감일 알림 체크 및 생성
  async checkDueProjects() {
    try {
      const today = moment().startOf('day').toDate();
      const tomorrow = moment().add(1, 'day').startOf('day').toDate();

      // 오늘 마감인 프로젝트 조회
      const dueProjects = await Project.find({
        endDate: {
          $gte: today,
          $lt: tomorrow
        },
        status: { $ne: '완료' }  // 완료되지 않은 프로젝트만
      });

      for (const project of dueProjects) {
        const recipients = await this.getNotificationRecipients(project);
        await Notification.create({
          title: '프로젝트 마감',
          content: `프로젝트 "${project.title}"가 오늘 마감입니다.`,
          type: 'PROJECT_ENDED',
          project: project._id,
          recipients
        });
      }
    } catch (error) {
      console.error('마감일 알림 체크 중 오류:', error);
    }
  }

  // 프로젝트 생성 알림
  async createProjectNotification(project: IProject) {
    try {
      const recipients = await this.getNotificationRecipients(project);
      await Notification.create({
        title: '새 프로젝트 생성',
        content: `새 프로젝트 "${project.title}"가 생성되었습니다.`,
        type: 'PROJECT_CREATED',
        project: project._id,
        recipients
      });
    } catch (error) {
      console.error('프로젝트 생성 알림 중 오류:', error);
      throw error;
    }
  }

  // 프로젝트 삭제 알림
  async createProjectCancelNotification(project: IProject) {
    try {
      const recipients = await this.getNotificationRecipients(project);
      await Notification.create({
        title: '프로젝트 철회',
        content: `프로젝트 "${project.title}"가 취소되었습니다.`,
        type: 'PROJECT_CANCELED',
        project: project._id,
        recipients
      });
    } catch (error) {
      console.error('프로젝트 취소 알림 중 오류:', error);
      throw error;
    }
  }

  // 사용자의 알림 목록 조회
  async getUserNotifications(userId: string) {
    return Notification.find({ recipients: userId })
      .populate('project', 'title')
      .sort({ createdAt: -1 });
  }

  // 알림 읽음 처리
  async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { 
          _id: notificationId,
          recipients: userId,
          'readBy': { $ne: userId } // 아직 읽지 않은 경우에만
        },
        { 
          $addToSet: { readBy: userId } // readBy 배열에 사용자 추가
        },
        { new: true }
      );

      if (!notification) {
        throw new Error('알림을 찾을 수 없거나 이미 읽은 알림입니다.');
      }

      return notification;
    } catch (error) {
      console.error('알림 읽음 처리 중 오류:', error);
      throw error;
    }
  }

  // 알림 삭제 (사용자별)
  async deleteNotification(notificationId: string, userId: string) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId },
        { $pull: { recipients: userId } },
        { new: true }
      );

      if (!notification) {
        throw new Error('알림을 찾을 수 없습니다.');
      }

      // recipients 배열이 비어있으면 알림 완전 삭제
      if (notification.recipients.length === 0) {
        await Notification.findByIdAndDelete(notificationId);
        return null;
      }

      return notification;
    } catch (error) {
      console.error('알림 삭제 중 오류:', error);
      throw error;
    }
  }
}

export default new NotificationService();