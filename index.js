'use strict';

// store apiKey & base URL
const apiKey = 'uLeEWjpSIy3rGBk6kepRQxRJAvGkGfsUy7pz43EL'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


// format the userinput query
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

// formatting address
function formatAddress(address) {
  let finalAddress = '';
  finalAddress = address.line1 + ', ';
  if (address.line2) {
    finalAddress += address.line2 + ', ';
  }
  if (address.line3) {
    finalAddress += address.line3 + ', ';
  }  
  return `${finalAddress}${address.city}, ${address.stateCode} ${address.postalCode}`;
}

// display results
function displayResults(responseJson) {

  console.log(responseJson);

  // if no result, show error message
  if (responseJson.total == '0'){
    return $('#js-error-message').text(`Something went wrong: no matches found!`);    
  }
  
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){

  //for the stretch goal: add NP's address into display
    let addressObject = responseJson.data[i].addresses[0];
    console.log(addressObject);

    let completeAddress = formatAddress(addressObject);

  //changing DOM
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><b>Address:</b> ${completeAddress}</p>
      <a href="${responseJson.data[i].directionsUrl}">${responseJson.data[i].directionsUrl}</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};


//converting input state into state code
function stateCodeConverter(stateCodeArray) {
  console.log(stateCodeArray);
  const stateCodeList = {alabama:'AL',
   alaska:'AK',
   arizona:'AZ',
   arkansas:'AR',
   california:'CA',
   colorado:'CO',
   connecticut:'CT',
   delaware:'DE',
   "district of columbia":'DC',
   florida:'FL',
   georgia:'GA',
   hawaii:'HI',
   idaho:'ID',
   illinois:'IL',
   indiana:'IN',
   iowa:'IA',
   kansas:'KS',
   kentucky:'KY',
   louisiana:'LA',
   maine:'ME',
   maryland:'MD',
   massachusetts:'MA',
   michigan:'MI',
   minnesota:'MN',
   mississippi:'MS',
   missouri:'MS',
   montana:'MT',
   nebraska:'NE',
   nevada:'NV',
   "new hampshire":'NH',
   "new jersey":'NJ',
   "new mexico":'NM',
   "new york":'NY',
   "north carolina":'NC',
   "north dakota":'ND',
   ohio:'OH',
   oklahoma:'OK',
   oregon:'OR',
   pennsylvania:'PA',
   "rhode island":'RI',
   "south carolina":'SC',
   "south dakota":'SD',
   tennessee:'TN',
   texas:'TX',
   utah:'UT',
   vermont:'VT',
   virginia:'VA',
   washington:'WA',
   "west virginia":'WV',
   wisconsin:'WI',
   wyoming:'WY'
  };

  let stateCodeListArr = Object.keys(stateCodeList);
  console.log(stateCodeListArr);

  let convertedStateCode = stateCodeArray.map( function(state){
    return stateCodeList[stateCodeListArr.find(element => element === state)]
  });

  console.log(convertedStateCode);  

  return convertedStateCode;
}

// get search results from server
function getNationalParks(query, limit=10) {

  const stateCode = query.toLowerCase().split(',')
  console.log(stateCode)

  let stateCodesArr = stateCodeConverter(stateCode);
  
  if (stateCodesArr.includes(undefined)){
    return $('#js-error-message').text(`Something went wrong: no matches found!`);
  }
  
  const params = {
    api_key: apiKey,
    stateCode: stateCodesArr,
    limit,
    fields: ["addresses"] // this is for the stretch goal: adding address
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//listen to the click
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    $('#results-list').empty();
    $('#results').addClass('hidden');
    $('#js-error-message').empty();    
    getNationalParks(searchTerm, maxResults);
  });
}

$(watchForm);
