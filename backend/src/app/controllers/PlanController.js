import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async show(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      res.status(400).json({ error: 'Plan not found' });
    }

    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required().positive().integer(),
      price: Yup.number().required().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { title } = req.body;

    const PlansExists = await Plan.findOne({ where: { title } });

    if (PlansExists) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().positive().integer(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation failed' });
    }

    const { id } = req.params;
    const { title } = req.body;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    if (title && title !== plan.title) {
      const planExists = await Plan.findOne({ where: { title } });

      if (planExists) {
        res.status(400).json({ error: 'Plan name already in use' });
      }
    }

    const updatedPlan = await plan.update(req.body);

    return res.json(updatedPlan);
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    await (await plan).destroy();

    return res.json({ message: 'Plan deleted' });
  }
}

export default new PlanController();
