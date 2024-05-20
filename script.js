document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('agenda-form');
  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const cuitInput = document.getElementById('cuit');
  const condicionIvaInput = document.getElementById('condicion-iva');
  const agendaBody = document.getElementById('agenda-body');
  const searchInput = document.getElementById('search-input');

  // Cargar datos almacenados en localStorage al cargar la página
  loadAgenda();

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombreValue = nombreInput.value.trim();
    const apellidoValue = apellidoInput.value.trim();
    const cuitValue = parseInt(cuitInput.value);
    const condicionIvaValue = condicionIvaInput.value;

    if (nombreValue === '' || apellidoValue === '' || isNaN(cuitValue) || condicionIvaValue === '') {
      alert('Por favor ingresa todos los campos correctamente.');
      return;
    }

    const rowData = {
      nombre: nombreValue,
      apellido: apellidoValue,
      cuit: cuitValue,
      condicionIva: condicionIvaValue
    };

    addRowToTable(rowData);

    // Guardar datos en localStorage
    saveAgenda();

    // Limpiar el formulario
    nombreInput.value = '';
    apellidoInput.value = '';
    cuitInput.value = '';
    condicionIvaInput.value = '';
  });

  // Agregar evento de entrada al campo de búsqueda
  searchInput.addEventListener('input', function() {
    filterTable(searchInput.value.trim().toLowerCase());
  });

  function addRowToTable(rowData) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${rowData.nombre}</td>
      <td>${rowData.apellido}</td>
      <td>${rowData.cuit}</td>
      <td>${rowData.condicionIva}</td>
      <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Borrar</button>
        <button class="copy-btn">Copiar CUIT</button>
      </td>
    `;
    agendaBody.appendChild(row);

    // Asignar eventos a los botones de la nueva fila
    assignRowEvents(row);
  }

  // Función para asignar eventos a los botones de una fila
  function assignRowEvents(row) {
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');
    const copyBtn = row.querySelector('.copy-btn');

    editBtn.addEventListener('click', () => editRow(row));
    deleteBtn.addEventListener('click', () => deleteRow(row));
    copyBtn.addEventListener('click', () => copyCuit(row));
  }

  // Función de edición
  function editRow(row) {
    const nombreCell = row.querySelector('td:nth-child(1)');
    const apellidoCell = row.querySelector('td:nth-child(2)');
    const cuitCell = row.querySelector('td:nth-child(3)');
    const condicionIvaCell = row.querySelector('td:nth-child(4)');
    const actionsCell = row.querySelector('td:nth-child(5)');

    const originalData = {
      nombre: nombreCell.textContent,
      apellido: apellidoCell.textContent,
      cuit: cuitCell.textContent,
      condicionIva: condicionIvaCell.textContent
    };

    nombreCell.innerHTML = `<input type="text" value="${originalData.nombre}">`;
    apellidoCell.innerHTML = `<input type="text" value="${originalData.apellido}">`;
    cuitCell.innerHTML = `<input type="text" value="${originalData.cuit}">`;

    const condicionIvaInput = document.createElement('select');
    const options = ['Monotributo', 'Responsable Inscripto', 'IVA Exento', 'Consumidor Final'];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      if (option === originalData.condicionIva) {
        optionElement.selected = true;
      }
      condicionIvaInput.appendChild(optionElement);
    });
    condicionIvaCell.innerHTML = '';
    condicionIvaCell.appendChild(condicionIvaInput);

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirmar';
    actionsCell.innerHTML = '';
    actionsCell.appendChild(confirmBtn);

    confirmBtn.addEventListener('click', function() {
      const nuevoNombre = nombreCell.querySelector('input').value;
      const nuevoApellido = apellidoCell.querySelector('input').value;
      const nuevoCuit = cuitCell.querySelector('input').value;
      const nuevaCondicionIva = condicionIvaInput.value;

      if (nuevoNombre === '' || nuevoApellido === '' || nuevoCuit === '' || nuevaCondicionIva === '') {
        nombreCell.textContent = originalData.nombre;
        apellidoCell.textContent = originalData.apellido;
        cuitCell.textContent = originalData.cuit;
        condicionIvaCell.textContent = originalData.condicionIva;
      } else {
        nombreCell.textContent = nuevoNombre;
        apellidoCell.textContent = nuevoApellido;
        cuitCell.textContent = nuevoCuit;
        condicionIvaCell.textContent = nuevaCondicionIva;
      }

      actionsCell.innerHTML = `
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Borrar</button>
        <button class="copy-btn">Copiar CUIT</button>
      `;

      assignRowEvents(row);
      saveAgenda();
    });
  }

  // Función de borrado
  function deleteRow(row) {
    row.remove();
    saveAgenda();
  }

  // Función de copia
  function copyCuit(row) {
    const cuitText = row.querySelector('td:nth-child(3)').innerText;
    copyToClipboard(cuitText);
  }

  // Función para copiar al portapapeles
  function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  // Función para guardar la agenda
  function saveAgenda() {
    const rows = agendaBody.querySelectorAll('tr');
    const agendaData = [];
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const rowData = {
        nombre: cells[0].textContent,
        apellido: cells[1].textContent,
        cuit: cells[2].textContent,
        condicionIva: cells[3].textContent
      };
      agendaData.push(rowData);
    });
    localStorage.setItem('agendaData', JSON.stringify(agendaData));
  }

  // Función para cargar la agenda desde el almacenamiento local
  function loadAgenda() {
    const agendaData = JSON.parse(localStorage.getItem('agendaData'));
    if (agendaData) {
      agendaData.forEach(rowData => {
        addRowToTable(rowData);
      });
    }
  }

  // Función para filtrar la tabla según el término de búsqueda
  function filterTable(searchTerm) {
    const rows = agendaBody.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      let matchesSearch = false;
      cells.forEach(cell => {
        if (cell.textContent.toLowerCase().includes(searchTerm)) {
          matchesSearch = true;
        }
      });
      if (matchesSearch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  // Asignar eventos a todas las filas existentes al cargar la página
  const rows = agendaBody.querySelectorAll('tr');
  rows.forEach(row => {
    assignRowEvents(row);
  });
});
