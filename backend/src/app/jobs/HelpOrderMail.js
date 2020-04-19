import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { student, helpOrder } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Answer to your question',
      template: 'help-order',
      context: {
        student: student.name,
        date: format(parseISO(helpOrder.created_at), 'PPPP'),
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new HelpOrderMail();
