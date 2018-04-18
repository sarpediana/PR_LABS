let express = require('express');
let app = express();
let Promise = require('promise');
const request = require('request');

var categoriesArr = [];
var ordersArr = [];

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
let objectD = [];

let newArray = [];

let getResponse = (options) => {
  return new Promise((resolve, reject) => {
    request.get(options, (err, body) => {
      if (err) {
        return reject(err);
      }
      return resolve(body);
    });
  });
}
let req = [getResponse(optionsCategories), getResponse(optionsOrder)]

Promise.all(req)
  .then((resp) => {
    categoriesParse(resp[0].body);
    ordersParse(resp[1].body);
    addTotal();
    categories();
  })


function addTotal() {
  categoriesArr.map(index => {

    index.subtotal = calculateSubtotal(index.id);
    newArray.push(
      index
    )
  })
}

function calculateSubtotal(id) {
  let total = 0;
  ordersArr.map(orders => {
    if (id === orders.category_id) {
      total += parseFloat(orders.total)
    }
  });
  return total;
}
async function categories() {
  newArray.map(category => {
    if (category.category_id === '') {
      category.subcategory = subcategories(category.id)
      objectD.push(
        category
      )
    }
  });
  console.log(JSON.stringify(objectD))
}


function subcategories(id) {
  let subcateg = [];
  newArray.map(subcategory => {
    if (id === subcategory.category_id) {

      subcateg.push({ ...subcategory,
        subcategory: subcategories(subcategory.id)
      });
    }
  });
  return subcateg;
}

function totalCalculate(id){
  let total = 0;
  newArray.map(orders => {
    if (id === orders.category_id) {
      total += parseFloat(newArray.subtotal)
    }
  });
}

async function categoriesParse(csv) {
  let id = "";
  let name = "";
  let category_id = "";
  let itemIndex = 0;
  let index = 0;
  for (let i = 0; i < csv.length; i++) {
    if (csv[i] === ",") {
      index += 1;
    } else if (index === 0) {
      id = id.concat(csv[i]);
    } else if (index === 1) {
      name = name.concat(csv[i]);
    } else if (index === 2) {
      if (csv[i] !== "\n") {
        category_id = category_id.concat(csv[i]);
      } else {
        if (itemIndex !== 0) {
          categoriesArr.push({
            id,
            name,
            category_id
          });
        }
        itemIndex += 1;
        id = "";
        name = "";
        category_id = "";
        index = 0;
      }
    }
  }
}

async function ordersParse(csv) {
  let id = "";
  let total = "";
  let category_id = "";
  let created = "";
  let itemIndex = 0;
  let index = 0;
  for (let i = 0; i < csv.length; i++) {
    if (csv[i] === ",") {
      index += 1;
    } else if (index === 0) {
      id = id.concat(csv[i]);
    } else if (index === 1) {
      total = total.concat(csv[i]);
    } else if (index === 2) {
      category_id = category_id.concat(csv[i]);
    } else if (index === 3) {
      if (csv[i] !== "\n") {
        created = created.concat(csv[i]);
      } else {
        if (itemIndex !== 0) {
          ordersArr.push({
            id,
            total,
            category_id,
            created
          });
        }
        itemIndex += 1;
        id = "";
        total = "";
        category_id = "";
        created = "";
        index = 0;
      }
    }
  }
}