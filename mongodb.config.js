import mongoose from "mongoose";
const url = 'mongodb+srv://singhshashi126:XwnLN4iCXuvp6amm@cluster0.o0efqix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}