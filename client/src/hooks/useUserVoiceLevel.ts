import { useEffect, useState } from "react";

export const useUserVoiceLevel = () => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let gainNode: GainNode;
    let dataArray: Uint8Array<ArrayBuffer>;
    let animationFrame: number;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });

        audioContext = new AudioContext();
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        const source = audioContext.createMediaStreamSource(stream);

        // 🔥 ADD GAIN NODE: Amplify raw microphone signal 2x BEFORE analysis
        gainNode = audioContext.createGain();
        gainNode.gain.value = 2;

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0;

        source.connect(gainNode);
        gainNode.connect(analyser);

        dataArray = new Uint8Array(analyser.fftSize) as Uint8Array<ArrayBuffer>;
      } catch (err) {
        console.error("Microphone access denied or unavailable", err);
        return;
      }

      const update = () => {
        analyser.getByteTimeDomainData(dataArray);

        // 🔥 RMS (REAL LOUDNESS CALCULATION)
        let sumSquares = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const val = dataArray[i] - 128; // center signal
          sumSquares += val * val;
        }

        let rms = Math.sqrt(sumSquares / dataArray.length);

        // 🔥 REDUCED: With 2x hardware gain, normal speech stays in lower range
        const normalized = Math.min((rms / 32) * 100, 100);

        setVolume(normalized);

        animationFrame = requestAnimationFrame(update);
      };

      update();
    };

    start();

    return () => {
      cancelAnimationFrame(animationFrame);
      audioContext?.close();
    };
  }, []);

  return volume;
};
