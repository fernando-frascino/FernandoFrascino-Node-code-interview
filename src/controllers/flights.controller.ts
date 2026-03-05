import {
    JsonController,
    Get,
    Param,
    Put,
    Post,
    Body,
    Delete,
} from 'routing-controllers';
import { FlightsService } from '../services/flights.service';

@JsonController('/flights', { transformResponse: false })
export default class FlightsController {
    private _flightsService: FlightsService;

    constructor() {
        this._flightsService = new FlightsService();
    }

    @Get('')
    async getAll() {
        return {
            status: 200,
            data: await this._flightsService.getFlights(),
        };
    }

    @Delete('/passengers/:email')
    async deletePassenger(@Param('email') passengerEmail: string,) {
        return {
            status: 200,
            data: await this._flightsService.deletePassenger(passengerEmail),
        };
    }

    @Post('/:code/passengers')
    async insertPassenger(
        @Param('code') flightCode: string,
        @Body()
        passenger: {
            name: string;
            email: string;
        }
    ) {
        return {
            status: 200,
            data: await this._flightsService.addPassenger(passenger, flightCode)
        }
    }

    @Put('/:code')
    async updateFlightStatus(@Param('code') code: string) {
        return {
            status: 200,
            data: await this._flightsService.updateFlightStatus(code),
        };
    }

    // add flight
    @Post('')
    async addFlight(
        @Body()
        flight: {
            code: string;
            origin: string;
            destination: string;
            status: string;
        },
    ) {
        return {
            status: 200,
            data: await this._flightsService.addFlight(flight),
        };
    }
}
