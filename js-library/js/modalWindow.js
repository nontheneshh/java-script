function modalWindow(caption, name, fields, buttonText, callback){
  let modal = document.createElement('div');
  modal.className = 'modal';

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal__caption">
        <div class="modal__caption-name">${caption}</div>
        <div class="modal__X">X</div>
      </div>
      <div class="modal__body">
        <form name="${name}"></form>
      </div>
      <div class="modal__footer">
        <button type="button">${buttonText}</button>
        <button type="button">Cancel</button>
      </div>
    </div>`;

  let form = modal.querySelector('form');
  let formHTML = '';
  for (let field of fields) {
    switch (field.type) {
      case 'input':
        formHTML += `
        <label>
          <span>${field.name}:</span>
          <input type="input" name="${field.name.toLowerCase()}" value="${field.value.toString().toLowerCase()}"></input>
        </label>`;
        break;

      case 'select':
        let options = '';
        for (let option of field.value) {
          options += `<option value="${option}">${option}</option>`;
        }
        formHTML += `
        <label>
          <span>${field.name}:</span>
          <select name="${field.name.toLowerCase()}">${options}</select>
        </label>`;
        break;
    }
  }
  form.innerHTML = formHTML;

  modal.querySelector('.modal__X').addEventListener('click', ()=>{modal.remove()}, false);
  modal.querySelector('button:last-child').addEventListener('click', ()=>{modal.remove()}, false);
  modal.querySelector('button:first-child').addEventListener('click', ()=>{callback(); modal.remove();}, false);

  document.body.appendChild(modal);
}
