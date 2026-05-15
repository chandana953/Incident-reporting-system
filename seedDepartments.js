const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('./models/Department');

dotenv.config();

const departments = [
  {
    name: 'City Central Hospital',
    type: 'hospital',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    address: 'MG Road, Bangalore',
    contactInfo: { phone: '080-1234567', email: 'contact@centralhospital.gov' }
  },
  {
    name: 'Westside Medical Center',
    type: 'hospital',
    location: { type: 'Point', coordinates: [77.5446, 12.9816] },
    address: 'Rajajinagar, Bangalore',
    contactInfo: { phone: '080-2234567', email: 'help@westside.med' }
  },
  {
    name: 'Precinct 04 Headquarters',
    type: 'police',
    location: { type: 'Point', coordinates: [77.5846, 12.9616] },
    address: 'Cubbon Park, Bangalore',
    contactInfo: { phone: '100', email: 'p04@ksp.gov.in' }
  },
  {
    name: 'North District Station',
    type: 'police',
    location: { type: 'Point', coordinates: [77.6046, 12.9916] },
    address: 'Hebbal, Bangalore',
    contactInfo: { phone: '100', email: 'north@ksp.gov.in' }
  },
  {
    name: 'Fire Station 09',
    type: 'fire',
    location: { type: 'Point', coordinates: [77.5746, 12.9516] },
    address: 'Jayanagar, Bangalore',
    contactInfo: { phone: '101', email: 'f09@kfs.gov.in' }
  },
  {
    name: 'Emergency Rescue Unit',
    type: 'rescue',
    location: { type: 'Point', coordinates: [77.5646, 12.9416] },
    address: 'Banshankari, Bangalore',
    contactInfo: { phone: '108', email: 'rescue@city.gov' }
  },
  {
    name: 'Municipal Utility Hub',
    type: 'utility',
    location: { type: 'Point', coordinates: [77.6146, 12.9316] },
    address: 'Koramangala, Bangalore',
    contactInfo: { phone: '1912', email: 'support@bescom.in' }
  },
  {
    name: 'Rapid Ambulance Service',
    type: 'ambulance',
    location: { type: 'Point', coordinates: [77.5546, 12.9216] },
    address: 'JP Nagar, Bangalore',
    contactInfo: { phone: '108', email: 'ambulance@city.gov' }
  }
];

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Department.deleteMany();
    console.log('Cleared existing departments.');

    await Department.insertMany(departments);
    console.log('Successfully seeded departments!');

    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDepartments();
