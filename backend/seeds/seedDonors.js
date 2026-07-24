import mongoose from "mongoose";
import dotenv from "dotenv";
import Donor from "../models/donorModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error(err));

const donors = [
  {
    fullName: "Rahul Kumar",
    email: "rahul.kumar@gmail.com",
    password: "Password@123",
    phone: "9876543210",
    role: "donor",
    address: {
      street: "12 MG Road",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500001",
    },
    bloodGroup: "O+",
    age: 21,
    gender: "Male",
    weight: 72,
    eligibleToDonate: true,
  },

  {
    fullName: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    password: "Password@123",
    phone: "9123456789",
    role: "donor",
    address: {
      street: "45 Residency Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    bloodGroup: "A+",
    age: 28,
    gender: "Female",
    weight: 58,
    eligibleToDonate: true,
  },

{
    fullName: "Arjun Reddy",
    email: "arjun.reddy@gmail.com",
    password: "Password@123",
    phone: "9012345678",
    role: "donor",
    address: {
      street: "8 Benz Circle",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      pincode: "520010",
    },
    bloodGroup: "B+",
    age: 30,
    gender: "Male",
    weight: 75,
    eligibleToDonate: true,
  },
  {
    fullName: "Sneha Patel",
    email: "sneha.patel@gmail.com",
    password: "Password@123",
    phone: "8899123456",
    role: "donor",
    address: {
      street: "22 CG Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380009",
    },
    bloodGroup: "AB+",
    age: 26,
    gender: "Female",
    weight: 56,
    eligibleToDonate: true,
  },
  {
    fullName: "Rohit Verma",
    email: "rohit.verma@gmail.com",
    password: "Password@123",
    phone: "9345678901",
    role: "donor",
    address: {
      street: "90 FC Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411005",
    },
    bloodGroup: "O-",
    age: 35,
    gender: "Male",
    weight: 78,
    eligibleToDonate: true,
  },
  {
    fullName: "Neha Iyer",
    email: "neha.iyer@gmail.com",
    password: "Password@123",
    phone: "9988776655",
    role: "donor",
    address: {
      street: "15 Anna Salai",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600002",
    },
    bloodGroup: "A-",
    age: 27,
    gender: "Female",
    weight: 60,
    eligibleToDonate: true,
  },
  {
    fullName: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    password: "Password@123",
    phone: "9871203456",
    role: "donor",
    address: {
      street: "18 Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    bloodGroup: "B-",
    age: 32,
    gender: "Male",
    weight: 80,
    eligibleToDonate: true,
  },
  {
    fullName: "Aisha Khan",
    email: "aisha.khan@gmail.com",
    password: "Password@123",
    phone: "9898981234",
    role: "donor",
    address: {
      street: "11 Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
    },
    bloodGroup: "AB-",
    age: 29,
    gender: "Female",
    weight: 55,
    eligibleToDonate: true,
  },
  {
    fullName: "Karthik Nair",
    email: "karthik.nair@gmail.com",
    password: "Password@123",
    phone: "9874501234",
    role: "donor",
    address: {
      street: "44 MG Road",
      city: "Kochi",
      state: "Kerala",
      pincode: "682011",
    },
    bloodGroup: "O+",
    age: 24,
    gender: "Male",
    weight: 69,
    eligibleToDonate: true,
  },
  {
    fullName: "Pooja Mehta",
    email: "pooja.mehta@gmail.com",
    password: "Password@123",
    phone: "9988123456",
    role: "donor",
    address: {
      street: "77 Ring Road",
      city: "Surat",
      state: "Gujarat",
      pincode: "395003",
    },
    bloodGroup: "A+",
    age: 31,
    gender: "Female",
    weight: 57,
    eligibleToDonate: true,
  },
  {
    fullName: "Sandeep Rao",
    email: "sandeep.rao@gmail.com",
    password: "Password@123",
    phone: "9876112233",
    role: "donor",
    address: {
      street: "21 Beach Road",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      pincode: "530002",
    },
    bloodGroup: "B+",
    age: 33,
    gender: "Male",
    weight: 74,
    eligibleToDonate: true,
  },
  {
    fullName: "Ananya Das",
    email: "ananya.das@gmail.com",
    password: "Password@123",
    phone: "9812345670",
    role: "donor",
    address: {
      street: "10 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016",
    },
    bloodGroup: "AB+",
    age: 22,
    gender: "Female",
    weight: 54,
    eligibleToDonate: true,
  },
  {
    fullName: "Naveen Chandra",
    email: "naveen.chandra@gmail.com",
    password: "Password@123",
    phone: "9955667788",
    role: "donor",
    address: {
      street: "5 Trunk Road",
      city: "Ongole",
      state: "Andhra Pradesh",
      pincode: "523001",
    },
    bloodGroup: "O+",
    age: 27,
    gender: "Male",
    weight: 71,
    eligibleToDonate: true,
  },
  {
    fullName: "Divya Joshi",
    email: "divya.joshi@gmail.com",
    password: "Password@123",
    phone: "9900112233",
    role: "donor",
    address: {
      street: "66 MI Road",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
    },
    bloodGroup: "A-",
    age: 30,
    gender: "Female",
    weight: 59,
    eligibleToDonate: true,
  },
  {
    fullName: "Harish Gowda",
    email: "harish.gowda@gmail.com",
    password: "Password@123",
    phone: "9873216540",
    role: "donor",
    address: {
      street: "18 Sayyaji Rao Road",
      city: "Mysuru",
      state: "Karnataka",
      pincode: "570001",
    },
    bloodGroup: "B-",
    age: 36,
    gender: "Male",
    weight: 79,
    eligibleToDonate: true,
  },
  {
    fullName: "Ritu Malhotra",
    email: "ritu.malhotra@gmail.com",
    password: "Password@123",
    phone: "9811198765",
    role: "donor",
    address: {
      street: "42 Sector 17",
      city: "Chandigarh",
      state: "Chandigarh",
      pincode: "160017",
    },
    bloodGroup: "AB-",
    age: 34,
    gender: "Female",
    weight: 61,
    eligibleToDonate: true,
  },
  {
    fullName: "Aditya Kulkarni",
    email: "aditya.kulkarni@gmail.com",
    password: "Password@123",
    phone: "9890011223",
    role: "donor",
    address: {
      street: "24 Sitabuldi",
      city: "Nagpur",
      state: "Maharashtra",
      pincode: "440012",
    },
    bloodGroup: "O+",
    age: 26,
    gender: "Male",
    weight: 73,
    eligibleToDonate: true,
  },
  {
    fullName: "Meera Ramesh",
    email: "meera.ramesh@gmail.com",
    password: "Password@123",
    phone: "9845012345",
    role: "donor",
    address: {
      street: "12 Avinashi Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641018",
    },
    bloodGroup: "A+",
    age: 25,
    gender: "Female",
    weight: 56,
    eligibleToDonate: true,
  },
  {
    fullName: "Pranav Mishra",
    email: "pranav.mishra@gmail.com",
    password: "Password@123",
    phone: "9877771122",
    role: "donor",
    address: {
      street: "31 Hazratganj",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226001",
    },
    bloodGroup: "B+",
    age: 29,
    gender: "Male",
    weight: 76,
    eligibleToDonate: true,
  },
  {
    fullName: "Kavya Reddy",
    email: "kavya.reddy@gmail.com",
    password: "Password@123",
    phone: "9888881234",
    role: "donor",
    address: {
      street: "14 AIR Bypass Road",
      city: "Tirupati",
      state: "Andhra Pradesh",
      pincode: "517501",
    },
    bloodGroup: "O-",
    age: 23,
    gender: "Female",
    weight: 55,
    eligibleToDonate: true,
  },
  
];

const seedDonors = async () => {
  try {
    // Delete all existing donors
    await Donor.deleteMany({});
    console.log("🗑️ All donors deleted.");

    let added = 0;
    let updated = 0;

    for (const donor of donors) {
      const existing = await Donor.findOne({ email: donor.email });

      if (!existing) {
        await new Donor(donor).save();
        added++;
      } else {
        existing.fullName = donor.fullName;
        existing.phone = donor.phone;
        existing.address = donor.address;
        existing.bloodGroup = donor.bloodGroup;
        existing.age = donor.age;
        existing.gender = donor.gender;
        existing.weight = donor.weight;
        existing.eligibleToDonate = donor.eligibleToDonate;

        // Leave password and history untouched
        await existing.save();
        updated++;
      }
    }

    console.log("✅ Donor seeding completed!");
    console.log(`➕ Added: ${added}`);
    console.log(`🔄 Updated: ${updated}`);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDonors();

// const seedDonors = async () => {
//   try {
//     let added = 0;
//     let updated = 0;

//     for (const donor of donors) {
//       const existing = await Donor.findOne({ email: donor.email });

//       if (!existing) {
//         await new Donor(donor).save();
//         added++;
//       } else {
//         existing.fullName = donor.fullName;
//         existing.phone = donor.phone;
//         existing.address = donor.address;
//         existing.bloodGroup = donor.bloodGroup;
//         existing.age = donor.age;
//         existing.gender = donor.gender;
//         existing.weight = donor.weight;
//         existing.eligibleToDonate = donor.eligibleToDonate;

//         // Leave password and history untouched
//         await existing.save();
//         updated++;
//       }
//     }

//     console.log("✅ Donor seeding completed!");
//     console.log(`➕ Added: ${added}`);
//     console.log(`🔄 Updated: ${updated}`);

//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// seedDonors();
