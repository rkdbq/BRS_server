// script.js
// 페이지가 로드될 때 현재 테마 설정을 확인하고 적용
document.addEventListener("DOMContentLoaded", function () {
  applyTheme(getSavedTheme());
});
// 버튼 클릭에 따라 테마를 변경하는 함수
function toggleTheme() {
  const currentTheme = getSavedTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(newTheme);
  saveTheme(newTheme);
}

// 테마를 적용하는 함수
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const themeStyleLink = document.getElementById("themestyle");

  themeStyleLink.href = `/static/css/${theme}style.css`;
}

// 테마를 저장하는 함수
function saveTheme(theme) {
  localStorage.setItem("theme", theme);
}

// 저장된 테마를 가져오는 함수
function getSavedTheme() {
  return localStorage.getItem("theme") || "light";
}

// 버튼 클릭 이벤트에 테마 토글 함수 연결
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// 드래그 앤 드롭 상태일 때의 스타일 변경
function dragEnter(event) {
  event.preventDefault();
  document.getElementById("image-container").classList.add("dragover");
}

// 드래그 앤 드롭 상태에서 벗어났을 때의 스타일 변경
function dragLeave(event) {
  event.preventDefault();
  document.getElementById("image-container").classList.remove("dragover");
}

// 이미지 처리를 위한 함수
function processImage() {
  var input = document.getElementById("image-input");
  var file = input.files[0];

  if (file) {
    // File 객체를 읽어와서 base64로 변환
    var reader = new FileReader();
    reader.onload = function (e) {
      //base64로 변환?
      var base64Data = e.target.result;

      // 변환된 base64 데이터를 콘솔에 출력
      console.log(base64Data);

      // 서버로 POST 요청 보내기
      fetch("https://example.com/upload", {
        //링크 수정해서 넣기
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify({ image: base64Data }),
      })
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          var myStringVariable = data;
          console.log(myStringVariable);
          decodeBase64ToImage(myStringVariable, "image-input"); //id 얻어야해
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    // File을 base64로 변환하는 작업 시작
    reader.readAsDataURL(file);
  } else {
    alert("이미지를 선택해주세요.");
  }
}

function decodeBase64ToImage(base64Data, containerId) {
  // 이미지 엘리먼트 생성
  var img = new Image();

  // 이미지의 소스에 base64 데이터 할당
  img.src = base64Data;

  // 이미지가 로드되면 화면에 표시
  img.onload = function () {
    var container = document.getElementById(containerId);
    if (container) {
      container.appendChild(img);
    } else {
      console.error("Container not found");
    }
  };
}
// Drag & Drop 관련 함수들
function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  // 드래그 앤 드롭으로 선택된 파일 가져오기
  var file = event.dataTransfer.files[0];

  // 파일이 선택되었는지 확인
  if (file) {
    // FileReader 객체 생성
    var reader = new FileReader();

    // 파일을 읽은 후의 동작 정의
    reader.onload = function (e) {
      // 이미지를 보여주기
      var image = document.getElementById("uploaded-image");
      image.src = e.target.result;

      // 업로드된 이미지 텍스트 감추기
      document.getElementById("upload-text").style.display = "none";
    };

    // 파일을 읽기
    reader.readAsDataURL(file);
  } else {
    alert("이미지를 선택해주세요.");
  }

  // 드래그 앤 드롭 상태에서 벗어났을 때의 스타일 변경
  document.getElementById("image-container").classList.remove("dragover");
}

// 클릭 시 파일 선택 창 열기 및 이미지 처리
document
  .getElementById("image-container")
  .addEventListener("click", function () {
    var input = document.getElementById("image-input");
    var image = document.getElementById("uploaded-image");

    input.click();

    input.addEventListener("change", function () {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          image.src = e.target.result;
          document.getElementById("upload-text").style.display = "none";
        };

        reader.readAsDataURL(input.files[0]);
      }
    });
  });
