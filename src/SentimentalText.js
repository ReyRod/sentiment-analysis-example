import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

//Model and metadata URL
const url = {
  model:
    "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json",
  metadata:
    "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json",
};

const SentimentalText = ({ text }) => {
  const [metadata, setMetadata] = useState();
  const [model, setModel] = useState();

  const PAD_INDEX = 0;

  const padSequences = (
    sequences,
    maxLen,
    padding = "pre",
    truncating = "pre",
    value = PAD_INDEX
  ) => {
    return sequences.map((seq) => {
      if (seq.length > maxLen) {
        if (truncating === "pre") {
          seq.splice(0, seq.length - maxLen);
        } else {
          seq.splice(maxLen, seq.length - maxLen);
        }
      }

      if (seq.length < maxLen) {
        const pad = [];
        for (let i = 0; i < maxLen - seq.length; ++i) {
          pad.push(value);
        }
        if (padding === "pre") {
          seq = pad.concat(seq);
        } else {
          seq = seq.concat(pad);
        }
      }

      return seq;
    });
  };

  const loadModel = async (url) => {
    try {
      const model = await tf.loadLayersModel(url.model);
      setModel(model);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMetadata = async (url) => {
    try {
      const metadataJson = await fetch(url.metadata);
      const metadata = await metadataJson.json();
      setMetadata(metadata);
    } catch (err) {
      console.log(err);
    }
  };

  const getSentimentScore = (text) => {
    const OOV_INDEX = 2;
    const inputText = text
      .trim()
      .toLowerCase()
      .replace(/(\.|\,|\!)/g, "")
      .split(" ");
    const sequence = inputText.map((word) => {
      let wordIndex = metadata.word_index[word] + metadata.index_from;
      if (wordIndex > metadata.vocabulary_size) {
        wordIndex = OOV_INDEX;
      }
      return wordIndex;
    });
    const paddedSequence = padSequences([sequence], metadata.max_len);
    const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);
    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    const range = Math.pow(1, 16) / 3;

    if (score >= range * 2) {
      return "🙂";
    } else if (score >= range && score <= range * 2) {
      return "😐";
    } else if (score <= range) {
      return "🙁";
    }
  };

  useEffect(() => {
    tf.ready().then(() => {
      loadModel(url);
      loadMetadata(url);
    });
  }, []);

  if (!metadata || !model) return null;

  return <li>{`${text} ${getSentimentScore(text)}`}</li>;
};

export default SentimentalText;
