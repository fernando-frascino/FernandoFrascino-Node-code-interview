import { PersonsModel } from '../src/models/persons.model'
import { FlightsModel } from '../src/models/flights.model'

import personsJson from './persons.json'
import flightsJson from './flights.json'

export const loadData = async () => {
    for (const person of personsJson) {
        await PersonsModel.create(person)
    }

    console.log(` --- Loaded ${personsJson.length} persons ---`)

    for (const flight of flightsJson) {
        await FlightsModel.create(flight)
    }

    console.log(` --- Loaded ${flightsJson.length} flights ---`)
}
