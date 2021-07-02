class Table{
    constructor(containerId){
        this.container = document.getElementById(containerId);
        this.table = document.createElement('table');
        
        this.head = document.createElement('thead');
        this.foot = document.createElement('tfoot');
        this.body = document.createElement('tbody');
        
        this.table.append(this.head);
        this.table.append(this.foot);
        this.table.append(this.body);


        this._setTableListeners();
    }

    // возвращает значение выбранного dataset из нужного столбца
    getDatasetValue(datasetType, columnIndex){
        return this.head.childNodes[0].childNodes[columnIndex].dataset[datasetType];
    }

    create(args){
        // если при создании не было передано столбца с id
        if (!args.find(a => a['columnName'] === 'id')){
            args = [{columnName: 'id', columnText: 'Id', total : '', validation: 'int'}, ...args];
        }

        this._createHead(args);
        this._createFoot(args);
        this.container.append(this.table);
    }

    remove(){
        this.table.remove();
    }    

    addRow(args){
        const rowId = this.getMaxId() + 1;

        const row = document.createElement('tr');
        const headRow = this.head.childNodes[0];

        // если id не было передано, то создаем
        if (args['id'] == undefined || args['id'] == '') 
            args['id'] = rowId;

        const ind = this.getColumnIndex('id');
        const tds = this.body.childNodes;

        const errors = [];
        let isValid = true;

        // проверка уникальности id
        Array.from(tds).forEach(e=>{
            if (args['id'] == e.childNodes[ind].innerText){ 
                isValid = false
                errors.push('Id не должен повторяться')
            };
        })

        // создаем строку, заполняем
        headRow.childNodes.forEach((el) => {
            const td = document.createElement('td');
            const value = args[el.dataset['columnName']];
            const validationType = el.dataset['validation'];
           
            if (this._validateValue(value, validationType)){
                td.innerText = value;
            }
            else{
                errors.push(`ошибка: ${el.innerText} неверный формат`);
                isValid = false;
                return;
            } 

            row.append(td);
        });        
        if (!isValid) {
            window.alert(errors.join('\n'));
            return false;
        }

        this.body.append(row);
        
        // высчитываем итоги
        this.updateData();
        
        return true;
    }

    // обновляет итого определенного столбца
    updateDateTotal(columnIndex){
        const totalType = this.getDatasetValue('total', columnIndex);
        const rows = this.body.querySelectorAll('tr');
        switch (totalType){
            case 'sum':
                let res = 0;
                rows.forEach(r => {       
                    res += +r.children[columnIndex].innerText;
                });
                this.foot.childNodes[0].childNodes[columnIndex].innerText = res;
                break;
            case 'count':
                this.head.childNodes[0].childNodes.forEach((el, i) => {
                    if (this.getDatasetValue('total', i) == 'count')
                        this.foot.childNodes[0].childNodes[i].innerText = this.body.childNodes.length;
                });
                break;
        }
    }

    // обновляет итого всех столбцов
    updateData(){
        for (let i = 0; i < this.head.childNodes[0].childNodes.length; i++){
            this.updateDateTotal(i);
        }
    }
    
    // перемещение столбцов
    moveColumn(columnName1, columnName2) {
        if (columnName1 == columnName2) return;

        // находим индексы столбцов
        let from = this.getColumnIndex(columnName1);
        let to = this.getColumnIndex(columnName2);

        if (from > to){
            const tmp = from;Date.parse()
            from = to;
            to = tmp;
        }

        const rows = this.table.querySelectorAll('tr');
        // меняем местами все ячейки таблицы из нужных столбцов
        rows.forEach((el) => {
            const cols = el.querySelectorAll('th, td');
            const afterNode2 = cols[to].nextElementSibling;
            const parent = cols[to].parentNode;
            cols[from].replaceWith(cols[to]);
            parent.insertBefore(cols[from], afterNode2);
        });
    }

    removeRowModal(cell){
       const response = window.confirm('Удалить id ' + cell.innerText);
       if (response){
           cell.parentNode.remove();
           this.updateData();
       }
    }

    addRowModal(){
        const modal = document.createElement('div');
        modal.className = 'modal';
    
        modal.innerHTML = `
        <div class="modal-content">
        <div class="modal__caption">
          <div class="modal__caption-name">Добавление строки</div>
          <div class="modal__X">X</div>
        </div>
        <div class="modal__body">
          <form name="row-add-form"></form>
        </div>
        <div class="modal__footer">
          <button type="button">Сохранить</button>
          <button type="button">Отмена</button>
        </div>
      </div>`;
    
        const form = modal.querySelector('form');
        let formHTML = '';
       
        this.head.childNodes[0].childNodes.forEach(el => {
            
            formHTML += `
            <div>
              <span>${el.innerText}:</span>
              <input type="text" name="${el.dataset['columnName']}"></input>
            </div>`
        });

        form.innerHTML = formHTML;

        modal.querySelector('.modal__X').addEventListener(
            'click', ()=>{modal.remove()}, false);
        modal.querySelector('button:last-child').addEventListener(
            'click', ()=>{modal.remove()}, false);
            
        modal.querySelector('button:first-child').addEventListener(
            'click', () => {
                const form = document.forms['row-add-form'];
                const argsAddRow = {};
                this.head.childNodes[0].childNodes.forEach(el => {
                    argsAddRow[el.dataset['columnName']] = form[el.dataset['columnName']].value;
                });
                const isSuccess = table.addRow(argsAddRow);

                if (!isSuccess) return; 
                modal.remove();
            }, false);
    
        document.body.appendChild(modal);
    }

    getColumnIndex(columnName){
        const elems = Array.from(this.head.querySelectorAll('th'));
        return elems.findIndex((el) => el.dataset['columnName'] == columnName);
    }

    getMaxId(){
        if (this.body.childNodes.length == 0) return 0;

        const index = this.getColumnIndex('id');
        const tds = Array.from(this.body.childNodes);

        return Math.max.apply(Math, tds.map(el => +el.childNodes[index].innerText));
    }

//////////////
//////////////

_createHead(args){
    const headRow = document.createElement('tr');
    
    args.forEach((el, i) => {
        const th = document.createElement('th');
        for (let i in el) { 
            if (i == 'columnText'){
                th.innerText = el[i];
            }
            else{
                th.dataset[i] = el[i];
            }
        }

        headRow.append(th);
    });

    this.head.append(headRow);
}


    _createFoot(args){
        const footTr = document.createElement('tr');

        args.forEach((el, i) => {
            const footTh = document.createElement('th');
            
             if (el['columnName'] == 'id') footTh.innerText = 'Итого';
             else footTh.innerText = '0';
            
            footTr.append(footTh);
        });
        
       this.foot.append(footTr);
    }

    _validateValue(value, type){
        switch(type){
            case 'int':
                if (!isFinite(value) || isNaN(value)){
                    return false;
                }
                break;
            case 'date':
                const dateRegexp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g
                return dateRegexp.test(value);
                break;
        }

        return true;
    }

    _setTableListeners(){
        // не всегда с первого раза срабатывает, с firefox проблемы
        this.table.addEventListener('dragstart',(e) => {
            if (e.target.tagName != 'TH' && e.target.tagName != 'TD') return;

            if (e.tagName == 'TH'){
                e.dataTransfer.setData('text/plain', e.target.dataset['columnName']);
            }
            else{
                const columnName = this.getDatasetValue('columnName', e.target.cellIndex);
                e.dataTransfer.setData('text/plain', columnName);
            }

            e.target.classList.toggle('dragging');
        });

        this.table.addEventListener('dragend',(e) => {
            if (e.target.tagName != 'TH' && e.target.tagName != 'TD') return;

            e.target.classList.toggle('dragging');
        });

        this.table.addEventListener('dragenter',(e) => {
            if (e.target.tagName != 'TH' && e.target.tagName != 'TD') return;

            e.target.classList.toggle('drag-hover')
        });

        this.table.addEventListener('dragleave',(e) => {
            if (e.target.tagName != 'TH' && e.target.tagName != 'TD') return;

            e.target.classList.toggle('drag-hover')
        });

        this.table.addEventListener('dragover',(e) => {
            if (e.target.tagName != 'TH' && e.target.tagName != 'TD') return;

            e.preventDefault();
         });

         this.table.addEventListener('drop',(e) => {
            if (e.target.tagName != 'TH' && e.target.tagName != 'TD') return;

            e.preventDefault();

            if (e.target.tagName == 'TH'){
                this.moveColumn(
                    e.dataTransfer.getData('text/plain'), 
                    e.target.dataset['columnName']);
            }
            if (e.target.tagName == 'TD'){
                this.moveColumn(
                    e.dataTransfer.getData('text/plain'), 
                    this.getDatasetValue('columnName', e.target.cellIndex));
            }
            e.target.classList.toggle('drag-hover')
        });




        this.table.addEventListener('dblclick', (e) =>{            
            if (e.target.tagName != 'TD') return;

            const input = document.createElement('input');
            const columnIndex = e.target.cellIndex;
            input.dataset['validation'] = this.getDatasetValue('validation', columnIndex);
            input.type = 'text';
            input.className = 'tmp-input';
            input.value = e.target.innerText;

            input.addEventListener('blur', e2 => {
                const self = e2.target;
                const parent = self.parentNode;
                self.value.trim();

                // на случай копирование в input
                if (self.dataset['validation'] == 'int')
                    self.value = self.value.replace(/\D/g, '');
              
                    parent.innerText = self.value;
                
                if (self.classList.contains('invalid')){
                    parent.classList.add('invalid');
                }
                else {
                    parent.classList.remove('invalid');
                }
                
                self.remove();
                this.updateDateTotal(parent.cellIndex);
            });

            input.addEventListener('input', e => {
                const ci = e.target.parentNode.cellIndex;
                const validationType = this.getDatasetValue('validation', ci);
              
                switch (validationType){
                    case 'int' : 
                        if (!this._validateValue(e.data, validationType))
                             e.target.value = e.target.value.replace(e.data, '');
                        break;
                    case 'date': 
                        if (!this._validateValue(e.target.value, validationType)){
                           if (!e.target.classList.contains('invalid'))
                                e.target.classList.add('invalid');
                        }
                        else{
                            if (e.target.classList.contains('invalid'))
                                e.target.classList.remove('invalid');
                        }
                        break;
                }
            });

            e.target.innerText = '';
            e.target.append(input);
            input.focus();
        });


        this.table.addEventListener('click', (e) =>{
            const th = e.target;
            
            if (e.target.tagName == 'TD'){
                const ci = e.target.cellIndex;
                if (this.getDatasetValue('columnName', ci) == 'id') 
                    this.removeRowModal(e.target);
            }
            if (e.target.tagName == 'TH' && th.parentNode.parentNode.tagName == 'THEAD'){
                const tbody = th.closest('table').querySelector('tbody');
                Array.from(tbody.childNodes)
                    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                    .forEach(tr => tbody.appendChild(tr));
            }
        });
    }
}
