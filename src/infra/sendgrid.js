import nodemailer from 'nodemailer';

const sendEmail = async (config, from, to, subject, html) => {
  /* istanbul ignore else */
  if (process.env.STAGE === 'test') {
    return {
      messageId: '5F5F269DFBCCE3201B40CF47',
    };
  }
  const transporter = nodemailer.createTransport(config);
  /* istanbul ignore next */
  const info = await transporter.sendMail({
    from, // sender address
    to,
    subject,
    text: html,
    html,
  });
  // console.log('Message sent: %s', info.messageId);
  /* istanbul ignore next */
  return info;
};

export default sendEmail;
