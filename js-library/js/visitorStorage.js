class VisitorStorage {
  visitors = [];
  constructor(container) {
    let tmpvisitors = JSON.parse(localStorage.getItem('visitors')) || [];
    if (tmpvisitors == null) this.visitors = [];
    for (let v of tmpvisitors) {
      this.visitors.push(new Visitor(v.id, v.name, v.phone));
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
          <th data-type="string">Name</th>
          <th data-type="string">Phone</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody></tbody>`;
    for (let visitor of this.visitors) {
       table.querySelector('tbody').appendChild(this._createItem(visitor));
    }
    this.container.appendChild(table);
  }

  _createItem(visitor){
    let item = document.createElement('tr');
    item.innerHTML += `
      <td>${visitor.id}</td>
      <td data-type="string">${visitor.name}</td>
      <td data-type="string">${visitor.phone}</td>
      <td class="table-cell-clickable">EDIT</td>`;
    item.querySelector('td:last-child').addEventListener('click', ()=>{this.edit(event, visitor);});
    return item;
  }

  edit(e, visitor){
    let callback = ()=>{
      let form = document.forms.editing;
      visitor.change(form.name.value, form.phone.value);
      localStorage.removeItem('visitors');
      localStorage.setItem('visitors', JSON.stringify(this.visitors));
      this.render();
    }
    modalWindow(
      'Editing',
      'editing',
      [
        {type: 'input', name: 'Name', value: visitor.name},
        {type: 'input', name: 'Phone', value: visitor.phone}
      ],
      'Edit',
      callback);
  }


  createVisitor(){
    let callback = ()=>{
      let form = document.forms.creating;
      let id;
      if (this.visitors.length == 0) id = 1;
      else id = +this.visitors[this.visitors.length - 1].id + 1;
      let visitor = new Visitor(id, form.name.value, form.phone.value);
      this.add(visitor);
    }
    modalWindow(
      'Creating',
      'creating',
      [
        {type: 'input', name: 'Name', value: ''},
        {type: 'input', name: 'Phone', value: ''}
      ],
      'Create',
      callback);
 }

  add(visitor){
    localStorage.removeItem('visitors');
    this.visitors.push(visitor);
    localStorage.setItem('visitors', JSON.stringify(this.visitors));
    this.container.querySelector('tbody').appendChild(this._createItem(visitor));
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
   const visitors = this.visitors.reduce((acc, cur) =>{
     for (let i in cur) {
       if (cur[i].toString().toLowerCase().indexOf(what.toLowerCase()) != -1) {
         if (acc.indexOf(cur) != -1) break;
         acc.push(cur)
       };
     }
     return acc;
   },[]);

   let tbody = this.container.querySelector('tbody');
   tbody.innerHTML = '';
   for (let visitor of visitors) {
      this.container.querySelector('tbody').appendChild(this._createItem(visitor));
   }
 }
}
