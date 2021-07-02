const table = new Table('layout');

document.getElementById('add-row').onclick = function(){
    table.addRowModal();
};

table.create([
    {columnName:'id', columnText :'Порядковый Номер', total : '', validation : 'int'},
    {columnName:'fullName', columnText :'ФИО', total: 'count', validation : 'none'},
    {columnName:'birthDate', columnText : 'Дата Рождения', total: 'count', validation : 'date'},
    {columnName: 'salary', columnText : 'Оклад', total: 'sum', validation : 'int'}
]);

table.addRow({
    //'id' : '5',
    'fullName' : 'firstname middlename lastname',
    'birthDate' : '04.01.2020',
    'salary' : '11'
});
table.addRow({
  //  'id' : '2',
    'fullName' : 'middlename firstname lastname',
    'birthDate' : '06.03.2020',
    'salary' : '22'
});

table.addRow({
    'id' : '5',
  'fullName' : 'lastname firstname middlename',
  'birthDate' : '09.02.2020',
    'salary' : '33'
});