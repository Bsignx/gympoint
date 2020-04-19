import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

import Queue from '../../lib/Queue';
import HelpOrderMail from '../jobs/HelpOrderMail';

class HelpOrderAnswerController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(404).json({ error: 'Help order not found' });
    }

    if (helpOrder.answer) {
      return res
        .status(400)
        .json({ error: 'Help order has already been answered' });
    }

    const updatedHelpOrder = await helpOrder.update({
      answer,
    });

    await Queue.add(HelpOrderMail.key, {
      helpOrder: updatedHelpOrder,
      student: await updatedHelpOrder.getStudent(),
    });

    return res.json(updatedHelpOrder);
  }
}

export default new HelpOrderAnswerController();
