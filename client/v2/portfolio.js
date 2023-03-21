// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/


// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand=document.querySelector('#brand-select');
const selectSort=document.querySelector('#sort-select');
const RecentlyReleased=document.querySelector('#recent');
const ReasonablePrice=document.querySelector('#price');
const spanNbBrands=document.querySelector('#nbBrands');
const spanNewProducts=document.querySelector('#newProducts');
const spanP50=document.querySelector('#p50');
const spanP90=document.querySelector('#p90');
const spanP95=document.querySelector('#p95');
const spanLastReleased=document.querySelector('#lastReleased')
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {

    let url=`https://server-ashy.vercel.app?page=${page}&size=${size}`;
    const response = await fetch(url);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}</span>
        <button id=${product.uuid}>add to favorite</button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
 
  spanNbProducts.innerHTML = count;
};


const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

//Listener of brands

//Feature 1 - Browse pages
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), selectShow.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
  });

//Feature 2 - Filter Brands
selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, selectShow.value);
  products.result=products.result.filter(product=>product.brand==event.target.value)
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

//Feature 3 - New released
RecentlyReleased.addEventListener('click',async()=>{
  const products = await fetchProducts(currentPagination.currentPage, selectShow.value);
  const today = new Date();
  const twoWeeksAgo = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000)); // two weeks ago in milliseconds
  products.result = products.result.filter(product => new Date(product.released) > twoWeeksAgo);
  products.result.sort((productA, productB) => new Date(productB.released) - new Date(productA.released));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

//Feature 4 - Reasonnable Price 
ReasonablePrice.addEventListener('click',async()=>{
  const products = await fetchProducts(currentPagination.currentPage, selectShow.value);
  products.result=products.result.filter(products => products.price < 50)
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

//Feature 5 and 6 - Sort by price and date
selectSort.addEventListener('change', async () => {
  

    const products = await fetchProducts(currentPagination.currentPage, selectShow.value);
    if(selectSort.value=="price-desc"){
      products.result=products.result.sort((product_a, product_b) => product_b.price - product_a.price);
    }
    if(selectSort.value=="price-asc"){
      products.result=products.result.sort((product_a, product_b) => product_a.price - product_b.price);
    }
    if(selectSort.value=="date-desc"){
      products.result=products.result.sort((product_a, product_b) =>new Date(product_b.released) - new Date (product_a.released));
    }
    if(selectSort.value=="date-asc"){
      products.result=products.result.sort((product_a, product_b) =>new Date(product_a.released) - new Date (product_b.released));
    }
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
    
  
 
});

/**
 * Brands Indicator
 * @param  {Object} products
 */
function BrandsIndicator(products)
{
  const brandSet = new Set();
  for (let i = 0; i < products.length; i++) {
    brandSet.add(products[i].brand);
  }
  return brandSet.size;
}
/**
 * Number of recent products indicator
 * @param  {Object} products
 */
function NewProductsIndicator(product){
  const today= new Date();
  const week= new Date(today.getDate() - - 7 * 24 * 60 * 60 * 1000);
  const newproducts=product.filter(product=> Date (product.released)>week);
  return newproducts.length

}
/**
 * P50 value
 * @param  {Object} product
 */
function p50(product)
{
const prices=product.map(product => product.price);
prices.sort((a, b) => a - b);
const index = Math.ceil((50 / 100) * prices.length) - 1;
const p90 = prices[index];
return p90
}
/**
 * P90 value
 * @param  {Object} product
 */
function p90(product)
{
  const prices=product.map(product => product.price);
  prices.sort((a, b) => a - b);
  const index = Math.ceil((90 / 100) * prices.length) - 1;
  const p90 = prices[index];
  return p90
}
/**
 * P95 value
 * @param  {Object} product
 */
function p95(product)
{
  const prices=product.map(product => product.price);
  prices.sort((a, b) => a - b);
  const index = Math.ceil((95 / 100) * prices.length) - 1;
  const p90 = prices[index];
  return p90
}

/**
 * Last Released product date
 * @param  {Object} product
 */
function lastReleased(product){
  //sort product by date from the newest to the oldest
  product.sort((a, b)=> new Date(b.released)-new Date(a.released))
  return product[0].released
}
document.addEventListener("DOMContentLoaded",async()=>
{
  const products = await fetchProducts();

  //Feature 8 - Number of products indicator
  spanNbBrands.innerHTML=BrandsIndicator(products.result);
  //Feature 9 - Number of recent products indicator
  spanNewProducts.innerHTML= NewProductsIndicator(products.result) ;
  //Feature 10 - p50, p90 and p95 price value indicator
  spanP50.innerHTML=p50(products.result);
  spanP90.innerHTML=p90(products.result);
  spanP95.innerHTML=p95(products.result);
  //Feature 11 - Last released date indicator
  spanLastReleased.innerHTML=lastReleased(products.result);
})

//Feature 13 - Save as favorite

//Feature 14 - Filter by favorite

//Feature 15 - Usable and pleasant UX
/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
  
  
});
