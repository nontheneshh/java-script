function getStatistics(cards, which, count){
  switch (which) {
    case 'book':
      return getStatisticAll(cards, count, 'book');
    case 'visitor':
      return getStatisticAll(cards, count, 'visitor');
  }

  function getStatisticAll(cards, count, key){
    const unsortedValues = cards.reduce((acc, obj)=>{
      acc[obj[key]['id']]=(acc[obj[key]['id']] || 0) + 1;
      return acc;
    }, {});
    let sortedValues = Object.keys(unsortedValues).sort((a,b)=>unsortedValues[b]-unsortedValues[a]);
    let stats = {name: key, value: []};

    if (count >= cards.length) count = cards.length;
    for (let i = 0; i < count; i++) {
      if (sortedValues[i]) {
        stats.value.push(
          {
            key : cards.find(c => c[key]['id'] == sortedValues[i])[key],
            quantity: unsortedValues[sortedValues[i]]
          });
      }
    }
      return stats;
  }
}


function renderStatistics(stat, container){
  container.innerHTML = '';
  switch (stat.name) {
    case 'book':
        renderStatisticBook(stat.value, container);
        break;
    case 'visitor':
        renderStatisticVisitor(stat.value, container);
        break;
  }



  function renderStatisticBook(stat, container){
    const table = document.createElement('table');
    table.innerHTML = `
      <caption>Books</caption>
      <thead>
        <tr>
          <th>Position</th>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>House</th>
          <th>Year</th>
          <th>Pages</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody></tbody>`;

    let position = 1;
    for (let s of stat) {
      console.log(stat);
      let item = document.createElement('tr');
      item.innerHTML = `
          <td>${position++}</td>
          <td>${s.key.id}</td>
          <td>${s.key.title}</td>
          <td>${s.key.author}</td>
          <td>${s.key.publishingHouse}</td>
          <td>${s.key.year}</td>
          <td>${s.key.qtPages}</td>
          <td>${s.quantity}</td>
      `;

       table.querySelector('tbody').appendChild(item);
    }
    container.appendChild(table);
  }



  function renderStatisticVisitor(stat, container){
    const table = document.createElement('table');
      table.innerHTML = `
      <caption>Visitors</caption>
        <thead>
          <tr>
            <th>Position</th>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody></tbody>`;

    let position = 1;
    for (let s of stat) {
      let item = document.createElement('tr');
      item.innerHTML = `
          <td>${position++}</td>
          <td>${s.key.id}</td>
          <td>${s.key.name}</td>
          <td>${s.key.phone}</td>
          <td>${s.quantity}</td>
      `;
       table.querySelector('tbody').appendChild(item);
    }
    container.appendChild(table);
  }
}
