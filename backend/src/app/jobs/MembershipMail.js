import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';

class MembershipMail {
  get key() {
    return 'MembershipMail';
  }

  async handle({ data }) {
    const { student, membership, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'New Membership!',
      template: 'membership',
      context: {
        student: student.name,
        startDate: format(parseISO(membership.start_date), 'PPPP'),
        endDate: format(parseISO(membership.end_date), 'PPPP'),
        plan: plan.title,
        price: membership.price,
      },
    });
  }
}

export default new MembershipMail();
