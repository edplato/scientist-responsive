// APP FUNCTIONS:
// -FETCHING/RENDERING SCIENTISTS FROM API TO DOM
// -ADDING NEW SCIENTISTS TO STORE AND DOM
// -SORTING SCIENTISTS BY FOUR METHODS

// STORE SCIENTISTS OBJECTS
var scientistStore = [];

// CREATE TEMPLATE LITERAL SCIENTIST DOM ELEMENT
var createScientist = function(scientist) {
  // timeString handles lorempixel (API image source) repeating issue by adding variation to src
  var timeString = '?=' + (Date.now() - Math.floor(Math.random() * (223 - 2 + 1)) + 2);
  return '<div class="scientist">' +
      '<h2 class="name">' +
          scientist.name +
      '</h2>' +
      '<p class="birthday">' + scientist.birthday + '</p>' +
      '<p class="quote">' + scientist.quote + '</p>' +
      '<img class="loadingImage" src=' + scientist.image_url + timeString + ' onload="removeLoading(this)"/>' +
   '</div>';
};

// REMOVE LOADINGIMAGE CLASS USED WHEN IMG URLS LOADED
var removeLoading = function(e) {
  e.classList.remove('loadingImage');
};

// GET REQUEST FOR SCIENTIST DATA TO STORE AND ADD TO SCIENTIST CONTAINER DOM
var getScientists = function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/data');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var scientists = JSON.parse(xhr.responseText);
      for (var i = 0; i < scientists.length; i++) {
        scientistStore.push(scientists[i]);
        var scientist = createScientist(scientists[i]);
        document.querySelector('.scientist-container').insertAdjacentHTML('beforeend', scientist);
      }
    }
  };
  xhr.send();
};

// POST REQUEST TO ADD NEW SCIENTIST THROUGH DATA VALUES FROM THE FORM ELEMENT
var addScientist = function() {
  // HANDLE DATE FORMATTING FOR API CONSISTENCY
  var date = new Date(document.getElementById('form_birthday').value);
  var dateFormat = date.toLocaleString('en-us', {month: 'long'}) + ' ' +
                   date.toLocaleString('en-us', {day: 'numeric'}) + ', ' +
                   date.toLocaleString('en-us', {year: 'numeric'});

  // GET FORM VALUES FOR NEW SCIENTIST THEN RESET FORM VALUES
  var newScientist = {
    'name': document.getElementById('form_name').value,
    'quote': document.getElementById('form_quote').value,
    'birthday': dateFormat,
    'image_url': document.getElementById('form_image_url').value
  };

  document.getElementById('form_name').value = '';
  document.getElementById('form_quote').value = '';
  document.getElementById('form_birthday').value = '';
  document.getElementById('form_image_url').value = '';

  // POST REQUEST AND ADDITION OF NEW SCIENTIST TO TOP OF SCIENTIST CONTAINER DOM
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/data');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if (xhr.status === 201) {
      scientistStore.push(newScientist);
      var scientist = createScientist(newScientist);
      document.querySelector('.scientist-container').insertAdjacentHTML('afterbegin', scientist);
    }
  };
  xhr.send(JSON.stringify(newScientist));
};

//SORT SCIENTISTS ELEMENTS IN SCIENTIST CONTAINER DOM
var sortScientists = function(type) {
  // FOUR TYPES OF SORTS RELATED TO LAST NAME AND BIRTHDATE
  var sortType = {
    nameAZ: function(a, b) {
      if (a.name.split(' ')[1] === undefined) {
        return 1;
      }
      if (b.name.split(' ')[1] === undefined) {
        return -1;
      } else {
        var aName = a.name.split(' ')[1].toUpperCase();
        var bName = b.name.split(' ')[1].toUpperCase();
        return (aName > bName) ? 1 : ((bName > aName) ? -1 : 0);
      }
    },
    nameZA: function(a, b) {
      if (a.name.split(' ')[1] === undefined) {
        return 1;
      }
      if (b.name.split(' ')[1] === undefined) {
        return -1;
      } else {
        var aName = a.name.split(' ')[1].toUpperCase();
        var bName = b.name.split(' ')[1].toUpperCase();
        return (aName < bName) ? 1 : ((bName < aName) ? -1 : 0);
      }
    },
    dateOldNew: function(a, b) {
      var aDate = a.birthday.split(' ')[2];
      var bDate = b.birthday.split(' ')[2];
      return (aDate > bDate) ? 1 : ((bDate > aDate) ? -1 : 0);
    },
    dateNewOld: function(a, b) {
      var aDate = a.birthday.split(' ')[2];
      var bDate = b.birthday.split(' ')[2];
      return (aDate < bDate) ? 1 : ((bDate < aDate) ? -1 : 0);
    }
  };

  // SORT COPY OF SCIENTIST STORE AND CLEAR SCIENTIST CONTAINER DOM
  var sortedScientists = scientistStore.sort(sortType[type]);
  document.querySelector('.scientist-container').innerHTML = '';

  // ITERATE OF SORTED LIST AND INSERT INTO SCIENTIST CONTAINER DOM
  for (var i = 0; i < sortedScientists.length; i++) {
    var scientist = createScientist(sortedScientists[i]);
    document.querySelector('.scientist-container').insertAdjacentHTML('beforeend', scientist);
  }
};
