"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const options = {
    method: 'GET',
    url: 'https://india-pincode-api.p.rapidapi.com/v1/in/places/pincode/Aurangabad/Sillod',
    headers: {
        'x-rapidapi-key': 'e1227c6789msha51db629b967b7fp143b04jsnabe3d868eee2',
        'x-rapidapi-host': 'india-pincode-api.p.rapidapi.com'
    }
};
try {
    const response = axios_1.default.request(options);
    console.log(response);
}
catch (error) {
    console.error(error);
}
//# sourceMappingURL=IndianPincodes.js.map