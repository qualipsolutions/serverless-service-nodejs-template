import mongoose from 'mongoose';

let isConnected;
const uri = process.env.DB_URL;

export default async () => {
  if (isConnected) {
    // console.log('=> using existing database connection');
    return Promise.resolve();
  }

  // console.log('=> using new database connection');
  const db = await mongoose.connect(uri, {
    bufferCommands: false,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  isConnected = db.connections[0].readyState === 1;
  return Promise.resolve();
};
