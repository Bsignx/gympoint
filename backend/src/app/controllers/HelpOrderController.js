import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async show(req, res) {
    const student_id = req.params.studentId;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id,
      },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const student_id = req.params.studentId;
    const { question } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const helpOrder = await HelpOrder.create({
      student_id,
      question,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
