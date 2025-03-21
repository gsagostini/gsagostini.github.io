// Random fun color on hover
const funButton = document.querySelector('.fun-button');

if (funButton) {
  const funColors = ['#ff5e5e', '#5e5eff', '#5eff5e', '#ff5eff', '#5effff', '#ffa500']; // Add more colors if desired

  funButton.addEventListener('mouseenter', () => {
    const randomColor = funColors[Math.floor(Math.random() * funColors.length)];
    funButton.style.setProperty('--fun-color', randomColor);
  });
}
