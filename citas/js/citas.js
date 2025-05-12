
        document.addEventListener('DOMContentLoaded', function() {
            // Elementos del DOM
            const timeSlotsContainer = document.querySelector('.time-slots');
            const appointmentsContainer = document.querySelector('.appointments');
            const currentDateInput = document.getElementById('current-date');
            const prevDayBtn = document.getElementById('prev-day');
            const nextDayBtn = document.getElementById('next-day');
            const appointmentModal = document.getElementById('appointment-modal');
            const appointmentForm = document.getElementById('appointment-form');
            const cancelAppointmentBtn = document.getElementById('cancel-appointment');
            const modalTitle = document.getElementById('modal-title');
            const appointmentIdInput = document.getElementById('appointment-id');
            const appointmentDateInput = document.getElementById('appointment-date');
            const appointmentTimeInput = document.getElementById('appointment-time');
            const searchBox = document.getElementById('search-box');
            
            // Clave para localStorage
            const STORAGE_KEY = 'medical_appointments';
            
            // Configurar fecha actual
            const today = new Date();
            const formattedToday = formatDateForInput(today);
            currentDateInput.value = formattedToday;
            
            // Generar horario de 8:00 AM a 6:00 PM con intervalos de 30 minutos
            function generateTimeSlots() {
                timeSlotsContainer.innerHTML = '';
                
                for (let hour = 8; hour < 18; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        const timeSlot = document.createElement('div');
                        timeSlot.className = 'time-slot';
                        timeSlot.textContent = timeString;
                        timeSlotsContainer.appendChild(timeSlot);
                    }
                }
            }
            
            // Obtener citas de localStorage
            function getAppointments() {
                const appointmentsJson = localStorage.getItem(STORAGE_KEY);
                return appointmentsJson ? JSON.parse(appointmentsJson) : {};
            }
            
            // Guardar citas en localStorage
            function saveAppointments(appointments) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
            }
            
            // Obtener citas para una fecha específica
            function getAppointmentsForDate(date) {
                const appointments = getAppointments();
                return appointments[date] || [];
            }
            
            // Guardar una cita
            function saveAppointment(appointment) {
                const appointments = getAppointments();
                const date = appointment.date;
                
                if (!appointments[date]) {
                    appointments[date] = [];
                }
                
                if (appointment.id) {
                    // Editar cita existente
                    const index = appointments[date].findIndex(a => a.id === appointment.id);
                    if (index !== -1) {
                        appointments[date][index] = appointment;
                    }
                } else {
                    // Nueva cita
                    appointment.id = Date.now().toString();
                    appointments[date].push(appointment);
                }
                
                saveAppointments(appointments);
                return appointment;
            }
            
            // Eliminar una cita
            function deleteAppointment(date, id) {
                const appointments = getAppointments();
                
                if (appointments[date]) {
                    appointments[date] = appointments[date].filter(a => a.id !== id);
                    saveAppointments(appointments);
                }
            }
            
            // Generar slots de citas
            function generateAppointmentSlots() {
                appointmentsContainer.innerHTML = '';
                const currentDate = currentDateInput.value;
                const appointments = getAppointmentsForDate(currentDate);
                
                for (let hour = 8; hour < 18; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        const appointmentSlot = document.createElement('div');
                        appointmentSlot.className = 'appointment-slot available';
                        appointmentSlot.dataset.time = timeString;
                        
                        // Buscar si hay cita para este horario
                        const appointment = appointments.find(a => a.time === timeString);
                        
                        if (appointment) {
                            appointmentSlot.className = 'appointment-slot booked';
                            appointmentSlot.dataset.appointmentId = appointment.id;
                            
                            appointmentSlot.innerHTML = `
                                <div class="appointment-info">
                                    <div class="appointment-name">${appointment.patientName}</div>
                                    <div class="appointment-phone">${appointment.patientPhone}</div>
                                    <div class="appointment-type">${getAppointmentTypeText(appointment.type)}</div>
                                </div>
                                <div class="appointment-actions">
                                    <button class="action-btn btn-edit">Editar</button>
                                    <button class="action-btn btn-delete">Eliminar</button>
                                </div>
                            `;
                            
                            // Agregar eventos a los botones
                            const editBtn = appointmentSlot.querySelector('.btn-edit');
                            const deleteBtn = appointmentSlot.querySelector('.btn-delete');
                            
                            editBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                openEditAppointmentModal(appointment);
                            });
                            
                            deleteBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                if (confirm('¿Estás seguro de eliminar esta cita?')) {
                                    deleteAppointment(currentDate, appointment.id);
                                    updateSchedule();
                                }
                            });
                        } else {
                            appointmentSlot.innerHTML = `
                                <div class="appointment-info">Disponible</div>
                            `;
                        }
                        
                        appointmentSlot.addEventListener('click', handleAppointmentSlotClick);
                        appointmentsContainer.appendChild(appointmentSlot);
                    }
                }
            }
            
            // Obtener texto para tipo de cita
            function getAppointmentTypeText(type) {
                const types = {
                    'consulta': 'Consulta General',
                    'control': 'Control',
                    'emergencia': 'Emergencia',
                    'otros': 'Otros'
                };
                return types[type] || type;
            }
            
            // Abrir modal para editar cita
            function openEditAppointmentModal(appointment) {
                modalTitle.textContent = 'Editar Cita';
                appointmentIdInput.value = appointment.id;
                appointmentDateInput.value = appointment.date;
                appointmentTimeInput.value = appointment.time;
                document.getElementById('patient-name').value = appointment.patientName;
                document.getElementById('patient-phone').value = appointment.patientPhone;
                document.getElementById('appointment-type').value = appointment.type;
                document.getElementById('appointment-notes').value = appointment.notes || '';
                appointmentModal.style.display = 'flex';
            }
            
            // Manejar clic en un slot de cita
            function handleAppointmentSlotClick(event) {
                const slot = event.currentTarget;
                const time = slot.dataset.time;
                const currentDate = currentDateInput.value;
                
                if (slot.classList.contains('available')) {
                    // Nueva cita
                    modalTitle.textContent = 'Nueva Cita';
                    appointmentIdInput.value = '';
                    appointmentDateInput.value = currentDate;
                    appointmentTimeInput.value = time;
                    document.getElementById('patient-name').value = '';
                    document.getElementById('patient-phone').value = '';
                    document.getElementById('appointment-type').value = '';
                    document.getElementById('appointment-notes').value = '';
                    appointmentModal.style.display = 'flex';
                }
            }
            
            // Formatear fecha para input type="date"
            function formatDateForInput(date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            
            // Cambiar día
            function changeDate(days) {
                const currentDate = new Date(currentDateInput.value);
                currentDate.setDate(currentDate.getDate() + days);
                currentDateInput.value = formatDateForInput(currentDate);
                updateSchedule();
            }
            
            // Actualizar el horario
            function updateSchedule() {
                generateAppointmentSlots();
            }
            
            // Buscar citas
            function searchAppointments() {
                const searchTerm = searchBox.value.toLowerCase();
                if (!searchTerm) {
                    updateSchedule();
                    return;
                }
                
                const allAppointments = getAppointments();
                const matchingAppointments = [];
                
                // Buscar en todas las fechas
                for (const date in allAppointments) {
                    allAppointments[date].forEach(appointment => {
                        if (appointment.patientName.toLowerCase().includes(searchTerm) || 
                            appointment.patientPhone.includes(searchTerm)) {
                            matchingAppointments.push({...appointment, date});
                        }
                    });
                }
                
                // Mostrar resultados
                displaySearchResults(matchingAppointments);
            }
            
            // Mostrar resultados de búsqueda
            function displaySearchResults(appointments) {
                appointmentsContainer.innerHTML = '';
                
                if (appointments.length === 0) {
                    appointmentsContainer.innerHTML = '<div class="no-results">No se encontraron citas</div>';
                    return;
                }
                
                // Ordenar por fecha y hora
                appointments.sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    if (dateCompare !== 0) return dateCompare;
                    return a.time.localeCompare(b.time);
                });
                
                // Mostrar cada cita encontrada
                appointments.forEach(appointment => {
                    const appointmentElement = document.createElement('div');
                    appointmentElement.className = 'appointment-slot booked';
                    appointmentElement.innerHTML = `
                        <div class="appointment-info">
                            <div class="appointment-date">${formatDisplayDate(appointment.date)} ${appointment.time}</div>
                            <div class="appointment-name">${appointment.patientName}</div>
                            <div class="appointment-phone">${appointment.patientPhone}</div>
                            <div class="appointment-type">${getAppointmentTypeText(appointment.type)}</div>
                            ${appointment.notes ? `<div class="appointment-notes">Notas: ${appointment.notes}</div>` : ''}
                        </div>
                        <div class="appointment-actions">
                            <button class="action-btn btn-edit">Editar</button>
                            <button class="action-btn btn-delete">Eliminar</button>
                        </div>
                    `;
                    
                    // Agregar eventos a los botones
                    const editBtn = appointmentElement.querySelector('.btn-edit');
                    const deleteBtn = appointmentElement.querySelector('.btn-delete');
                    
                    editBtn.addEventListener('click', () => {
                        openEditAppointmentModal(appointment);
                    });
                    
                    deleteBtn.addEventListener('click', () => {
                        if (confirm('¿Estás seguro de eliminar esta cita?')) {
                            deleteAppointment(appointment.date, appointment.id);
                            searchAppointments();
                        }
                    });
                    
                    appointmentsContainer.appendChild(appointmentElement);
                });
            }
            
            // Formatear fecha para mostrar
            function formatDisplayDate(dateString) {
                const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('es-ES', options);
            }
            
            // Event listeners
            prevDayBtn.addEventListener('click', () => changeDate(-1));
            nextDayBtn.addEventListener('click', () => changeDate(1));
            currentDateInput.addEventListener('change', updateSchedule);
            
            cancelAppointmentBtn.addEventListener('click', () => {
                appointmentModal.style.display = 'none';
            });
            
            searchBox.addEventListener('input', searchAppointments);
            
            appointmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const appointment = {
                    id: appointmentIdInput.value || Date.now().toString(),
                    date: appointmentDateInput.value,
                    time: appointmentTimeInput.value,
                    patientName: document.getElementById('patient-name').value,
                    patientPhone: document.getElementById('patient-phone').value,
                    type: document.getElementById('appointment-type').value,
                    notes: document.getElementById('appointment-notes').value
                };
                
                saveAppointment(appointment);
                appointmentModal.style.display = 'none';
                
                if (searchBox.value) {
                    searchAppointments();
                } else {
                    updateSchedule();
                }
            });
            
            // Cerrar modal haciendo clic fuera del contenido
            window.addEventListener('click', function(event) {
                if (event.target === appointmentModal) {
                    appointmentModal.style.display = 'none';
                }
            });
            
            // Inicializar
            generateTimeSlots();
            generateAppointmentSlots();
        });
  