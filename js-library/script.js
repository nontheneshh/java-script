const bookStorage = new BookStorage(
  document.getElementById('container-books')
);
const visitorStorage = new VisitorStorage(
  document.getElementById('container-visitors')
);
const cardStorage = new CardStorage(
  document.getElementById('container-cards')
);

fillControls('books');
const btns = document.querySelector('header').querySelectorAll('button');
for (let btn of btns) {
  btn.onclick = function(event){
    for (let sbtn of btns) {
      if (sbtn.className == 'menu__item-active') {
        sbtn.className = '';
        const section = document.getElementById(sbtn.name);
        section.className = 'hidden';
        section.querySelector('div').innerHTML = '';
        break;
      }
    }

    document.getElementById(this.name).className = '';
    this.className = 'menu__item-active';
    fillControls(this.name.toLowerCase());
  }
}



function fillControls(page) {
  const select = document.getElementById('sorting');
  const h2 = document.getElementById('all');
  const button = document.getElementById('add');
  button.className = '';
  const searchform = document.forms.searchform;
  searchform.style.display = 'block';
  const span = document.getElementById('span');
  span.innerText = 'Sort by';
  select.innerHTML = '';

  switch (page) {
    case 'books':
      h2.innerText = 'All Books';
      button.innerText = 'Add a new book';
      select.innerHTML = `
        <option value="id">ID</option>
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="house">House</option>
        <option value="year">Year</option>
        <option value="pages">Pages</option>
        <option value="left">Left</option>
      `;
      button.onclick = function(event) {
        bookStorage.createBook();
      }
      select.onchange = function(event){
        bookStorage.sortBy(this.value);
      }
      searchform.search.onclick = function(event){
        bookStorage.search(searchform.text.value);
      }
      bookStorage.render();
      break;


    case 'visitors':
      h2.innerText = 'All Visitors';
      button.innerText = 'Add a new visitor';
      select.innerHTML = `
        <option value="id">ID</option>
        <option value="name">Name</option>
        <option value="phone">Phone</option>
      `;
      button.onclick = function(event) {
        visitorStorage.createVisitor();
      }
      select.onchange = function(event){
        visitorStorage.sortBy(this.value);
      }
      searchform.search.onclick = function(event){
        visitorStorage.search(searchform.text.value);
      }
      visitorStorage.render();
      break;

      case 'cards':
        h2.innerText = 'All Cards';
        button.innerText = 'Add a new card';
        select.innerHTML = `
          <option value="id">ID</option>
          <option value="visitorId">Visitor ID</option>
          <option value="bookId">Book ID</option>
          <option value="borrowDate">Borrow Date</option>
          <option value="returnDate">Return Date</option>
        `;
        button.onclick = function(event) {
          cardStorage.createCard(bookStorage.books, visitorStorage.visitors);
        }
        select.onchange = function(event){
          cardStorage.sortBy(this.value);
        }
        searchform.search.onclick = function(event){
          cardStorage.search(searchform.text.value);
        }
        cardStorage.render();
        break;


      case 'statistics':
      button.className = 'hidden';
      searchform.style.display = 'none';
      span.innerText = 'Show';
      const statcontainer = document.getElementById('container-statistics')
      select.innerHTML = `
        <option value="book">Book</option>
        <option value="visitor">Visitor</option>
      `;
      h2.innerText = 'Statistics';

      renderStatistics(getStatistics(cardStorage.cards, 'book', 5), statcontainer);
      select.onchange = function(event){
          renderStatistics(getStatistics(cardStorage.cards, this.value, 5), statcontainer);
      }
      break
  }
}
