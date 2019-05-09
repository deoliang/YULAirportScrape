const puppeteer = require('puppeteer');
const url = 'https://www.admtl.com/en/flights/departures';
const $ = require('cheerio');
const fs = require('fs');
const YULDestinations = {
    "Cities": []
}

const uniqueSet = new Set();
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    let html = await page.content();
    await $('td:nth-child(5) > span',html).each(function(i, elem) {
        if(uniqueSet.has($(this).text()))return true;
         uniqueSet.add($(this).text().trim());
     });
    YULDestinations.Cities = await [...uniqueSet].sort();
            
    await fs.writeFile('YULDestinations.json', JSON.stringify(YULDestinations), function(err){
        if (err) throw err;
        console.log("Successfully Written to File.");
    });
    await browser.close();
});