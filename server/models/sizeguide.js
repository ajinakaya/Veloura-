import mongoose from 'mongoose';

const sizeGuideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String, 
      },
    ],
    sizeDetails: [
      {
        label: { type: String },       
        measurement: { type: String }, 
        note: { type: String },       
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SizeGuide = mongoose.model('SizeGuide', sizeGuideSchema);

export default SizeGuide;
