import mongoose, { Schema } from 'mongoose';

interface Flight {
    code: string;
    origin: string;
    destination: string;
    status: string;
}

const schema = new Schema<Flight>(
    {
        code: { required: true, type: String },
        origin: { required: true, type: String },
        destination: { required: true, type: String },
        status: String,
    },
    { timestamps: true },
);

export const FlightsModel = mongoose.model('Flights', schema);
