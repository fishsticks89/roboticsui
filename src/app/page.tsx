"use client"

import { useEffect, useState } from "react";
import isClient from "./isClient";

export default function Home() {
  if (!isClient()) {
    return null;
  }
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedM, setSelectedM] = useState<string | null>(null);

  const handleSelection = () => {
    const confirmed = window.confirm("Click OK to Score, Cancel to Match Load");
    if (!confirmed) {
        return selectedM ?? "ERROR DUDE";
    } else {
      console.log(`${selectedLetter}${selectedLevel}`);
        return `${selectedLetter}${selectedLevel}`; //
    }
    throw new Error("No selection made");
  };


  return (<>
    <CharacterPairList getPair={handleSelection} />
    <div className="font-[family-name:var(--font-geist-sans)]">
      <div className="relative w-[80vh] h-[80vh] mx-auto">
        {[..."abcdefghijkl".toUpperCase()].map((letter, index) => {
          const angle = (index * (2 * Math.PI / 12)) - Math.PI / 2;
          const radius = (80 * (window?.innerHeight ?? 2) / 100) * 0.4; // 40% of 80vh
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <div
              key={letter}
              className={`absolute w-24 h-24 rounded-full ${selectedLetter === letter ? 'bg-white' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center ${selectedLetter === letter ? 'text-black' : 'text-white'} transform -translate-x-1/2 -translate-y-1/2 text-3xl cursor-pointer `}
              style={{
                left: `${x + (40 * window.innerHeight / 100)}px`,
                top: `${y + (40 * window.innerHeight / 100)}px`
              }}
              onClick={() => setSelectedLetter(letter)}
              role="button"
              tabIndex={0}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* Level selector at bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-24 h-24 rounded-lg ${selectedLevel === level ? 'bg-white' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center ${selectedLevel === level ? 'text-black' : 'text-white'} cursor-pointer text-4xl`}
            onClick={() => setSelectedLevel(level)}
            role="button"
            tabIndex={0}
          >
            {level}
          </div>
        ))}
      </div>

      {/* M1-M6 selector on left */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={`M${num}`}
            className={`w-20 h-20 rounded-full ${selectedM === `M${num}` ? 'bg-white' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center ${selectedM === `M${num}` ? 'text-black' : 'text-white'} cursor-pointer text-2xl`}
            onClick={() => setSelectedM(`M${num}`)}
            role="button"
            tabIndex={0}
          >
            M{num}
          </div>
        ))}
      </div>
    </div>
  </>
  );
}
const CharacterPairList = (p: {getPair: () => string}) => {
  const generateRandomPair = (index: number) => {
    if (index % 2 === 0) {
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 12));
      const number = Math.floor(Math.random() * 4) + 1;
      return letter + number;
    } else {
      const number = Math.floor(Math.random() * 6) + 1;
      return 'M' + number;
    }
  };

  const [pairs, setPairs] = useState<string[]>(
    [generateRandomPair(0), generateRandomPair(1)]
  );

  const addPair = (index: number) => {
    const newPair = p.getPair();
    if (newPair && newPair.length === 2) {
      const newPairs = [...pairs];
      newPairs.splice(index, 0, newPair);
      setPairs(newPairs);
    }
  };

  return (
    <div className="fixed right-0 top-0 w-[120px] h-screen overflow-y-auto pr-2">
      <div className="flex flex-col gap-2 mt-4">
        {pairs.map((pair, index) => (
          <div key={index} className="flex items-center gap-1">
            <button
              onClick={() => {
                const newPairs = [...pairs];
                newPairs.splice(index, 1);
                setPairs(newPairs);
              }}
              className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-md"
              title="Remove this pair"
            >
              -
            </button>
            <div
              className="bg-white text-black p-2 rounded-md font-mono text-center flex-1"
            >
              {pair}
            </div>
            <button
              onClick={() => addPair(index)}
              className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-md"
              style={{
                transform: 'translateY(-25px)',
              }}
              title="Add pair after this position"
            >
              +
            </button>
          </div>
        ))}
        <button
          onClick={() => addPair(pairs.length)}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md mb-4"
          title="Add pair at the end"
        >
          +
        </button>
      </div>
    </div>
  );
};
