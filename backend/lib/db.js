import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 ثانية انتظار للاتصال
      socketTimeoutMS: 45000, // 45 ثانية انتظار للعمليات
      maxPoolSize: 10, // أقصى عدد اتصالات
      minPoolSize: 2, // أقل عدد اتصالات مستمرة
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    // مراقبة حالة الاتصال
    mongoose.connection.on('connected', () => {
      console.log('🟢 MongoDB connection established');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('🔴 MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🟡 MongoDB connection disconnected');
    });
    
    return conn;
  } catch (error) {
    console.error("❌ Error connecting to MONGODB:", error.message);
    console.error("🔍 Error details:", {
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    
    // إعادة المحاولة بعد 5 ثواني في حالة الفشل
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(() => {
      connectDB();
    }, 5000);
    
    // process.exit(1); // تم التعليق للسماح بإعادة المحاولة
  }
};

// دالة مساعدة للتحقق من حالة الاتصال
export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };
  return {
    state: states[mongoose.connection.readyState],
    readyState: mongoose.connection.readyState
  };
};