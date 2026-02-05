const moodData = {
  calm: {
    title: "차분하게 둘러보기",
    text: "밝기가 낮은 구역을 먼저 찾고, 통로를 따라 천천히 이동하세요. 체류 중간에 잠깐 휴식 구간을 넣으면 집중도가 높아집니다."
  },
  balance: {
    title: "균형 있게 즐기기",
    text: "초반에는 전체 동선을 한 번 훑고, 중간에는 자신에게 맞는 구역을 선택하는 방식이 부담이 적습니다. 이동과 휴식을 번갈아 배치하세요."
  },
  energy: {
    title: "활기 있게 움직이기",
    text: "리듬이 빠른 구역을 중심으로 이동하되, 인파가 몰릴 때는 통로 가장자리를 이용해 안전을 우선하세요."
  }
};

const buttons = document.querySelectorAll(".mood-btn");
const panel = document.querySelector(".mood-panel");

function setMood(key) {
  const data = moodData[key];
  if (!data) return;
  panel.innerHTML = `<strong>${data.title}</strong><p>${data.text}</p>`;
  buttons.forEach((btn) => {
    const active = btn.dataset.mood === key;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => setMood(btn.dataset.mood));
});

setMood("calm");
