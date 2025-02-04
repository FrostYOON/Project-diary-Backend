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
    try {
      const notifications = await Notification.find({
        $or: [
          { recipients: userId },
          { readBy: userId }
        ]
      })
        .populate('project', 'title')
        .sort({ createdAt: -1 });

      // 사용자별 알림 상태 처리
      return notifications.map(notification => {
        const notificationObj = notification.toObject();
        return {
          ...notificationObj,
          isRead: notification.readBy.includes(new Types.ObjectId(userId)),
          // 현재 사용자 기준으로 recipients, readBy 필터링
          recipients: notification.recipients.filter(id => id.toString() === userId),
          readBy: notification.readBy.filter(id => id.toString() === userId)
        };
      });
    } catch (error) {
      console.error('알림 목록 조회 중 오류:', error);
      throw error;
    }
  }

  // 알림 읽음 처리
  async markAsRead(notificationId: string, userId: string) {
    try {
      // 먼저 알림이 존재하는지 확인
      const existingNotification = await Notification.findById(notificationId);
      if (!existingNotification) {
        throw new Error('알림을 찾을 수 없습니다.');
      }

      // 이미 읽은 알림인지 확인
      if (existingNotification.readBy.includes(new Types.ObjectId(userId))) {
        return existingNotification;
      }

      // 알림 업데이트
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId },
        { 
          $addToSet: { readBy: userId },
          $pull: { recipients: userId }
        },
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
      console.error('알림 읽음 처리 중 오류:', error);
      throw error;
    }
  }

  // 알림 삭제 (사용자별)
  async deleteNotification(notificationId: string, userId: string) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId },
        { $pull: { readBy: userId, recipients: userId } },
        { new: true }
      );

      if (!notification) {
        throw new Error('알림을 찾을 수 없습니다.');
      }

      // recipients 배열이 비어있으면 알림 완전 삭제
      if (notification.recipients.length === 0 && notification.readBy.length === 0) {
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