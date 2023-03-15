const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Extract the sub-page URLs to be scraped from the main navigation menu
 * @param  {String} data - HTML response
 * @return {Array} Array of URL objects
 */
const extractUrls = (data) => {
  const $ = cheerio.load(data);
  return $('.mainNavigation-fixedContainer .mainNavigation-link-subMenu-link')
    .map((i, element) => {
      const url = 'https://www.dedicatedbrand.com' + 
      $(element)
      .children('a')
      .attr('href');
      
      return { url };
    })
    .get();
};

/**
 * Extract product information from a single product list element
 * @param  {Object} $ - Cheerio instance
 * @param  {Object} element - Product list element
 * @return {Object} Product object
 */
const extractProduct = ($, element) => {
  const name = $(element)
    .find('.productList-title')
    .text()
    .trim()
    .replace(/\s/g, ' ');
  const price = parseInt(
    $(element)
      .find('.productList-price')
      .text()
  );
  const link = 'https://www.dedicatedbrand.com' + $(element)
    .find('.productList-link')
    .attr('href');
  const brand = 'Dedicated';
  const image = $(element)
    .find('.productList-image')
    .children('img')
    .attr('src');
  return { name, price, link, brand, image };
};

/**
 * Scrape all products from a single page
 * @param  {String} url - URL of page to scrape
 * @return {Array} Array of product objects
 */
const scrapePage = async (url) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();
      const $ = cheerio.load(body);
      return $('.productList-container .productList')
        .map((i, element) => extractProduct($, element))
        .get();
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Scrape all products from all pages
 * @param  {String} url - URL of main page to start from
 * @return {Array|null} Array of all product objects, or null if an error occurred
 */
module.exports.scrape = async (url) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();
      const urlsToScrape = extractUrls(body);
      let allProducts = [];

      for (const urlObj of urlsToScrape) {
        const products = await scrapePage(urlObj.url);
        allProducts.push(...products);
      }

      return allProducts;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
