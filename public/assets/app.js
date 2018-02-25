// MAIN APP FUNCTION WITH METHODS FOR:
// -FETCHING/RENDERING SCIENTISTS FROM API TO DOM
// -ADDING NEW SCIENTISTS TO STORE AND DOM
// -SORTING SCIENTISTS

function GreatScientists() {
  // STORE SCIENTISTS OBJECTS
  this.scientistStore = [];

  // CREATE TEMPLATE LITERAL SCIENTIST DOM ELEMENT
  this.createScientist = (scientist) => {
    // timeString handles lorempixel (API image source) repeating issue by adding variation to src
    let timeString = '?=' + (Date.now() - Math.floor(Math.random() * (223 - 2 + 1)) + 2);
    return `
     <div class="scientist">
        <h2 class="name">
            ${scientist.name}
        </h2>
        <p class="birthday">${scientist.birthday}</p>
        <p class="quote">${scientist.quote}</p>
        <img class="loadingImage" src=${scientist.image_url + timeString} onload="gs.removeLoading(this)"/>
     </div>
    `;
  };

  // REMOVE LOADINGIMAGE CLASS USED WHEN IMG URLS LOADED
  this.removeLoading = (e) => {
    e.classList.remove('loadingImage');
  };

  // GET REQUEST FOR SCIENTIST DATA TO STORE AND ADD TO SCIENTIST CONTAINER DOM
  this.getScientists = () => {
    fetch('http://localhost:3000/data')
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          this.scientistStore.push(data[i]);
          let scientist = this.createScientist(data[i]);
          document.querySelector('.scientist-container').insertAdjacentHTML('beforeend', scientist);
        }
      });
  };

  // POST REQUEST TO ADD NEW SCIENTIST THROUGH DATA VALUES FROM THE FORM ELEMENT
  this.addScientist = () => {
    // HANDLE DATE FORMATTING FOR API CONSISTENCY
    let date = new Date(document.getElementById('form_birthday').value);
    let dateFormat = date.toLocaleString('en-us', {month: 'long'}) + ' ' +
                     date.toLocaleString('en-us', {day: 'numeric'}) + ', ' +
                     date.toLocaleString('en-us', {year: 'numeric'});

    // GET FORM VALUES FOR NEW SCIENTIST THEN RESET FORM VALUES
    let newScientist = {
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
    fetch('http://localhost:3000/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newScientist)
    })
      .then(data => {
        this.scientistStore.push(newScientist);
        let scientist = this.createScientist(newScientist);
        document.querySelector('.scientist-container').insertAdjacentHTML('afterbegin', scientist);
      });
  };

  //SORT SCIENTISTS ELEMENTS IN SCIENTIST CONTAINER DOM
  this.sortScientists = (type) => {
    // FOUR TYPES OF SORTS RELATED TO LAST NAME AND BIRTHDATE
    const sortType = {
      nameAZ: (a, b) => {
        if (a.name.split(' ')[1] === undefined) {
          return 1;
        }
        if (b.name.split(' ')[1] === undefined) {
          return -1;
        } else {
          let aName = a.name.split(' ')[1].toUpperCase();
          let bName = b.name.split(' ')[1].toUpperCase();
          return (aName > bName) ? 1 : ((bName > aName) ? -1 : 0);
        }
      },
      nameZA: (a, b) => {
        if (a.name.split(' ')[1] === undefined) {
          return 1;
        }
        if (b.name.split(' ')[1] === undefined) {
          return -1;
        } else {
          let aName = a.name.split(' ')[1].toUpperCase();
          let bName = b.name.split(' ')[1].toUpperCase();
          return (aName < bName) ? 1 : ((bName < aName) ? -1 : 0);
        }
      },
      dateNewOld: (a, b) => {
        let aDate = a.birthday.split(' ')[2];
        let bDate = b.birthday.split(' ')[2];
        return (aDate > bDate) ? 1 : ((bDate > aDate) ? -1 : 0);
      },
      dateOldNew: (a, b) => {
        let aDate = a.birthday.split(' ')[2];
        let bDate = b.birthday.split(' ')[2];
        return (aDate < bDate) ? 1 : ((bDate < aDate) ? -1 : 0);
      }
    };

    // SORT COPY OF SCIENTIST STORE AND CLEAR SCIENTIST CONTAINER DOM
    let sortedScientists = [...this.scientistStore].sort(sortType[type]);
    document.querySelector('.scientist-container').innerHTML = '';

    // ITERATE OF SORTED LIST AND INSERT INTO SCIENTIST CONTAINER DOM
    for (let i = 0; i < sortedScientists.length; i++) {
      let scientist = this.createScientist(sortedScientists[i]);
      document.querySelector('.scientist-container').insertAdjacentHTML('beforeend', scientist);
    }
  };
}

const gs = new GreatScientists();