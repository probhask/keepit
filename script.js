// notes section
const notesSection = document.querySelector("#note-list-section");
// notes template
const noteTemplate = document.querySelector("#note-template");
// add note btn
const addNoteBtn = document.querySelector(".add-note");
// text area id
const textAreaId = "#edit-note-text-area";
// editing border color
const editingBorderColor = `var(--medium-gray)`;
// not editing border color
const notEditingBorderColor = `var(--medium-gray)`;

// random id generator
const randomIdGenerator = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const number = "0121456789";
  const charList = number + alphabet;
  const idLength = 6;

  let id = "";
  for (let i = 0; i < idLength; i++) {
    id += charList[Math.round(Math.random() * idLength)];
  }
  return id;
};
// get note id
function getNoteId(note) {
  return note.getAttribute("id").split("-")[1];
}
// get note list form local Storage
function getLocalStorageNotesList() {
  const rawNotes = localStorage.getItem("keep-it-notes");
  //  notes exist
  if (rawNotes) {
    const parseNotes = JSON.parse(rawNotes);
    return parseNotes;
  }
  // notes not exist
  return [];
}
// set not list to local Storage
function setLocalStorageNotesList(noteList) {
  if (noteList) {
    localStorage.setItem("keep-it-notes", JSON.stringify(noteList));
  }
}

// update to local storage Note list
function updateLocalNote(id, note) {
  const localNoteList = getLocalStorageNotesList();
  // find if note with id exists if it does then its editable
  const findNote = localNoteList.find((note) => note.id === id);
  // if notes already exist and edit is needed
  if (findNote) {
    for (let i = 0; i < localNoteList.length; i++) {
      if (localNoteList[i].id === id) {
        console.log("i", i);
        localNoteList[i].note = note;
        break;
      }
    }
  } else {
    // add new note
    localNoteList.push({
      id,
      note,
    });
  }
  // set local storage
  setLocalStorageNotesList(localNoteList);
}
// delete local storage notes
function deleteLocalNote(id) {
  const noteList = getLocalStorageNotesList();
  const newNoteList = noteList.filter((note) => note.id !== id);
  setLocalStorageNotesList(newNoteList);
}

// save note
function saveNote(event) {
  //note
  const note = event.target.closest(".note");

  // note id
  const noteId = getNoteId(note);
  const textArea = note.querySelector(textAreaId);
  // text area content
  const textAreaContent = textArea.value.replace(/\n/g, " <br />");

  if (textAreaContent) {
    const noteTxtDiv = note.querySelector(".note-txt");
    //add text area content to note-txt div
    noteTxtDiv.innerHTML = textAreaContent;

    // add to local storage
    updateLocalNote(noteId, textAreaContent);

    // noteTxt & textarea toggle
    textArea.classList.add("hidden");
    noteTxtDiv.classList.remove("hidden");

    // edit & save toggle
    note.querySelector(".edit").classList.remove("hidden");
    note.querySelector(".save").classList.add("hidden");
    note.style.borderColor = notEditingBorderColor;
  }
}

// edit note
function editNote(event, noteId) {
  //note
  const note = event.target.closest(".note");
  note.style.borderColor = editingBorderColor;
  // note txt div
  const noteTxtDiv = note.querySelector(".note-txt");
  const noteTxt = noteTxtDiv.innerHTML.replace(/<br\s*\/?>/gi, " \n");
  const textArea = note.querySelector(textAreaId);
  // copy note txt div content to text area
  textArea.value = noteTxt;

  // noteTxt & textarea toggle
  textArea.classList.remove("hidden");
  noteTxtDiv.classList.add("hidden");

  // edit & save toggle
  note.querySelector(".edit").classList.add("hidden");
  note.querySelector(".save").classList.remove("hidden");
}

// delete note
function deleteNote(event) {
  //note
  const note = event.target.closest(".note");
  // note id
  const noteId = getNoteId(note);
  deleteLocalNote(noteId);
  note.remove();
}

// retrieve noteList from local storage and render it on screen
document.addEventListener("DOMContentLoaded", () => {
  const localNotesList = getLocalStorageNotesList();
  if (localNotesList) {
    localNotesList.forEach((note) => {
      // clone note template
      const noteTemplateClone = noteTemplate.content.cloneNode(true);

      // add id to element
      noteTemplateClone
        .querySelector(".note")
        .setAttribute("id", `note-${note.id}`);

      // add note txt
      noteTemplateClone.querySelector(".note-txt").innerHTML = note.note;

      // add button event
      noteTemplateClone
        .querySelector(".edit")
        .addEventListener("click", editNote);
      noteTemplateClone
        .querySelector(".save")
        .addEventListener("click", saveNote);
      noteTemplateClone
        .querySelector(".delete")
        .addEventListener("click", deleteNote);
      notesSection.appendChild(noteTemplateClone);
    });
  }
});

// add new notes on addNoteBtn click
addNoteBtn.addEventListener("click", function () {
  // clone note template
  const cloneNoteTemplate = noteTemplate.content.cloneNode(true);

  // add note id
  const newNoteId = randomIdGenerator();
  cloneNoteTemplate
    .querySelector(".note")
    .setAttribute("id", `note-${newNoteId}`);

  // edit note btn
  const editNoteBtn = cloneNoteTemplate.querySelector(".edit");
  // save note btn
  const saveNoteBtn = cloneNoteTemplate.querySelector(".save");
  // add note btn
  const deleteNoteBtn = cloneNoteTemplate.querySelector(".delete");

  // hide edit btn
  editNoteBtn.classList.add("hidden");
  // show save btn
  saveNoteBtn.classList.remove("hidden");

  // hide note txt div
  cloneNoteTemplate.querySelector(".note-txt").classList.add("hidden");
  // show text area
  cloneNoteTemplate.querySelector(textAreaId).classList.remove("hidden");

  // save note button add event
  saveNoteBtn.addEventListener("click", saveNote);
  // delete note button add event
  deleteNoteBtn.addEventListener("click", deleteNote);
  // edit note button add event
  editNoteBtn.addEventListener("click", editNote);

  // append node
  notesSection.appendChild(cloneNoteTemplate);
});
