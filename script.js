/* =========================
   DADOS DO SISTEMA
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
        address: "Avenida Brasil, 850",
        hours: "24 horas",
        lotacao: "alta",
        patients: 87,
        professionals: 21
    },
    {
        id: 3,
        name: "UBS Jardim Saúde",
        address: "Rua Primavera, 45",
        hours: "07:00 às 17:00",
        lotacao: "media",
        patients: 38,
        professionals: 10
    },
    {
        id: 4,
        name: "Centro de Atendimento",
        address: "Rua da Esperança, 300",
        hours: "08:00 às 19:00",
        lotacao: "baixa",
        patients: 9,
        professionals: 6
    }
];


const professionals = [
    {
        name: "Dra. Ana Oliveira",
        specialty: "Clínica Geral",
        unit: "UBS Central",
        available: true
    },
    {
        name: "Dr. Lucas Mendes",
        specialty: "Cardiologia",
        unit: "Hospital Municipal",
        available: true
    },
    {
        name: "Dra. Mariana Costa",
        specialty: "Pediatria",
        unit: "UBS Jardim Saúde",
        available: true
    },
    {
        name: "Dr. Rafael Santos",
        specialty: "Ortopedia",
        unit: "Hospital Municipal",
        available: false
    },
    {
        name: "Dra. Beatriz Lima",
        specialty: "Dermatologia",
        unit: "Centro de Atendimento",
        available: true
    },
    {
        name: "Dr. Pedro Almeida",
        specialty: "Clínica Geral",
        unit: "UBS Central",
        available: true
    }
];


const caregivers = [
    {
        name: "Maria Aparecida",
        experience: "8 anos de experiência",
        rating: "4.9"
    },
    {
        name: "Carlos Henrique",
        experience: "5 anos de experiência",
        rating: "4.8"
    },
    {
        name: "Fernanda Souza",
        experience: "7 anos de experiência",
        rating: "5.0"
    }
];


const medicines = [
    {
        name: "Paracetamol",
        unit: "UBS Central",
        quantity: 42
    },
    {
        name: "Losartana",
        unit: "Hospital Municipal",
        quantity: 18
    },
    {
        name: "Amoxicilina",
        unit: "UBS Jardim Saúde",
        quantity: 7
    },
    {
        name: "Dipirona",
        unit: "Centro de Atendimento",
        quantity: 35
    }
];


/* =========================
   ELEMENTOS
========================= */

const unitsContainer =
    document.getElementById("units");

const professionalsContainer =
    document.getElementById("professionals");

const caregiversContainer =
    document.getElementById("caregivers");

const unitSearch =
    document.getElementById("unitSearch");

const lotFilter =
    document.getElementById("lotFilter");

const professionalSelect =
    document.getElementById("professionalSelect");

const specialtySelect =
    document.getElementById("specialty");

const appointmentForm =
    document.getElementById("appointmentForm");

const appointmentMsg =
    document.getElementById("appointmentMsg");

const easyBtn =
    document.getElementById("easyBtn");

const loginBtn =
    document.getElementById("loginBtn");

const adminBtn =
    document.getElementById("adminBtn");

const modal =
    document.getElementById("modal");

const adminModal =
    document.getElementById("adminModal");


/* =========================
   MOSTRAR UNIDADES
========================= */

function renderUnits() {

    const search =
        unitSearch.value.toLowerCase();

    const filter =
        lotFilter.value;

    const filteredUnits =
        units.filter(unit => {

            const matchesSearch =
                unit.name
                    .toLowerCase()
                    .includes(search);

            const matchesLot =
                filter === "todos" ||
                unit.lotacao === filter;

            return matchesSearch && matchesLot;
        });


    if (filteredUnits.length === 0) {

        unitsContainer.innerHTML = `
            <div class="unit">
                <div>
                    <h3>Nenhuma unidade encontrada</h3>
                    <p>
                        Tente mudar sua pesquisa ou filtro.
                    </p>
                </div>
            </div>
        `;

        return;
    }


    unitsContainer.innerHTML =
        filteredUnits.map(unit => {

            const lotacaoText = {

                baixa: "🟢 Lotação baixa",

                media: "🟡 Lotação média",

                alta: "🔴 Lotação alta"

            };


            return `
                <article class="unit">

                    <div>

                        <h3>
                            ${unit.name}
                        </h3>

                        <p>
                            📍 ${unit.address}
                        </p>

                        <p>
                            🕐 ${unit.hours}
                        </p>

                        <p>
                            👥 ${unit.patients} pacientes
                            • 👨‍⚕️ ${unit.professionals} profissionais
                        </p>

                    </div>

                    <div>

                        <span class="lot ${unit.lotacao}">
                            ${lotacaoText[unit.lotacao]}
                        </span>

                    </div>

                </article>
            `;

        }).join("");
}


/* =========================
   MOSTRAR PROFISSIONAIS
========================= */

function renderProfessionals() {

    professionalsContainer.innerHTML =
        professionals.map(professional => {

            const initials =
                professional.name
                    .replace("Dra. ", "")
                    .replace("Dr. ", "")
                    .split(" ")
                    .map(word => word[0])
                    .slice(0, 2)
                    .join("");


            return `
                <article class="professional">

                    <div class="avatar">
                        ${initials}
                    </div>

                    <h3>
                        ${professional.name}
                    </h3>

                    <p>
                        ${professional.specialty}
                    </p>

                    <p>
                        🏥 ${professional.unit}
                    </p>

                    ${
                        professional.available

                        ? `<span class="available">
                            ● Disponível
                           </span>`

                        : `<span style="color:#a63f3f;font-size:12px;font-weight:700;">
                            ● Indisponível
                           </span>`
                    }

                </article>
            `;

        }).join("");
}


/* =========================
   PROFISSIONAIS DO AGENDAMENTO
========================= */

function updateProfessionalSelect() {

    const specialty =
        specialtySelect.value;


    const filtered =
        professionals.filter(
            professional =>
                professional.specialty === specialty &&
                professional.available
        );


    professionalSelect.innerHTML = "";


    if (filtered.length === 0) {

        professionalSelect.innerHTML = `
            <option>
                Nenhum profissional disponível
            </option>
        `;

        return;
    }


    filtered.forEach(professional => {

        const option =
            document.createElement("option");

        option.value =
            professional.name;

        option.textContent =
            '${professional.name} — ${professional.unit}1';

        professionalSelect.appendChild(option);

    });
}


/* =========================
   AGENDAMENTO
========================= */

appointmentForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const patient =
            document.getElementById("patient").value;

        const specialty =
            document.getElementById("specialty").value;

        const professional =
            professionalSelect.value;

        const date =
            document.getElementById("appointmentDate").value;

        const time =
            document.getElementById("appointmentTime").value;


        if (!date) {

            appointmentMsg.style.color =
                "#a63f3f";

            appointmentMsg.textContent =
                "Escolha uma data para a consulta.";

            return;
        }


        const formattedDate =
            new Date(
                date + "T00:00:00"
            ).toLocaleDateString(
                "pt-BR"
            );


        appointmentMsg.style.color =
            "#16815e";

        appointmentMsg.innerHTML = `
            ✅ Consulta agendada!
            <br>
            ${patient} • ${specialty}
            <br>
            ${professional}
            <br>
            ${formattedDate} às ${time}
        `;


        appointmentForm.reset();

        updateProfessionalSelect();
    }
);


/* =========================
   FILTROS
========================= */

unitSearch.addEventListener(
    "input",
    renderUnits
);

lotFilter.addEventListener(
    "change",
    renderUnits
);

specialtySelect.addEventListener(
    "change",
    updateProfessionalSelect
);


/* =========================
   MODAL DE INFORMAÇÕES
========================= */

function info(title, text) {

    document.getElementById(
        "modalTitle"
    ).textContent = title;

    document.getElementById(
        "modalBody"
    ).textContent = text;

    modal.classList.add("show");
}


function closeModal() {

    modal.classList.remove("show");
}


/* Fecha clicando fora */

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {
            closeModal();
        }

    }
);


/* =========================
   MEDICAMENTOS
========================= */

function showMedicines() {

    let content = `
        <strong>
            Disponibilidade demonstrativa:
        </strong>
        <br><br>
    `;


    medicines.forEach(medicine => {

        let status;

        if (medicine.quantity > 20) {

            status = "🟢 Disponível";

        } else if (medicine.quantity > 10) {

            status = "🟡 Estoque reduzido";

        } else {

            status = "🔴 Poucas unidades";

        }


        content += `
            <b>${medicine.name}</b><br>

            🏥 ${medicine.unit}<br>

            ${status}
            (${medicine.quantity} unidades)

            <br><br>
        `;

    });


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Medicamentos disponíveis";


    document.getElementById(
        "modalBody"
    ).innerHTML = content;


    modal.classList.add("show");
}


/* =========================
   CUIDADORES
========================= */

function renderCaregivers() {

    caregiversContainer.innerHTML =
        caregivers.map(caregiver => {

            const initials =
                caregiver.name
                    .split(" ")
                    .map(word => word[0])
                    .slice(0, 2)
                    .join("");


            return `
                <article class="care">

                    <div class="care-avatar">
                        ${initials}
                    </div>

                    <h3>
                        ${caregiver.name}
                    </h3>

                    <span class="verified">
                        ✓ Perfil verificado
                    </span>

                    <p>
                        ${caregiver.experience}
                        <br>
                        ⭐ ${caregiver.rating}
                    </p>

                    <button
                        class="btn"
                        onclick="info(
                            'Cuidador',
                            'Este é um perfil demonstrativo. Em uma versão real, seria possível consultar disponibilidade e avaliações.'
                        )">

                        Ver perfil

                    </button>

                </article>
            `;

        }).join("");
}


/* =========================
   MODO FÁCIL / IDOSO
========================= */

easyBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "easy-mode"
        );


        const enabled =
            document.body.classList.contains(
                "easy-mode"
            );


        if (enabled) {

            easyBtn.textContent =
                "A−";

            easyBtn.title =
                "Desativar modo fácil";

        } else {

            easyBtn.textContent =
                "A+";

            easyBtn.title =
                "Ativar modo fácil";

        }

    }
);


/* =========================
   LOGIN DEMONSTRATIVO
========================= */

loginBtn.addEventListener(
    "click",
    function() {

        info(
            "Login do paciente",
            "Esta é uma demonstração. No sistema real, o paciente entraria com seus dados de acesso para visualizar exames, receitas, laudos e histórico."
        );

    }
);


/* =========================
   PAINEL ADMINISTRADOR
========================= */

function openAdmin() {

    const adminUnit =
        document.getElementById("adminUnit");


    adminUnit.innerHTML =
        units.map(unit => `
            <option value="${unit.id}">
                ${unit.name}
            </option>
        `).join("");


    loadAdminData();

    adminModal.classList.add("show");
}


function closeAdmin() {

    adminModal.classList.remove("show");
}


adminBtn.addEventListener(
    "click",
    openAdmin
);


/* =========================
   CARREGAR DADOS ADMIN
========================= */

function loadAdminData() {

    const id =
        Number(
            document.getElementById("adminUnit").value
        );


    const unit =
        units.find(unit => unit.id === id);


    if (!unit) return;


    document.getElementById(
        "adminLot"
    ).value = unit.lotacao;


    document.getElementById(
        "adminStock"
    ).value = unit.patients;
}


document.getElementById(
    "adminUnit"
).addEventListener(
    "change",
    loadAdminData
);


/* =========================
   SALVAR ADMIN
========================= */

document.getElementById(
    "saveAdmin"
).addEventListener(
    "click",
    function() {

        const id =
            Number(
                document.getElementById(
                    "adminUnit"
                ).value
            );


        const newLot =
            document.getElementById(
                "adminLot"
            ).value;


        const newPatients =
            Number(
                document.getElementById(
                    "adminStock"
                ).value
            );


        const unit =
            units.find(
                unit => unit.id === id
            );


        if (!unit) return;


        unit.lotacao =
            newLot;

        unit.patients =
            newPatients;


        renderUnits();


        document.getElementById(
            "adminMsg"
        ).textContent =
            "✅ Informações atualizadas com sucesso!";


        setTimeout(() => {

            document.getElementById(
                "adminMsg"
            ).textContent = "";

        }, 3000);

    }
);


/* =========================
   FECHAR ADMIN CLICANDO FORA
========================= */

adminModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === adminModal
        ) {
            closeAdmin();
        }

    }
);


/* =========================
   FEEDBACK
========================= */

const starButtons =
    document.querySelectorAll(
        "#stars button"
    );

let selectedRating = 0;


starButtons.forEach(
    (star, index) => {

        star.addEventListener(
            "click",
            function() {

                selectedRating =
                    index + 1;


                starButtons.forEach(
                    (item, itemIndex) => {

                        item.classList.toggle(
                            "active",
                            itemIndex <
                            selectedRating
                        );

                    }
                );

            }
        );

    }
);


document.getElementById(
    "feedbackBtn"
).addEventListener(
    "click",
    function() {

        const text =
            document.getElementById(
                "feedbackText"
            ).value.trim();


        const message =
            document.getElementById(
                "feedbackMsg"
            );


        if (selectedRating === 0) {

            message.style.color =
                "#a63f3f";

            message.textContent =
                "Escolha uma quantidade de estrelas.";

            return;
        }


        message.style.color =
            "#16815e";

        message.textContent =
            "✅ Obrigado pelo seu feedback!";


        document.getElementById(
            "feedbackText"
        ).value = "";


        starButtons.forEach(
            star =>
                star.classList.remove(
                    "active"
                )
        );


        selectedRating = 0;

    }
);


/* =========================
   DATA MÍNIMA DO AGENDAMENTO
========================= */

const dateInput =
    document.getElementById(
        "appointmentDate"
    );


const today =
    new Date();


const year =
    today.getFullYear();


const month =
    String(
        today.getMonth() + 1
    ).padStart(2, "0");


const day =
    String(
        today.getDate()
    ).padStart(2, "0");


dateInput.min =
    '${year}-${month}-${day}';


/* =========================
   INICIALIZAÇÃO
========================= */

renderUnits();

renderProfessionals();

renderCaregivers();

updateProfessionalSelect();
alert("o JavaScript está funcioando!");