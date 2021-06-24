class CardStorage {
  cards = [];
  constructor(container) {
    let tmpcards = JSON.parse(localStorage.getItem('cards')) || [];
    if (tmpcards == null) this.cards = [];
    for (let c of tmpcards) {
      this.cards.push(new Card(
        c.id,
        new Visitor(c.visitor.id, c.visitor.name, c.visitor.phone),
        new Book(c.book.id, c.book.title, c.book.author, c.book.publishingHouse, c.book.year, c.book.qtPages, c.book.qtLeft),
        new Date(c.borrowDate),
        c.returnDate))
    };
    this.container = container;
  }

  render(){
    this.container.innerHTML = '';
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th data-type="number">ID</th>
          <th data-type="string">Visitor</th>
          <th data-type="string">Book</th>
          <th data-type="date">Borrow Date</th>
          <th data-type="date">Return Date</th>
        </tr>
      </thead>
      <tbody></tbody>`;

    for (let card of this.cards) {
       table.querySelector('tbody').appendChild(this._createItem(card));
    }
    this.container.appendChild(table);
  }

  _createItem(card){
    let item = document.createElement('tr');
    item.innerHTML += `
      <td>${card.id}</td>
      <td>${card.visitor.name}</td>
      <td>${card.book.title}</td>
      <td>${card.borrowDate.toLocaleDateString()}</td>`;

      let lastCell = document.createElement('td');
      if (card.returnDate == null){
        lastCell.className = 'table-cell-clickable';
        lastCell.innerText = 'RETURN';
        lastCell.onclick = (e) => {
          const target = e.target;
          target.className = '';
          target.onclick = null;

          card.setReturnDate(new Date());
          target.innerText = card.returnDate.toLocaleDateString();

          console.log(this.cards);
          localStorage.removeItem('cards');
          localStorage.setItem('cards', JSON.stringify(this.cards));
        }
      }
      else{
        lastCell.innerText = card.returnDate.toLocaleDateString();
      }

      item.appendChild(lastCell);
    return item;
  }

   createCard(books, visitors){
     let callback = ()=>{
       let form = document.forms.creating;
       let id;
       if (this.cards.length == 0) id = 1;
       else id = +this.cards[this.cards.length - 1].id + 1;

       let bId = form.books.value.substring(0, form.books.value.indexOf(':'));
       let book = books.find(b => b.id == bId);

       let vId = form.visitors.value.substring(0, form.visitors.value.indexOf(':'));
       let visitor = visitors.find(v => v.id == vId);

       let card = new Card(id, visitor, book, new Date());
       this.add(card);
     }

     let bookNames = books.map(b => `${b.id}: ${b.title}`);
     let visitorNames = visitors.map(v => `${v.id}: ${v.name}`);
     modalWindow(
       'Creating',
       'creating',
       [
         {name: 'Books', value: [...bookNames], type: 'select'},
         {name: 'Visitors', value: [...visitorNames], type: 'select'}
       ],
       'Create',
       callback);
  }

  add(card){
    localStorage.removeItem('cards');
    this.cards.push(card);
    localStorage.setItem('cards', JSON.stringify(this.cards));
    this.container.querySelector('tbody').appendChild(this._createItem(card));
  }

  sortBy(by){
   let table = this.container.querySelector('table');
   let rows = Array.from(table.tBodies[0].rows);

   let cellIndex = 0;
   let type;
   for (let el of table.tHead.querySelectorAll('th')) {
     if (el.innerText.toLowerCase() == by.toLowerCase()){
       type = el.dataset.type;
       break;
     }
     cellIndex++;
   }

   rows.sort((a,b) => compare(a.cells[cellIndex].innerText, b.cells[cellIndex].innerText, type.toLowerCase()));
   table.tBodies[0].append(...rows);
  }


  search(what){
    if (what == '') {
      this.render();
      return;
    }
    const cards = this.cards.reduce((acc, cur) =>{
      for (let i in cur) {
        if (cur[i] === null) continue;

        let comp = cur[i];

        if (i === 'book') {
          comp = cur[i].title;
        }
        else if (i === 'visitor') {
          comp = cur[i].name;
        }

        if (comp.toString().toLowerCase().indexOf(what.toLowerCase()) != -1) {
          if (acc.indexOf(cur) != -1) break;
          acc.push(cur)
        };
      }
      return acc;
    },[]);

    let tbody = this.container.querySelector('tbody');
    tbody.innerHTML = '';
    for (let card of cards) {
       this.container.querySelector('tbody').appendChild(this._createItem(card));
    }
  }
}
