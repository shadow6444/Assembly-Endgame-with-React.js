import { useState } from "react";
import { languages } from "../utils/languages";
import { getFarewellText, getRandomWord } from "../utils/utils";
import clsx from "clsx";
import Confetti from "react-confetti";

const App = () => {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetter, setGuessedLetter] = useState([]);

  const resetGame = () => {
    setCurrentWord(getRandomWord());
    setGuessedLetter([]);
  };

  const wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetter.includes(letter));
  const isGameOver = isGameLost || isGameWon;
  const revealLetters = isGameLost;

  const addGuessedLetter = (letter) => {
    setGuessedLetter((prevGuesses) =>
      prevGuesses.includes(letter) ? prevGuesses : [...prevGuesses, letter]
    );
  };

  let alphabets = "abcdefghijklmnopqrstuvwxyz";

  const latestWrongLetter =
    guessedLetter[guessedLetter.length - 1] &&
    !currentWord.includes(guessedLetter[guessedLetter.length - 1]);

  const statusClassName = clsx(
    "w-full sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-1/3 min-h-[76px] py-2 rounded-md text-[#F9F4DA] flex flex-col justify-center items-center text-center mt-4",
    {
      "bg-[#BA2A2A]": isGameLost,
      "bg-[#10A95B]": isGameWon,
      "bg-[#7A5EA7] border border-[#323232] border-dashed":
        !isGameOver && latestWrongLetter,
    }
  );
  return (
    <main className="min-h-screen w-screen bg-[#282726] flex flex-col items-center p-12">
      {isGameWon && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={1000}
          />
        </div>
      )}
      {/* Header */}
      <header className="w-full sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-1/3">
        <h3 className="text-[#F9F4DA] font-medium text-2xl text-center pb-2">
          Assembly: Endgame
        </h3>
        <p className="font-medium text-lg text-center leading-tight text-[#8E8E8E]">
          Guess the word in under {languages.length - 1} attempts to keep the
          programming world safe from Assembly!
        </p>
      </header>

      {/* Status */}
      <section aria-live="polite" role="status" className={statusClassName}>
        {!isGameOver && latestWrongLetter && (
          <p className="font-normal italic text-sm sm:text-base md:text-lg">
            {getFarewellText(languages[wrongGuessCount - 1].name)}
          </p>
        )}
        {isGameWon && (
          <>
            <h2 className="font-medium text-xl md:text-2xl">
              You Win!
            </h2>
            <p className="font-medium text-base md:text-lg">
              Well Done! 🎉
            </p>
          </>
        )}
        {isGameLost && (
          <>
            <h2 className="font-medium text-xl md:text-2xl">
              Game Over!
            </h2>
            <p className="font-medium text-base md:text-lg">
              You lose! Better start learning Assembly 😭
            </p>
          </>
        )}
      </section>

      {/* Languages */}
      <section className="flex w-full sm:w-[80%] md:w-[60%] lg:w-[45%] xl:w-1/4 items-center justify-center gap-1 mt-6 flex-wrap">
        {languages.map((lang, index) => {
          const isLangLost = index < wrongGuessCount;
          const classname = clsx({
            lost: isLangLost,
          });
          return (
            <span
              key={index}
              className={`rounded p-1  relative font-bold text-sm ${classname}`}
              style={{
                backgroundColor: lang.backgroundColor,
                color: lang.color,
              }}
            >
              {lang.name}
            </span>
          );
        })}
      </section>

      {/* Guess Word */}
      <section className="mt-8 flex gap-1 flex-wrap justify-center">
        {currentWord.split("").map((letter, index) => {
          const isLetterNotInclude =
            isGameLost && !guessedLetter.includes(letter);
          const classname = clsx(
            "bg-[#323232] text-[#F9F4DA] border-b border-b-[#F9F4DA] font-bold text-xl flex items-center justify-center w-10 h-10",
            {
              "text-[#ec5d49]": isLetterNotInclude,
            }
          );

          return (
            <span key={index} className={classname}>
              {guessedLetter.includes(letter) && letter.toUpperCase()}
              {isLetterNotInclude && letter.toUpperCase()}
            </span>
          );
        })}
      </section>

      {/* A11y */}
      {/* Combined visually-hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(guessedLetter[guessedLetter.length - 1])
            ? `Correct! The letter ${
                guessedLetter[guessedLetter.length - 1]
              } is in the word.`
            : `Sorry, the letter ${
                guessedLetter[guessedLetter.length - 1]
              } is not in the word.`}
          You have {languages.length - 1} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetter.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>

      {/* Keyboard */}
      <section className="w-full sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-1/3 mt-8 flex gap-2 flex-wrap justify-center">
        {alphabets.split("").map((letter, index) => {
          const isGuessed = guessedLetter.includes(letter);
          const isCorrect = isGuessed && currentWord.includes(letter);
          const isWrong = isGuessed && !currentWord.includes(letter);

          const classname = clsx({
            correct: isCorrect,
            wrong: isWrong,
          });

          return (
            <button
              key={index}
              onClick={() => addGuessedLetter(letter)}
              disabled={isGameOver}
              aria-disabled={guessedLetter.includes(letter)}
              aria-label={`Letter ${letter}`}
              className={`bg-[#FCBA29] ${classname} border disabled:opacity-50 disabled:cursor-not-allowed border-[#D7D7D7] rounded-md flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 font-semibold text-[#1E1E1E] text-base sm:text-lg`}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </section>

      {/* New Game Button */}
      {isGameOver && (
        <button
          onClick={resetGame}
          className="mt-10 bg-[#11B5E5] border border-[#D7D7D7] rounded-md text-[#1E1E1E] font-semibold text-base sm:text-lg px-10 sm:px-16 py-2"
        >
          New Game
        </button>
      )}
    </main>
  );
};

export default App;
