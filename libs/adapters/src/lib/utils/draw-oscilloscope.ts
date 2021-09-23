const defaultValue = {
  fill: '#fff',
  stroke: '#111',
};

export function drawOscilloscope(
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode,
  style: {
    fill: string;
    stroke: string;
  } = defaultValue
) {
  if (!(canvas as any).isDestroyed) {
    requestAnimationFrame(() => {
      drawOscilloscope(canvas, analyser, style);
    });
  }

  const canvasCtx = <CanvasRenderingContext2D>(
    (<HTMLCanvasElement>canvas).getContext('2d')
  );

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  if (canvas.parentElement?.style.backgroundColor) {
    canvasCtx.fillStyle = canvas.parentElement?.style.backgroundColor;
  }

  canvasCtx.fillStyle = style.fill;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = style.stroke;

  canvasCtx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}
