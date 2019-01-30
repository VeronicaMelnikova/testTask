'use strict';

var ESC_KEYCODE = 27;
var MAX_LENGTH = 15;
var catalog = document.querySelector('.catalog');
var addField = document.querySelector('.add-update');
var addForm = document.querySelector('.add-update__form');
var openAddField = document.querySelector('.button--add-new');
var buttonAddProduct = addForm.querySelector('.button--add');
var buttonCloseAddForm = addForm.querySelector('.button--close');
var search = document.querySelector('.button--search');
var nameField = addForm.querySelector('.add-update__name-field');
var countField = addForm.querySelector('.add-update__count-field');
var priceField = addForm.querySelector('.add-update__price-field');
var errorMessage = addField.querySelector('.error-message');
var arrorAscendingPrice = catalog.querySelector('.catalog__arrow-increase-price');
var arrorDescendingPrice = catalog.querySelector('.catalog__arrow-decrease-price');
var startPrice = 0;
var nameValue;
var countValue;
var priceValue;

var productsData = [
  {
    name: 'Монитор',
    count: 5,
    price: '$12,352.25',
  },
  {
    name: 'Клавиатура',
    count: 5,
    price: '$12,351.25'
  },
  {
    name: 'Мышка',
    count: 5,
    price: '$12,350.25'
  }
];

var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  } 
  return element;  
};

var createProduct = function(product, number) {
  var catalogProducts = makeElement('ul', 'catalog__product');
  var productItem = makeElement('li', 'product__item');
  var itemDescription = makeElement('div', 'product__description');
  var itemName = makeElement('a', 'product__name', product.name);
  var itemCount = makeElement('p', 'product__count', product.count);
  var productPrice = makeElement('li', 'product__price');
  var productPriceValue = makeElement('p', 'product__price-value', product.price);
  var productActions = makeElement('li', 'product__actions');
  var buttonWrapper = makeElement('div', 'product__actions-wrapper');
  var buttonEdit = makeElement('button', 'button-edit', 'Edit');
  var buttonDelete = makeElement('button', 'button-delete', 'Delete');
  itemName.href = '#';
  itemDescription.appendChild(itemName);
  itemDescription.appendChild(itemCount);
  productItem.appendChild(itemDescription);
  productPrice.appendChild(productPriceValue);
  buttonWrapper.appendChild(buttonEdit);
  buttonWrapper.appendChild(buttonDelete);
  productActions.appendChild(buttonWrapper);
  catalogProducts.appendChild(productItem);
  catalogProducts.appendChild(productPrice);
  catalogProducts.appendChild(productActions);
  return catalogProducts;
};

var renderProducts = function (startElement) {
  for (var i = startElement; i < productsData.length; i++) {
  var product = createProduct(productsData[i], i);
  catalog.appendChild(product);
  };
};

renderProducts(0);

var comparePrice = function (product1, product2) {
  var price1 = product1.price;
  var price2 = product2.price;
  var index1 = price1.indexOf(',');
  var index2 = price2.indexOf(',');
  price1 = parseFloat(price1.substring(1,index1) + price1.substring(index1 + 1));
  price2 = parseFloat(price2.substring(1,index2) + price2.substring(index2 + 1));
  return price1 - price2;
};

var sortbyAscendingPrice = function() {
  productsData.sort(comparePrice);
};

arrorAscendingPrice.addEventListener('click', function(evt) {
  evt.preventDefault();
  sortbyAscendingPrice();
  deleteProducts(0, productsData.length);
  renderProducts(0);
  arrorAscendingPrice.classList.add('hidden');
  arrorDescendingPrice.classList.remove('hidden');
});

openAddField.addEventListener('click', function (evt) {
  addField.classList.add('add-update--show');
  addForm.reset();
  buttonAddProduct.value = 'Add';
});

var onAddFieldKeyPress = function (evt) {
  var active = document.activeElement;
  if (evt.keyCode === ESC_KEYCODE) {
    if (active !== addForm) {
      closeAddField();
    }
  }
};

var closeAddField = function() {
  addField.classList.remove('add-update--show');
  document.removeEventListener('keydown', onAddFieldKeyPress);
  addForm.reset();
};

buttonCloseAddForm.addEventListener('click', function (evt) {
  closeAddField();
})

var hideUnsuitableProductbyName = function(name) {
  var allProducts = catalog.querySelectorAll('.catalog__product');
  var unsuitableProducts = [];
  if (name !== '') {
    for (var i = 0; i < productsData.length; i++) {
      allProducts[i].classList.remove('product--hidden');
      var productName = productsData[i].name;
      if (productName.toUpperCase() !== name.toUpperCase()) {
        unsuitableProducts.push(i);
      }
    };
    for (var i = 0; i < unsuitableProducts.length; i++) {
      var number = unsuitableProducts[i];
      var unsuitableProduct = allProducts[number];
      unsuitableProduct.classList.add('product--hidden');
    };
  };
};

search.addEventListener('click', function (evt) {
  evt.preventDefault();
  var searchName = document.querySelector('.search__field').value;
  hideUnsuitableProductbyName(searchName);
});

var addNewProduct = function (nameValue, countValue, priceValue) {
  var index = productsData.length;
  productsData[index] = {};
  productsData[index].name = nameValue;
  productsData[index].count = countValue;
  productsData[index].price = priceValue;
};

var checkName = function (name) {
  var space = ' ';
  if (name && name.length <= MAX_LENGTH) {
    for (var i = 1; i < MAX_LENGTH; i++) {
      if (name !== space) {
        return name;
      };
      space += ' ';
    }; 
  } else {
    return false;
  };
};

var convertPrice = function (price) {
  var textPrice = 0;
  if (price / 1000 >= 1) {
    var thousands = Math.floor(price / 1000);
    var residue = price % 1000;
    residue = residue.toFixed(2);
    textPrice = '$' + thousands.toString() + ',' + residue.toString();
  } else {
    textPrice = '$' + price.toString();
  };
  return textPrice;
};

priceField.addEventListener('blur', function() {
  startPrice = priceField.value;
  priceField.type = 'text';
  priceField.value = convertPrice(priceField.value);
});

priceField.addEventListener('focus', function() {
  priceField.type = 'number';
  priceField.value = startPrice;
});

var showError = function() {
  nameField.classList.add('error');
  errorMessage.classList.add('error-message--show');
};

var getFieldValue = function () {
  nameValue = nameField.value;
  countValue = countField.value;
  priceValue = priceField.value;
}

var writeProductParameters = function () {
  getFieldValue();
  addNewProduct(nameValue, countValue, priceValue); 
  return checkName(nameValue);
};

var rewriteProduct = function(elementNumber) {
  getFieldValue();
  productsData[elementNumber].name = nameValue; 
  productsData[elementNumber].count = countValue; 
  productsData[elementNumber].price = priceValue;
  return checkName(nameValue);
};

addForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  if (buttonAddProduct.value === 'Add') {
    if (writeProductParameters()) {
      renderProducts(productsData.length - 1);
      closeAddField();
      addForm.reset();
    } else {
      showError();
    }
  }; 
  if (buttonAddProduct.value === 'Update') {
    if (rewriteProduct(productNumber)) {
      rewriteProduct(productNumber);
      deleteProducts(0, productsData.length);
      renderProducts(0);
      closeAddField();
      addForm.reset();
    } else {
      showError();
    };
  } 
});

var deleteProducts = function (startProduct, endProduct) {
  var allProducts = catalog.querySelectorAll('.catalog__product');
  for (var i = startProduct; i < endProduct; i++) {
    catalog.removeChild(allProducts[i]);
  };
};

/*var deleteProducts = function () {
  var allProducts = catalog.querySelectorAll('.catalog__product');
  catalog.removeChild(allProducts[i]);
};*/

nameField.addEventListener('mouseup', function () {
  nameField.classList.remove('error');
  errorMessage.classList.remove('error-message--show');
}, true);

var getProductValue = function (element) {
  var name = element.querySelector('.product__name').textContent;
  nameField.value = name;
  countField.value = element.querySelector('.product__count').textContent;
  priceField.type = 'text';
  priceField.value = element.querySelector('.product__price-value').textContent;
  return name;
};

var searchProductByName = function (name) {
  var allProducts = catalog.querySelectorAll('.catalog__product');
  for (var i = 0; i < productsData.length; i++) {
      var productName = productsData[i].name;
      if (productName === name) {
        var number = i;
        return number;
      }
    };
};

var productNumber;
var initialProduct;
var confirmationPopup = document.querySelector('.confirmation');
var buttonCancel = confirmationPopup.querySelector('.button__cancel');
var buttonConsent = confirmationPopup.querySelector('.button__consent');
var closeConfirmationPopup = function () {
  confirmationPopup.classList.remove('confirmation--show');
};

catalog.addEventListener('click', function (evt) {
  var target = evt.target;
  while (target !== this) {
    if (target.className === 'button-edit') {
      addField.classList.add('add-update--show');
      buttonAddProduct.value = 'Update';
    };
    if (target.className === 'button-delete') {
      confirmationPopup.classList.add('confirmation--show');
      buttonCancel.addEventListener('click', function () {
        closeConfirmationPopup();
      });
      buttonConsent.addEventListener('click', function () {
        deleteProducts(0, productsData.length);
        productsData.splice(productNumber, 1);
        renderProducts(0);
        closeConfirmationPopup();
      });
    };

    target = target.parentNode;
    if (target.className === 'catalog__product') {
      initialProduct = target;
      getProductValue(target);
      productNumber = searchProductByName(getProductValue(target));
      rewriteProduct(productNumber);
    };  
  }
});
