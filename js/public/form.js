const dropZone = document.querySelector("div");
const input = document.querySelector("input");
let file;
document.addEventListener("dragover", (ev) => ev.preventDefault());
document.addEventListener("drop", (ev) => ev.preventDefault());
dropZone.addEventListener("drop", (ev) => {
  // отключаем поведение по умолчанию
  ev.preventDefault();

  file = ev.dataTransfer.files[0];

  // передаем файл в функцию для дальнейшей обработки
  handleFile(file);
});
dropZone.addEventListener("click", () => {
  // кликаем по скрытому инпуту
  input.click();

  input.addEventListener("change", () => {
    console.log(input.files);

    // извлекаем File
    file = input.files[0];

    handleFile(file);
  });
});

const handleFile = (file) => {
  dropZone.remove();
  input.remove();
  console.log(file.type);
  if (file.type !== "video/mp4") return;
  let VideoName = file.name;

  let formData = new FormData();
  formData.append("video", file, `${VideoName}`);
  let fetchOptions = {
    method: "POST",
    body: formData,
  };
  fetch("/upload", fetchOptions)
    .then((response) => response.text())
    .then((text) => {
      window.location.href = `/video/${text}`;
    });

  fetchOptions = {
    method: "GET",
  };
};
