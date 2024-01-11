module.exports = {
	port: 5155,
	dumyResp: {
		trip: {
			pnr: {
				bookingReference: "O8RFRR",
			},
			bookingInformation: {
				bookingDateTime: "2023-12-26T09:22:00Z",
				bookingStatus: "CONFIRMED",
				siteOfficeId: {
					siteOfficeId: "DOHQR08IB",
				},
			},
			passengers: [
				{
					passengerId: {
						id: "PT2",
						passengerType: "ADT",
					},
					passengerName: {
						firstName: "Shashank",
						lastName: "Hm",
						titleCode: "MR",
					},
					primary: false,
					tickets: [
						{
							ticketNumber: "1572107797844",
							ticketType: "FLIGHT",
						},
					],
					issuedDocuments: [
						{
							number: "1572107797844",
							disassociated: false,
							issuedDocumentType: "FLIGHT",
						},
					],
					specialServiceRequests: [
						{
							id: "OT26",
							code: "CTCE",
							quantity: 1,
							segmentIds: ["ST2", "ST1"],
						},
						{
							id: "OT27",
							code: "CTCM",
							quantity: 1,
							segmentIds: ["ST2", "ST1"],
						},
						{
							id: "OT58",
							code: "OTHS",
							segmentIds: ["ST2", "ST1"],
						},
						{
							id: "OT65",
							code: "OTHS",
							segmentIds: ["ST2", "ST1"],
						},
						{
							id: "OT8",
							code: "DOCS",
							quantity: 1,
							segmentIds: ["ST2", "ST1"],
						},
						{
							id: "OT22",
							code: "CTCE",
							quantity: 1,
							segmentIds: ["ST2", "ST1"],
						},
						{
							id: "OT23",
							code: "CTCM",
							quantity: 1,
							segmentIds: ["ST2", "ST1"],
						},
					],
				},
			],
			bounds: [
				{
					id: "1",
					duration: 27300,
					origin: {
						iataCode: "DOH",
						cityName: "DOHA",
						countryCode: "QA",
					},
					destination: {
						iataCode: "LHR",
						cityName: "LONDON",
						countryCode: "GB",
					},
					fareInfos: [
						{
							segmentId: "ST1",
							cabinType: "ECONOMY",
							rbd: {
								bookingClass: "M",
							},
						},
					],
					segments: [
						{
							id: "ST1",
							cabinType: "ECONOMY",
							origin: {
								iataCode: "DOH",
								cityName: "DOHA",
								countryCode: "QA",
							},
							destination: {
								iataCode: "LHR",
								cityName: "LONDON",
								countryCode: "GB",
							},
							departure: {
								departureDateTime: "2024-01-20T01:50:00+03:00",
							},
							arrival: {
								arrivalDateTime: "2024-01-20T06:25:00Z",
								terminal: "4",
							},
							vehicle: {
								name: "AIRBUS A380-800",
								code: "388",
								vehicleType: "AIRCRAFT",
							},
							flightNumber: {
								number: "QR011",
							},
							flightStatus: "SCHEDULED",
							carrierInformation: {
								operatingAirlineCode: "QR",
								operatingFlightNumber: "011",
								marketingAirlineCode: "QR",
								marketingFlightNumber: "011",
							},
							flightDuration: 27300,
							rbd: {
								bookingClass: "M",
							},
							segmentStatus: "CONFIRMED",
							upgraded: false,
						},
					],
					baggageAllowanceSpecifications: [
						{
							passengerType: "ADT",
							policy: "PIECE",
							baggageType: "HAND_BAGGAGE",
							baggageCharacteristics: {
								unit: "KG",
								weight: 7,
							},
							quantity: 1,
						},
						{
							passengerType: "ADT",
							policy: "WEIGHT",
							baggageType: "CHECKED",
							baggageCharacteristics: {
								unit: "KG",
								weight: 30,
							},
						},
					],
				},
				{
					id: "2",
					duration: 24000,
					origin: {
						iataCode: "LHR",
						cityName: "LONDON",
						countryCode: "GB",
					},
					destination: {
						iataCode: "DOH",
						cityName: "DOHA",
						countryCode: "QA",
					},
					fareInfos: [
						{
							segmentId: "ST2",
							cabinType: "ECONOMY",
							rbd: {
								bookingClass: "M",
							},
						},
					],
					segments: [
						{
							id: "ST2",
							cabinType: "ECONOMY",
							origin: {
								iataCode: "LHR",
								cityName: "LONDON",
								countryCode: "GB",
							},
							destination: {
								iataCode: "DOH",
								cityName: "DOHA",
								countryCode: "QA",
							},
							departure: {
								departureDateTime: "2024-01-20T08:35:00Z",
								terminal: "4",
							},
							arrival: {
								arrivalDateTime: "2024-01-20T18:15:00+03:00",
							},
							vehicle: {
								name: "AIRBUS A380-800",
								code: "388",
								vehicleType: "AIRCRAFT",
							},
							flightNumber: {
								number: "QR010",
							},
							flightStatus: "SCHEDULED",
							carrierInformation: {
								operatingAirlineCode: "QR",
								operatingFlightNumber: "010",
								marketingAirlineCode: "QR",
								marketingFlightNumber: "010",
							},
							flightDuration: 24000,
							rbd: {
								bookingClass: "M",
							},
							segmentStatus: "RESCHEDULED",
							upgraded: false,
						},
					],
					baggageAllowanceSpecifications: [
						{
							passengerType: "ADT",
							policy: "PIECE",
							baggageType: "HAND_BAGGAGE",
							baggageCharacteristics: {
								unit: "KG",
								weight: 7,
							},
							quantity: 1,
						},
						{
							passengerType: "ADT",
							policy: "WEIGHT",
							baggageType: "CHECKED",
							baggageCharacteristics: {
								unit: "KG",
								weight: 30,
							},
						},
					],
				},
			],
			group: false,
			tripType: "ROUND",
		},
		additionalDetails: {
			isGroup: false,
		},
	},
};
