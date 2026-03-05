import { Database } from '../database_abstract';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { FlightsModel } from './models/flights.model';

export class MongoStrategy extends Database {
    constructor() {
        super();
        this.getInstance();
    }

    private async getInstance() {
        const mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();

        const mongooseOpts = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        };

        const flights = [
            {
                code: 'ABC-123',
                origin: 'EZE',
                destination: 'LDN',
                status: 'ACTIVE',
            },
            {
                code: 'XYZ-678',
                origin: 'CRC',
                destination: 'MIA',
                status: 'ACTIVE',
            },
        ];

        (async () => {
            await mongoose.connect(uri, mongooseOpts);
            await FlightsModel.create(flights);
        })();
    }

    public async getFlights() {
        return FlightsModel.find({});
    }
}
