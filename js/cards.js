const track = document.querySelector('.cards-track');
const container = document.querySelector('.cards-section');

const ogCards = Array.from(track.children);
const ogCount = ogCards.length;

ogCards.forEach(card => {
	const clone = card.cloneNode(true);
	track.appendChild(clone);
})

ogCards.reverse().forEach(card => {
	const clone = card.cloneNode(true);
	track.insertBefore(clone, track.firstChild);
})

let drag = false, startX, currTrans = 0, prevTrans = 0;
let speed = 0, lastX = 0, timeLast = 0, animFrameID = null;
let friction2Dlmao = 0.9;

function initThingy() {
	const firstCard = track.children[ogCount];
	const cardWidth = firstCard.getBoundingClientRect().width;
	const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
	const segmentWidth = (cardWidth + gap) * ogCount;
	currTrans = -segmentWidth;
	prevTrans = currTrans;

	function updateLoop() {
		if (!drag) {
			currTrans+=speed;
			speed*=friction2Dlmao;
			prevTrans=currTrans;
		}
		if (currTrans<-(segmentWidth*2)) {
			currTrans+=segmentWidth;
			prevTrans=currTrans;
		}
		if (currTrans>-segmentWidth) {
			currTrans-=segmentWidth;
			prevTrans=currTrans;
		}
		track.style.transform = `translateX(${currTrans}px)`;
		animFrameID = requestAnimationFrame(updateLoop);
	}

	if (animFrameID) {cancelAnimationFrame(animFrameID)};
	animFrameID = requestAnimationFrame(updateLoop);

}

window.addEventListener('load', initThingy);
window.addEventListener('resize', initThingy);

if (document.readyState==='complete') {initThingy();}

track.addEventListener('mousedown', (e) => {
	drag = true; speed = 0; startX = e.pageX - prevTrans;
	lastX = e.pageX; timeLast = performance.now();
	track.style.transition = 'none';
});

window.addEventListener('mousemove', (e) => {
	if (!drag) {return};
	e.preventDefault();

	const currX = e.pageX;
	const currTime = performance.now();
	const deltaX = currX-lastX;

	currTrans = prevTrans+deltaX;
	prevTrans = currTrans;

	const timeElapsed = currTime - timeLast;
	if (timeElapsed>0) {
		speed = deltaX;
	}
	lastX = currX;
	timeLast = currTime;

});

window.addEventListener('mouseup', () => {
	if (!drag) {return;}
	drag = false;
	if (Math.abs(speed)<1) {speed=0;}
});

track.addEventListener('mouseleave', () => {
	if (drag) {
		drag=false;
	}
});