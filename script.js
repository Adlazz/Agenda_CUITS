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

    // Agregar eventos de clic a los botones de edición, eliminación y copia
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');
    const copyBtn = row.querySelector('.copy-btn');

    editBtn.addEventListener('click', function() {
      // Obtener la fila actual
      const row = editBtn.closest('tr');
    
      // Obtener los datos de la fila actual
      const nombre = row.querySelector('td:nth-child(1)').textContent;
      const apellido = row.querySelector('td:nth-child(2)').textContent;
      const cuit = row.querySelector('td:nth-child(3)').textContent;
      const condicionIva = row.querySelector('td:nth-child(4)').textContent;
    
      // Crear inputs para editar los datos
      const nombreInput = document.createElement('input');
      nombreInput.value = nombre;
    
      const apellidoInput = document.createElement('input');
      apellidoInput.value = apellido;
    
      const cuitInput = document.createElement('input');
      cuitInput.value = cuit;
    
      const condicionIvaInput = document.createElement('select');
      const options = ['Monotributo', 'Responsable Inscripto', 'IVA Exento', 'Consumidor Final'];
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        if (option === condicionIva) {
          optionElement.selected = true;
        }
        condicionIvaInput.appendChild(optionElement);
      });
    
      // Crear botón para confirmar los cambios
      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'Confirmar';
    
      // Agregar inputs y botón de confirmar a las celdas de la fila
      row.querySelector('td:nth-child(1)').textContent = '';
      row.querySelector('td:nth-child(1)').appendChild(nombreInput);
      row.querySelector('td:nth-child(2)').textContent = '';
      row.querySelector('td:nth-child(2)').appendChild(apellidoInput);
      row.querySelector('td:nth-child(3)').textContent = '';
      row.querySelector('td:nth-child(3)').appendChild(cuitInput);
      row.querySelector('td:nth-child(4)').textContent = '';
      row.querySelector('td:nth-child(4)').appendChild(condicionIvaInput);
      row.querySelector('td:nth-child(5)').textContent = '';
      row.querySelector('td:nth-child(5)').appendChild(confirmBtn);
    
      // Agregar evento de clic al botón de confirmar cambios
      confirmBtn.addEventListener('click', function() {
        // Obtener los nuevos valores de los inputs
        const nuevoNombre = nombreInput.value;
        const nuevoApellido = apellidoInput.value;
        const nuevoCuit = cuitInput.value;
        const nuevaCondicionIva = condicionIvaInput.value;
    
        // Restaurar el estado original si algún campo está vacío
        if (nuevoNombre === '' || nuevoApellido === '' || nuevoCuit === '' || nuevaCondicionIva === '') {
            row.querySelector('td:nth-child(1)').textContent = originalData.nombre;
            row.querySelector('td:nth-child(2)').textContent = originalData.apellido;
            row.querySelector('td:nth-child(3)').textContent = originalData.cuit;
            row.querySelector('td:nth-child(4)').textContent = originalData.condicionIva;
        } else {
            // Actualizar los valores de la fila con los nuevos valores de los inputs
            row.querySelector('td:nth-child(1)').textContent = nuevoNombre;
            row.querySelector('td:nth-child(2)').textContent = nuevoApellido;
            row.querySelector('td:nth-child(3)').textContent = nuevoCuit;
            row.querySelector('td:nth-child(4)').textContent = nuevaCondicionIva;
        }
    
        // Restaurar el estado original de la fila (editar, borrar y copiar)
        row.querySelector('td:nth-child(5)').innerHTML = `
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Borrar</button>
            <button class="copy-btn">Copiar CUIT</button>
        `;
    
        // Volver a asignar eventos a los botones de edición, borrado y copia
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        const copyBtn = row.querySelector('.copy-btn');
    
        // Agregar eventos de clic a los botones de edición, eliminación y copia
        editBtn.addEventListener('click', function() {
            // Lógica de edición...
            // Por ejemplo, podrías volver a mostrar los inputs para editar los datos aquí
        });
    
        deleteBtn.addEventListener('click', function() {
            // Lógica de borrado...
            deleteBtn.addEventListener('click', function() {
              // Obtener la fila actual
              const row = deleteBtn.closest('tr');
        
              // Eliminar la fila del DOM
              row.remove();
        
              // Guardar los cambios en el almacenamiento local
              saveAgenda();
            });
        });
    
        copyBtn.addEventListener('click', function() {
            // Lógica de copia...
            copyBtn.addEventListener('click', function() {
              // Lógica para copiar el CUIT al portapapeles
              const cuitText = row.querySelector('td:nth-child(3)').innerText;
              copyToClipboard(cuitText);
            });
        });
    
        // Guardar los cambios en el almacenamiento local
        saveAgenda();
    });
    });
    

    deleteBtn.addEventListener('click', function() {
      // Obtener la fila actual
      const row = deleteBtn.closest('tr');

      // Eliminar la fila del DOM
      row.remove();

      // Guardar los cambios en el almacenamiento local
      saveAgenda();
    });

    copyBtn.addEventListener('click', function() {
      // Lógica para copiar el CUIT al portapapeles
      const cuitText = row.querySelector('td:nth-child(3)').innerText;
      copyToClipboard(cuitText);
    });
  }

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

  function loadAgenda() {
    const agendaData = JSON.parse(localStorage.getItem('agendaData'));
    if (agendaData) {
      agendaData.forEach(rowData => {
        addRowToTable(rowData);
      });
    }
  }

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

  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
});
