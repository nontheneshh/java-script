class BookStorage{
  books = [];
  constructor(container){
    let tmpbooks = JSON.parse(localStorage.getItem('books')) || [];
    if (tmpbooks == null) this.books = [];
    for (let b of tmpbooks) {
      this.books.push(new Book(b.id, b.title, b.author, b.publishingHouse, b.year, b.qtPages, b.qtLeft));
    }

    this.container = container;
  }

  render(){
    this.container.innerHTML = '';
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th data-type="number">ID</th>
          <th data-type="string">Title</th>
          <th data-type="string">Author</th>
          <th data-type="string">House</th>
          <th data-type="number">Year</th>
          <th data-type="number">Pages</th>
          <th data-type="number">Left</th>
          <th>EDIT</th>
          <th>REMOVE</th>
        </tr>
      </thead>
      <tbody></tbody>`;

    for (let book of this.books) {
       table.querySelector('tbody').appendChild(this._createItem(book));
    }
    this.container.appendChild(table);
  }

  _createItem(book){
    let item = document.createElement('tr');
    item.innerHTML += `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.publishingHouse}</td>
      <td>${book.year}</td>
      <td>${book.qtPages}</td>
      <td>${book.qtLeft}</td>
      <td class="table-cell-clickable">EDIT</td>
      <td class="table-cell-clickable">REMOVE</td>`;
    item.querySelector(`td:nth-child(${item.children.length - 1}`).addEventListener('click', ()=>{this.edit(event, book.id);});
    item.querySelector('td:last-child').addEventListener('click', ()=>{this.remove(event, book);});
    return item;
  }

  edit(e, index){
    let book = this.books.find(b => b.id == index);
    let callback = () => {

        let form = document.forms.editing;
        book.change(form.title.value, form.author.value, form.house.value, form.year.value, form.left.value, form.pages.value);
        //console.log(book);
        localStorage.removeItem('books');
        localStorage.setItem('books', JSON.stringify(this.books));
        this.render();
    }
    modalWindow(
      'Editing',
      'editing',
      [
        {type: 'input', name: 'Title', value: book.title},
        {type: 'input', name: 'Author', value: book.author},
        {type: 'input', name: 'House', value: book.publishingHouse},
        {type: 'input', name: 'Year', value: book.year},
        {type: 'input', name: 'Pages', value: book.qtPages},
        {type: 'input', name: 'Left', value: book.qtLeft}
      ],
      'Edit',
      callback);
  }

  remove(e, book){
    let i = this.books.indexOf(book);
    this.books.splice(i, 1);

    localStorage.removeItem('books');
    localStorage.setItem('books', JSON.stringify(this.books));

    this.render();
  }

   createBook(){
     let callback = ()=>{
       let form = document.forms.creating;
       let id;
       if (this.books.length == 0) id = 1;
       else id = +this.books[this.books.length - 1].id + 1;
       let book = new Book(id, form.title.value, form.author.value, form.house.value, form.year.value, form.left.value, form.pages.value);
       this.add(book);
     }

     modalWindow(
       'Creating',
       'creating',
       [
         {type: 'input', name: 'Title', value: ''},
         {type: 'input', name: 'Author', value: ''},
         {type: 'input', name: 'House', value: ''},
         {type: 'input', name: 'Year', value: ''},
         {type: 'input', name: 'Pages', value: ''},
         {type: 'input', name: 'Left', value: ''}
       ],
       'Create',
       callback);
   }

 add(book){
   localStorage.removeItem('books');
   this.books.push(book);
   localStorage.setItem('books', JSON.stringify(this.books));
   this.container.querySelector('tbody').appendChild(this._createItem(book));
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
    const books = this.books.reduce((acc, cur) =>{
      for (let i in cur) {
        if (cur[i].toString().toLowerCase().indexOf(what.toLowerCase()) != -1) {
          console.log('find');
          if (acc.indexOf(cur) != -1) break;
          acc.push(cur)
        };
      }
      return acc;
    },[]);

    let tbody = this.container.querySelector('tbody');
    tbody.innerHTML = '';

    for (let book of books) {
         this.container.querySelector('tbody').appendChild(this._createItem(book));
    }
  }
}
