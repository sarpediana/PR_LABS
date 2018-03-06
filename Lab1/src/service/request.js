let express = require('express');
let app = express();
let fs = require('fs');
const request = require('request');

let categories;

let optionsCategories = {
    url: 'https://evil-legacy-service.herokuapp.com/api/v101/categories/',
    headers: {
        'Accept': 'text/csv',
        'x-api-key': '55193451-1409-4729-9cd4-7c65d63b8e76',
    }
 }

 let optionsOrder = {
    url: 'https://evil-legacy-service.herokuapp.com/api/v101/orders/?start=2018-01-01&end=2018-01-30',
    headers: {
        'Accept': 'text/csv',
        'x-api-key': '55193451-1409-4729-9cd4-7c65d63b8e76',
    }
 }

function myRequest(url) {
    return new Promise((resolve, reject) => {

        request.get(url, (err, res, body) => {
            if (err) {
                return reject(err);
            }
            return resolve(body);
        });
    })
 }

 myRequest(optionsCategories)
 .then(rs => {
     categories = rs;
     console.log(categories);
 })
 .catch(err => {
     console.error(err);
 })
 
 myRequest(optionsOrder)
     .then(resp =>{
        orders =resp;
        console.log(orders);
     })
     .catch(err =>{
         console.error(err);
     })
 