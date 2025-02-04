import { Router } from 'express';
import notificationService from '../../../services/notification.service';

const router = Router();

// 사용자의 알림 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
      return;
    }
    const notifications = await notificationService.getUserNotifications(userId);
    res.json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    next(error);
  }
});

// 알림 읽음 처리
router.patch('/:id/read', async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
      return;
    }
    const notification = await notificationService.markAsRead(req.params.id, userId);
    res.json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    next(error);
  }
});

// 알림 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
      return;
    }
    const notification = await notificationService.deleteNotification(req.params.id, userId);
    res.json({
      success: true,
      message: '알림이 삭제되었습니다.',
      data: { notification }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 