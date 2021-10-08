'use strict';

const dotenv = require("dotenv");
const { start } = require('./server');

dotenv.config('.env');

start();
