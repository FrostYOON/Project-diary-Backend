import notificationService from '../services/notification.service';
import schedule from 'node-schedule';

export const initScheduler = () => {
  // 매일 오전 9시에 마감 임박 프로젝트 체크
  schedule.scheduleJob('0 7 * * *', async () => {
    await notificationService.checkDueSoonProjects();
  });

  // 매일 오전 9시에 마감일 프로젝트 체크
  schedule.scheduleJob('0 7 * * *', async () => {
    await notificationService.checkDueProjects();
  });
}; 