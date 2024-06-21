let inputNovaTarefa = document.querySelector("#inputTarefa");
let btnAddtarefa = document.querySelector("#btnAddtarefa");
let listaTarefa = document.querySelector("#listTarefas");
let IdTarefaEdicao = document.getElementById("TarefaEdit");
let btnAtualizar = document.querySelector("#btnAtualizar");
let inputTarefaEdicao = document.getElementById("inputTarefaEdicao");
const KEY_LOCALSTORAGE = 'listaDeTarefas';
let dbTarefas = [];


obterTarefasLocal();
renderizarTarefaHtml();
inputNovaTarefa.addEventListener("keypress", (e) => {
  if (e.keyCode == 13) {
    let tarefa = {
      nome: inputNovaTarefa.value,
      id: gerarId(),
      concluido: false,
    };

    if (inputNovaTarefa.value != "") {
      adicionarTarefa(tarefa);
    } else {
      alert("Digite uma tarefa para ela ser adicionada");
    }
  }
});

btnAddtarefa.addEventListener("click", (e) => {
  let tarefa = {
    nome: inputNovaTarefa.value,
    id: gerarId(),
    concluido: false,
  };

  if (inputNovaTarefa.value != "") {
    adicionarTarefa(tarefa);
  } else {
    alert("Digite uma tarefa para ela ser adicionada");
  }
});

btnAtualizar.addEventListener("click", (e) => {
  e.preventDefault();

  let idTarefa = IdTarefaEdicao.innerHTML.replace("#", "");

  let tarefa = {
    nome: inputTarefaEdicao.value,
    id: idTarefa,
    concluido: false,
  };

  let tarefaAtual = document.getElementById(idTarefa);

  if (tarefaAtual) {

    const indiceTarefa = obterIndiceTarefaID(idTarefa);
    dbTarefas[indiceTarefa] = tarefa;
    saveTarefaLocal();

    let li = criarTagLI(tarefa);
    listaTarefa.replaceChild(li, tarefaAtual);
  }

  showAlert("Tarefa atualizada com sucesso!", "success");
});

function SaveConcluida(idTarefa, li, concluida) {


  let tarefa = {
    nome: li.innerText,
    id: idTarefa,
    concluido: concluida,
  };

  let tarefaAtual = document.getElementById(idTarefa);

  if (tarefaAtual) {

    const indiceTarefa = obterIndiceTarefaID(idTarefa);
    dbTarefas[indiceTarefa] = tarefa;
    saveTarefaLocal();

    let li = criarTagLI(tarefa);
    listaTarefa.replaceChild(li, tarefaAtual);
  }


};



let Id = 0;

function gerarId() {
  Id++;
  return Id;
}

function adicionarTarefa(tarefa) {

  dbTarefas.push(tarefa);
  saveTarefaLocal();
  renderizarTarefaHtml();
}

function criarTagLI(tarefa) {
  let li = document.createElement("li");
  li.id = tarefa.id;
  li.classList.add(
    "p-3",
    "rounded-3",
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "my-3",
    "flex-wrap"
  );
 
  if (concluida){
    li.classList.add("bg-success")
  }
  else{
    li.classList.add("bg-black")
  }

  let span = document.createElement("span");
  span.classList.add("tarefaText");
  span.innerHTML = tarefa.nome;

  let div = document.createElement("div");

  let btnConcluir = document.createElement("button");
  btnConcluir.classList.add("btn", "btn-dark");
  btnConcluir.innerHTML = '<i class="bi bi-check"></i>';
  btnConcluir.setAttribute("onclick", "concluir(" + tarefa.id + ")");

  let btnEditar = document.createElement("button");
  btnEditar.classList.add("btn", "btn-dark", "m-2");
  btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
  btnEditar.setAttribute("data-bs-toggle", "modal");
  btnEditar.setAttribute("data-bs-target", "#editTaskModal");
  btnEditar.setAttribute("onclick", "editar(" + tarefa.id + ")");

  let btnExcluir = document.createElement("button");
  btnExcluir.classList.add("btn", "btn-dark");
  btnExcluir.innerHTML = '<i class="bi bi-trash"></i>';
  btnExcluir.setAttribute("onclick", "excluir(" + tarefa.id + ")");

  div.appendChild(btnConcluir);
  div.appendChild(btnEditar);
  div.appendChild(btnExcluir);

  li.appendChild(span);
  li.appendChild(div);

  return li;
}

var concluida = false;


function concluir(IdTarefa) {
  let li = document.getElementById(IdTarefa);

  if (li) {
    concluida = !concluida;

    if (concluida) {
      li.classList.add("concluida");
      showAlert("Tarefa marcada como concluída!", "success");
    } else {
      li.classList.remove("concluida");
      showAlert("Tarefa desmarcada como concluída!", "danger");
    }

    SaveConcluida(IdTarefa, li, concluida);
  }
}


function editar(IdTarefa) {
  let li = document.getElementById(IdTarefa);

  if (li) {
    IdTarefaEdicao.textContent = "#" + IdTarefa;
    inputTarefaEdicao.value = li.innerText;
  } else {
    alert("elemento não encontrado");
  }
}

function excluir(IdTarefa) {

  const indiceTarefa = obterIndiceTarefaID(IdTarefa)

  if (indiceTarefa < 0) {
    throw new Error('Id da tarefa não encontrado')
  }

  dbTarefas.splice(indiceTarefa, 1)
  saveTarefaLocal();

  let confirmarcao = window.confirm("Tem certeza que deseja excluir?");
  if (confirmarcao) {
    let li = document.getElementById(IdTarefa);
    if (li) {
      listaTarefa.removeChild(li);
      showAlert("Tarefa Excluida", "danger");
    }
  }
}

function showAlert(message, type = "success") {
  let alertContainer = document.getElementById("alertContainer");

  let alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", `alert-${type}`);
  alertDiv.setAttribute("role", "alert");
  alertDiv.textContent = message;

  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

function renderizarTarefaHtml() {

  listaTarefa.innerHTML = '';
  for (let i = 0; i < dbTarefas.length; i++) {
    let li = criarTagLI(dbTarefas[i]);
    listaTarefa.appendChild(li);
  }
  inputNovaTarefa.value = "";

}

function saveTarefaLocal() {
  localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(dbTarefas));
}


function obterTarefasLocal() {
  if (localStorage.getItem(KEY_LOCALSTORAGE)) {
    dbTarefas = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE));
  }
}


function obterIndiceTarefaID(IdTarefa) {

  const indiceTarefa = dbTarefas.findIndex(t => t.id == IdTarefa);

  if (indiceTarefa < 0) {
    throw new Error('Id da tarefa não encontrado')
  }
  return indiceTarefa;
}