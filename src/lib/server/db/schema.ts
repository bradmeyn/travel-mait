import { pgTable, text, uuid, timestamp, numeric, date } from 'drizzle-orm/pg-core';

const timestamps = {
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
};

export const user = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	...timestamps
});

export const trip = pgTable('trip', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
	...timestamps
});

export const itinerary = pgTable('itinerary', {
	id: uuid('id').primaryKey().defaultRandom(),
	tripId: uuid('tripId')
		.notNull()
		.references(() => trip.id),
	name: text('name').notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	budget: numeric('budget', { precision: 10, scale: 2 }).notNull(),
	...timestamps
});

export const destination = pgTable('destination', {
	id: uuid('id').primaryKey().defaultRandom(),
	itineraryId: uuid('itineraryId')
		.notNull()
		.references(() => itinerary.id),
	city: text('city').notNull(),
	country: text('country').notNull()
});

export const dayPlan = pgTable('day_plan', {
	id: uuid('id').primaryKey().defaultRandom(),
	destinationId: uuid('destinationId')
		.notNull()
		.references(() => destination.id),
	date: date('date').notNull()
});

export const accommodation = pgTable('accommodation', {
	id: uuid('id').primaryKey().defaultRandom(),
	destinationId: uuid('destinationId')
		.notNull()
		.references(() => destination.id),
	name: text('name').notNull(),
	checkInDate: date('check_in_date').notNull(),
	checkOutDate: date('check_out_date').notNull(),
	address: text('address'),
	cost: numeric('cost', { precision: 10, scale: 2 }),
	...timestamps
});

export const activity = pgTable('activity', {
	id: uuid('id').primaryKey().defaultRandom(),
	dayPlanId: uuid('dayPlanId')
		.notNull()
		.references(() => dayPlan.id),
	name: text('name').notNull(),
	startTime: timestamp('startTime').notNull(),
	endTime: timestamp('endTime').notNull(),
	location: text('location').notNull(),
	description: text('description').notNull(),
	cost: numeric('cost', { precision: 10, scale: 2 }).notNull()
});

export const flight = pgTable('flight', {
	id: uuid('id').primaryKey().defaultRandom(),
	tripId: uuid('tripId')
		.notNull()
		.references(() => trip.id),
	airline: text('airline').notNull(),
	flightNumber: text('flightNumber').notNull(),
	departureTime: timestamp('departureTime').notNull(),
	arrivalTime: timestamp('arrivalTime').notNull(),
	cost: numeric('cost', { precision: 10, scale: 2 }).notNull()
});
