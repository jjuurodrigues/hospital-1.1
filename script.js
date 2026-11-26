/* =========================
   VIVASUS - JAVASCRIPT
========================= */

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

/* =========================
   MODAL DE INFORMAÇÕES
========================= */

function info(title, message) {
    $("modalTitle").textContent = title;
    $("modalBody").textContent = message;
    $("modal").classList.add("show");
    $("modal").setAttribute("aria-hidden", "false");
}

function closeModal() {
    $("modal").classList.remove("show");
    $("modal").setAttribute("aria-hidden", "true");
}

/* =========================
   UNIDADES
========================= */

const units = [
    {
        id: 1,
        name: "UBS Central",
        address: "Rua das Flores, 120",
        hours: "08:00 às 18:00",
        lotacao: "baixa",
        patients: 12,
        professionals: 8
    },
    {
        id: 2,
        name: "Hospital Municipal",
        address: "Avenida Principal, 500",
        hours: "Atendimento 24 horas",
        lotacao: "alta",
        patients: 45,
        professionals: 18
    },
    {
        id: 3,
        name: "UBS Vila Rami",
        address: "Rua da Saúde, 85",
        hours: "07:00 às 17:00",
        lotacao: "media",
        patients: 25,
        professionals: 10
    },
    {
        id: 4,
        name: "UBS Jardim do Lago",
        address: "Rua das Palmeiras, 210",
        hours: "08:00 às 17:00",
        lotacao: "baixa",
        patients: 10,
        professionals: 7
    },
    {
        id: 5,
        name: "Pronto Atendimento Central",
        address: "Avenida dos Médicos, 300",
        hours: "Atendimento 24 horas",
        lotacao: "media",
        patients: 30,
        professionals: 15
    }
];

function renderUnits() {
    const container = $("units");
    if (!container) return;

    const search = $("unitSearch").value.toLowerCase();
    const filter = $("lotFilter").value;

    const filtered = units.filter(unit => {
        const matchesName = unit.name.toLowerCase().includes(search);
        const matchesLot = filter === "todos" || unit.lotacao === filter;
        return matchesName && matchesLot;
    });

    if (!filtered.length) {
        container.innerHTML = "<p>Nenhuma unidade encontrada.</p>";
        return;
    }

    container.innerHTML = filtered.map(unit => {
        const status = {
            baixa: "Baixa",
            media: "Média",
            alta: "Alta"
        }[unit.lotacao];

        const statusClass = {
            baixa: "green",
            media: "orange",
            alta: "red"
        }[unit.lotacao];

        return `
            <article class="unit-card">
                <span class="tag">UNIDADE DE SAÚDE</span>
                <h3>🏥 ${escapeHTML(unit.name)}</h3>
                <p>📍 ${escapeHTML(unit.address)}</p>
                <p>🕒 ${escapeHTML(unit.hours)}</p>
                <p>👥 ${unit.patients} pacientes</p>
                <p>👩‍⚕️ ${unit.professionals} profissionais</p>
                <p>Lotação: <strong class="${statusClass}">${status}</strong></p>
                <button type="button" onclick="showUnitDetails(${unit.id})">
                    Ver detalhes
                </button>
            </article>
        `;
    }).join("");
}

function showUnitDetails(id) {
    const unit = units.find(item => item.id === id);
    if (!unit) return;

    const status = {
        baixa: "Baixa",
        media: "Média",
        alta: "Alta"
    }[unit.lotacao];

    info(
        "Unidade de saúde",
        `${unit.name}
Endereço: ${unit.address}
Horário: ${unit.hours}
Pacientes registrados: ${unit.patients}
Profissionais: ${unit.professionals}
Lotação demonstrativa: ${status}`
    );
}

$("unitSearch").addEventListener("input", renderUnits);
$("lotFilter").addEventListener("change", renderUnits);

/* =========================
   PROFISSIONAIS
========================= */

const professionals = [
    {
        id: 1,
        name: "Dra. Ana Souza",
        specialty: "Clínica Geral",
        unit: "UBS Central",
        schedule: "08:00 às 14:00",
        days: [1, 2, 4],
        times: ["08:00", "09:00", "10:30", "13:00"]
    },
    {
        id: 2,
        name: "Dr. Carlos Oliveira",
        specialty: "Cardiologia",
        unit: "Hospital Municipal",
        schedule: "09:00 às 16:00",
        days: [2, 3, 5],
        times: ["09:00", "10:00", "13:00", "15:00"]
    },
    {
        id: 3,
        name: "Dra. Mariana Lima",
        specialty: "Pediatria",
        unit: "UBS Vila Rami",
        schedule: "08:00 às 15:00",
        days: [1, 3, 5],
        times: ["08:00", "09:30", "13:00", "14:00"]
    },
    {
        id: 4,
        name: "Dr. Pedro Santos",
        specialty: "Ortopedia",
        unit: "Hospital Municipal",
        schedule: "10:00 às 17:00",
        days: [2, 4],
        times: ["10:00", "11:00", "14:00", "16:00"]
    },
    {
        id: 5,
        name: "Dra. Julia Martins",
        specialty: "Dermatologia",
        unit: "UBS Jardim do Lago",
        schedule: "08:00 às 13:00",
        days: [1, 4, 5],
        times: ["08:00", "09:00", "10:00", "11:00", "12:00"]
    }
];

function renderProfessionals() {
    $("professionals").innerHTML = professionals.map(person => `
        <article class="professional-card">
            <span>👩‍⚕️</span>
            <h3>${escapeHTML(person.name)}</h3>
            <p>${escapeHTML(person.specialty)}</p>
            <p>🏥 ${escapeHTML(person.unit)}</p>
            <p>🕒 ${escapeHTML(person.schedule)}</p>
        </article>
    `).join("");
}

/* =========================
   AGENDA DE CONSULTAS
========================= */

const APPOINTMENT_STORAGE_KEY = "vivasus_appointments";

function getAppointments() {
    try {
        return JSON.parse(
            localStorage.getItem(APPOINTMENT_STORAGE_KEY)
        ) || [];
    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        return [];
    }
}

function saveAppointments(appointments) {
    try {
        localStorage.setItem(
            APPOINTMENT_STORAGE_KEY,
            JSON.stringify(appointments)
        );

        return true;
    } catch (error) {
        console.error("Erro ao salvar agendamento:", error);
        return false;
    }
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatAppointmentDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function isAppointmentTimePast(dateString, time) {
    const [year, month, day] = dateString.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    const appointmentDate = new Date(
        year,
        month - 1,
        day,
        hour,
        minute
    );

    return appointmentDate <= new Date();
}

function getSelectedProfessional() {
    const id = Number($("professionalSelect").value);

    return professionals.find(person => person.id === id);
}

function fillProfessionalSelect() {
    const select = $("professionalSelect");
    const specialty = $("specialty").value;

    select.innerHTML = `
        <option value="">Selecione um profissional</option>
    `;

    const filteredProfessionals = professionals.filter(person =>
        person.specialty === specialty
    );

    filteredProfessionals.forEach(person => {
        const option = document.createElement("option");

        option.value = person.id;
        option.textContent = person.name;

        select.appendChild(option);
    });

    $("appointmentDate").innerHTML = `
        <option value="">Selecione primeiro um profissional</option>
    `;

    $("appointmentDate").disabled = true;

    $("appointmentTime").innerHTML = `
        <option value="">Selecione primeiro uma data</option>
    `;

    $("appointmentTime").disabled = true;
}

function updateAvailableDates() {
    const professional = getSelectedProfessional();
    const dateSelect = $("appointmentDate");
    const timeSelect = $("appointmentTime");

    dateSelect.innerHTML = "";
    timeSelect.innerHTML = "";

    timeSelect.disabled = true;

    if (!professional) {
        dateSelect.innerHTML = `
            <option value="">Selecione primeiro um profissional</option>
        `;

        dateSelect.disabled = true;

        timeSelect.innerHTML = `
            <option value="">Selecione primeiro uma data</option>
        `;

        return;
    }

    dateSelect.innerHTML = `
        <option value="">Escolha uma data disponível</option>
    `;

    dateSelect.disabled = false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = getAppointments();

    let availableCount = 0;

    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const weekday = date.getDay();
        const dateString = getLocalDateString(date);

        if (!professional.days.includes(weekday)) {
            continue;
        }

        const hasFreeTime = professional.times.some(time => {
            const alreadyBooked = appointments.some(appointment =>
                appointment.professionalId === professional.id &&
                appointment.date === dateString &&
                appointment.time === time
            );

            const timeHasPassed = isAppointmentTimePast(dateString, time);

            return !alreadyBooked && !timeHasPassed;
        });

        if (!hasFreeTime) {
            continue;
        }

        const option = document.createElement("option");

        option.value = dateString;
        option.textContent = formatAppointmentDate(dateString);

        dateSelect.appendChild(option);

        availableCount++;
    }

    if (availableCount === 0) {
        dateSelect.innerHTML = `
            <option value="">Nenhuma data disponível nos próximos 30 dias</option>
        `;

        dateSelect.disabled = true;
    }
}

function updateAvailableTimes() {
    const professional = getSelectedProfessional();
    const selectedDate = $("appointmentDate").value;
    const timeSelect = $("appointmentTime");

    timeSelect.innerHTML = "";

    if (!professional || !selectedDate) {
        timeSelect.innerHTML = `
            <option value="">Selecione primeiro uma data</option>
        `;

        timeSelect.disabled = true;
        return;
    }

    const appointments = getAppointments();

    const availableTimes = professional.times.filter(time => {
        const alreadyBooked = appointments.some(appointment =>
            appointment.professionalId === professional.id &&
            appointment.date === selectedDate &&
            appointment.time === time
        );

        const timeHasPassed = isAppointmentTimePast(selectedDate, time);

        return !alreadyBooked && !timeHasPassed;
    });

    if (availableTimes.length === 0) {
        timeSelect.innerHTML = `
            <option value="">Não há horários livres nesta data</option>
        `;

        timeSelect.disabled = true;
        return;
    }

    timeSelect.innerHTML = `
        <option value="">Escolha um horário</option>
    `;

    availableTimes.forEach(time => {
        const option = document.createElement("option");

        option.value = time;
        option.textContent = time;

        timeSelect.appendChild(option);
    });

    timeSelect.disabled = false;
}

$("specialty").addEventListener("change", function() {
    fillProfessionalSelect();
});

$("professionalSelect").addEventListener("change", function() {
    updateAvailableDates();
});

$("appointmentDate").addEventListener("change", function() {
    updateAvailableTimes();
});

$("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const patient = $("patient").value.trim();
    const specialty = $("specialty").value;
    const professional = getSelectedProfessional();
    const date = $("appointmentDate").value;
    const time = $("appointmentTime").value;

    const message = $("appointmentMsg");

    if (!patient || !professional || !date || !time) {
        message.textContent =
            "Preencha todos os campos e escolha um horário disponível.";

        return;
    }

    const appointments = getAppointments();

    const alreadyBooked = appointments.some(appointment =>
        appointment.professionalId === professional.id &&
        appointment.date === date &&
        appointment.time === time
    );

    if (alreadyBooked || isAppointmentTimePast(date, time)) {
        message.textContent =
            "Esse horário não está mais disponível. Escolha outra opção.";

        updateAvailableDates();
        return;
    }

    const newAppointment = {
        id: Date.now(),
        patient,
        specialty,
        professionalId: professional.id,
        professional: professional.name,
        unit: professional.unit,
        date,
        time,
        createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);

    if (!saveAppointments(appointments)) {
        message.textContent =
            "Não foi possível registrar o agendamento neste navegador.";

        return;
    }

    message.textContent =
        `Consulta demonstrativa confirmada!

Paciente: ${patient}
Especialidade: ${specialty}
Profissional: ${professional.name}
Unidade: ${professional.unit}
Data: ${formatAppointmentDate(date)}
Horário: ${time}`;

    this.reset();

    fillProfessionalSelect();
});

/* =========================
   MEDICAMENTOS
========================= */

const medicines = [
    {
        name: "Paracetamol",
        quantity: 120,
        unit: "UBS Central",
        description: "Medicamento utilizado para alívio de dor e febre. Seu uso deve seguir orientação profissional."
    },
    {
        name: "Dipirona",
        quantity: 85,
        unit: "UBS Vila Rami",
        description: "Medicamento utilizado para alívio de dor e febre. Consulte um profissional sobre seu uso."
    },
    {
        name: "Losartana",
        quantity: 60,
        unit: "Hospital Municipal",
        description: "Medicamento utilizado no tratamento da pressão arterial, conforme prescrição."
    },
    {
        name: "Ibuprofeno",
        quantity: 0,
        unit: "UBS Jardim do Lago",
        description: "Medicamento com ação anti-inflamatória e analgésica. Seu uso exige orientação adequada."
    },
    {
        name: "Omeprazol",
        quantity: 45,
        unit: "UBS Central",
        description: "Medicamento utilizado em condições relacionadas à acidez do estômago, conforme orientação profissional."
    }
];

function showMedicines() {
    const message = medicines.map(item =>
        `${item.name}

Unidade: ${item.unit}
Estoque demonstrativo: ${
            item.quantity > 0
                ? item.quantity + " unidades"
                : "Indisponível"
        }

Informação: ${item.description}`
    ).join("\n\n------------------------------\n\n");

    info(
        "Consulta de medicamentos",
        `${message}

ATENÇÃO: os nomes e quantidades são fictícios e servem apenas para demonstração do projeto. Confirme a disponibilidade diretamente na unidade de saúde. Não utilize medicamentos sem orientação profissional.`
    );
}

/* =========================
   VACINAÇÃO
========================= */

const vaccines = [
    {
        name: "BCG",
        description: "Ajuda a proteger contra formas graves de tuberculose, especialmente na infância."
    },
    {
        name: "Hepatite B",
        description: "Protege contra a infecção pelo vírus da hepatite B."
    },
    {
        name: "Tríplice viral",
        description: "Protege contra sarampo, caxumba e rubéola."
    },
    {
        name: "Influenza",
        description: "Ajuda a proteger contra formas graves da gripe e suas complicações."
    },
    {
        name: "Febre amarela",
        description: "É indicada conforme as recomendações de vacinação e as características de cada pessoa."
    },
    {
        name: "HPV",
        description: "Ajuda a prevenir infecções por tipos de papilomavírus humano relacionados a diferentes doenças."
    }
];

function showVaccines() {
    const message = vaccines.map(vaccine =>
        `${vaccine.name}

${vaccine.description}`
    ).join("\n\n------------------------------\n\n");

    info(
        "Informações sobre vacinação",
        `${message}

COMO CONSULTAR SUA VACINAÇÃO?

• Procure uma Unidade Básica de Saúde (UBS).
• Leve sua caderneta de vacinação, se tiver.
• Pergunte sobre as vacinas indicadas para sua idade e situação de saúde.
• Confirme os horários e a disponibilidade diretamente na unidade.

Atenção: o calendário e as recomendações podem variar conforme a idade, histórico vacinal e orientações dos profissionais de saúde.`
    );
}

/* =========================
   PREVENÇÃO DE DOENÇAS
========================= */

const preventionTips = [
    {
        title: "Prevenção da dengue",
        description: "Evite água parada em recipientes, mantenha caixas-d'água fechadas e cuide de vasos e pneus que possam acumular água."
    },
    {
        title: "Higiene das mãos",
        description: "Lave as mãos com água e sabão, especialmente antes das refeições, após usar o banheiro e ao chegar da rua."
    },
    {
        title: "Vacinação em dia",
        description: "A vacinação ajuda a prevenir doenças e reduzir o risco de complicações. Mantenha sua caderneta atualizada."
    },
    {
        title: "Consultas preventivas",
        description: "Procure os serviços de saúde para avaliações e orientações de acordo com suas necessidades."
    },
    {
        title: "Cuidados com alimentos",
        description: "Higienize frutas e verduras, mantenha os alimentos bem armazenados e utilize água própria para consumo."
    },
    {
        title: "Proteção respiratória",
        description: "Mantenha ambientes ventilados e adote cuidados de higiene ao tossir ou espirrar."
    }
];

function showPrevention() {
    const message = preventionTips.map((tip, index) =>
        `${index + 1}. ${tip.title}

${tip.description}`
    ).join("\n\n------------------------------\n\n");

    info(
        "Prevenção de doenças",
        `${message}

A prevenção é uma forma importante de proteger a saúde individual e coletiva. Em caso de sintomas ou dúvidas, procure orientação em uma unidade de saúde.`
    );
}

/* =========================
   HÁBITOS SAUDÁVEIS
========================= */

const healthyHabits = [
    {
        title: "Alimentação equilibrada",
        description: "Procure variar os alimentos e incluir frutas, verduras, legumes, feijão e outros alimentos nutritivos na rotina."
    },
    {
        title: "Hidratação",
        description: "Beba água ao longo do dia. A quantidade necessária pode variar conforme a idade, atividade e condições de saúde."
    },
    {
        title: "Movimento e atividade física",
        description: "Pratique atividades adequadas à sua rotina e às suas condições, como caminhadas, dança, brincadeiras ou esportes."
    },
    {
        title: "Sono e descanso",
        description: "Mantenha horários regulares para dormir e procure ter um ambiente tranquilo e confortável para descansar."
    },
    {
        title: "Saúde emocional",
        description: "Reserve momentos para lazer, convivência e descanso. Conversar com pessoas de confiança também pode ajudar."
    },
    {
        title: "Acompanhamento de saúde",
        description: "Realize consultas e exames quando recomendados por profissionais e mantenha sua vacinação atualizada."
    }
];

function showHealthyHabits() {
    const message = healthyHabits.map((habit, index) =>
        `${index + 1}. ${habit.title}

${habit.description}`
    ).join("\n\n------------------------------\n\n");

    info(
        "Hábitos saudáveis",
        `${message}

Pequenas atitudes incorporadas à rotina podem contribuir para o bem-estar. Escolha hábitos possíveis para sua realidade e procure orientação profissional quando necessário.`
    );
}

/* =========================
   CUIDADORES
========================= */

const caregivers = [
    {
        name: "Maria Oliveira",
        specialty: "Cuidadora de idosos",
        experience: "5 anos de experiência"
    },
    {
        name: "João Ferreira",
        specialty: "Cuidador domiciliar",
        experience: "3 anos de experiência"
    },
    {
        name: "Carla Mendes",
        specialty: "Acompanhamento de pacientes",
        experience: "4 anos de experiência"
    }
];

function renderCaregivers() {
    $("caregivers").innerHTML = caregivers.map((person, index) => `
        <article class="care-card">
            <span>🤝</span>
            <h3>${escapeHTML(person.name)}</h3>
            <p>${escapeHTML(person.specialty)}</p>
            <small>${escapeHTML(person.experience)}</small>
            <button type="button" onclick="showCaregiver(${index})">
                Ver informações
            </button>
        </article>
    `).join("");
}

function showCaregiver(index) {
    const person = caregivers[index];
    if (!person) return;

    info(
        "Informações do cuidador",
        `${person.name}
${person.specialty}
${person.experience}`
    );
}

/* =========================
   MODO DE ACESSIBILIDADE
========================= */

$("easyBtn").addEventListener("click", function() {
    document.body.classList.toggle("easy-mode");

    this.textContent =
        document.body.classList.contains("easy-mode") ? "A-" : "A+";
});

/* =========================
   LOGIN DEMONSTRATIVO
========================= */

$("loginBtn").addEventListener("click", function() {
    info(
        "Área do paciente",
        "Esta é uma demonstração de acesso. Um sistema real precisaria de autenticação segura."
    );
});

/* =========================
   ATENDIMENTO DOMICILIAR
========================= */

const HOME_CARE_STORAGE_KEY = "vivasus_home_care_requests";

function getHomeCareRequests() {
    try {
        const saved = localStorage.getItem(HOME_CARE_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Erro ao ler solicitações:", error);
        return [];
    }
}

function saveHomeCareRequests(requests) {
    try {
        localStorage.setItem(
            HOME_CARE_STORAGE_KEY,
            JSON.stringify(requests)
        );
        return true;
    } catch (error) {
        console.error("Erro ao salvar solicitações:", error);
        return false;
    }
}

function generateProtocol() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `VS-${randomNumber}`;
}

function formatDate(dateValue) {
    return new Date(dateValue).toLocaleString("pt-BR");
}

/* CRIAR SOLICITAÇÃO */

$("homeCareForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = $("homeCareName").value.trim();
    const address = $("homeCareAddress").value.trim();
    const phone = $("homeCarePhone").value.trim();
    const reason = $("homeCareReason").value.trim();

    if (!name || !address || !phone || !reason) {
        $("homeCareMessage").textContent =
            "Preencha todos os campos para continuar.";
        return;
    }

    const requests = getHomeCareRequests();

    let protocol = generateProtocol();

    while (requests.some(request => request.protocol === protocol)) {
        protocol = generateProtocol();
    }

    const now = new Date().toISOString();

    const newRequest = {
        protocol,
        name,
        address,
        phone,
        reason,
        status: "Solicitado",
        createdAt: now,
        updatedAt: now
    };

    requests.push(newRequest);

    if (!saveHomeCareRequests(requests)) {
        $("homeCareMessage").textContent =
            "Não foi possível salvar. Verifique as configurações do navegador.";
        return;
    }

    $("homeCareMessage").innerHTML = `
        Solicitação registrada neste navegador!<br>
        Seu protocolo é:
        <strong>${escapeHTML(protocol)}</strong><br>
        Guarde esse número para acompanhar o pedido.
    `;

    $("trackingProtocol").value = protocol;

    this.reset();

    renderAdminHomeCareRequests();
});

/* CONSULTAR SOLICITAÇÃO */

$("trackHomeCareForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const protocol = $("trackingProtocol").value.trim().toUpperCase();
    const requests = getHomeCareRequests();

    const request = requests.find(item =>
        item.protocol.toUpperCase() === protocol
    );

    const result = $("trackingResult");

    if (!request) {
        result.innerHTML = `
            <div class="tracking-result-card">
                <strong>Protocolo não encontrado.</strong>
                <p>Confira o número digitado e tente novamente neste navegador.</p>
            </div>
        `;
        return;
    }

    const statusClass = {
        "Solicitado": "solicitado",
        "Em análise": "analise",
        "Aprovado": "aprovado",
        "Concluído": "concluido"
    }[request.status] || "";

    result.innerHTML = `
        <div class="tracking-result-card">
            <h3>Solicitação encontrada</h3>
            <p><strong>Protocolo:</strong> ${escapeHTML(request.protocol)}</p>
            <p><strong>Paciente:</strong> ${escapeHTML(request.name)}</p>
            <p><strong>Data do pedido:</strong> ${formatDate(request.createdAt)}</p>
            <p><strong>Status:</strong>
                <span class="status ${statusClass}">
                    ${escapeHTML(request.status)}
                </span>
            </p>
            <p><strong>Última atualização:</strong> ${formatDate(request.updatedAt)}</p>
            <p><strong>Observação:</strong> ${getStatusMessage(request.status)}</p>
        </div>
    `;
});

function getStatusMessage(status) {
    const messages = {
        "Solicitado": "O pedido foi registrado e aguarda análise.",
        "Em análise": "A solicitação está sendo avaliada pela equipe.",
        "Aprovado": "A solicitação foi aprovada no sistema demonstrativo. Consulte a equipe responsável para informações de agendamento.",
        "Concluído": "O atendimento foi marcado como concluído no sistema demonstrativo."
    };

    return messages[status] || "Consulte a equipe responsável para mais informações.";
}

/* =========================
   PAINEL ADMINISTRATIVO
========================= */

function openAdmin() {
    $("adminModal").classList.add("show");
    $("adminModal").setAttribute("aria-hidden", "false");

    fillAdminUnits();
    renderAdminHomeCareRequests();
}

function closeAdmin() {
    $("adminModal").classList.remove("show");
    $("adminModal").setAttribute("aria-hidden", "true");
}

function fillAdminUnits() {
    $("adminUnit").innerHTML = units.map(unit => `
        <option value="${unit.id}">${escapeHTML(unit.name)}</option>
    `).join("");
}

$("adminBtn").addEventListener("click", openAdmin);

/* SALVAR ALTERAÇÕES DE UNIDADES E ESTOQUE */

$("saveAdmin").addEventListener("click", function() {
    const unitId = Number($("adminUnit").value);
    const newLot = $("adminLot").value;
    const stockValue = $("adminStock").value;

    const unit = units.find(item => item.id === unitId);

    if (!unit) {
        $("adminMsg").textContent = "Selecione uma unidade.";
        return;
    }

    if (stockValue !== "") {
        const quantity = Number(stockValue);

        if (!Number.isInteger(quantity) || quantity < 0) {
            $("adminMsg").textContent = "Informe uma quantidade válida.";
            return;
        }

        const medicine = medicines.find(item => item.unit === unit.name);

        if (medicine) {
            medicine.quantity = quantity;
        }
    }

    unit.lotacao = newLot;

    renderUnits();

    $("adminMsg").textContent =
        "Alterações demonstrativas salvas.";
});

/* LISTAR SOLICITAÇÕES NO PAINEL ADMIN */

function renderAdminHomeCareRequests() {
    const container = $("adminHomeCareList");
    if (!container) return;

    const requests = getHomeCareRequests();

    if (requests.length === 0) {
        container.innerHTML =
            "<p>Nenhuma solicitação cadastrada neste navegador.</p>";
        return;
    }

    container.innerHTML = requests.map(request => `
        <div class="admin-request">
            <p><strong>Protocolo:</strong> ${escapeHTML(request.protocol)}</p>
            <p><strong>Paciente:</strong> ${escapeHTML(request.name)}</p>
            <p><strong>Endereço:</strong> ${escapeHTML(request.address)}</p>
            <p><strong>Telefone:</strong> ${escapeHTML(request.phone)}</p>
            <p><strong>Motivo:</strong> ${escapeHTML(request.reason)}</p>
            <p><strong>Solicitado em:</strong> ${formatDate(request.createdAt)}</p>

            <label>Atualizar status:</label>

            <select class="home-care-status-select"
                    data-protocol="${escapeHTML(request.protocol)}">
                <option value="Solicitado" ${request.status === "Solicitado" ? "selected" : ""}>Solicitado</option>
                <option value="Em análise" ${request.status === "Em análise" ? "selected" : ""}>Em análise</option>
                <option value="Aprovado" ${request.status === "Aprovado" ? "selected" : ""}>Aprovado</option>
                <option value="Concluído" ${request.status === "Concluído" ? "selected" : ""}>Concluído</option>
            </select>

            <button type="button"
                    class="btn save-home-care-status"
                    data-protocol="${escapeHTML(request.protocol)}">
                Salvar status
            </button>
        </div>
    `).join("");
}

/* SALVAR NOVO STATUS */

$("adminHomeCareList").addEventListener("click", function(event) {
    const button = event.target.closest(".save-home-care-status");
    if (!button) return;

    const protocol = button.dataset.protocol;

    const select = Array.from(
        document.querySelectorAll(".home-care-status-select")
    ).find(item => item.dataset.protocol === protocol);

    if (!select) return;

    const requests = getHomeCareRequests();

    const request = requests.find(item => item.protocol === protocol);

    if (!request) {
        $("adminMsg").textContent = "Solicitação não encontrada.";
        return;
    }

    request.status = select.value;
    request.updatedAt = new Date().toISOString();

    if (saveHomeCareRequests(requests)) {
        renderAdminHomeCareRequests();

        $("adminMsg").textContent =
            `Status da solicitação ${protocol} atualizado.`;
    } else {
        $("adminMsg").textContent =
            "Não foi possível salvar a atualização.";
    }
});

/* =========================
   MEU SUS - DADOS DO PACIENTE
========================= */

const PATIENT_STORAGE_KEY = "vivasus_patient_data";
const RECORDS_STORAGE_KEY = "vivasus_patient_records";

function getPatientData() {
    try {
        return JSON.parse(localStorage.getItem(PATIENT_STORAGE_KEY)) || null;
    } catch (error) {
        return null;
    }
}

function savePatientData(data) {
    try {
        localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        return false;
    }
}

function getPatientRecords() {
    try {
        return JSON.parse(localStorage.getItem(RECORDS_STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function savePatientRecords(records) {
    try {
        localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
        return true;
    } catch (error) {
        return false;
    }
}

function getInitials(name) {
    if (!name) return "?";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

function renderPatientData() {
    const patient = getPatientData();

    if (!patient) {
        $("patientDisplayName").textContent = "Nome do paciente";
        $("patientInitials").textContent = "?";
        $("patientCardNumber").textContent = "Não informado";
        return;
    }

    $("patientDisplayName").textContent = patient.name;
    $("patientInitials").textContent = getInitials(patient.name);

    $("patientCardNumber").textContent =
        patient.card || "Não informado";

    $("patientFullName").value = patient.name || "";
    $("patientBirth").value = patient.birth || "";
    $("patientPhone").value = patient.phone || "";
    $("patientCard").value = patient.card || "";
}

/* SALVAR CADASTRO */

$("patientDataForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = $("patientFullName").value.trim();
    const birth = $("patientBirth").value;
    const phone = $("patientPhone").value.trim();
    const card = $("patientCard").value.trim();

    if (!name) {
        $("patientDataMessage").textContent =
            "Informe o nome do paciente.";
        return;
    }

    const patient = {
        name,
        birth,
        phone,
        card
    };

    if (!savePatientData(patient)) {
        $("patientDataMessage").textContent =
            "Não foi possível salvar os dados neste navegador.";
        return;
    }

    renderPatientData();

    $("patientDataMessage").textContent =
        "Seus dados foram salvos com sucesso neste navegador!";
});

/* CONSULTAR DADOS DO PACIENTE */

function showPatientData() {
    const patient = getPatientData();

    if (!patient) {
        info(
            "Dados do paciente",
            "Você ainda não cadastrou seus dados. Preencha o formulário na área Meu SUS."
        );
        return;
    }

    info(
        "Dados do paciente",
        `Nome: ${patient.name}
Data de nascimento: ${patient.birth ? new Date(patient.birth + "T00:00:00").toLocaleDateString("pt-BR") : "Não informada"}
Telefone: ${patient.phone || "Não informado"}
Carteirinha demonstrativa: ${patient.card || "Não informada"}`
    );
}

/* CONSULTAR CARTEIRINHA */

function showPatientCard() {
    const patient = getPatientData();

    if (!patient) {
        info(
            "Carteirinha",
            "Cadastre seus dados primeiro para visualizar sua carteirinha demonstrativa."
        );
        return;
    }

    info(
        "Carteirinha digital demonstrativa",
        `VIVASUS

Nome: ${patient.name}
Data de nascimento: ${patient.birth ? new Date(patient.birth + "T00:00:00").toLocaleDateString("pt-BR") : "Não informada"}
Número: ${patient.card || "Não informado"}

Esta carteirinha é apenas uma demonstração acadêmica e não é um documento oficial do SUS.`
    );
}

/* ADICIONAR DOCUMENTOS E INFORMAÇÕES */

function addPatientRecord(category) {
    const patient = getPatientData();

    if (!patient) {
        info(
            "Cadastre seus dados",
            "Para adicionar documentos, primeiro preencha seus dados na área Meu SUS."
        );
        return;
    }

    const title = prompt(
        `Digite o título de ${category.toLowerCase()}:`
    );

    if (!title || !title.trim()) return;

    const description = prompt(
        "Digite uma descrição ou informação:"
    );

    if (!description || !description.trim()) return;

    const records = getPatientRecords();

    records.push({
        id: Date.now(),
        category,
        title: title.trim(),
        description: description.trim(),
        date: new Date().toISOString()
    });

    if (!savePatientRecords(records)) {
        info(
            "Erro",
            "Não foi possível salvar essa informação no navegador."
        );
        return;
    }

    renderPatientRecords();

    info(
        "Informação adicionada",
        `${category} adicionado com sucesso à sua área do paciente.`
    );
}

/* CONSULTAR DOCUMENTOS */

function showPatientRecords(category) {
    const patient = getPatientData();

    if (!patient) {
        info(
            "Área do paciente",
            "Cadastre seus dados primeiro para utilizar esta função."
        );
        return;
    }

    const records = getPatientRecords().filter(
        record => record.category === category
    );

    if (records.length === 0) {
        info(
            category,
            `Você ainda não adicionou informações em ${category.toLowerCase()}.

Utilize o botão "Adicionar informação" na área de documentos do Meu SUS.`
        );
        return;
    }

    const message = records.map(record =>
        `${record.title}
${record.description}
Data: ${new Date(record.date).toLocaleDateString("pt-BR")}`
    ).join("\n\n--------------------\n\n");

    info(`Meus ${category.toLowerCase()}`, message);
}

/* MOSTRAR DOCUMENTOS NA TELA */

function renderPatientRecords() {
    const container = $("patientRecordsList");
    if (!container) return;

    const categories = [
        "Exames",
        "Receitas",
        "Laudos",
        "Histórico"
    ];

    const records = getPatientRecords();

    container.innerHTML = categories.map(category => {
        const categoryRecords = records.filter(
            record => record.category === category
        );

        return `
            <div class="patient-record-item">
                <h4>${category}</h4>
                <p>${categoryRecords.length} informação(ões) cadastrada(s).</p>

                <button type="button"
                    class="btn"
                    onclick="addPatientRecord('${category}')">
                    + Adicionar informação
                </button>

                <button type="button"
                    class="btn"
                    onclick="showPatientRecords('${category}')">
                    Consultar
                </button>
            </div>
        `;
    }).join("");
}

function initializePatientArea() {
    renderPatientData();
    renderPatientRecords();
}

/* =========================
   FEEDBACK
========================= */

let selectedRating = 0;

const starButtons = document.querySelectorAll("#stars button");

starButtons.forEach((button, index) => {
    button.addEventListener("click", function() {
        selectedRating = index + 1;

        starButtons.forEach((star, starIndex) => {
            star.classList.toggle("active", starIndex < selectedRating);
        });
    });
});

$("feedbackBtn").addEventListener("click", function() {
    const comment = $("feedbackText").value.trim();

    if (selectedRating === 0) {
        $("feedbackMsg").textContent = "Selecione uma avaliação.";
        return;
    }

    if (!comment) {
        $("feedbackMsg").textContent = "Escreva um comentário.";
        return;
    }

    $("feedbackMsg").textContent =
        `Obrigado pelo feedback! Sua avaliação foi de ${selectedRating} estrela(s).`;

    $("feedbackText").value = "";
    selectedRating = 0;

    starButtons.forEach(star => star.classList.remove("active"));
});

/* =========================
   TELEFONES IMPORTANTES
========================= */

const importantPhones = [
    { name: "SAMU", description: "Emergências médicas", number: "192" },
    { name: "Polícia Militar", description: "Emergências policiais", number: "190" },
    { name: "Polícia Civil", description: "Atendimento policial", number: "197" },
    { name: "Corpo de Bombeiros", description: "Incêndios e resgates", number: "193" },
    { name: "Defesa Civil", description: "Riscos e desastres", number: "199" },
    { name: "Guarda Municipal", description: "Segurança municipal", number: "153" },
    { name: "Disque Denúncia", description: "Denúncias anônimas", number: "181" },
    { name: "Direitos Humanos", description: "Canal de atendimento", number: "100" },
    { name: "Atendimento ao Munícipe", description: "Prefeitura de Jundiaí", number: "156" },
    { name: "Hospital São Vicente", description: "Atendimento hospitalar", number: "1145838155" },
    { name: "Hospital Universitário", description: "Atendimento hospitalar", number: "1145275700" },
    { name: "Pronto Atendimento Central", description: "Atendimento 24 horas", number: "1145835391" },
    { name: "Pronto Atendimento Hortolândia", description: "Atendimento 24 horas", number: "1145835436" },
    { name: "Pronto Atendimento Retiro", description: "Atendimento das 7h às 19h", number: "1145235218" },
    { name: "Pronto Atendimento Ponte São João", description: "Atendimento das 7h às 19h", number: "1144929048" }
];

function openPhones() {
    $("phonesList").innerHTML = importantPhones.map(phone => `
        <div class="phone-card">
            <div>
                <strong>${escapeHTML(phone.name)}</strong>
                <p>${escapeHTML(phone.description)}</p>
            </div>

            <a class="phone-link" href="tel:${phone.number}">
                📞 ${escapeHTML(phone.number)}
            </a>
        </div>
    `).join("");

    $("phonesModal").classList.add("show");
    $("phonesModal").setAttribute("aria-hidden", "false");
}

function closePhones() {
    $("phonesModal").classList.remove("show");
    $("phonesModal").setAttribute("aria-hidden", "true");
}

$("openPhonesBtn").addEventListener("click", openPhones);
$("closePhonesBtn").addEventListener("click", closePhones);
$("closePhonesFooter").addEventListener("click", closePhones);

$("phonesModal").addEventListener("click", function(event) {
    if (event.target === $("phonesModal")) closePhones();
});

/* =========================
   PRIMEIROS SOCORROS
========================= */

const firstAidTopics = [
    {
        icon: "😵",
        title: "Desmaios",
        description: "Como reconhecer e agir diante de um desmaio.",
        content: `O desmaio é uma perda temporária de consciência.

• Verifique se o ambiente está seguro.
• Confira se a pessoa responde e respira normalmente.
• Se estiver inconsciente, mas respirando normalmente, coloque-a de lado, se não houver suspeita de trauma.
• Não ofereça água, alimentos ou medicamentos enquanto estiver inconsciente.
• Não tente fazê-la levantar rapidamente.

Se a pessoa não recuperar a consciência rapidamente ou não respirar normalmente, ligue 192.`
    },
    {
        icon: "🫁",
        title: "Engasgos",
        description: "Reconheça sinais de engasgo e peça ajuda.",
        content: `O engasgo pode dificultar ou impedir a passagem de ar.

• Observe se a pessoa consegue falar, tossir e respirar.
• Se a tosse for eficaz, incentive a pessoa a continuar tossindo.
• Se houver obstrução grave, peça ajuda imediatamente e ligue 192.
• Siga as orientações do atendente de emergência.
• Não ofereça água ou alimentos durante o engasgo.

As técnicas de desengasgo variam conforme idade e situação. O ideal é receber treinamento prático em primeiros socorros.`
    },
    {
        icon: "🩸",
        title: "Sangramentos",
        description: "Cuidados iniciais em casos de sangramento.",
        content: `Sangramentos podem ser leves ou representar uma emergência.

• Mantenha a calma e proteja-se do contato direto com o sangue.
• Se for seguro, utilize luvas ou uma barreira de proteção.
• Em sangramentos externos, faça pressão direta com um pano limpo ou gaze.
• Não retire objetos que estejam presos na ferida.
• Se o sangramento for intenso ou não parar, ligue 192.

Procure atendimento profissional para avaliar a lesão.`
    },
    {
        icon: "🔥",
        title: "Queimaduras",
        description: "Saiba quais cuidados iniciais são importantes.",
        content: `Queimaduras podem acontecer por calor, líquidos quentes, produtos químicos ou eletricidade.

• Afaste a pessoa da fonte de calor, se for seguro.
• Em queimaduras térmicas, resfrie a região com água corrente fresca.
• Não aplique gelo, pasta de dente, manteiga ou receitas caseiras.
• Não estoure bolhas.
• Procure atendimento em queimaduras extensas, profundas ou em regiões sensíveis.

Em situações graves, ligue 192 ou 193, conforme a ocorrência.`
    },
    {
        icon: "🦴",
        title: "Fraturas",
        description: "Como agir diante de uma possível fratura.",
        content: `Uma fratura é a quebra de um osso e pode causar dor, inchaço e dificuldade de movimentação.

• Evite movimentar a região lesionada.
• Não tente colocar o osso no lugar.
• Não tente endireitar a região.
• Mantenha a pessoa confortável e aguarde ajuda.
• Em lesões graves, acidentes ou suspeita de fratura na coluna, ligue 192.

A avaliação médica é importante para identificar a lesão e indicar o tratamento.`
    },
    {
        icon: "☎️",
        title: "Quando chamar o SAMU",
        description: "Identifique situações que precisam de atendimento urgente.",
        content: `O SAMU atende situações de urgência e emergência.

Ligue 192 em situações como:
• Pessoa inconsciente.
• Dificuldade intensa para respirar.
• Dor forte no peito.
• Suspeita de AVC.
• Convulsão prolongada ou repetida.
• Acidentes graves.
• Sangramento intenso.

Ao ligar, informe o endereço, explique o que aconteceu e siga as orientações do atendente. A ligação é gratuita.`
    }
];

function openFirstAid() {
    $("firstAidGrid").innerHTML = firstAidTopics.map((topic, index) => `
        <button type="button" class="first-aid-card" data-topic="${index}">
            <span>${topic.icon}</span>
            <strong>${escapeHTML(topic.title)}</strong>
            <small>${escapeHTML(topic.description)}</small>
        </button>
    `).join("");

    $("firstAidGrid").hidden = false;
    $("firstAidContent").hidden = true;

    $("firstAidModal").classList.add("show");
    $("firstAidModal").setAttribute("aria-hidden", "false");
}

function showFirstAidTopic(index) {
    const topic = firstAidTopics[index];
    if (!topic) return;

    $("firstAidContentTitle").textContent = topic.title;
    $("firstAidContentText").textContent = topic.content;

    $("firstAidGrid").hidden = true;
    $("firstAidContent").hidden = false;
}

function backToFirstAidTopics() {
    $("firstAidContent").hidden = true;
    $("firstAidGrid").hidden = false;
}

function closeFirstAid() {
    $("firstAidModal").classList.remove("show");
    $("firstAidModal").setAttribute("aria-hidden", "true");
}

$("openFirstAidBtn").addEventListener("click", openFirstAid);

$("firstAidGrid").addEventListener("click", function(event) {
    const card = event.target.closest("[data-topic]");

    if (card) {
        showFirstAidTopic(Number(card.dataset.topic));
    }
});

$("backFirstAidBtn").addEventListener("click", backToFirstAidTopics);
$("closeFirstAidBtn").addEventListener("click", closeFirstAid);
$("closeFirstAidFooter").addEventListener("click", closeFirstAid);

$("firstAidModal").addEventListener("click", function(event) {
    if (event.target === $("firstAidModal")) closeFirstAid();
});

/* =========================
   VÍDEOS EDUCATIVOS
========================= */

const videos = [
    { id: "fYZpdpF_bQ", title: "Vídeo educativo 1" },
    { id: "PDemedkFSPo", title: "Vídeo educativo 2" },
    { id: "A6z-jNcw0fo", title: "Vídeo educativo 3" },
    { id: "uImVd4rBlPA", title: "Vídeo educativo 4" },
    { id: "pn_oKccTlvc", title: "Vídeo educativo 5" },
    { id: "gqgguKRpbQQ", title: "Vídeo educativo 6" },
    { id: "4uxn36IGCBQ", title: "Vídeo educativo 7" },
    { id: "T1admQD8ZII", title: "Vídeo educativo 8" }
];

function openVideos() {
    $("videosGrid").innerHTML = videos.map(video => `
        <article class="video-card">
            <h3>${escapeHTML(video.title)}</h3>

            <div class="video-container">
                <iframe
                    src="https://www.youtube-nocookie.com/embed/${video.id}"
                    title="${escapeHTML(video.title)}"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>
            </div>
        </article>
    `).join("");

    $("videosModal").classList.add("show");
    $("videosModal").setAttribute("aria-hidden", "false");
}

function closeVideos() {
    $("videosModal").classList.remove("show");
    $("videosModal").setAttribute("aria-hidden", "true");
    $("videosGrid").innerHTML = "";
}

$("openVideosBtn").addEventListener("click", openVideos);
$("closeVideosBtn").addEventListener("click", closeVideos);

$("videosModal").addEventListener("click", function(event) {
    if (event.target === $("videosModal")) closeVideos();
});

/* =========================
   FECHAR MODAIS
========================= */

$("modal").addEventListener("click", function(event) {
    if (event.target === $("modal")) closeModal();
});

$("adminModal").addEventListener("click", function(event) {
    if (event.target === $("adminModal")) closeAdmin();
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
        closeAdmin();
        closeVideos();
        closePhones();
        closeFirstAid();
    }
});

/* =========================
   INICIALIZAÇÃO
========================= */

function initializeVivaSUS() {
    renderUnits();
    renderProfessionals();
    fillProfessionalSelect();
    renderCaregivers();
    fillAdminUnits();
    renderAdminHomeCareRequests();
    initializePatientArea();

    console.log("VivaSUS carregado com sucesso!");
}

initializeVivaSUS();