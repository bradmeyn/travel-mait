import { setContext, getContext } from 'svelte';

// Types for itinerary data structure
export type Activity = {
	time: string;
	title: string;
	description: string;
	duration: string;
	cost?: string;
	tips?: string;
};

export type DayItinerary = {
	day: number;
	date?: string;
	location: string;
	theme: string;
	activities: Activity[];
	meals?: {
		breakfast?: string;
		lunch?: string;
		dinner?: string;
	};
	accommodation?: string;
	transportation?: string;
	budget_estimate?: string;
};

export type Destination = {
	city: string;
	country: string;
	days_spent: number;
};

export type BudgetBreakdown = {
	accommodation: string;
	food: string;
	activities: string;
	transportation: string;
	total_estimate: string;
};

export type Itinerary = {
	id: string;
	title: string;
	overview: string;
	duration: number;
	destinations: Destination[];
	trip_style: string;
	best_time_to_visit: string;
	daily_itinerary: DayItinerary[];
	packing_suggestions?: string[];
	budget_breakdown?: BudgetBreakdown;
	important_notes?: string[];
	created_at: Date;
};

export type Message = {
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp?: Date;
	itinerary?: Itinerary;
};

type RequestState = {
	isLoading: boolean;
	error: string | null;
};

class ItineraryChat {
	messages = $state<Message[]>([]);
	itineraries = $state<Itinerary[]>([]);
	currentItinerary = $state<Itinerary | null>(null);
	request = $state<RequestState>({ isLoading: false, error: null });

	addMessage(message: Message) {
		this.messages = [...this.messages, { ...message, timestamp: new Date() }];
	}

	addItinerary(itinerary: Itinerary) {
		this.itineraries = [...this.itineraries, itinerary];
		this.currentItinerary = itinerary;
	}

	setCurrentItinerary(itinerary: Itinerary | null) {
		this.currentItinerary = itinerary;
	}

	async generateItinerary(prompt: string) {
		if (this.request.isLoading) return;

		// Add user message immediately
		this.addMessage({
			role: 'user',
			content: prompt
		});

		// Set loading state
		this.request = { isLoading: true, error: null };

		try {
			const response = await fetch('/api/generate-itinerary', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success && data.itinerary) {
				// Create itinerary with unique ID
				const itinerary: Itinerary = {
					...data.itinerary,
					id: crypto.randomUUID(),
					created_at: new Date()
				};

				// Add to itineraries list
				this.addItinerary(itinerary);

				// Add assistant response with itinerary
				this.addMessage({
					role: 'assistant',
					content: `I've created your ${itinerary.duration}-day ${itinerary.trip_style} itinerary: "${itinerary.title}"`,
					itinerary
				});
			} else {
				throw new Error('Failed to generate itinerary');
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			this.request.error = errorMessage;

			// Add error message to chat
			this.addMessage({
				role: 'system',
				content: `Error generating itinerary: ${errorMessage}`
			});
		} finally {
			this.request.isLoading = false;
		}
	}

	async refineItinerary(refinementRequest: string) {
		if (!this.currentItinerary || this.request.isLoading) return;

		this.addMessage({
			role: 'user',
			content: refinementRequest
		});

		this.request = { isLoading: true, error: null };

		try {
			const response = await fetch('/api/refine-itinerary', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					itinerary: this.currentItinerary,
					refinement: refinementRequest
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success && data.itinerary) {
				// Update current itinerary
				const updatedItinerary: Itinerary = {
					...data.itinerary,
					id: this.currentItinerary.id,
					created_at: this.currentItinerary.created_at
				};

				// Update in itineraries list
				this.itineraries = this.itineraries.map((it) =>
					it.id === updatedItinerary.id ? updatedItinerary : it
				);
				this.currentItinerary = updatedItinerary;

				this.addMessage({
					role: 'assistant',
					content: `I've updated your itinerary based on your request.`,
					itinerary: updatedItinerary
				});
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			this.request.error = errorMessage;

			this.addMessage({
				role: 'system',
				content: `Error refining itinerary: ${errorMessage}`
			});
		} finally {
			this.request.isLoading = false;
		}
	}

	deleteItinerary(id: string) {
		this.itineraries = this.itineraries.filter((it) => it.id !== id);
		if (this.currentItinerary?.id === id) {
			this.currentItinerary = null;
		}
	}

	clearMessages() {
		this.messages = [];
		this.request = { isLoading: false, error: null };
	}

	clearAll() {
		this.messages = [];
		this.itineraries = [];
		this.currentItinerary = null;
		this.request = { isLoading: false, error: null };
	}
}

const ITINERARY_CHAT_KEY = Symbol('itinerary-chat');

export function setChatState() {
	return setContext(ITINERARY_CHAT_KEY, new ItineraryChat());
}

export function getChatState(): ItineraryChat {
	const chatState = getContext<ItineraryChat>(ITINERARY_CHAT_KEY);
	if (!chatState) {
		throw new Error(
			'Itinerary chat state not found. Make sure to call setItineraryChatState() in a parent component.'
		);
	}
	return chatState;
}

// Test itinerary data for your European vacation
export const testItinerary = {
	id: 'test-italy-14day',
	title: 'Relaxing Italian Riviera & Tuscany Escape',
	overview:
		'A perfect blend of coastal charm and countryside serenity, featuring the stunning Cinque Terre villages, romantic Florence, and peaceful Tuscan hills. This itinerary balances must-see sights with plenty of time for relaxation and authentic Italian experiences.',
	duration: 14,
	destinations: [
		{ city: 'Rome', country: 'Italy', days_spent: 3 },
		{ city: 'Cinque Terre', country: 'Italy', days_spent: 4 },
		{ city: 'Florence', country: 'Italy', days_spent: 3 },
		{ city: 'Siena', country: 'Italy', days_spent: 2 },
		{ city: 'Pisa', country: 'Italy', days_spent: 1 },
		{ city: 'Rome', country: 'Italy', days_spent: 1 }
	],
	trip_style: 'Relaxing Cultural',
	best_time_to_visit: 'May-June or September-October',
	daily_itinerary: [
		{
			day: 1,
			location: 'Rome',
			theme: 'Arrival & Ancient Wonders',
			activities: [
				{
					time: '10:00 AM',
					title: 'Airport Transfer & Hotel Check-in',
					description:
						'Arrive at Leonardo da Vinci Airport, take the Leonardo Express to Termini Station',
					duration: '2 hours',
					cost: '€15',
					tips: 'Book express train tickets online to skip lines'
				},
				{
					time: '2:00 PM',
					title: 'Colosseum & Roman Forum Tour',
					description:
						'Explore the iconic amphitheater and ancient ruins with skip-the-line access',
					duration: '3 hours',
					cost: '€35',
					tips: 'Wear comfortable shoes and bring water'
				},
				{
					time: '6:00 PM',
					title: 'Aperitivo in Trastevere',
					description:
						'Enjoy traditional Italian drinks and small plates in this charming neighborhood',
					duration: '2 hours',
					cost: '€20-30'
				}
			],
			meals: {
				lunch: 'Light lunch near the Colosseum - try Trattoria Monti',
				dinner: 'Da Enzo al 29 in Trastevere for authentic Roman cuisine'
			},
			accommodation: 'Hotel Artemide (near Termini Station)',
			budget_estimate: '€120-150'
		},
		{
			day: 2,
			location: 'Rome',
			theme: 'Vatican & Relaxation',
			activities: [
				{
					time: '8:00 AM',
					title: 'Vatican Museums & Sistine Chapel',
					description: "Early morning tour to avoid crowds, see Michelangelo's masterpieces",
					duration: '3 hours',
					cost: '€45',
					tips: 'Book first entry slot to beat the crowds'
				},
				{
					time: '12:00 PM',
					title: "St. Peter's Basilica",
					description:
						'Marvel at the largest church in the world, climb the dome if energy permits',
					duration: '2 hours',
					cost: '€10 (dome)',
					tips: 'Dress modestly - covered shoulders and knees required'
				},
				{
					time: '3:00 PM',
					title: 'Villa Borghese Gardens',
					description: "Relax in Rome's central park, rent bikes or just stroll",
					duration: '2 hours',
					cost: 'Free',
					tips: 'Perfect spot for a afternoon nap under the trees'
				},
				{
					time: '6:00 PM',
					title: 'Trevi Fountain & Spanish Steps',
					description: 'Classic Rome photo ops, throw a coin for good luck',
					duration: '1.5 hours',
					cost: 'Free'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast or nearby café',
				lunch: 'Pizzarium for amazing pizza al taglio near Vatican',
				dinner: 'Checchino dal 1887 for traditional Roman specialties'
			},
			budget_estimate: '€95-120'
		},
		{
			day: 3,
			location: 'Rome to Cinque Terre',
			theme: 'Travel Day & Coastal Arrival',
			activities: [
				{
					time: '9:00 AM',
					title: 'Train to La Spezia',
					description: 'High-speed train journey through Italian countryside',
					duration: '4 hours',
					cost: '€45-65',
					tips: 'Book seats on the right side for better views'
				},
				{
					time: '2:00 PM',
					title: 'Local Train to Monterosso',
					description: 'Connect to Cinque Terre train line, first glimpse of coastal beauty',
					duration: '30 minutes',
					cost: '€4'
				},
				{
					time: '3:00 PM',
					title: 'Check-in & Beach Relaxation',
					description: "Settle into accommodation and unwind at Monterosso's sandy beach",
					duration: '3 hours',
					cost: 'Free',
					tips: 'Monterosso has the only real sandy beach in Cinque Terre'
				},
				{
					time: '6:30 PM',
					title: 'Sunset Aperitif',
					description: 'Welcome drinks overlooking the Ligurian Sea',
					duration: '1.5 hours',
					cost: '€15-25'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast in Rome',
				lunch: 'Packed lunch for train journey',
				dinner: "L'Ancora della Tortuga - seafood with sea views"
			},
			accommodation: 'Hotel Villa Steno, Monterosso',
			transportation: 'High-speed train Rome-La Spezia, local train to Monterosso',
			budget_estimate: '€140-180'
		},
		{
			day: 4,
			location: 'Cinque Terre - Monterosso & Vernazza',
			theme: 'Coastal Villages & Hiking',
			activities: [
				{
					time: '9:00 AM',
					title: 'Monterosso Old Town Exploration',
					description: 'Wander through medieval streets, visit Chiesa di San Giovanni Battista',
					duration: '2 hours',
					cost: 'Free',
					tips: 'Try local focaccia with cheese at Il Frantoio'
				},
				{
					time: '11:30 AM',
					title: 'Train to Vernazza',
					description: 'Short scenic ride to perhaps the most picturesque village',
					duration: '15 minutes',
					cost: '€4'
				},
				{
					time: '12:00 PM',
					title: 'Vernazza Harbor & Swimming',
					description: 'Relax by the tiny harbor, swim in crystal-clear waters',
					duration: '3 hours',
					cost: 'Free',
					tips: 'Bring water shoes - rocky coastline'
				},
				{
					time: '4:00 PM',
					title: 'Vernazza to Monterosso Coastal Walk',
					description: 'Easy coastal trail with stunning Mediterranean views',
					duration: '1.5 hours',
					cost: '€7.50 (trail pass)',
					tips: 'Trail can be crowded - start early or late in day'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast',
				lunch: 'Gambero Rosso in Vernazza - try the anchovy pasta',
				dinner: 'Miky Restaurant, Monterosso - Michelin recommended'
			},
			budget_estimate: '€85-110'
		},
		{
			day: 5,
			location: 'Cinque Terre - Corniglia & Manarola',
			theme: 'Wine Terraces & Sunset Views',
			activities: [
				{
					time: '10:00 AM',
					title: 'Train to Corniglia',
					description: 'Visit the highest village, perched on dramatic cliffs',
					duration: '30 minutes travel',
					cost: '€4'
				},
				{
					time: '10:30 AM',
					title: 'Corniglia Village Walk & Viewpoint',
					description: 'Climb to the village center, enjoy panoramic terrace views',
					duration: '2 hours',
					cost: 'Free',
					tips: '382 steps from station to village - pace yourself!'
				},
				{
					time: '1:00 PM',
					title: 'Local Wine Tasting',
					description: 'Sample Sciacchetrà dessert wine and local whites',
					duration: '1.5 hours',
					cost: '€25-35',
					tips: 'A Cantina de Mananan offers great tastings'
				},
				{
					time: '3:30 PM',
					title: 'Train to Manarola',
					description: 'Journey to the wine-making capital of Cinque Terre',
					duration: '15 minutes',
					cost: '€4'
				},
				{
					time: '4:00 PM',
					title: "Manarola Harbor & Via dell'Amore",
					description: "Explore the romantic fishing village and famous lovers' path",
					duration: '2 hours',
					cost: 'Free',
					tips: "Via dell'Amore may be closed for maintenance - check ahead"
				},
				{
					time: '6:30 PM',
					title: 'Sunset at Punta Bonfiglio',
					description: 'Best sunset viewpoint in all of Cinque Terre',
					duration: '1 hour',
					cost: 'Free'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast',
				lunch: 'A Cantina de Mananan, Corniglia - wine and local specialties',
				dinner: 'Osteria di Manarola - romantic cliffside dining'
			},
			budget_estimate: '€75-100'
		},
		{
			day: 6,
			location: 'Cinque Terre - Riomaggiore & Rest Day',
			theme: 'Final Village & Relaxation',
			activities: [
				{
					time: '10:00 AM',
					title: 'Train to Riomaggiore',
					description: 'Visit the southernmost and oldest of the five villages',
					duration: '20 minutes travel',
					cost: '€4'
				},
				{
					time: '10:30 AM',
					title: 'Riomaggiore Village Exploration',
					description: 'Colorful houses, tiny marina, and local artisan shops',
					duration: '2 hours',
					cost: 'Free',
					tips: 'Climb to the castle ruins for great photos'
				},
				{
					time: '1:00 PM',
					title: 'Beach Time at Marina di Riomaggiore',
					description: 'Relax on the small rocky beach, swim in clear waters',
					duration: '3 hours',
					cost: 'Free',
					tips: 'Bring a towel - limited facilities'
				},
				{
					time: '5:00 PM',
					title: 'Return to Monterosso',
					description: 'Head back to base, evening at leisure',
					duration: '30 minutes travel',
					cost: '€4'
				},
				{
					time: '7:00 PM',
					title: 'Spa Time or Beach Walk',
					description: 'Unwind with hotel spa or peaceful beach stroll',
					duration: '2 hours',
					cost: '€30-50 (spa)'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast',
				lunch: 'Dau Cila, Riomaggiore - fresh seafood with harbor views',
				dinner: 'Light dinner at hotel or nearby pizzeria'
			},
			budget_estimate: '€70-95'
		},
		{
			day: 7,
			location: 'Cinque Terre to Florence',
			theme: 'Travel & Renaissance Introduction',
			activities: [
				{
					time: '9:00 AM',
					title: 'Train to Florence via La Spezia',
					description: 'Scenic journey through Tuscan countryside',
					duration: '3 hours',
					cost: '€25-35',
					tips: 'Regional trains are cheaper but slower than high-speed'
				},
				{
					time: '1:00 PM',
					title: 'Hotel Check-in & Lunch',
					description: 'Settle in near historic center, first taste of Florentine cuisine',
					duration: '2 hours',
					cost: '€25-35'
				},
				{
					time: '3:30 PM',
					title: 'Duomo Complex First Visit',
					description: 'Marvel at the cathedral dome, baptistery, and bell tower exterior',
					duration: '1.5 hours',
					cost: 'Free (exterior)',
					tips: 'Book dome climb for tomorrow - limited daily entries'
				},
				{
					time: '5:30 PM',
					title: 'Ponte Vecchio & Oltrarno Stroll',
					description: 'Cross the famous bridge, explore artisan workshops',
					duration: '2 hours',
					cost: 'Free',
					tips: 'Best photos of Ponte Vecchio from Ponte Santa Trinita'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast in Monterosso',
				lunch: "All'Antico Vinaio - famous for enormous sandwiches",
				dinner: 'Osteria Santo Spirito - authentic Tuscan in charming piazza'
			},
			accommodation: 'Hotel Davanzati (historic center)',
			transportation: 'Regional train La Spezia-Florence',
			budget_estimate: '€110-140'
		},
		{
			day: 8,
			location: 'Florence',
			theme: 'Renaissance Art & Culture',
			activities: [
				{
					time: '8:30 AM',
					title: 'Uffizi Gallery Pre-booked Tour',
					description: "World's greatest Renaissance art collection, Botticelli to Michelangelo",
					duration: '3 hours',
					cost: '€45',
					tips: 'Pre-book essential - often sold out weeks ahead'
				},
				{
					time: '12:30 PM',
					title: 'Lunch Break & Piazza della Signoria',
					description: 'Outdoor sculpture gallery and historic town square',
					duration: '1.5 hours',
					cost: '€20-30'
				},
				{
					time: '2:30 PM',
					title: 'Palazzo Vecchio Tour',
					description: 'Climb the tower for panoramic city views',
					duration: '2 hours',
					cost: '€20',
					tips: 'Palazzo ticket includes access to Roman ruins below'
				},
				{
					time: '5:00 PM',
					title: 'Duomo Dome Climb',
					description: "463 steps to Brunelleschi's architectural masterpiece",
					duration: '1.5 hours',
					cost: '€30',
					tips: 'Not for claustrophobic - narrow medieval staircases'
				},
				{
					time: '7:30 PM',
					title: 'Sunset at Piazzale Michelangelo',
					description: 'Best panoramic views of Florence at golden hour',
					duration: '1 hour',
					cost: 'Free'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast',
				lunch: 'Mercato Centrale - food market with local specialties',
				dinner: 'Trattoria Za Za - classic Florentine atmosphere'
			},
			budget_estimate: '€145-175'
		},
		{
			day: 9,
			location: 'Florence',
			theme: 'Art, Gardens & Relaxation',
			activities: [
				{
					time: '9:00 AM',
					title: "Accademia Gallery - Michelangelo's David",
					description: "See the world's most famous sculpture up close",
					duration: '1.5 hours',
					cost: '€25',
					tips: 'Audio guide recommended for full appreciation'
				},
				{
					time: '11:30 AM',
					title: 'San Lorenzo Market & Leather Shopping',
					description: 'Browse authentic leather goods and local crafts',
					duration: '2 hours',
					cost: 'Variable',
					tips: 'Bargaining is expected - start at 60% of asking price'
				},
				{
					time: '2:00 PM',
					title: 'Boboli Gardens Stroll',
					description: 'Renaissance gardens behind Pitti Palace, perfect for relaxing',
					duration: '2.5 hours',
					cost: '€15',
					tips: 'Bring water and snacks - large gardens with uphill walks'
				},
				{
					time: '5:30 PM',
					title: 'Cooking Class - Tuscan Specialties',
					description: 'Learn to make fresh pasta and tiramisu with local chef',
					duration: '3 hours',
					cost: '€75-95',
					tips: 'Many classes include wine pairings and dinner'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast',
				lunch: 'Gusta Pizza - hole-in-the-wall with amazing thin crust',
				dinner: 'Included in cooking class'
			},
			budget_estimate: '€140-170'
		},
		{
			day: 10,
			location: 'Florence to Siena',
			theme: 'Medieval Charm & Countryside',
			activities: [
				{
					time: '9:30 AM',
					title: 'Bus to Siena',
					description: 'Scenic drive through rolling Tuscan hills and vineyards',
					duration: '1.5 hours',
					cost: '€8',
					tips: 'Sit on right side for best countryside views'
				},
				{
					time: '11:30 AM',
					title: 'Hotel Check-in & Siena Introduction',
					description: 'Drop bags, get oriented in this perfectly preserved medieval city',
					duration: '1 hour',
					cost: 'Free'
				},
				{
					time: '1:00 PM',
					title: 'Piazza del Campo Exploration',
					description: "One of Europe's greatest medieval squares, site of famous Palio horse race",
					duration: '2 hours',
					cost: 'Free',
					tips: 'Sit on the sloped square like locals do'
				},
				{
					time: '3:30 PM',
					title: 'Siena Cathedral & Piccolomini Library',
					description: 'Stunning black and white striped cathedral with Renaissance frescoes',
					duration: '2 hours',
					cost: '€15',
					tips: 'Combined ticket includes cathedral, library, and crypt'
				},
				{
					time: '6:00 PM',
					title: 'Medieval Streets Walking Tour',
					description: 'Get lost in narrow stone alleys and discover hidden courtyards',
					duration: '1.5 hours',
					cost: 'Free'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast in Florence',
				lunch: 'Osteria le Logge - Michelin star dining in medieval setting',
				dinner: 'La Taverna di San Giuseppe - cave-like dining rooms'
			},
			accommodation: 'Hotel Athena (panoramic terrace views)',
			transportation: 'SITA bus Florence-Siena',
			budget_estimate: '€120-150'
		},
		{
			day: 11,
			location: 'Siena & Tuscan Countryside',
			theme: 'Wine Country & Hilltop Towns',
			activities: [
				{
					time: '9:00 AM',
					title: 'Chianti Classico Wine Tour',
					description: 'Visit family-owned winery in nearby countryside',
					duration: '4 hours',
					cost: '€65-85',
					tips: 'Tours often include transportation from Siena'
				},
				{
					time: '2:00 PM',
					title: 'San Gimignano Excursion',
					description: 'Medieval Manhattan with famous tower skyline',
					duration: '4 hours',
					cost: '€15 (bus)',
					tips: 'Try world champion gelato at Gelateria Dondoli'
				},
				{
					time: '7:00 PM',
					title: 'Return to Siena for Aperitivo',
					description: 'Sunset drinks overlooking the Tuscan hills',
					duration: '2 hours',
					cost: '€15-25'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast',
				lunch: 'Included in wine tour with local products',
				dinner: 'Il Carroccio - traditional Sienese cuisine'
			},
			budget_estimate: '€110-140'
		},
		{
			day: 12,
			location: 'Siena to Pisa',
			theme: 'Iconic Landmarks & Relaxation',
			activities: [
				{
					time: '10:00 AM',
					title: 'Train to Pisa via Florence',
					description: 'Journey to the city of the leaning tower',
					duration: '2.5 hours',
					cost: '€15-20',
					tips: 'Direct buses available but trains more comfortable'
				},
				{
					time: '1:00 PM',
					title: 'Hotel Check-in & Lunch',
					description: 'Central location near the famous square',
					duration: '1.5 hours',
					cost: '€20-30'
				},
				{
					time: '3:00 PM',
					title: 'Leaning Tower & Piazza dei Miracoli',
					description: 'Climb the famous tower and explore the cathedral complex',
					duration: '3 hours',
					cost: '€25 (tower climb)',
					tips: 'Book tower tickets in advance - limited entries per day'
				},
				{
					time: '6:30 PM',
					title: 'Pisa Historic Center Walk',
					description: 'Discover the university town beyond the tourist sites',
					duration: '2 hours',
					cost: 'Free',
					tips: 'Borgo Stretto is perfect for evening stroll and shopping'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast in Siena',
				lunch: 'Osteria dei Cavalieri - local university hangout',
				dinner: 'Ristorante Galileo - elegant dining near the tower'
			},
			accommodation: 'Hotel Villa Kinzica (walking distance to tower)',
			transportation: 'Train Siena-Florence-Pisa',
			budget_estimate: '€95-125'
		},
		{
			day: 13,
			location: 'Pisa to Rome',
			theme: 'Return Journey & Roman Farewell',
			activities: [
				{
					time: '10:00 AM',
					title: 'Morning Train to Rome',
					description: 'High-speed connection back to the eternal city',
					duration: '3 hours',
					cost: '€35-50',
					tips: 'Book Frecciarossa for fastest journey'
				},
				{
					time: '1:30 PM',
					title: 'Hotel Check-in & Lunch',
					description: 'Final Roman accommodation near main attractions',
					duration: '2 hours',
					cost: '€25-35'
				},
				{
					time: '4:00 PM',
					title: 'Pantheon & Piazza Navona',
					description: 'Ancient Roman temple and baroque fountain masterpieces',
					duration: '2 hours',
					cost: 'Free',
					tips: 'Pantheon is free but often crowded - visit early morning or evening'
				},
				{
					time: '6:30 PM',
					title: 'Final Shopping at Via del Corso',
					description: "Last-minute souvenir hunting on Rome's main shopping street",
					duration: '1.5 hours',
					cost: 'Variable'
				},
				{
					time: '8:30 PM',
					title: "Farewell Dinner in Campo de' Fiori",
					description: 'Celebrate your Italian journey in lively nightlife district',
					duration: '3 hours',
					cost: '€50-70'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast in Pisa',
				lunch: 'Armando al Pantheon - Roman institution since 1961',
				dinner: 'Piperno - famous for carciofi alla giudia (Jewish artichokes)'
			},
			accommodation: 'Hotel de Russie (luxury farewell)',
			transportation: 'High-speed train Pisa-Rome',
			budget_estimate: '€160-200'
		},
		{
			day: 14,
			location: 'Rome Departure',
			theme: 'Final Moments & Departure',
			activities: [
				{
					time: '9:00 AM',
					title: 'Last-minute Sightseeing',
					description: 'Revisit favorite spots or explore missed neighborhoods',
					duration: '3 hours',
					cost: 'Variable',
					tips: 'Check flight departure time and allow plenty of travel time'
				},
				{
					time: '12:30 PM',
					title: 'Lunch & Final Shopping',
					description: 'Pick up last souvenirs and enjoy final Italian meal',
					duration: '2 hours',
					cost: '€30-40'
				},
				{
					time: '3:00 PM',
					title: 'Airport Transfer',
					description: 'Leonardo Express train to Fiumicino Airport',
					duration: '45 minutes',
					cost: '€15',
					tips: 'Allow 3 hours before international departure'
				}
			],
			meals: {
				breakfast: 'Hotel breakfast',
				lunch: 'Da Valentino - traditional Roman trattoria near Termini'
			},
			transportation: 'Leonardo Express to airport',
			budget_estimate: '€60-80'
		}
	],
	packing_suggestions: [
		"Comfortable walking shoes (you'll walk 8-10 miles daily)",
		'Lightweight rain jacket (weather can change quickly)',
		'Modest clothing for churches (covered shoulders/knees)',
		'Portable phone charger and adapters',
		'Small daypack for excursions',
		'Sunscreen and sunglasses',
		'Water bottle (many free fountains in Italy)',
		'Cash for small vendors and tips',
		'Travel documents and copies',
		'Basic Italian phrases booklet'
	],
	budget_breakdown: {
		accommodation: '€1,400-1,800 (14 nights, mix of 3-4 star hotels)',
		food: '€840-1,200 (€60-85 daily for all meals)',
		activities: '€520-680 (museums, tours, experiences)',
		transportation: '€280-350 (trains, local transport)',
		total_estimate: '€3,040-4,030 per person'
	},
	important_notes: [
		'Book Uffizi Gallery and Duomo dome climb tickets well in advance',
		'Many museums close on Mondays - plan accordingly',
		'Restaurants typically open at 7:30 PM for dinner',
		"Carry cash - some small establishments don't accept cards",
		'Learn basic Italian greetings - locals appreciate the effort',
		'Pickpockets are common in tourist areas - stay alert',
		'Tipping is not mandatory but 10% is appreciated for good service',
		'August can be extremely hot and crowded - shoulder seasons preferred'
	],
	created_at: new Date()
};
