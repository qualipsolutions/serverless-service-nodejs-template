// import util from 'util';

// const { promisify } = util;

const invoke = async (handler, event = {}, context = {}) =>
  handler(event, context);

export default invoke;
