//
// Cratejoy Scraper
//

const fs = require('fs');
const osmosis = require('osmosis');
const yargs = require('yargs');

const argv = yargs
    .options({
        category: {
            describe:'which category of crategjoy to scrape. The choices are: (1) Beauty, (2) Books, (3) Gaming, (4) Home, (5) Food, (6) Kids, (7) Pets, (8) Art, (9) Fitness, (10) Men, (11) Novelty',
            demand: true,
            alias: 'c',
            string: true
        },
        pages: {
            describe: 'How many pages of the given category to scrape',
            alias: 'p',
            number: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

let categories = [
    [ 'beauty', 'beauty-fashion-subscription-boxes/' ],
    [ 'books', 'book-subscription-boxes/' ],
    [ 'gaming', 'geek-gaming-subscription-boxes/' ],
    [ 'home', 'home-garden-subscription-boxes/' ],
    [ 'food', 'food-subscription-boxes/' ],
    [ 'kids', 'family-kids-subscription-boxes/' ],
    [ 'pets', 'animals-pets-subscription-boxes/' ],
    [ 'art', 'art-culture-subscription-boxes/' ],
    [ 'fitness', 'fitness-health-subscription-boxes/' ],
    [ 'men', 'subscription-boxes-for-men/' ],
    [ 'novelty', 'novelty-subscription-boxes/' ]
] 

let cat, filename;

for (let i = 0; i < categories.length; i++) {
    if ( categories[i][0] === argv.category.toLowerCase() ) {
        cat = categories[i][1];
        filename = categories[i][0];
        break;
    }
}

let pages = argv.pages || 1;
let url = "https://www.cratejoy.com/category/" + cat

let results = [];

osmosis
    .get(url)
    .paginate('a.listingResults-page-next', pages)
    .find('#hits')
    .follow('a.listing-box')
    .find('body')
    .set({
        'company': '.listingSidebar-name h2'
    })
    .find('#listing-more')
    .set({
        'url': '#storeBacklink@href',
        'facebook': '#merchant-facebook-link@href',
        'ig': '#merchant-instagram-link@href'
    })
    .data((data) => {
        results.push(data)
    })
    .log(console.log)
    .error(console.error)
    .done(() => {
        fs.writeFile('results/' + filename , JSON.stringify( results, null, 4), function(err) {
            if(err) console.error(err);
            else console.log('Data Saved to data.json file');
        });
    });