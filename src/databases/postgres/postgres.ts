import { Database } from '../database_abstract';

import { newDb, IMemoryDb } from 'pg-mem';

export class PostgreStrategy extends Database {
    _instance: IMemoryDb;

    constructor() {
        super();
        this.getInstance();
    }

    private async getInstance() {
        const db = newDb();

        db.public.many(`
            CREATE TABLE flights (
                code VARCHAR(5) PRIMARY KEY,
                origin VARCHAR(50),
                destination VARCHAR(50),
                status VARCHAR(50)
            );

            CREATE TABLE passengers (
                id BIGSERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(70)
            );

            CREATE TABLE passengers_flights (
                id BIGSERIAL PRIMARY KEY,
                passenger_id BIGSERIAL REFERENCES passengers(id),
                flight_id VARCHAR(5) REFERENCES flights(code)
            );
        `);

        db.public.many(`
            INSERT INTO flights (code, origin, destination, status)
            VALUES ('LH123', 'Frankfurt', 'New York', 'on time'),
                     ('LH124', 'Frankfurt', 'New York', 'delayed'),
                        ('LH125', 'Frankfurt', 'New York', 'on time');

            INSERT INTO passengers (name, email)
            VALUES ('Fernando', 'fernando@yahoo.com'),
                    ('Andre', 'andre@beon.com'),
                    ('Michelle', 'michelle@gmail.com');
        `);

        PostgreStrategy._instance = db;

        return db;
    }

    public async getFlights() {
        return PostgreStrategy._instance.public.many(`
            SELECT f.*, p.name, p.email FROM flights f
            LEFT JOIN passengers_flights pf ON f.code = pf.flight_id
            LEFT JOIN passengers p ON p.id = pf.passenger_id;
        `);
    }

    public async addFlight(flight: {
        code: string;
        origin: string;
        destination: string;
        status: string;
    }) {
        return PostgreStrategy._instance.public.many(
            `INSERT INTO flights (code, origin, destination, status) VALUES ('${flight.code}', '${flight.origin}', '${flight.destination}', '${flight.status}')`,
        );
    }

    public async addPassenger(
        passenger: {
            name: string;
            email: string;
        },
        flightCode: string,
    ) {
        return PostgreStrategy._instance.public.many(
            `
            BEGIN;
            INSERT INTO passengers (name, email) VALUES ('${passenger.name}', '${passenger.email}');
            INSERT INTO passengers_flights (flight_id, passenger_id) VALUES ('${flightCode}', SELECT id from passengers p WHERE p.email = '${passenger.email}' );
            COMMIT;
            `,
        );
    }

    public async deletePassenger(
        email: string
    ) {
        return PostgreStrategy._instance.public.many(
            `
            BEGIN;
            DELETE FROM passengers_flights WHERE passenger_id IN (SELECT id from passengers WHERE email = '${email}');
            DELETE FROM passengers WHERE email = '${email}';
            COMMIT;
            `,
        );
    }
}
