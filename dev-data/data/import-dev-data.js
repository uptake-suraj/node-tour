const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB Connections Successfully!'));

// READ Json File

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
console.log(tours, "All updated Toursssssssssssss")

// Import Data INto DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully Loaded');
    process.exit()
  } catch (error) {
    console.log(error);
  }
};

// Delete All Data From Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully Deleted-------------------------------------');
    process.exit()

  } catch (error) {
    console.log(error);
  }
};

// console.log(process.argv)



if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}