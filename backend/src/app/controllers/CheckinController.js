import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const student_id = req.params.studentId;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id,
      },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const student_id = req.params.studentId;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const checkinDate = new Date();

    const checkin = await Checkin.findOne({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfDay(checkinDate), endOfDay(checkinDate)],
        },
      },
    });

    if (checkin) {
      return res.json({ message: 'Student already checked in today' });
    }

    const checkinsCount = await Checkin.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfWeek(checkinDate), endOfWeek(checkinDate)],
        },
      },
    });

    if (checkinsCount === 5) {
      return res
        .status(403)
        .json({ error: 'Student can only checkin 5 times per week' });
    }

    await Checkin.create({ student_id });

    return res.json({ message: 'Student checked in successfully' });
  }
}

export default new CheckinController();
